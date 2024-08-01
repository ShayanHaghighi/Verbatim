import { useEffect, useContext, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import { TokenContext, SetTokenContext } from "../../App";
import IDeck from "../../models/deck-model";
import DeckComponent from "./deck-component";

function Deck() {
  const [decks, setDecks] = useState<IDeck[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const token = useContext(TokenContext);
  const setToken = useContext(SetTokenContext);

  const navigate = useNavigate();

  useEffect(() => {
    axios({
      method: "GET",
      url: "/api/deck",
      headers: {
        Authorization: "Bearer " + token,
      },
    })
      .then((response) => {
        response.data.access_token && setToken(response.data.access_token);
        setDecks(response.data.decks);
        setIsLoaded(true);
        // console.log(temp);
      })
      .catch((error) => {
        if (error.response) {
          if (error.response.status === 401) {
            navigate("/login");
            return;
          }
          // TODO show this message to the user
          console.log(error.response.data.message);
          console.log(error.response);
        }
      });
  }, []);

  return (
    <>
      {!isLoaded && <p>loading...</p>}
      <ul>
        {decks.map((deck) => (
          <DeckComponent deck={deck} />
        ))}
      </ul>
    </>
  );
}

export default Deck;
