from app import db
from ..models.UserProfile import UserProfile
from sqlalchemy import select, delete, update, or_

def save_(user:UserProfile):
    db.session.add(user)
    db.session.commit()


def get_by_id(id:int) -> UserProfile:
    return db.session.execute(select(UserProfile).where(UserProfile.id == id)).scalar_one_or_none()

def get_by_username(username:str) -> UserProfile:
    return db.session.execute(select(UserProfile).where(UserProfile.username == username)).scalar_one_or_none()

def get_by_email(email:str) -> UserProfile:
    return db.session.execute(select(UserProfile).where(UserProfile.email == email)).scalar_one_or_none()

def get_by_email_or_username(email:str,username:str) -> UserProfile:
    return db.session.execute(select(UserProfile).where(or_(UserProfile.email == email,UserProfile.username == username))).scalars()

def update_(user:UserProfile):
    db_user = get_by_id(user.id)
    if db_user:
        db_user.username = user.username
        db_user.email = user.email
        db_user.password_hash = user.password_hash
        db.session.commit()
    else:
        print("Error: update object does not exist")

def delete_(user:UserProfile):
    db.session.delete(user)
    db.session.commit()