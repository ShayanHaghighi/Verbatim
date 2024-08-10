from flask_sqlalchemy import SQLAlchemy
from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_socketio import SocketIO
from datetime import timedelta
db = SQLAlchemy()

def create_app():
    backend = Flask(__name__)

    CORS(backend)

    db.init_app(backend)


    backend.config["JWT_SECRET_KEY"] = "please-remember-to-change-me"
    backend.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=1)
    jwt = JWTManager(backend)

    socketio = SocketIO(backend, cors_allowed_origins="*")

    from app.endpoints.DeckEndpoint import deck_route
    from app.endpoints.QuoteEndpoint import quote_route
    from app.endpoints.AuthorEndpoint import author_route
    from app.endpoints.AuthEndpoint import tokens_route
    from app.endpoints.UserEndpoint import user_profile_route
    from app.endpoints.game.GameResource import game_route

    backend.register_blueprint(quote_route, url_prefix='/api')
    backend.register_blueprint(deck_route, url_prefix='/api')
    backend.register_blueprint(author_route, url_prefix='/api')
    backend.register_blueprint(tokens_route, url_prefix='/api')
    backend.register_blueprint(game_route, url_prefix='/api')
    backend.register_blueprint(user_profile_route, url_prefix='/api')

    from app.endpoints.game.GameSockets import init_sockets

    init_sockets(socketio)
    socketio.run(backend, host='127.0.0.1', port=5000)
