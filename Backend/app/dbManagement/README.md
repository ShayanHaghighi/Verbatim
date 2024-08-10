# Repository Files

These files contain helper functions for CRUD (Create/Read/Update/Delete) operations on the database

## Writing to the database

Functions take models (as found in the models folder) as arguments, and write them to the database as new entries.

### Example:

```python
def save_(author: Author):

...

# Usage:
from dbManagement.Author import Author

author1 = Author(author_name="Ben",deck_id=1)
save_(author1)
```

This function takes in an Author object and saves it to the database
