from random import SystemRandom,sample
from string import ascii_uppercase,digits
from ..models.Deck import Deck
GAME_CODE_LENGTH = 6

games:dict = {}

WAITING,QUESTION,ANSWER,REBUTTAL,RESULTS = [0,1,2,3,4]

class Game():
    def __init__(self,deck:Deck,num_questions=1,password=None) -> None:
        self.game_code = gen_code()
        self.password = password # not implemented yet
        self.allow_midway_joining = True # not implemented yet
        self.time_limit = 30 # not implemented yet
        self.players:dict = {}
        self.owner_sid = None
        self.owner_token = None
        self.current_q_index = 0
        self.state = WAITING
        self.num_questions = num_questions
        self.questions = sample(deck.get_quotes(),num_questions)
        self.author_votes = {author:0 for author in deck.get_authors()}
        self.deck_id = deck.id
        # other options here

    def get_player_names(self):
        return [player.name for player in self.players.values()]
    
    def get_players(self):
        return [{"name":player.name,"score":player.score,"score_increase":player.get_score_increase()} for player in self.players.values()]

    def get_available_names(self):
        available_players = []
        for author in list(self.author_votes.keys()):
            if not author in self.get_player_names():
                available_players.append(author)
        return available_players

class Player():
    def __init__(self,player_name) -> None:
        self.name: str = player_name
        self.score = 0
        self.score_list = [0,]
        
    def get_score_increase(self):
        return self.score_list[-1] - self.score_list[-2]

def gen_code():
    return ''.join(SystemRandom().choice(ascii_uppercase + digits) for _ in range(GAME_CODE_LENGTH))
