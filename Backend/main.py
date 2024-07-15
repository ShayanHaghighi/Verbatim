from app import *
from flask import Flask
from app.endpoints.DeckResource import deck

app = Flask(__name__)

app.register_blueprint(deck, url_prefix='/')

if __name__ == '__main__':
    app.run()