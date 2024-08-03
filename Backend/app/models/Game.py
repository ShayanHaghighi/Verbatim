from random import SystemRandom,sample
from string import ascii_uppercase,digits
from ..models.Deck import Deck
GAME_CODE_LENGTH = 6

games:dict = {}

class Game():
    def __init__(self,deck:Deck,num_questions=1,password=None) -> None:
        self.game_code = gen_code()
        self.password = password
        self.players:dict = {}
        self.owner_sid = None
        self.owner_token = None
        self.current_q_index = 0
        self.num_questions = num_questions
        self.questions = sample(deck.get_quotes(),num_questions)
        self.author_scores = {author:0 for author in deck.get_authors()}
        # other options here

    def get_player_names(self):
        return [player.name for player in self.players.values()]
    
    def get_players(self):
        return [{"name":player.name,"score":player.score} for player in self.players.values()]

class Player():
    def __init__(self,player_name) -> None:
        self.name: str = player_name
        self.score = 0

def gen_code():
    return ''.join(SystemRandom().choice(ascii_uppercase + digits) for _ in range(GAME_CODE_LENGTH))