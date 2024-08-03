import json
from flask import request, jsonify, Blueprint
from datetime import datetime, timedelta, timezone
from flask_jwt_extended import create_access_token,get_jwt,get_jwt_identity, \
                               unset_jwt_cookies, jwt_required
from werkzeug.security import generate_password_hash, check_password_hash


from ..dbManagement.UserProfileRepository import get_by_email, get_by_username, save_
from ..models.UserProfile import UserProfile

tokens_route = Blueprint('tokens',__name__)

# TODO: implement refresh tokens?
@tokens_route.after_request
def refresh_expiring_jwts(response):
    try:
        exp_timestamp = get_jwt()["exp"]
        now = datetime.now(timezone.utc)
        target_timestamp = datetime.timestamp(now + timedelta(minutes=30))
        if target_timestamp > exp_timestamp:
            access_token = create_access_token(identity=get_jwt_identity())
            data = response.get_json()
            if type(data) is dict:
                data["access_token"] = access_token 
                response.data = json.dumps(data)
        return response
    except (RuntimeError, KeyError):
        # Case where there is not a valid JWT. Just return the original respone
        return response
    

@tokens_route.route('/login', methods=["POST"])
def create_token():

    email = request.json.get("email", None)
    password = request.json.get("password", None)
    if not email or not password:
        return {"msg": "Please provide email and password"}, 400


    user = get_by_email(email)

    if not user:
        return {"msg": "User with that email does not exist"}, 400

    password_correct = check_password_hash(user.password_hash,password)
    if not password_correct:
        return {"msg": "Incorrect password"}, 400

    access_token = create_access_token(identity=user.id)
    response = {"access_token":access_token}
    return response



@tokens_route.route('/signup', methods=["POST"])
def create_user_and_token():



    email = request.json.get("email", None)
    username = request.json.get("username", None)
    password = request.json.get("password", None)

    if not email or not password or not username:
        return {"msg": "Please provide email, username and password"}, 400
        

    if len(password)>50:
        return {"msg": "password too long"}, 400


    user = get_by_email(email)

    if user:
        return {"msg": "User with that email already exists"}, 400
    
    user = get_by_username(username)

    if user:
        return {"msg": "User with that username already exists"}, 400

    user = UserProfile(username=username, email=email, password_hash=generate_password_hash(password))
    save_(user)

    access_token = create_access_token(identity=user.id)
    response = {"access_token":access_token}
    return response


@tokens_route.route("/logout", methods=["POST"])
def logout():
    response = jsonify({"msg": "logout successful"})
    unset_jwt_cookies(response)
    return response

@tokens_route.route('/test')
@jwt_required()
def my_profile():
    response_body = {
        "msg":"access-token accepted"
}

    return response_body,200




