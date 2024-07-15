from app import db
from ..models.UserProfile import UserProfile
from sqlalchemy import select, delete, update


def get_by_id(id:int) -> UserProfile:
    return db.session.execute(select(UserProfile).where(UserProfile.id == id)).scalar_one_or_none()