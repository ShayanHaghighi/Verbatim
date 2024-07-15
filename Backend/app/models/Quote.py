from app import db
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import ForeignKey, UniqueConstraint, String

class Quote(db.Model):
    __tablename__ = 'quote'

    id: Mapped[int] = mapped_column(primary_key=True)
    quote_text: Mapped[str] = mapped_column(nullable=False)

    deck_id: Mapped[int] = mapped_column(ForeignKey('deck.id'), nullable=False)
    author_id: Mapped[int] = mapped_column(ForeignKey('author.id'), nullable=False)

    author = relationship('Author', back_populates='quotes')