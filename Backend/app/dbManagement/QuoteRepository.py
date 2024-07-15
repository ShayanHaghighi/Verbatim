from app import db
from ..models.Quote import Quote
from sqlalchemy import select, delete, update

def save_(quote:Quote):
    db.session.add(quote)
    db.session.commit()

def get_by_id(id:int) -> Quote:
    return db.session.execute(select(Quote).where(Quote.id == id)).scalar_one_or_none()

def delete_(quote:Quote):
    db.session.delete(quote)
    db.session.commit()

def delete_by_id(id:int):
    db.session.delete(get_by_id(id))
    db.session.commit()

def update_(quote:Quote):
    db_quote = get_by_id(quote.id)
    if db_quote:
        db_quote.deck_id = quote.deck_id
        db_quote.author_id = quote.author_id
        db_quote.quote_text = quote.quote_text
        db.session.commit()
    else:
        print("Error: update object does not exist")