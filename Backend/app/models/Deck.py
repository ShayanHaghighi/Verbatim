from app import db
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import ForeignKey, UniqueConstraint, String


class Deck(db.Model):
    __tablename__ = 'deck'
    
    id: Mapped[int] = mapped_column(primary_key=True)
    deck_name: Mapped[str] = mapped_column(String(20),nullable=False)

    user_profile_id: Mapped[int] = mapped_column(ForeignKey('user_profile.id'), nullable=False)
    
    owner = relationship('UserProfile', back_populates='decks')
    quotes = relationship('Quote', back_populates='deck',cascade="all,delete")
    authors = relationship('Author', back_populates='deck',cascade="all,delete")
    
    __table_args__ = (
        UniqueConstraint('deck_name', 'user_profile_id', name='owner_of_deck'),
    )

    def to_dict(self):
        return {
            'id' : self.id,
            'deck_name' : self.deck_name,
            'owner_id' : self.user_profile_id,
            'quotes': list(map(lambda quote: quote.to_dict(),self.quotes)),
        }
    
    def get_authors(self):
        return list(map(lambda author: author.author_name,self.authors))
        
    def get_quotes(self):
        return list(map(lambda quote: quote.get_as_questions(),self.quotes))
    
    def to_dict_short(self):
        return {
            'id' : self.id,
            'deck_name' : self.deck_name,
            'owner_id' : self.user_profile_id,
            'num_quotes': len(self.quotes),
            'num_authors': len(self.authors)
        }

