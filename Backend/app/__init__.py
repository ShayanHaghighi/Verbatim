from flask_sqlalchemy import SQLAlchemy
from flask import Flask
from flask_cors import CORS
from flask_socketio import SocketIO
from dotenv import load_dotenv
import os

db = SQLAlchemy()

def create_app():


    backend = Flask(__name__)

    CORS(backend)



    load_dotenv()


    socketio = SocketIO(backend, cors_allowed_origins="*")
    from app.new_dbmanagement.db_management import init_db
    init_db()

    from app.endpoints.AuthorEndpoint import author_route

    backend.register_blueprint(author_route, url_prefix='/api')

    from app.endpoints.game.GameSockets import init_sockets
    init_sockets(socketio)
    print(socketio.async_mode)
    socketio.run(backend, host='127.0.0.1', port=5000)
    # socketio.run(backend, host='0.0.0.0', port=5000)
