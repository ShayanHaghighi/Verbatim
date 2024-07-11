from Backend import *
from flask import Flask
from Backend.endpoints.DeckResource import deck

app = Flask(__name__)

app.register_blueprint(deck, url_prefix='/')
app.run()