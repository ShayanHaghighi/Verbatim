from typing import Any

from flask_socketio import emit, SocketIO, send, join_room, leave_room
from flask import request

from ...models.Game import games, Player, Game

players = {}

TOKEN_LENGTH = 32
WAITING, QUESTION, ANSWER, REBUTTAL, RESULTS = [0, 1, 2, 3, 4]

DEFAULT_NUM_QNS = 30
game = Game(num_questions=int(DEFAULT_NUM_QNS))
MAIN_ROOM = "main_room"


def init_sockets(socketio: SocketIO):

    @socketio.on("connect")
    def handle_connect():
        print("Client connected")

    @socketio.on("create-game")
    def handle_create_game(data: dict):
        global game, QUESTION, ANSWER, REBUTTAL, RESULTS
        print("creating game")

        if game:
            handle_reconnnect(data)

        else:
            num_questions = data.get("num_questions", DEFAULT_NUM_QNS)
            game = Game(num_questions=int(num_questions))
        game.owner_sid = request.sid

        emit("players-update", {"players": game.get_players()}, to=game.owner_sid)

    def handle_reconnnect(data: dict):
        if game.state == WAITING:
            print("game made, updating q nums")
            num_questions = data.get("num_questions", DEFAULT_NUM_QNS)
            game.num_questions = int(num_questions)
        if game.state == QUESTION:
            message = {
                "question": game.get_current_question().quote_text,
                "options": list(game.author_votes.keys()),
                "time_limit": game.time_limit,
                "question_number": game.current_q_index,
                "total_questions": game.num_questions,
            }
            emit("question", message)
        if game.state == ANSWER:
            emit(
                "player-scores",
                {
                    "scores": game.get_players(),
                    "answer": game.get_current_question().player_name,
                },
            )
        if game.state == REBUTTAL:
            emit(
                "rebuttal-details",
                {
                    "question": {
                        "question": game.get_current_question().quote_text,
                        "answer": game.get_current_question().player_name,
                    }
                },
            )

    @socketio.on("join-game")
    def join_game(data: dict):
        global game
        player_name = data.get("name", None)
        print(f"player {player_name} is joining")
        if not game:
            emit("user-error", {"error:": "game not started yet"})
            return

        player = Player(player_name=player_name)
        game.players[player_name] = player

        join_room(player_name)
        join_room(MAIN_ROOM)
        emit("players-update", {"players": game.get_players()}, to=game.owner_sid)

    @socketio.on("start-game")
    def handle_start_game(data: dict):

        global game
        print("game started")
        if not game:
            emit("user-error", {"error:": "game code not valid"})
            return

        game.state = QUESTION

        first_question = game.questions[0].quote_text
        options = list(game.author_votes.keys())
        message = {
            "question": first_question,
            "options": options,
            "time_limit": game.time_limit,
            "question_number": game.current_q_index,
            "total_questions": game.num_questions,
        }

        emit("question", message, to=MAIN_ROOM)
        emit("players-update", {"players": game.get_players()}, to=game.owner_sid)
        print("sending qns", message)
        send_message_to_client(game.owner_sid, "question", body=message)
        for player in game.players.values():
            player.has_answered = False

    @socketio.on("answer")
    def handle_answer(data: dict):
        global game
        player_name = data.get("player_name", None)
        answer = data.get("answer", None)
        time_taken_ratio = data.get("time_taken_ratio", None)

        print(f"got answer from {player_name}")

        player: Player = game.players.get(player_name, None)
        if not player:
            emit("user-error", {"error:": "you are not in this game"})
            return
        # emit("new-answer",{"name":player.name},to=game.owner_sid)
        if answer == game.questions[game.current_q_index].player_name:
            player.score += calc_score_increase(time_taken_ratio)
        player.score_list.append(player.score)
        player.has_answered = True

        emit("players-update", {"players": game.get_players()}, to=game.owner_sid)

    def calc_score_increase(time_taken_ratio) -> Any:
        return round(500 + 600 * ((time_taken_ratio) ** 2))

    @socketio.on("question-end")
    def handle_question_finished(data: dict):
        print("question ended")
        global game

        for player in game.players.values():
            if len(player.score_list) == game.current_q_index + 1:
                player.score_list.append(player.score)
        for player in game.players.values():
            print(f"name: {player.name}, score: {player.score_list}")

        game.state = ANSWER
        author = (game.questions[game.current_q_index]).player_name
        for player in game.players.values():
            emit(
                "results",
                {
                    "answer": author,
                    "score_increase": player.get_score_increase(),
                    "score": player.score,
                    "question_number": game.current_q_index,
                    "total_questions": game.num_questions,
                },
                to=player.name,
            )
        emit("player-scores", {"scores": game.get_players(), "answer": author})

    @socketio.on("start-rebuttal")
    def handle_rebuttal_start(data: dict):

        global game

        if game.owner_sid != request.sid:
            game.owner_sid = request.sid
        game.state = REBUTTAL
        author = game.questions[game.current_q_index].player_name
        question = game.questions[game.current_q_index]
        emit("start-rebuttal", {"author_name": author}, to=MAIN_ROOM)
        emit(
            "rebuttal-details",
            {
                "question": {
                    "question": question.quote_text,
                    "answer": question.player_name,
                }
            },
        )

    @socketio.on("rebuttal-vote")
    def handle_rebuttal_vote(data: dict):
        global game
        player_name = data.get("player_name", None)
        score = data.get("score", None)
        print("rebuttal vote", player_name, score)

        author = game.questions[game.current_q_index].player_name
        game.author_votes[author] += score  # TODO make sure score is in certain bounds?
        emit("rebuttal-vote", {"name": player_name, "score": score}, to=game.owner_sid)

    @socketio.on("rebuttal-end")
    def handle_rebuttal_end(data: dict):
        global game
        if game.owner_sid != request.sid:
            game.owner_sid = request.sid
        game.current_q_index += 1
        if game.current_q_index < game.num_questions:
            game.state = QUESTION
            question = game.questions[game.current_q_index].quote_text
            options = list(set([question.player_name for question in game.questions]))
            message = {
                "question": question,
                "options": options,
                "time_limit": game.time_limit,
                "question_number": game.current_q_index,
                "total_questions": game.num_questions,
            }

            emit("question", message, to=MAIN_ROOM)
            send_message_to_client(game.owner_sid, "question", body=message)
            for player_name in game.players.keys():
                game.players[player_name].has_answered = False

            emit("players-update", {"players": game.get_players()}, to=game.owner_sid)

        else:
            game.state = RESULTS
            emit("game-end", to=MAIN_ROOM)
            emit("game-end", {"authorVotes": game.author_votes}, to=game.owner_sid)

    @socketio.on("leave-game")
    def handle_leave_game(data: dict):
        game_code = data.get("game_code", None)
        game: Game = games.get(game_code, None)
        game_token = data.get("game_token", None)
        if game and game_token in game.players:
            res = game.players.pop(game_token, None)
            if res:
                print(f"player {res} left the game")
                emit("left-game")  # not used by client yet
                emit(
                    "players-update", {"players": game.get_players()}, to=game.owner_sid
                )
                del res
            else:
                print(
                    f"request from client not in game: {game_token}, game_code: {game_code}"
                )

    @socketio.on("end-game")
    def handle_end_game(data: dict):
        global game
        game = None

    def send_message_to_client(sid, event, body=""):
        socketio.emit(event, body, room=sid)

