from Backend import db
from flask_login import UserMixin
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import String

class UserProfile(db.Model,UserMixin):
    __tablename__ = 'user_profile'
    
    id: Mapped[int] = mapped_column(primary_key=True)
    username: Mapped[str] = mapped_column(String(30),unique=True, nullable=False)
    email: Mapped[str] = mapped_column(String(50),unique=True, nullable=False)
    password: Mapped[str] = mapped_column(String(50),unique=True, nullable=False)
    
    decks = relationship('Deck', back_populates='owner')


