# Models

Just like how in the Backend we had classes to help us manipulate database entries, we also have a similar thing in the Frontend.

Let's say the backend sends you this JSON object for a deck:

```json
{
  "deck_name": "deck 2",
  "id": 5,
  "owner_id": 8
}
```

Ideally, we would convert this into a IDeck object. These functions to convert from json to IDeck object will be found in the "service" folder.
