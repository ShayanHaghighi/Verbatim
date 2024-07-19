# Endpoints

YOU CAN ALSO VIEW THIS FILE [HERE](https://www.notion.so/README-Import-Jul-19-2024-dab7360cb1ee4e299c677ee781a99a05?pvs=4) IN NOTION

The endpoint files (ending in “…Resource”) define endpoints that the frontend can send http requests to.
There are endpoints for manipulating these 4 entities:

- Deck
- UserProfile
- Quote
- Author

as well as endpoints for getting **access tokens**.

# Token Endpoints

The token endpoints are used for getting access tokens that can be used to access the other endpoints.
There are two token endpoints, both only accessible with the POST method:

### /signup

This is for when you want to create a new user profile AND get an access token

**Required Parameters in body**: username, email, password
**Returns**: access token

### /login

This is for when you already have a user profile, and just want an access token

**Required Parameters in body**: email, password
**Returns**: access token

# Entity Endpoints

Here I will go over what the endpoints are for each entity. I will use “deck” in this example, but the endpoints have the same structure for every entity.
Remember that to access any of the endpoints mentioned here you will need a valid access token in the header of the http request.

---

# /deck

## /deck Path

### GET method

**Required Parameters in body**:
**Returns**: All decks for current logged in user

### POST method

**Required Parameters in body**: `“deck_name”`
**Returns**: message on whether the request succeeded and the new deck’s ID

## /deck/<id> Path

(here `<id>` is a variable part of the URL, referring to the deck ID)

### GET method

**Required Parameters in body**:
**Returns**: The deck with the given id, along with all its quotes and authors

### PATCH method

**Required Parameters in body**: `“deck_name"`
**Returns**: Success/failure message

### DELETE method

**Required Parameters in body**:
**Returns**: Success/failure message

---

# /author

## /author Path

### GET method

**Required Parameters in body**: `“deck_id”` OR `“deck_name”`
**Returns**: All authors for a given deck

### POST method

**Required Parameters in body**: `“author_name”`
**Returns**: success/failure message

## /author/<id> Path

(here `<id>` is a variable part of the URL, referring to the deck ID)

### GET method

**Required Parameters in body**:
**Returns**: The author with the given id, along with all their quotes

### PATCH method

**Required Parameters in body**: `“author_name"` AND/OR `“deck_id”`
**Returns**: Success/failure message

### DELETE method

**Required Parameters in body**:
**Returns**: Success/failure message

---

# /quote

## /quote Path

### GET method

**Required Parameters in body**: `“deck_id”` OR `“deck_name”`
**Returns**: All quotes for the given deck

### POST method

**Required Parameters in body**: (`“quote_text”`,`”deck_id”`) OR `“deck_name”`
**Returns**: success/failure message

## /quote/<id> Path

(here `<id>` is a variable part of the URL, referring to the deck ID)

### GET method

**Required Parameters in body**:
**Returns**: The quote with the given id

### PATCH method

**Required Parameters in body**: _minimum one of_: `“quote_text"` ,`“deck_id”` ,`“deck_name”`,`“author_id”`,`”author_name”`  
**Returns**: Success/failure message

### DELETE method

**Required Parameters in body**:
**Returns**: Success/failure message

---

# /userProfile

## /userProfile Path

### GET method

**Required Parameters in body**:
**Returns**: Gets username, email, and decks of logged in user

## /userProfile/<id> Path

(here `<id>` is a variable part of the URL, referring to the deck ID)

### GET method

**Required Parameters in body**:
**Returns**: The user profile with the given id

### PATCH method

**Required Parameters in body**: `“username"` AND/OR `“email”` AND/OR `“password”`
**Returns**: Success/failure message

### DELETE method

**Required Parameters in body**:
**Returns**: Success/failure message
