import axios from "axios";
import IDeck, { IDeckShort } from "../models/deck-model";
import { TokenContext } from "../App";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";

// this function should request all of the decks for the current logged in user. (can be done with GET request to /deck)
// the function should then parse the response and create a list of IDeck objects, and then return those IDeck objects
// pro tip 😎: try making the right API requests in Postman, then translate the request you did to this function
export default function deckHelper() {
  const navigate = useNavigate();
  const { token, removeToken, setToken } = useContext(TokenContext);

  async function getAllDecks(): Promise<IDeckShort[]> {
    return new Promise<IDeck[]>((resolve, reject) => {
      axios({
        method: "GET",
        url: "/api/deck?short=true",
        headers: {
          Authorization: "Bearer " + token,
        },
      })
        .then((response) => {
          response.data.access_token && setToken(response.data.access_token);
          resolve(response.data.decks);
        })
        .catch((error) => {
          // console.log(error.response.status);
          // console.log(token);
          if (error.response.status == 401) {
            navigate("/");
            removeToken();
            resolve([]);
          }
          reject(error);
        });
    });
  }

  async function getDeck(deckId: number) {
    return new Promise<IDeck[]>((resolve, reject) => {
      axios({
        method: "GET",
        url: `/api/deck${deckId}`,
        headers: {
          Authorization: "Bearer " + token,
        },
      })
        .then((response) => {
          response.data.access_token && setToken(response.data.access_token);
          resolve(response.data.decks);
        })
        .catch((error) => {
          // console.log(error.response.status);
          // console.log(token);
          if (error.response.status == 401) {
            navigate("/");
            removeToken();
            resolve([]);
          }
          reject(error);
        });
    });
  }

  // arguments: deck_name, access_token
  // send a request to the backend to create a new deck entry
  // return the results (status code/message)
  async function createDeck(deckName: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      axios({
        method: "POST",
        url: "/api/deck",
        headers: {
          Authorization: "Bearer " + token,
        },
        data: {
          deck_name: deckName,
        },
      })
        .then((response) => {
          response.data.access_token && setToken(response.data.access_token);
          navigate("/deck");
          resolve();
        })
        .catch((error) => {
          if (error.response) {
            if (error.response.status == 401) {
              navigate("/");
              removeToken();
              resolve();
            }
            reject(error);
          }
        });
    });
  }

  function delete_deck() {}

  function update_deck() {}

  return { getAllDecks, createDeck };
}
// feel free to add more functions to help you
