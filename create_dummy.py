from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import ForeignKey, UniqueConstraint, String, select, delete
from flask_sqlalchemy import SQLAlchemy
from flask import Flask
from flask_login import UserMixin
from flask import current_app


db = SQLAlchemy()
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = "postgresql+psycopg2://postgres:Taytay21@localhost:5432/verbatimproject"
db.init_app(app)


class UserProfile(db.Model,UserMixin):
    __tablename__ = 'user_profile'
    
    id: Mapped[int] = mapped_column(primary_key=True)
    username: Mapped[str] = mapped_column(String(30),unique=True, nullable=False)
    email: Mapped[str] = mapped_column(String(50),unique=True, nullable=False)
    password: Mapped[str] = mapped_column(String(50),unique=True, nullable=False)
    
    decks = relationship('Deck', back_populates='owner')









class Deck(db.Model):
    __tablename__ = 'deck'
    
    id: Mapped[int] = mapped_column(primary_key=True)
    deck_name: Mapped[str] = mapped_column(String(20),nullable=False)

    user_profile_id: Mapped[int] = mapped_column(ForeignKey('user_profile.id'), nullable=False)
    
    owner = relationship('UserProfile', back_populates='decks')
    
    __table_args__ = (
        UniqueConstraint('deck_name', 'user_profile_id', name='owner_of_deck'),
    )









class Quote(db.Model):
    __tablename__ = 'quote'

    id: Mapped[int] = mapped_column(primary_key=True)
    quote_text: Mapped[str] = mapped_column(nullable=False)

    deck_id: Mapped[int] = mapped_column(ForeignKey('deck.id'), nullable=False)
    author_id: Mapped[int] = mapped_column(ForeignKey('author.id'), nullable=False)

    author = relationship('Author', back_populates='quotes')


class Author(db.Model):
    __tablename__ = 'author'

    id: Mapped[int] = mapped_column(primary_key=True)

    author_name: Mapped[str] = mapped_column(String(50),nullable=False)

    deck_id: Mapped[int] = mapped_column(ForeignKey('deck.id'), nullable=False)


    quotes = relationship('Quote',back_populates='author')



    __table_args__ = (UniqueConstraint('author_name','deck_id',name='person_in_deck'),)




with app.app_context():
    db.create_all()


    user_ben = UserProfile(username="Ben",email="b@b.com",password="1234")
    db.session.add(user_ben)



    # deck1 = Deck(deck_name="deck1",owner=user_ben)
    # db.session.add(deck1)



    db.session.commit()


    # print(deck1.owner.username)
    # for deck in user_ben.decks:
    #     print(deck.deck_name)










    users = (db.session.execute(select(UserProfile).where(UserProfile.username == "Ben"))).scalars()

    for user in users:
        print(user)











    # print(users.first())


    # user = UserProfile(username="Ben",email="b@b.com",password="1234")
    # db.session.add(user)


    # deck1 = Deck(deck_name="deck1",owner=user)
    # db.session.add(deck1)

    # db.session.commit()

    # print(deck1.owner.username)
    # for deck in user.decks:
    #     print(deck.deck_name)