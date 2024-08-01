from app import db
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import ForeignKey, UniqueConstraint, String, Date
from datetime import date

class Quote(db.Model):
    __tablename__ = 'quote'

    id: Mapped[int] = mapped_column(primary_key=True)
    quote_text: Mapped[str] = mapped_column(nullable=False)
    date_created: Mapped[date] = mapped_column(Date,nullable=True)

    deck_id: Mapped[int] = mapped_column(ForeignKey('deck.id'), nullable=False)
    author_id: Mapped[int] = mapped_column(ForeignKey('author.id'), nullable=True)

    deck = relationship('Deck', back_populates='quotes')
    author = relationship('Author')

    def to_dict(self):
        return {
            'id' : self.id,
            'quote_text' : self.quote_text,
            'deck_id' : self.deck_id,
            'author' : self.author.to_dict_short(),
        }
    
    def get_as_questions(self):
        return {
            'quote' : self.quote_text,
            'author' : self.author.author_name,
        }        
    
    def to_dict_short(self):
        return {
            'id' : self.id,
            'quote_text' : self.quote_text,
        }        