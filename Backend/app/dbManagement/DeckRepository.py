from app import db
from ..models.Deck import Deck
from sqlalchemy import select, delete, update, or_, and_

def save_(deck:Deck):
    db.session.add(deck)
    db.session.commit()

def get_by_id(id:int) -> Deck:
    return db.session.execute(select(Deck).where(Deck.id == id)).scalar_one_or_none()

def get_by_owner_id_and_name(owner_id,deck_name):
    return db.session.execute(select(Deck).where(and_(Deck.user_profile_id == owner_id,Deck.deck_name == deck_name))).scalar_one_or_none()

def get_all_by_owner_id(owner_id:int) -> Deck:
    return db.session.execute(select(Deck).where(Deck.user_profile_id == owner_id)).scalars()

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