from app import db
from ..models.Author import Author
from sqlalchemy import select, delete, update, and_

def save_(author:Author):
    db.session.add(author)
    db.session.commit()

def get_by_id(id:int) -> Author:
    return db.session.execute(select(Author).where(Author.id == id)).scalar_one_or_none()

def get_by_author_and_deck_id(author_name,deck_id):
    return db.session.execute(select(Author).where(and_(Author.author_name == author_name,Author.deck_id == deck_id))).scalar_one_or_none()


def delete_(author:Author):
    db.session.delete(author)
    db.session.commit()

def delete_by_id(id:int):
    db.session.delete(get_by_id(id))
    db.session.commit()

def update_(author:Author):
    db_author = get_by_id(author.id)
    if db_author:
        db_author.deck_id = author.deck_id
        db_author.author_name = author.author_name
        db_author.quotes = author.quotes
        db.session.commit()
    else:
        print("Error: update object does not exist")