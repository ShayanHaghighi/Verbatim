from flask import request, Blueprint, jsonify
import json
from flask_jwt_extended import get_jwt_identity,jwt_required

from ..models.Deck import Deck
from ..dbManagement import DeckRepository as deck_repo
from ..dbManagement import UserProfileRepository as user_repo

import sqlalchemy

deck_route = Blueprint('decks',__name__)

def response_400(message:str):
    return jsonify({
        "error":"Bad Request",
        "message":message
    }),400


@deck_route.route('/deck',methods=['GET','POST'])
@jwt_required()
def deck_endpoint():
    if request.method == 'GET':
        decks = (user_repo.get_by_id(get_jwt_identity()).to_dict())["decks"]

        return decks,200

    if request.method == 'POST':
        if request.data == b'':
            return response_400("provide deck_name")

        deck :dict = json.loads(request.data)

        # check if request is in right format
        if not 'deck_name' in deck.keys():
            return response_400("provide deck_name")


        # check if user profile exists
        owner = user_repo.get_by_id(get_jwt_identity()) 
        if owner == None:
            return {"msg":"error - user not found"}


        # save deck to database
        deck_new = Deck()
        deck_new.deck_name = deck['deck_name']
        deck_new.owner = owner
        print(deck_new.owner)
        try:
            deck_repo.save_(deck_new)
        except sqlalchemy.exc.IntegrityError:
            return response_400("Deck already exists")


        return jsonify({"message": "Deck created successfully", "deck_id": deck_new.id}), 200

    


@deck_route.route('/deck/<id>',methods=['GET','DELETE','PATCH'])
@jwt_required()
def get_deck(id):


    deck = deck_repo.get_by_id(id) 

    if deck == None:
        response = {
        "error": "Bad Request",
        "message": "Deck with given ID does not exist"
        }
        return jsonify(response),400
    
    if request.method == 'GET':
        return deck.to_dict()
    
    if request.method == 'DELETE':
        deck_repo.delete_(deck)
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
            deck_repo.update_(deck)
            return jsonify({"message": "Deck updated successfully"}), 200
        else:
            return jsonify({"message": "provide deck name to update"}), 400

 