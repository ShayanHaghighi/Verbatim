from sqlalchemy import create_engine, Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship, sessionmaker
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class Player(Base):
    __tablename__ = 'players'
    id = Column(Integer, primary_key=True)
    name = Column(String, unique=True, nullable=False)
    quotes = relationship("Quote", back_populates="player")

    def __repr__(self):
        return f"<Player(name='{self.name}')>"

class Quote(Base):
    __tablename__ = 'quotes'
    id = Column(Integer, primary_key=True)
    quote_text = Column(String, nullable=False)
    player_id = Column(Integer, ForeignKey('players.id'))
    player = relationship("Player", back_populates="quotes")

    def __repr__(self):
        return f"<Quote(quote_text='{self.quote_text[:20]}...')>"

class QuoteModel:
    def __init__(self,quote_text,player_name):
        self.quote_text = quote_text
        self.player_name = player_name