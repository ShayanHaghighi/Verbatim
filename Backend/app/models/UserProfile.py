from app import db
# from flask_login import UserMixin
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import String

class UserProfile(db.Model):
    __tablename__ = 'user_profile'
    __table_args__ = {'extend_existing': True}
    
    id: Mapped[int] = mapped_column(primary_key=True)
    username: Mapped[str] = mapped_column(String(30),unique=True, nullable=False)
    email: Mapped[str] = mapped_column(String(50),unique=True, nullable=False)
    password_hash: Mapped[str] = mapped_column(String(162), nullable=False)
    
    decks = relationship('Deck', back_populates='owner')

    def to_dict(self):
        return {
            'id' : self.id,
            'username' : self.username,
            'email' : self.email,
            # TODO: figure out if you want to keep this as to_dict_short()
            'decks': list(map(lambda deck: deck.to_dict(),self.decks))
        }


