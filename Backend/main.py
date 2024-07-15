from app import *
from flask import Flask
from app.endpoints.DeckResource import deck

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = "postgresql+psycopg2://postgres:Taytay21@localhost:5432/verbatimproject"
db.init_app(app)


app.register_blueprint(deck, url_prefix='/')

if __name__ == '__main__':
    app.run()