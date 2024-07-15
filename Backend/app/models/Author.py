from app import db
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import ForeignKey, UniqueConstraint, String


class Author(db.Model):
    __tablename__ = 'author'

    id: Mapped[int] = mapped_column(primary_key=True)

    author_name: Mapped[str] = mapped_column(String(50),nullable=False)

    deck_id: Mapped[int] = mapped_column(ForeignKey('deck.id'), nullable=False)


    quotes = relationship('Quote',back_populates='author')
    deck = relationship('Deck')



    __table_args__ = (UniqueConstraint('author_name','deck_id',name='person_in_deck'),)

    def to_dict(self):
        print(f"quotes: {list(map(lambda quote: quote.to_dict(),self.quotes))}")
        return {
            'id' : self.id,
            'deck_id' : self.deck_id,
            'quotes' : list(map(lambda quote: quote.to_dict(),self.quotes)),
        }