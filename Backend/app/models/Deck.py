from app import db
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import ForeignKey, UniqueConstraint, String


class Deck(db.Model):
    __tablename__ = 'deck'
    
    id: Mapped[int] = mapped_column(primary_key=True)
    deck_name: Mapped[str] = mapped_column(String(20),nullable=False)

    user_profile_id: Mapped[int] = mapped_column(ForeignKey('user_profile.id'), nullable=False)
    
    owner = relationship('UserProfile', back_populates='decks')
    quotes = relationship('Quote', back_populates='deck')
    authors = relationship('Author', back_populates='deck')
    
    __table_args__ = (
        UniqueConstraint('deck_name', 'user_profile_id', name='owner_of_deck'),
    )

    def to_dict(self):
        return {
            'id' : self.id,
            'deck_name' : self.deck_name,
            'owner_id' : self.user_profile_id,
            'quotes': list(map(lambda quote: quote.to_dict(),self.quotes)),
            'authors': list(map(lambda author: author.to_dict(),self.authors)),
        }
    
    def to_dict_short(self):
        return {
            'id' : self.id,
            'deck_name' : self.deck_name,
            'owner_id' : self.user_profile_id,
            'num_quotes': len(self.quotes),
            'num_authors': len(self.authors)
        }

