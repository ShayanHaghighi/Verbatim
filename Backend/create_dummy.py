from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import ForeignKey, UniqueConstraint, String, Date, select, delete, or_, exc
from flask_sqlalchemy import SQLAlchemy
from flask import Flask
from flask import current_app
import datetime
from psycopg2 import errors
from werkzeug.security import generate_password_hash
from datetime import date

from app.models.UserProfile import UserProfile
db = SQLAlchemy()
app = Flask(__name__)
db.init_app(app)


class UserProfile(db.Model):
    __tablename__ = 'user_profile'
    __table_args__ = {'extend_existing': True}
    
    id: Mapped[int] = mapped_column(primary_key=True)
    username: Mapped[str] = mapped_column(String(30),unique=True, nullable=False)
    email: Mapped[str] = mapped_column(String(50),unique=True, nullable=False)
    password_hash: Mapped[str] = mapped_column(String(162), nullable=False)
    
    decks = relationship('Deck', back_populates='owner',cascade="all,delete")






class Deck(db.Model):
    __tablename__ = 'deck'
    
    id: Mapped[int] = mapped_column(primary_key=True)
    deck_name: Mapped[str] = mapped_column(String(20),nullable=False)
    date_created: Mapped[date] = mapped_column(Date,nullable=True)

    user_profile_id: Mapped[int] = mapped_column(ForeignKey('user_profile.id'), nullable=False)
    
    owner = relationship('UserProfile', back_populates='decks')
    quotes = relationship('Quote', back_populates='deck',cascade="all,delete")
    authors = relationship('Author', back_populates='deck',cascade="all,delete")
    
    __table_args__ = (
        UniqueConstraint('deck_name', 'user_profile_id', name='owner_of_deck'),
    )



class Quote(db.Model):
    __tablename__ = 'quote'

    id: Mapped[int] = mapped_column(primary_key=True)
    quote_text: Mapped[str] = mapped_column(nullable=False)
    date_created: Mapped[date] = mapped_column(Date,nullable=True)

    deck_id: Mapped[int] = mapped_column(ForeignKey('deck.id'), nullable=False)
    author_id: Mapped[int] = mapped_column(ForeignKey('author.id'), nullable=True)

    deck = relationship('Deck', back_populates='quotes')
    author = relationship('Author')


class Author(db.Model):
    __tablename__ = 'author'

    id: Mapped[int] = mapped_column(primary_key=True)

    author_name: Mapped[str] = mapped_column(String(50),nullable=False)

    deck_id: Mapped[int] = mapped_column(ForeignKey('deck.id'), nullable=True)


    quotes = relationship('Quote',back_populates='author')
    deck = relationship('Deck')



    __table_args__ = (UniqueConstraint('author_name','deck_id',name='person_in_deck'),)



with app.app_context():
    db.create_all()


    user_ben = UserProfile(username="Ben",email="b@b.com",password_hash=generate_password_hash("1234"))
    db.session.add(user_ben)

    user_bob = UserProfile(username="Bob",email="bob@bob.com",password_hash=generate_password_hash("abcd"))
    db.session.add(user_bob)



    # deck1 = Deck(deck_name="deck1",owner=user_ben)
    # db.session.add(deck1)


    try:
        db.session.commit()
    except exc.IntegrityError:
        print("user already exists")
    except errors.UniqueViolation:
        print("user already exists")

    # print(deck1.owner.username)
    # for deck in user_ben.decks:
    #     print(deck.deck_name)












    # print(users.first())


    # user = UserProfile(username="Ben",email="b@b.com",password="1234")
    # db.session.add(user)


    # deck1 = Deck(deck_name="deck1",owner=user)
    # db.session.add(deck1)

    # db.session.commit()

    # print(deck1.owner.username)
    # for deck in user.decks:
    #     print(deck.deck_name)