import axios from "axios";
import IQuote from "../models/quote-model";
import { TokenContext } from "../App";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";

// this function should request all of the decks for the current logged in user. (can be done with GET request to /deck)
// the function should then parse the response and create a list of IDeck objects, and then return those IDeck objects
// pro tip 😎: try making the right API requests in Postman, then translate the request you did to this function
export default function quoteHelper() {
  const navigate = useNavigate();
  const { token, removeToken, setToken } = useContext(TokenContext);

  // arguments: deck_name, access_token
  // send a request to the backend to create a new deck entry
  // return the results (status code/message)
  async function createQuote(
    quote_text: string,
    date: string,
    deck_id: number,
    author_id?: number
  ): Promise<void> {
    if (!token) {
      navigate("/login");
      return Promise.reject();
    }
    return new Promise<void>((resolve, reject) => {
      axios({
        method: "POST",
        url: "/api/quote",
        ...getHeader(),

        data: {
          quote_text: quote_text,
          author_id: author_id,
          date: date,
          deck_id: deck_id,
        },
      })
        .then((response) => {
          response.data.access_token && setToken(response.data.access_token);
          navigate(`/deck/${deck_id}`);
          resolve();
        })
        .catch((error) => {
          if (error.response) {
            checkUnauthorised(error);
            reject(error);
          }
        });
    });
  }

  function checkUnauthorised(error: any) {
    if (error.response.status == 401 || error.response.status == 422) {
      navigate("/");
      removeToken();
    }
  }
  function getHeader() {
    return {
      headers: {
        Authorization: "Bearer " + token,
      },
    };
  }

  function delete_deck() {}

  function update_deck() {}

  return { createQuote };
}
// feel free to add more functions to help you
