from app import db
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import ForeignKey, UniqueConstraint, String

class Quote(db.Model):
    __tablename__ = 'quote'

    id: Mapped[int] = mapped_column(primary_key=True)
    quote_text: Mapped[str] = mapped_column(nullable=False)

    deck_id: Mapped[int] = mapped_column(ForeignKey('deck.id'), nullable=False)
    author_id: Mapped[int] = mapped_column(ForeignKey('author.id'), nullable=False)

    deck = relationship('Deck', back_populates='quotes')
    author = relationship('Author')

    def to_dict(self):
        return {
            'id' : self.id,
            'quote_text' : self.quote_text,
            'deck_id' : self.deck_id,
            'author_id' : self.author_id,
        }