import { IoIosArrowDropdownCircle } from "react-icons/io";
import deckHelper from "../../service/deck-helper";
import { useEffect, useState } from "react";
import { IDeckShort } from "../../models/deck-model";
import { useNavigate } from "react-router-dom";

export default function SideBar({
  currentDeckId,
  setCurrentDeckId,
}: {
  currentDeckId: number;
  setCurrentDeckId: React.Dispatch<React.SetStateAction<number>>;
}) {
  const [decks, setDecks] = useState<IDeckShort[]>();
  const [showingDecks, setShowingDecks] = useState(true);
  const navigate = useNavigate();
  const { getAllDecks } = deckHelper();
  useEffect(() => {
    getAllDecks()
      .then((res) => {
        setDecks(res);
      })
      .catch((error) => {
        console.log(error);
      });
  });
  return (
    <>
      <div className="pt-6 text-blk bg-gray relative h-full w-48 max-w-48 min-w-48 top-0 left-0">
        <div>
          <div
            className="text-2xl border-blk cursor-pointer border-b-2 flex flex-row items-center"
            onClick={() => {
              setShowingDecks(!showingDecks);
            }}
          >
            <span className="ml-4 mr-4 mb-2">Decks</span>
            <IoIosArrowDropdownCircle
              className={`${!showingDecks && "rotate-90"} transition-all duration-300`}
            />
          </div>
          {decks?.map((deck) => (
            <div
              onClick={() => {
                navigate(`/deck/${deck.id}`);
                setCurrentDeckId(deck.id);
              }}
              className={`ml-8 border-blk border-l-2  cursor-pointer hover:text-white ${deck.id == currentDeckId ? "font-bold text-gray bg-blk hover:bg-accent2" : "font-extralight hover:bg-accent1"}  ${showingDecks ? "h-10 p-2" : "h-0 p-0"} transition-all duration-300`}
            >
              <span
                className={`${!showingDecks && "opacity-0"} transition-opacity duration-300`}
              >
                {deck.deck_name}
              </span>
            </div>
          ))}
        </div>
        <div className="text-2xl border-blk border-t-2 flex flex-row items-center pl-2">
          History
        </div>
      </div>
    </>
  );
}
