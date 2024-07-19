from app import db
from flask import Flask
from flask_jwt_extended import JWTManager
from datetime import timedelta
from flask_cors import CORS

from app.endpoints.DeckResource import deck_route
from app.endpoints.QuoteResource import quote_route
from app.endpoints.AuthorResource import author_route
from app.endpoints.AuthResource import tokens_route
from app.endpoints.UserProfileResource import user_profile_route

backend = Flask(__name__)

CORS(backend)

backend.config['SQLALCHEMY_DATABASE_URI'] = "postgresql+psycopg2://postgres:Taytay21@localhost:5432/verbatimproject"
db.init_app(backend)

backend.config["JWT_SECRET_KEY"] = "please-remember-to-change-me"
backend.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=1)
jwt = JWTManager(backend)

backend.register_blueprint(deck_route, url_prefix='/')
backend.register_blueprint(quote_route, url_prefix='/')
backend.register_blueprint(author_route, url_prefix='/')
backend.register_blueprint(tokens_route, url_prefix='/')
backend.register_blueprint(user_profile_route, url_prefix='/')


if __name__ == '__main__':
    backend.run()