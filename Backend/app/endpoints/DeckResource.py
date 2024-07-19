from flask import request, Blueprint, jsonify
import json

from ..models.Deck import Deck
from ..dbManagement import DeckRepository as quote_repo
from ..dbManagement import UserProfileRepository as user_repo

deck_route = Blueprint('decks',__name__)


@deck_route.route('/deck',methods=['GET','POST'])
def deck_endpoint():
    if request.method == 'GET':

        # get all decks for the current logged in user
        pass

    if request.method == 'POST':
        if request.data == b'':
            response = {
            "error": "Bad Request",
            "message": "Provide attributes to update"
            }
            return jsonify(response),400

        deck :dict = json.loads(request.data)


        # check if request is in right format
        if not 'owner_id' in deck.keys() or \
            not 'deck_name' in deck.keys():
            response = {
            "error": "Bad Request",
            "message": "provide deck_name and owner_id"
            }
            return jsonify(response),400

        # check if user profile exists
        owner = user_repo.get_by_id(int(deck['owner_id'])) 
        if owner == None:
            response = {
            "error": "Bad Request",
            "message": "User Profile does not exist"
            }
            return jsonify(response),400

        # save deck to database
        deck_new = Deck()
        deck_new.deck_name = deck['deck_name']
        deck_new.owner = owner
        print(deck_new.owner)
        quote_repo.save_(deck_new)
        return jsonify({"message": "Deck created successfully"}), 200

    


@deck_route.route('/deck/<id>',methods=['GET','DELETE','PATCH'])
def get_deck(id):


    deck = quote_repo.get_by_id(id) 

    if deck == None:
        response = {
        "error": "Bad Request",
        "message": "Deck with given ID does not exist"
        }
        return jsonify(response),400
    
    if request.method == 'GET':
        return deck.to_dict()
    
    if request.method == 'DELETE':
        quote_repo.delete_(deck)
        return jsonify({"message": "Deck deleted successfully"}), 200


    if request.method == 'PATCH':

        if request.data == b'':
            response = {
            "error": "Bad Request",
            "message": "Provide attributes to update"
            }
            return jsonify(response),400
        

        user_request :dict = json.loads(request.data)

        
        

        if 'deck_name' in user_request.keys():
            deck.deck_name = user_request['deck_name']
            quote_repo.update_(deck)
        return jsonify({"message": "Deck updated successfully"}), 200
 