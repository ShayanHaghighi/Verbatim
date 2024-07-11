from Backend import db
from ..models.Deck import Deck
from sqlalchemy import select, delete, update

def save_(deck:Deck):
    db.session.add(deck)
    db.session.commit()

def get_by_id(id:int) -> Deck:
    return db.session.execute(select(Deck).where(Deck.id == id)).scalar_one_or_none()

def delete_(deck:Deck):
    db.session.delete(deck)

def update_(deck:Deck):
    db_deck = get_by_id(deck.id)
    if db_deck:
        db_deck.deck_name = deck.deck_name
        db_deck.owner = deck.owner
        db.session.commit()
    else:
        print("Error: update object does not exist")