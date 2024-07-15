from app import *
from flask import Flask
from app.endpoints.DeckResource import deck_route
from app.endpoints.QuoteResource import quote_route
from app.endpoints.AuthorResource import author_route



app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = "postgresql+psycopg2://postgres:Taytay21@localhost:5432/verbatimproject"
db.init_app(app)

app.register_blueprint(deck_route, url_prefix='/')
app.register_blueprint(quote_route, url_prefix='/')
app.register_blueprint(author_route, url_prefix='/')

if __name__ == '__main__':
    app.run()