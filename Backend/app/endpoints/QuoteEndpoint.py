from flask import request, Blueprint, jsonify
import json
from flask_jwt_extended import get_jwt_identity,jwt_required
from datetime import datetime
import re

from ..models.Quote import Quote
from ..dbManagement import DeckRepository as deck_repo
from ..dbManagement import QuoteRepository as quote_repo
from ..dbManagement import AuthorRepository as author_repo

quote_route = Blueprint('quotes',__name__)

@quote_route.route('/quote',methods=['GET','POST'])
@jwt_required()
def quote_endpoint():
    if request.method == 'GET':

        deck_name = request.json.get("deck_name", None)
        deck_id = request.json.get("deck_id", None)

        if not (deck_name or deck_id):
            return {"msg":"please provide deck_name/deck_id"},400
        
        # check if deck exists
        deck = deck_repo.get_by_id(int(deck_id)) if deck_id else deck_repo.get_by_owner_id_and_name(owner_id=get_jwt_identity(),deck_name=deck_name)
        if deck == None:
            return {"msg":"Deck does not exist"},400

        return deck_repo.get_by_id(deck.id).to_dict()['quotes']


    if request.method == 'POST':
        deck_name = request.json.get("deck_name", None)
        deck_id = request.json.get("deck_id", None)
        quote_text = request.json.get("quote_text", None)
        author_name = request.json.get("author_name", None)
        author_id = request.json.get("author_id", None)
        string_date:str = request.json.get("date", None)

        if string_date:
            date = datetime(re.findall(r"[\w']+", string_date))

        if not (deck_name or deck_id) or not (author_name or author_id) or not quote_text:
            return {"msg":"please provide author_name/author_id, deck_name/deck_id and quote_text"},400

        # check if deck exists
        deck = deck_repo.get_by_id(int(deck_id)) if deck_id else deck_repo.get_by_owner_id_and_name(owner_id=get_jwt_identity(),deck_name=deck_name)
        if deck == None:
            return {"msg":"Deck does not exist"},4000
        
        # check if user profile exists
        author = author_repo.get_by_id(int(author_id)) if author_id else author_repo.get_by_author_and_deck_id(deck_id=deck.id,author_name=author_name)
        if author == None:
            return {"msg":"Author does not exist"},400
        
        if author.deck_id != deck.id:
            return {"msg":"Author must be from given deck"},400

        # save deck to database
        quote_new = Quote(quote_text=quote_text , deck=deck , author=author,date_created=date)
        quote_repo.save_(quote_new)
        return {"message": "Quote created successfully"}, 200



@quote_route.route('/quote/<id>',methods=['GET','DELETE','PATCH'])
@jwt_required()
def get_quote(id):


    quote = quote_repo.get_by_id(id) 

    if quote == None:
        return {"msg":"Quote with given ID does not exist"},400
    
    if request.method == 'GET':
        return quote.to_dict()
    
    if request.method == 'DELETE':
        quote_repo.delete_(quote)
        return jsonify({"message": "Deck deleted successfully"}), 200


    if request.method == 'PATCH':
        deck_name = request.json.get("deck_name", None)
        deck_id = request.json.get("deck_id", None)
        quote_text = request.json.get("quote_text", None)
        author_name = request.json.get("author_name", None)
        author_id = request.json.get("author_id", None)
        
        if not (deck_name or deck_id or author_name or author_id or quote_text):
            return {"msg":"please provide author_name/author_id, deck_name/deck_id or quote_text to update the quote with"},400

        deck = None
        author = None

        # check if deck exists
        if deck_name or deck_id:
            deck = deck_repo.get_by_id(int(deck_id)) if deck_id else deck_repo.get_by_owner_id_and_name(owner_id=get_jwt_identity(),deck_name=deck_name)
            if deck == None:
                return {"msg":"Deck does not exist"},400
        
        # check if user profile exists
        if author_name or author_id:
            author = author_repo.get_by_id(int(author_id)) if author_id else author_repo.get_by_author_and_deck_id(deck_id=deck.id,author_name=author_name)
            if author == None:
                return {"msg":"Author does not exist"},400

        if quote_text:
            quote.quote_text = quote_text
        if author:
            quote.author = author
        if deck:
            quote.deck = deck
        if quote.author.deck_id != quote.deck.id:
            return {"msg":"Author must be from given deck"},400
        quote_repo.update_(quote)
        return jsonify({"message": "Quote updated successfully"}), 200
 