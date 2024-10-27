import { IoIosArrowDropdownCircle } from "react-icons/io";
import deckHelper from "../../service/deck-helper";
import { useEffect, useState } from "react";
import { IDeckShort } from "../../models/deck-model";
import { useNavigate } from "react-router-dom";
import {
  MdKeyboardDoubleArrowLeft,
  MdKeyboardDoubleArrowRight,
} from "react-icons/md";
import { IoArrowBack } from "react-icons/io5";

export default function SideBar({
  currentDeckId,
  setCurrentDeckId,
}: {
  currentDeckId: number;
  setCurrentDeckId: React.Dispatch<React.SetStateAction<number>>;
}) {
  const [decks, setDecks] = useState<IDeckShort[]>();
  const [showingDecks, setShowingDecks] = useState(true);
  const [isOpen, setIsOpen] = useState(true);
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
  }, []);
  return (
    <>
      <div className={`pt-2 pl-2 ${isOpen ? "hidden" : "absolute"}`}>
        <MdKeyboardDoubleArrowRight
          className="size-8 text-blk hover:bg-blk hover:text-wht rounded-md cursor-pointer -z-10"
          onClick={() => setIsOpen(true)}
        />
      </div>
      <div
        className={`hidden md:block pt-2 text-blk bg-gray h-full text-nowrap select-none ${isOpen ? "w-48 max-w-48 min-w-48" : "w-0 max-w-0 min-w-0"} transition-all ease-out duration-300`}
      >
        <div className="flex justify-between px-2 mb-4 ">
          <MdKeyboardDoubleArrowLeft
            className="size-8 hover:bg-zinc-900 hover:text-white rounded-md cursor-pointer"
            onClick={() => setIsOpen(false)}
          />
          <div
            className="flex flex-row items-center p-1 hover:bg-zinc-900 hover:text-white rounded-md cursor-pointer"
            onClick={() => {
              navigate("/deck");
            }}
          >
            <IoArrowBack className="size-6" />
            Back
          </div>
        </div>

        <div>
          <div
            className="text-2xl border-[#D9D9D9] cursor-pointer border-b-4 flex flex-row items-center"
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
              className={`ml-8 border-[#D9D9D9]  border-l-4  cursor-pointer hover:text-white ${deck.id == currentDeckId ? "font-extrabold text-black bg-[#D9D9D9] hover:bg-accent2" : "hover:bg-accent1"}  ${showingDecks ? "h-10 p-2" : "h-0 p-0"} transition-all duration-300`}
            >
              <span
                className={`${!showingDecks && "opacity-0"} transition-opacity duration-300`}
              >
                {deck.deck_name}
              </span>
            </div>
          ))}
        </div>
        <div className="text-2xl border-[#D9D9D9] border-t-4 flex flex-row items-center pl-2">
          History
        </div>
      </div>
    </>
  );
}
