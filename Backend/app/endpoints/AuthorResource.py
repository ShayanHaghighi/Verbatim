from flask import request, Blueprint, jsonify
import json

from ..models.Author import Author
from ..dbManagement import DeckRepository as deck_repo
from ..dbManagement import QuoteRepository as quote_repo
from ..dbManagement import AuthorRepository as author_repo

author_route = Blueprint('authors',__name__)



@author_route.route('/author',methods=['GET','POST'])
def author_endpoint():
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
        if  not 'author_name'  in user_request.keys() or \
            not 'deck_id'    in user_request.keys():
                
                response = {
                "error": "Bad Request",
                "message": "provide author_name and deck_id"
                }
                return jsonify(response),400

        # check if user profile exists
        deck = deck_repo.get_by_id(int(user_request['deck_id'])) 
        if deck == None:
            response = {
            "error": "Bad Request",
            "message": "Deck does not exist"
            }
            return jsonify(response),400
        
        # save deck to database
        author_new = Author()
        
        author_new.author_name = user_request['author_name']
        author_new.deck = deck


        author_repo.save_(author_new)
        return jsonify({"message": "Author created successfully"}), 200


@author_route.route('/author/<id>',methods=['GET','DELETE','PATCH'])
def get_author(id):


    author = author_repo.get_by_id(id) 

    if author == None:
        response = {
        "error": "Bad Request",
        "message": "Author with given ID does not exist"
        }
        return jsonify(response),400
    
    if request.method == 'GET':
        return author.to_dict()
    
    if request.method == 'DELETE':
        author_repo.delete_(author)
        return jsonify({"message": "Deck deleted successfully"}), 200


    if request.method == 'PATCH':

        if request.data == b'':
            response = {
            "error": "Bad Request",
            "message": "Provide attributes to update"
            }
            return jsonify(response),400
        

        user_request :dict = json.loads(request.data)

        
        

        if 'author_name' in user_request.keys():
            author.author_name = user_request['author_name']
            author_repo.update_(author)
        return jsonify({"message": "Deck updated successfully"}), 200
 