from flask_socketio import emit, SocketIO,send,join_room,leave_room
from flask import request
from random import SystemRandom
from string import ascii_lowercase,digits

from ...models.Game import games,Player,Game
from ...dbManagement import DeckRepository as deck_repo

players = {}

TOKEN_LENGTH = 32
WAITING,QUESTION,ANSWER,REBUTTAL,RESULTS = [0,1,2,3,4]

# TODO: add game code as url query param (hash?)

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
        if not deck:
            emit("user-error", {"error:":"deck id not valid"})
            return
        for game in games.values():
            if request.sid==game.owner_sid:
                del game
                break
        

        
        

        game = Game(deck=deck, password=password,num_questions=int(num_questions))
        game.owner_sid = request.sid
        games[game.game_code] = game
        game_token = gen_token()
        game.owner_token = game_token
        print(f"num games: {len(games)}")
        emit('code', {'game_code': game.game_code,"game_token":game_token})

    @socketio.on('game-info-req')
    def get_game_info(data:dict):
        game_code = data.get("game_code",None)
        print("asked for game info "+game_code)

        game:Game = games.get(game_code,None)
        if not game:
            emit("user-error", {"error:":"game code not valid"})
            return


        emit('game-info', {'password_needed': not not game.password,'authors':list(game.author_votes.keys()) })

    @socketio.on('current-game-info')
    def get_current_info(data:dict):
     
        game_code = data.get("game_code", None)
        game_token = data.get("game_token", None)
        game:Game = games.get(game_code,None)
        if not game:
            emit('user-error','Game code not valid')
            return
        # TODO auth by checking player code matches one of the players in the game
        message = {"question_no":f"{game.current_q_index+1}/{game.num_questions}"}
        if game_token:
            message["score"] = game.players[game_token].score

        emit('current-game-info',message)

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

    
    @socketio.on('get-players')
    def handle_player_update(data:dict):
        game_code = data.get("game_code",None)
        
        game:Game = games.get(game_code,None)
        if not game:
            emit("user-error", {"error:":"game code not valid"})
            return
        
        if request.sid==game.owner_sid:
            emit('updated-players',game.get_players())
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
        options = list(game.author_votes.keys())
        message = {"question":first_question,"options":options,"time_limit":game.time_limit}

        print("starting game " + game_code)
        emit('question',message ,to=game_code)
        send_message_to_client(game.owner_sid,'question', body=message)

    @socketio.on("my-answer")
    def handle_answer(data:dict):
        print('got answer')
        game_code = data.get("game_code",None)
        answer = data.get("answer",None)
        game_token = data.get("game_token",None)
        time_taken_ratio = data.get("time_taken_ratio",None)
        
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
            score_increase = round(500 + 600 * (( time_taken_ratio)**2))
            player.score += score_increase
            player.score_increase = score_increase
            print(player.score)
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
            print(game.questions[game.current_q_index])
            author = (game.questions[game.current_q_index])["author"]
            emit('question-finished',{'answer':author},to=game.game_code)
            emit('player-scores',{'scores':game.get_players(),'answer':author})
        else:
            emit('user-error',"you are not permitted to do that action")

    @socketio.on("get-increase")
    def handle_score_increase(data:dict):
        
        game_code = data.get("game_code",None)
        game:Game = games.get(game_code,None)
        game_token = data.get("game_token",None)

        if not game:
            emit("user-error", {"error:":"game code not valid"})
            return
        if not game_token:
            emit("user-error", {"error:":"Please provide a game_token"})
            return
        player:Player = game.players.get(game_token,None)
        if not player:
            emit("user-error", {"error:":"Please provide a valid game_token"})
            return
        
        emit('score-increase',{'increase':player.score_increase})

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
            emit('start-rebuttal',{"author_name":author},to=game.game_code,)
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
        game.author_votes[author] += score # TODO make sure score is in certain bounds?
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
                message = {"question":question,"options":options,"time_limit":game.time_limit}

                emit('question',message ,to=game_code)
                send_message_to_client(game.owner_sid,'question', body=message)
            else:
                game.state = RESULTS
                emit('game-end' ,to=game_code)
                emit('game-end',{"authorVotes":game.author_votes},to=game.owner_sid)

        else:
            emit('user-error',"you are not permitted to do that action")

    @socketio.on("update")
    def handle_update(data:dict):
        print("update")
        game_code = data.get("game_code",None)
        game:Game = games.get(game_code,None)
        game_token = data.get("game_token",None)
        
        if not game or not game_token:
            emit("user-error", {"error:":"Please provide a game_token and valid game_code"})
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
                emit('update',{"state":"results","authorVotes":game.author_votes},to=game.owner_sid)

    # @socketio.on("rejoin-game")
    # def handle_rejoin(data:dict):
    #     print("rejoining")
    #     game_code = data.get("game_code",None)
    #     game:Game = games.get(game_code,None)
    #     game_token = data.get("game_token",None)
    #     if not game_token or not game:
    #         emit("user-error", {"error:":"Please provide a game_token and game_code"})
    #         return
    #     if game_token in game.players:
    #         player = game.players[game_token]
    #         if game.state == WAITING:
    #             emit("rejoin-info",{"state":"waiting","name": player.name})
    #         elif game.state == QUESTION:
    #             question = game.questions[game.current_q_index]['quote']
    #             options = list(set([question['author'] for question in game.questions]))
    #             message = {"question":question,"options":options, }
    #             emit('rejoin-info',{"state":"question","question":message,"time_limit":game.time_limit})
    #         elif game.state == ANSWER:
    #             emit('rejoin-info',{"state":"answer","scores":game.get_players()})
    #         elif game.state == REBUTTAL:
    #             emit('rejoin-info',{"state":"rebuttal","question":game.questions[game.current_q_index]})
    #         elif game.state == RESULTS:
    #             emit('rejoin-info',{"state":"results","authorVotes":game.author_votes},to=game.owner_sid)



    @socketio.on("leave-game")
    def handle_leave_game(data:dict):
        game_code = data.get("game_code",None)
        game:Game = games.get(game_code,None)
        game_token = data.get("game_token",None)
        if game and game_token in game.players:
            res = game.players.pop(game_token,None)
            if res:
                print(f'player {res} left the game')
                emit('left-game') # not used by client yet
                emit("players-update",{"players": game.get_player_names()},to=game.owner_sid)
                del res
            else:
                print(f"request from client not in game: {game_token}, game_code: {game_code}")

    @socketio.on("end-game")
    def handle_end_game(data:dict):
        game_code = data.get("game_code",None)
        game:Game = games.get(game_code,None)
        game_token = data.get("game_token",None)
        if not game_token and game.state == WAITING:
            del game
            emit('game-deleted')
            emit('force-end',to=game_code)
        elif game.owner_token == game_token:
            del game
            emit('game-deleted')
            emit('force-end',to=game_code)

    

    def send_message_to_client(sid,event, body=""):
        socketio.emit(event, body, room=sid)
      

        

        
        