from flask import request, Blueprint, jsonify,send_file
import json
from flask_jwt_extended import get_jwt_identity,jwt_required
from os import path, getcwd, makedirs

from ..models.Author import Author
from ..dbManagement import DeckRepository as deck_repo
from ..dbManagement import QuoteRepository as quote_repo
from ..dbManagement import AuthorRepository as author_repo
from ..models.Game import games,Player,Game

IMAGE_DIR = "assets/author_images"


author_route = Blueprint('authors',__name__)

@author_route.route('/author',methods=['GET','POST'])
@jwt_required()
def author_endpoint():
    if request.method == 'GET':
        deck_name = request.json.get("deck_name", None)
        deck_id = request.json.get("deck_id", None)

        if deck_id:
            deck = deck_repo.get_by_id(deck_id)
        elif deck_name:
            deck = deck_repo.get_by_owner_id_and_name(deck_name=deck_name,owner_id=get_jwt_identity())
        else:
            return {"msg":"provide deck_name or deck_id"},400
        authors = deck.to_dict()['authors']
        return authors,200

    if request.method == 'POST':

        deck_name = request.json.get("deck_name", None)
        deck_id = request.json.get("deck_id", None)
        author_name = request.json.get("author_name", None)

        if author_name and deck_id and author_repo.get_by_author_and_deck_id(author_name=author_name,deck_id=deck_id):
            return {"msg":"author with this name already exists in this deck"},400


        if not (deck_name or deck_id) or not author_name:
            return {"msg":"please provide author_name and deck_id/deck_name"},400

        # check if deck exists
        deck = deck_repo.get_by_id(int(deck_id)) if deck_id else deck_repo.get_by_owner_id_and_name(owner_id=get_jwt_identity(),deck_name=deck_name)
        if deck == None:
            response = {
            "error": "Bad Request",
            "message": "Deck does not exist"
            }
            return jsonify(response),400
        
        # save deck to database
        author_new = Author()
        author_new.author_name = author_name
        author_new.deck = deck
        author_repo.save_(author_new)

        return jsonify({"message": "Author created successfully"}), 200


@author_route.route('/author/<id>',methods=['GET','DELETE','PATCH'])
@jwt_required()
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

        deck_name = request.json.get("deck_name", None)
        deck_id = request.json.get("deck_id", None)
        author_name = request.json.get("author_name", None)        

        if not (deck_name or deck_id or author_name):
            return {"msg":"please provide author_name, deck_id or deck_name to update"},400

        # get deck if name or id is provided
        deck = None
        if not (deck_name or deck_id):
            deck = deck_repo.get_by_id(int(deck_id)) if deck_id else deck_repo.get_by_owner_id_and_name(owner_id=get_jwt_identity(),deck_name=deck_name)
        
        if deck:
            author.deck = deck
        if author_name:
            author.author_name = author_name

        author_repo.update_(author)
        return jsonify({"message": "Deck updated successfully"}), 200
 

@author_route.route('/author/images/<id>',methods=['GET'])
@jwt_required()
def auth_images(id):
    if request.method == 'GET':
        author = author_repo.get_by_id(id)
        
        
        if not author:
            return {"error":"invalid US scan ID"},404
        dir = path.join("..","assets","author_images")
        image_path = path.join(dir,f"{id}.png")
        return send_file(image_path, mimetype='image/png')
    

    if request.method == 'POST':
        if 'image' not in request.files:
            return jsonify({"error": "No image file provided"}), 400
        # print("keys:")
        # print(request.files.keys())
        # print(request.files)
        file = request.files['image']


        # if file.filename == '':
        #     return jsonify({"error": "No selected file"}), 400

        if not file.filename.lower().endswith(('.png')):
            return jsonify({"error": "Unsupported file type - only png is supported"}), 400

        image_path = IMAGE_DIR+f"/{id}.png"
        file.save(image_path)

@author_route.route('/author/images',methods=['GET'])
# @jwt_required()
def auth_images_game():

    game_code = request.args.get('game_code',None)
    player_name = request.args.get('player_name',None)
    
    if not game_code or not player_name:
        return  {"msg":"provide game_code and player_name"},400

    game:Game = games.get(game_code,None)

    if not game_code or not player_name:
        return  {"msg":"game with game code does not exist"},400

    author_id = 0
    for author_name in game.author_votes.keys():
        if author_name == player_name:
            author = author_repo.get_by_author_and_deck_id(author_name=author_name,deck_id=game.deck_id)
            if not author:
                return {"msg":"internal error - could not find that author"},500
            else:
                author_id = author.id
                break
    dir = path.join("..","assets","author_images")
    image_path = path.join(dir,f"{author_id}.png")
    return send_file(image_path, mimetype='image/png')