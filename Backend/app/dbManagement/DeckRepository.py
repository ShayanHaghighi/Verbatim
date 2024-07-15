from app import db
from ..models.Deck import Deck
from sqlalchemy import select, delete, update

def save_(deck:Deck):
    db.session.add(deck)
    db.session.commit()

def get_by_id(id:int) -> Deck:
    return db.session.execute(select(Deck).where(Deck.id == id)).scalar_one_or_none()

def delete_(deck:Deck):
    db.session.delete(deck)
    db.session.commit()

def delete_by_id(id:int):
    db.session.delete(get_by_id(id))
    db.session.commit()

def update_(deck:Deck):
    db_deck = get_by_id(deck.id)
    if db_deck:
        db_deck.deck_name = deck.deck_name
        db_deck.owner = deck.owner
        db.session.commit()
    else:
        print("Error: update object does not exist")

def commit():
    db.session.commit()