from Backend import db
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import ForeignKey, UniqueConstraint, String


class Deck(db.Model):
    __tablename__ = 'deck'
    
    id: Mapped[int] = mapped_column(primary_key=True)
    deck_name: Mapped[str] = mapped_column(String(20),nullable=False)

    user_profile_id: Mapped[int] = mapped_column(ForeignKey('user_profile.id'), nullable=False)
    
    owner = relationship('UserProfile', back_populates='decks')
    
    __table_args__ = (
        UniqueConstraint('deck_name', 'user_profile_id', name='owner_of_deck'),
    )

