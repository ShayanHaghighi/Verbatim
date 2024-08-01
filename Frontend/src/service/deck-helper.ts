import axios from "axios";
import IDeck from "../models/deck-model";

// this function should request all of the decks for the current logged in user. (can be done with GET request to /deck)
// the function should then parse the response and create a list of IDeck objects, and then return those IDeck objects
// pro tip 😎: try making the right API requests in Postman, then translate the request you did to this function
function get_all_decks(access_token: string): IDeck[] {
  return [];
}

// arguments: deck_name, access_token
// send a request to the backend to create a new deck entry
// return the results (status code/message)
function create_deck() {}

function delete_deck() {}

function update_deck() {}

// feel free to add more functions to help you
