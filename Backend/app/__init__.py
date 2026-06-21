from flask_sqlalchemy import SQLAlchemy
from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_socketio import SocketIO
from datetime import timedelta
from dotenv import load_dotenv
import os

db = SQLAlchemy()

def create_app():


    backend = Flask(__name__)

    CORS(backend)



    # app = Flask(__name__)

    load_dotenv()
    # password = os.getenv('PASSWORD')
    # username = os.getenv('DATABASE_USERNAME')
    # db_port = os.getenv('DATABASE_SERVER_PORT')
    # db_name = os.getenv('DATABASE_NAME')
    # print(username)
    # backend.config['SQLALCHEMY_DATABASE_URI'] = f"postgresql+psycopg2://{username}:{password}@localhost:{db_port}/{db_name}"

    # db.init_app(backend)


    socketio = SocketIO(backend, cors_allowed_origins="*",async_mode="eventlet",)
    from app.new_dbmanagement.db_management import init_db
    init_db()
    # from app.endpoints.DeckEndpoint import deck_route
    from app.endpoints.AuthorEndpoint import author_route

    # backend.register_blueprint(quote_route, url_prefix='/api')
    # backend.register_blueprint(deck_route, url_prefix='/api')
    backend.register_blueprint(author_route, url_prefix='/api')
    # backend.register_blueprint(tokens_route, url_prefix='/api')
    # backend.register_blueprint(user_profile_route, url_prefix='/api')

    from app.endpoints.game.GameSockets import init_sockets
    init_sockets(socketio)
    print(socketio.async_mode)
    socketio.run(backend, host='127.0.0.1', port=5000)
    # socketio.run(backend, host='0.0.0.0', port=5000)
