from flask import request, Blueprint, jsonify
import json

from ..models.Quote import Quote
from ..dbManagement import DeckRepository as deck_repo
from ..dbManagement import QuoteRepository as quote_repo
from ..dbManagement import AuthorRepository as author_repo

quote_route = Blueprint('quotes',__name__)



@quote_route.route('/quote',methods=['GET','POST'])
def quote_endpoint():
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

        user_request :dict = json.loads(request.data)


        # check if request is in right format
        if  not 'author_id'  in user_request.keys() or \
            not 'quote_text' in user_request.keys() or \
            not 'deck_id'    in user_request.keys():
                
                response = {
                "error": "Bad Request",
                "message": "provide author_id, deck_id and quote_text"
                }
                return jsonify(response),400

        # check if user profile exists
        author = author_repo.get_by_id(int(user_request['author_id'])) 
        if author == None:
            response = {
            "error": "Bad Request",
            "message": "Author does not exist"
            }
            return jsonify(response),400
        
        deck = deck_repo.get_by_id(int(user_request['deck_id'])) 
        if deck == None:
            response = {
            "error": "Bad Request",
            "message": "Deck does not exist"
            }
            return jsonify(response),400

        # save deck to database
        quote_new = Quote()
        
        quote_new.quote_text = user_request['quote_text']
        quote_new.deck = deck
        quote_new.author = author


        quote_repo.save_(quote_new)
        return jsonify({"message": "Quote created successfully"}), 200



@quote_route.route('/quote/<id>',methods=['GET','DELETE','PATCH'])
def get_quote(id):


    quote = quote_repo.get_by_id(id) 

    if quote == None:
        response = {
        "error": "Bad Request",
        "message": "Quote with given ID does not exist"
        }
        return jsonify(response),400
    
    if request.method == 'GET':
        return quote.to_dict()
    
    if request.method == 'DELETE':
        quote_repo.delete_(quote)
        return jsonify({"message": "Deck deleted successfully"}), 200


    if request.method == 'PATCH':

        if request.data == b'':
            response = {
            "error": "Bad Request",
            "message": "Provide attributes to update"
            }
            return jsonify(response),400
        

        user_request :dict = json.loads(request.data)

        
        

        if 'quote_text' in user_request.keys():
            quote.quote_text = user_request['quote_text']
            quote_repo.update_(quote)
        return jsonify({"message": "Quote updated successfully"}), 200
 