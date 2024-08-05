import { useEffect, useState } from "react";

import IDeck, { IDeckShort } from "../../models/deck-model";
import DeckComponent from "./deck-component";
import deckHelper from "../../service/deck-helper";

function Deck() {
  const { getAllDecks } = deckHelper();
  const [decks, setDecks] = useState<IDeckShort[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    getAllDecks()
      .then((response) => {
        setDecks(response);
        setIsLoaded(true);
      })
      .catch((error) => {
        console.log("there has been an error");
        console.log(error);
      });
  }, []);

  return (
    <>
      {!isLoaded && <p>loading...</p>}
      <ul className="mt-12 w-3/4 flex flex-col  justify-center items-center">
        {decks.map((deck) => (
          <DeckComponent deck={deck} />
        ))}
      </ul>
    </>
  );
}

export default Deck;
