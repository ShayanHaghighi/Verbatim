import { ChangeEvent, useEffect, useState } from "react";

import IDeck, { IDeckShort } from "../../models/deck-model";
import DeckComponent from "./deck-component";
import deckHelper from "../../service/deck-helper";
import { MdOutlineEmail } from "react-icons/md";
import { FaSearch } from "react-icons/fa";
import { CiSearch } from "react-icons/ci";

function Deck() {
  const { getAllDecks } = deckHelper();
  const [decks, setDecks] = useState<IDeckShort[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedId, setSelectedId] = useState<string | undefined>("");
  document.addEventListener("click", updateSelectedId);

  function updateSelectedId() {
    setSelectedId(document.activeElement?.id);
  }

  const [formData, setFormData] = useState({
    filter: "",
  });

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

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  return (
    <>
      {!isLoaded && <p>loading...</p>}
      <div className=" flex flex-col w-full mt-4 p-4 pr-10 font-josefin">
        <div className="flex flex-row justify-between items-center">
          <div className="font-bold text-3xl text-blk">Decks</div>
          <button
            className="btn-white text-lg py-4"
            style={{
              boxShadow: "0px 3px 8px rgba(0, 0, 0, 0.486)",
            }}
          >
            create deck
          </button>
        </div>
        <div className="flex flex-row justify-between mt-4 ">
          <div className="relative flex items-center w-full">
            {!formData.filter && selectedId != "filter" && (
              <>
                <CiSearch className="absolute left-3 top-2 text-gray-400 w-5 h-auto text-zinc-400 pointer-events-none" />
                <span className="absolute left-11 font-light text-zinc-400 pointer-events-none">
                  Find Deck
                </span>
              </>
            )}
            <input
              type="text"
              id="filter"
              name="filter"
              value={formData.filter}
              onChange={handleChange}
              onFocus={updateSelectedId}
              className="border h-full border-zinc-200 pl-4 placeholder:text-md w-full mr-4"
            />
          </div>
          <div className="border border-zinc-200 px-4 py-2 w-40 text-zinc-400 font-light mr-4">
            Search by
          </div>
        </div>
        <ul className="mt-12 w-full flex flex-col justify-center items-center ">
          {decks.map((deck) => (
            <DeckComponent deck={deck} />
          ))}
        </ul>
      </div>
    </>
  );
}

export default Deck;
