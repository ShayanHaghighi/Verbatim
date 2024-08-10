from flask import request, Blueprint, jsonify
import json
from flask_jwt_extended import get_jwt_identity,jwt_required,create_access_token,get_jwt
from datetime import datetime, timedelta, timezone

from ..models.Deck import Deck
from ..dbManagement import DeckRepository as deck_repo
from ..dbManagement import UserProfileRepository as user_repo
from .AuthEndpoint import refresh_expiring_jwts

from sqlalchemy import exc

deck_route = Blueprint('decks',__name__)


@deck_route.after_request
def refresh(response):
    return refresh_expiring_jwts(response)
    

@deck_route.route('/deck',methods=['GET','POST'])
@jwt_required()
def deck_endpoint():
    if request.method == 'GET':
        if request.args.get('short')=="true":
            decks = {"decks":list(map(lambda deck: deck.to_dict_short(),deck_repo.get_all_by_owner_id(get_jwt_identity())))}
            return decks,200

        decks = {"decks":(user_repo.get_by_id(get_jwt_identity()).to_dict())["decks"]}

        return decks,200

    if request.method == 'POST':

        # get the deck name from the request body
        deck_name = request.json.get("deck_name", None)

        # check if deck_name attribute was provided
        if not deck_name:
            return {"msg":"provide deck_name"},400


        # check if user profile exists
        owner = user_repo.get_by_id(get_jwt_identity()) 
        if owner == None:
            return {"msg":"error - user not found"}
        new_deck = Deck(deck_name=deck_name,owner=owner)
        # save deck to database
        try:
            deck_repo.save_(new_deck)
        except exc.IntegrityError:
            return {"msg":"deck with that name already exists"},400

        return jsonify({"message": "Deck created successfully", "deck_id": new_deck.id}), 200

    


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

 