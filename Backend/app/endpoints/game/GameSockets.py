from flask_socketio import emit, SocketIO,send,join_room,leave_room
from flask import request
from random import SystemRandom
from string import ascii_lowercase,digits

from ...models.Game import games,Player,Game
from ...dbManagement import DeckRepository as deck_repo

players = {}

TOKEN_LENGTH = 32
WAITING,QUESTION,ANSWER,REBUTTAL,RESULTS = [0,1,2,3,4]

# TODO: add game code as url query param

def gen_token():
    return ''.join(SystemRandom().choice(ascii_lowercase + digits) for _ in range(TOKEN_LENGTH))

def init_sockets(socketio:SocketIO):

    @socketio.on('connect')
    def handle_connect():
        print('Client connected')

    @socketio.on('create-game')
    def handle_create_game(data:dict):
        print('Creating game:', data,type(data))
        deck_id = data.get('deck_id',None)
        password = data.get('password',None)
        num_questions = data.get('num_questions',None)

        deck = deck_repo.get_by_id(deck_id)

        for game in games.values():
            if request.sid==game.owner_sid:
                del game
                break
        

        if not deck:
            emit("user-error", {"error:":"deck id not valid"})
        else:

            game = Game(deck=deck, password=password,num_questions=int(num_questions))
            game.owner_sid = request.sid
            games[game.game_code] = game
            game_token = gen_token()
            game.owner_token = game_token
            emit('code', {'game_code': game.game_code,"game_token":game_token})

    @socketio.on('game-info-req')
    def get_game_info(data:dict):
        game_code = data.get("game_code",None)
        print("asked for game info "+game_code)

        game:Game = games.get(game_code,None)
        if not game:
            emit("user-error", {"error:":"game code not valid"})
            return


        emit('game-info', {'password_needed': not not game.password})

    @socketio.on('join-game')
    def join_game(data:dict):
        game_code = data.get("game_code",None)
        player_name = data.get("name",None)
        password = data.get("password",None)
        print("request to join game: " + game_code)
        game:Game = games.get(game_code,None)
        if not game:
            emit("user-error", {"error:":"game code not valid"})
            return

        if bool(game.password) and game.password != password:
            emit("user-error", {"error:":"incorrect password"})
            return     
        if player_name in game.get_player_names():
            emit("user-error", {"error:":"user with that name already exists"})
            return            
        game_token = gen_token()

      
        player = Player(player_name=player_name)
        game.players[game_token] = player

        join_room(game_code)
        emit('joined-game', {"game_token":game_token})
        emit("players-update",{"players": game.get_player_names()},to=game.owner_sid)


    # @socketio.on("disconnect-custom")
    # def handle_custom_disconnect(data):
    #     print("custom disconnect")
    #     print(data)


    # TODO from game.players, remove the associated player using request,sid
    @socketio.on("disconnect")
    def handle_disconnect():
        print(request.sid + " --- disconnected")


    @socketio.on("start-game")
    def handle_start_game(data:dict):
        print("start game")

        game_code = data.get("game_code",None)
        game:Game = games.get(game_code,None)
        game_token = data.get("game_token",None)
        if not game_token:
            emit("user-error", {"error:":"Please provide a game_token"})
            return
        if not game:
            emit("user-error", {"error:":"game code not valid"})
            return
        
        if game.owner_sid != request.sid:
            if game.owner_token != game_token:
                emit('user-error',"you are not permitted to do that action" ,to=request.sid)
                return
            else:
                game.owner_sid = request.sid
        game.state = QUESTION

        first_question = game.questions[0]['quote']
        options = list(game.author_scores.keys())
        message = {"question":first_question,"options":options}

        print("starting game " + game_code)
        emit('question',message ,to=game_code)
        send_message_to_client(game.owner_sid,'question', body=message)

    @socketio.on("my-answer")
    def handle_answer(data:dict):
        game_code = data.get("game_code",None)
        answer = data.get("answer",None)
        game_token = data.get("game_token",None)
        if not game_token:
            emit("user-error", {"error:":"Please provide a game_token"})
            return
        game:Game = games.get(game_code,None)
        if not game:
            emit("user-error", {"error:":"game code not valid"})
            return
        player:Player = game.players.get(game_token,None)
        if not player:
            emit("user-error", {"error:":"you are not in this game"})
            return
        emit("new-answer",{"name":player.name},to=game.owner_sid)
        if answer == game.questions[game.current_q_index]['author']:
            player.score += 1 # TODO change the way score is calculated
            emit("answer-correctness",{"isCorrect":True})
        else:
            emit("answer-correctness",{"isCorrect":False})
        

    @socketio.on("question-finished")
    def handle_question_finished(data:dict):
        print("question finshed")
        game_code = data.get("game_code",None)
        print(game_code) 
        game:Game = games.get(game_code,None)
        game_token = data.get("game_token",None)
        if not game_token:
            emit("user-error", {"error:":"Please provide a game_token"})
            return
        if not game:
            emit("user-error", {"error:":"game code not valid"})
            return
        if game.owner_token == game_token:
            if game.owner_sid != request.sid:
                game.owner_sid = request.sid
            game.state = ANSWER
            emit('question-finished',to=game.game_code)
            emit('player-scores',game.get_players())
        else:
            emit('user-error',"you are not permitted to do that action")

    @socketio.on("start-rebuttal")
    def handle_rebuttal_start(data:dict):
        print("rebuttal start")

        game_code = data.get("game_code",None)
        game:Game = games.get(game_code,None)
        game_token = data.get("game_token",None)

        if not game:
            emit("user-error", {"error:":"game code not valid"})
            return
        if not game_token:
            emit("user-error", {"error:":"Please provide a game_token"})
            return
        if game.owner_token == game_token:
            if game.owner_sid != request.sid:
                game.owner_sid = request.sid
            game.state = REBUTTAL
            author = game.questions[game.current_q_index]['author']
            emit('start-rebuttal',{"author_name":author},to=game.game_code)
            emit('rebuttal-details',{"question":game.questions[game.current_q_index]})
        else:
            emit('user-error',"you are not permitted to do that action")
    
    @socketio.on("rebuttal-vote")
    def handle_rebuttal_vote(data:dict):
        print("rebuttal vote")
        game_code = data.get("game_code",None)
        game:Game = games.get(game_code,None)
        score = data.get("score",None)
        game_token = data.get("game_token",None)
        print("vote in game " + game_code)
        if not game_token:
            emit("user-error", {"error:":"Please provide a game_token"})
            return
        if not game:
            emit("user-error", {"error:":"game code not valid"})
            return
        author = game.questions[game.current_q_index]['author']
        # print("current author:"+author)
        game.author_scores[author] += score # TODO make sure score is in certain bounds?
        player = game.players[game_token]
        emit('rebuttal-vote',{"name":player.name,"score":score},to=game.owner_sid)
        
    @socketio.on("rebuttal-end")
    def handle_rebuttal_end(data:dict):
        print("rebuttal-end")

        game_code = data.get("game_code",None)
        game:Game = games.get(game_code,None)
        game_token = data.get("game_token",None)
        if not game_token:
            emit("user-error", {"error:":"Please provide a game_token"})
            return
        if game.owner_token == game_token :
            if game.owner_sid != request.sid:
                game.owner_sid = request.sid
            game.current_q_index += 1
            if game.current_q_index < game.num_questions:
                game.state = QUESTION
                question = game.questions[game.current_q_index]['quote']
                options = list(set([question['author'] for question in game.questions]))
                message = {"question":question,"options":options}

                emit('question',message ,to=game_code)
                send_message_to_client(game.owner_sid,'question', body=message)
            else:
                game.state = RESULTS
                emit('game-end' ,to=game_code)
                emit('game-end',{"authorVotes":game.author_scores},to=game.owner_sid)

        else:
            emit('user-error',"you are not permitted to do that action")

    @socketio.on("update")
    def handle_update(data:dict):
        print("update")
        game_code = data.get("game_code",None)
        game:Game = games.get(game_code,None)
        game_token = data.get("game_token",None)
        if not game_token:
            emit("user-error", {"error:":"Please provide a game_token"})
            return
        if game.owner_token == game_token:
            game.owner_sid = request.sid
            if game.state == WAITING:
                emit("update",{"state":"waiting","players": game.get_player_names()})
            elif game.state == QUESTION:
                question = game.questions[game.current_q_index]['quote']
                options = list(set([question['author'] for question in game.questions]))
                message = {"question":question,"options":options}
                emit('update',{"state":"question","question":message})
            elif game.state == ANSWER:
                emit('update',{"state":"answer","scores":game.get_players()})
            elif game.state == REBUTTAL:
                emit('update',{"state":"rebuttal","question":game.questions[game.current_q_index]})
            elif game.state == RESULTS:
                emit('update',{"state":"results","authorVotes":game.author_scores},to=game.owner_sid)

    @socketio.on("end-game")
    def handle_end_game(data:dict):
        game_code = data.get("game_code",None)
        game:Game = games.get(game_code,None)
        game_token = data.get("game_token",None)
        if not game_token:
            emit('game-deleted')
        elif game.owner_token == game_token:
            del game
            emit('game-deleted')

    

    def send_message_to_client(sid,event, body=""):
        socketio.emit(event, body, room=sid)
      

        

        
        