from flask import request, Blueprint, jsonify
import json
from flask_jwt_extended import get_jwt_identity,jwt_required
from werkzeug.security import generate_password_hash


from ..models.Quote import Quote
from ..dbManagement import DeckRepository as deck_repo
from ..dbManagement import QuoteRepository as quote_repo
from ..dbManagement import AuthorRepository as author_repo
from ..dbManagement import UserProfileRepository as user_repo

user_profile_route = Blueprint('user_profile',__name__)

@user_profile_route.route('/userProfile',methods=['GET'])
@jwt_required()
def quote_endpoint():
    if request.method == 'GET':

        return user_repo.get_by_id(get_jwt_identity()).to_dict(),200


@user_profile_route.route('/userProfile/<id>',methods=['GET','DELETE','PATCH'])
@jwt_required()
def get_quote(id):


    user = user_repo.get_by_id(id) 

    if user == None:
        return {"msg":"User with given ID does not exist"},400
    
    if request.method == 'GET':
        return user.to_dict()
    
    if request.method == 'DELETE':
        if user.id != get_jwt_identity():
            return {"msg": "you do not have authority to delete that account"}, 403
            
        user_repo.delete_(user)
        return {"message": "User deleted successfully"}, 200


    if request.method == 'PATCH':
        if user.id != get_jwt_identity():
            return {"msg": "you do not have authority to edit that account"}, 403
        
        username = request.json.get("username", None)
        password = request.json.get("password", None)
        email = request.json.get("email", None)

        
        if not (username or password or email):
            return {"msg":"please provide user_name, password or email to update the user profile with"},400


        if email:
            user.email = email
        if password:
            user.password_hash = generate_password_hash(password)
        if username:
            user.username = username
        user_repo.update_(user)
        return jsonify({"message": "User Profile updated successfully"}), 200
 