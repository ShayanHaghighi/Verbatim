# Model files

These files contain the models (as python classes) for entities that exist in the database.

These files will be used when you want to write to/read from the database.

This is because to write to e.g. the "Deck" table in the database, you need to create an instance of the Deck class, and then write that to the database.

Helper functions to read/write to the database can be found in the `"dbManagement"` folder

## Example

```python

# Creating an instance of UserProfile
user1 = UserProfile(email="a@a.com",password="1234")

# Writing the instance to the database
db.session.add(me)
db.session.commit()
```

Here, the model class is `UserProfile`. Its implementation can be found in the `UserProfile.py` file.
