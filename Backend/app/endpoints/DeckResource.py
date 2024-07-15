from flask import request, Blueprint
from ..models.Deck import Deck
from ..dbManagement.DeckRepository import save_, delete_,update_, get_by_id
import json

deck = Blueprint('exmaple',__name__)


@deck.route('/deck',methods=['GET','POST','UPDATE'])
def deck_endpoint():
    if request.method == 'POST':
        deck = json.loads(request.data)
        deck_db = Deck()
        deck_db.deck_name = deck['deck_name']
        return deck

@deck.route('/deck/<id>',methods=['GET','DELETE'])
def get_deck(id):
    return id