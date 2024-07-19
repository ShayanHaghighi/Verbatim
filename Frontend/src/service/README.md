# Service

These files contain helper functions. These helper functions will provide the rest of the files with easy ways to send/recieve HTTP requests.

The first function that needs to be written is `get_all_decks`. This function should:

1. Send a GET request to the backend (using axios) to the `/deck` endpoint.
2. Receive the response and convert it do a list of IDeck[] objects
3. Return the list of IDeck[] objects

If you spot anything that looks like a mistake, change it/tell me about it, because you may be onto somthing
