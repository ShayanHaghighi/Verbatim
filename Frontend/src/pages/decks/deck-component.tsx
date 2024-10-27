import { HiDotsVertical } from "react-icons/hi";
import IDeck, { IDeckShort } from "../../models/deck-model";
import { MdEdit, MdOutlineEdit } from "react-icons/md";
import { IoMdContact, IoMdQuote } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { TbCards } from "react-icons/tb";

export default function DeckComponent({ deck }: { deck: IDeckShort }) {
  const navigate = useNavigate();
  return (
    <div
      className="bg-whtpp flex flex-col w-full min-w-96 rounded-sm m-3 blue-hover cursor-pointer"
      key={deck.id}
      onClick={() => {
        navigate(`/deck/${deck.id}`);
      }}
    >
      <div className="m-2 p-1 pt-2 flex flex-row justify-between items-center">
        <span className="flex flex-row font-bold text-ppwht text-4xl font-jockey">
          <TbCards className="mr-2" />
          {deck.deck_name}
          <div className="w-fit h-fit rounded-full hover:bg-black hover:bg-opacity-25 transition-all duration-300 ml-1 p-1 cursor-pointer ">
            <MdOutlineEdit className="w-6 h-6 opacity-80" />
          </div>
        </span>

        <div className="flex flex-row items-center justify-end">
          <div className="rounded-full hover:bg-black hover:bg-opacity-25 transition-all duration-300 mr-1 p-1 cursor-pointer">
            <HiDotsVertical className="w-6 h-auto mr-0 text-zinc-600" />
          </div>
        </div>
      </div>
      <div className="flex flex-row justify-between items-center ">
        <div className="flex flex-row items-center ml-4 text-lightpurple text-center -mb-4">
          <IoMdQuote className="h-5 w-auto" />
          <span className="ml-2 mr-4"> : {deck.num_quotes}</span>
          <div className="scale-y-150 scale-x-50 mr-3">|</div>
          <IoMdContact className="h-5 w-auto" />
          <span className=" ml-2"> : {deck.num_authors}</span>
        </div>
        <div className="p-3 h-16 mb-4">
          <button className="btn-purple  h-full text-sm px-4 border-b-4 border-b-[#251174] ">
            Host Game
          </button>
        </div>
      </div>
    </div>
  );
}
