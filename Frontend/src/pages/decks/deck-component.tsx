import { HiDotsVertical } from "react-icons/hi";
import IDeck, { IDeckShort } from "../../models/deck-model";
import { MdEdit } from "react-icons/md";
import { IoMdContact, IoMdQuote } from "react-icons/io";

export default function DeckComponent({ deck }: { deck: IDeckShort }) {
  //   console.log(deck.quotes);
  return (
    <div
      className="bg-gradient-to-br from-accent2 to-accent1 flex flex-col w-3/4 min-w-96 rounded-2xl m-3 border-purple border-4 blue-hover"
      key={deck.id}
    >
      <div className="m-2 flex flex-row justify-between items-center">
        <span className="ml-2 text-white text-4xl font-jockey">
          {deck.deck_name}
        </span>
        <div className="text-white flex flex-row items-center justify-end">
          <div className="rounded-full hover:bg-black hover:bg-opacity-25 transition-all duration-300 mr-1 p-1 cursor-pointer ">
            <MdEdit className="w-6 h-auto " />
          </div>
          <div className="rounded-full hover:bg-black hover:bg-opacity-25 transition-all duration-300 mr-1 p-1 cursor-pointer">
            <HiDotsVertical className="w-6 h-auto mr-0" />
          </div>
        </div>
      </div>
      <div className="flex flex-row justify-between items-center ">
        <div className="flex flex-row items-end ml-4 text-white text-center opacity-60 -mb-4">
          <IoMdQuote className="h-5 w-auto" />
          <span className="ml-2 mr-4"> : {deck.num_quotes}</span>
          <div className="scale-y-150 scale-x-50 mr-3">|</div>
          <IoMdContact className="h-5 w-auto" />
          <span className=" ml-2 "> : {deck.num_authors}</span>
        </div>
        <div className="p-2 h-16 mb-2">
          <button className="btn-white h-full p-2">Host Game</button>
        </div>
      </div>
    </div>
  );
}
