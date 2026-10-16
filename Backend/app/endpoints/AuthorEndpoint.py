from flask import request, Blueprint
from ..endpoints.game.GameSockets import game

from ..new_dbmanagement.db_management import get_all_player_names

IMAGE_DIR = "assets/author_images"


author_route = Blueprint('authors',__name__)

@author_route.route('/author',methods=['GET','POST'])
def author_endpoint():

    if request.method == 'GET':
        players = get_all_player_names()
        # players_taken = game.get_player_names()
        # print("players taken",players,players_taken)



        # available_players = list(set(players) - set(players_taken))

        return players, 200

