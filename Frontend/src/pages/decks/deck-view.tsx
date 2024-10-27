import { useParams } from "react-router-dom";
import IDeck from "../../models/deck-model";
import deckHelper from "../../service/deck-helper";
import { ChangeEvent, useEffect, useState } from "react";
import IAuthor from "../../models/author-model";
import { FaEdit } from "react-icons/fa";
import quoteHelper from "../../service/quote-helper";
import SideBar from "./sidebar";
import QuoteModal from "./quote-modal";
import { MdDelete, MdOutlineEdit } from "react-icons/md";
import Loader from "../../components/loading";

interface FormData {
  quote_text: string;
  author?: IAuthor;
  date: string;
}

export interface IQuoteModal {
  quote: string;
  author: IAuthor | null;
}

export default function DeckView() {
  const [deck, setDeck] = useState<IDeck>();
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [authors, setAuthors] = useState<string[]>([]);
  const [currentQuote, setCurrentQuote] = useState<IQuoteModal | null>(null);
  const [formData, setFormData] = useState<FormData>({
    quote_text: "",
    date: new Date().toJSON().slice(0, 10).replace(/-/g, "-"),
  });

  const { createQuote } = quoteHelper();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    console.log(name, value);
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  function saveQuote() {
    createQuote(
      formData.quote_text,
      formData.date,
      currentDeckId,
      formData.author?.id
    );
  }

  const { getDeck } = deckHelper();
  const { id: deckId } = useParams();

  const [currentDeckId, setCurrentDeckId] = useState(Number(deckId));

  useEffect(() => {
    setIsLoading(true);
    console.log("another request");
    getDeck(currentDeckId)
      .then((res) => {
        setDeck(res);
        let temp: string[] = [];
        res.quotes?.forEach((quote) => {
          const author_name = quote.author?.author_name;
          if (author_name && !temp.includes(author_name)) {
            temp.push(author_name);
          }
        });
        setAuthors(temp);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [currentDeckId]);
  return (
    <div className="relative w-full h-full flex flex-row justify-normal">
      {currentQuote && (
        <QuoteModal
          currentQuote={currentQuote}
          setCurrentQuote={setCurrentQuote}
        />
      )}
      <SideBar
        currentDeckId={currentDeckId}
        setCurrentDeckId={setCurrentDeckId}
      />
      {isLoading ? (
        <Loader />
      ) : (
        <div className="bg-whtdarkpp flex flex-col items-center w-full overflow-y-auto">
          <div className="w-full p-2 min-w-96 max-w-5xl h-fit mt-8 rounded-md rounded-b-md">
            <div className="text-blk flex flex-row justify-start items-center rounded-t-md p-4 pb-0">
              <div className=" text-5xl">{deck?.deck_name}</div>
              <button className="text-blk font-semibold bg-gray hover:bg-[#8d8d8d] border-gray border-2 w-auto h-auto m-2 ml-12 px-4 py-2 rounded-md text-sm">
                Quick Add
              </button>
              <button className="text-blk font-semibold hover:bg-gray border-[2.5px] border-gray w-auto h-auto m-2 ml-8 px-4 py-2 rounded-md text-sm">
                Export (.csv)
              </button>
            </div>
            <div className="w-full text-blk ">
              <table
                className="w-full table-fixed rounded-b-lg"
                style={{
                  boxShadow: "0 -2px 10px rgba(0,0,0,0.2)",
                }}
              >
                <tr className="font-medium text-sm h-6 bg-whtdarkpp  text-zinc-300">
                  <th className="text-start pl-4 font-medium min-40 ">Quote</th>
                  <th className="text-start pl-4 font-medium w-36 ">Author</th>
                  <th className="text-start pl-4 font-medium w-48  ">
                    Date Entered
                  </th>
                  <th className="text-start pl-4 font-medium w-20">Edit</th>
                </tr>
                {deck?.quotes?.map((quote, index) => (
                  <tr
                    className={`bg-${index % 2 ? "whtdarkpp" : "gray"} h-12 text-center hover:brightness-75 cursor-pointer`}
                    onClick={() => {
                      setCurrentQuote({
                        quote: quote.quote_text,
                        author: quote.author,
                      });
                      console.log(currentQuote);
                    }}
                  >
                    <td className="text-start pl-4 font-medium">
                      {quote.quote_text}
                    </td>
                    <td className="text-start pl-4 font-medium">
                      {quote.author?.author_name}
                    </td>
                    <td className="text-start pl-4 font-medium">
                      {new Date(quote.date_created).toLocaleDateString()}
                    </td>
                    <td>
                      <div className="flex flex-row justify-evenly">
                        <MdOutlineEdit />
                        <MdDelete />
                      </div>
                    </td>
                  </tr>
                ))}
                <tr
                  className={`${isCreating && "rounded-full border-2 border-t-0 bg-gray border-blk border-opacity-30"}`}
                >
                  {isCreating ? (
                    <>
                      <td className="align-middle">
                        <input
                          id="quote_text"
                          name="quote_text"
                          type="text"
                          className="p-4 w-11/12 h-12 ml-3 text-black bg-white border-slate-400 border-2"
                          value={formData?.quote_text}
                          onChange={handleChange}
                        />
                      </td>
                      <td className="align-middle text-center">
                        <button className="btn-purple m-2 rounded-md px-4 py-2 text-sm text-wrap text-center w-3/4">
                          Choose Author
                        </button>
                      </td>
                      <td className="align-middle	text-start">
                        <input
                          id="date"
                          name="date"
                          type="date"
                          className="text-zinc-800 bg-zinc-50 rounded-sm relative left-1/2 -translate-x-1/2 p-2 pt-4 pb-4"
                          value={formData?.date}
                          onChange={handleChange}
                        />
                      </td>
                      <td />
                    </>
                  ) : (
                    <td colSpan={4} className=" col-span-4">
                      <button
                        onClick={() => setIsCreating(true)}
                        className="w-full h-12 text-center bg-gradient-to-br from-purple to-accent1 hover:to-purple hover:from-accent1 hover:brightness-75 text-wht font-semibold rounded-b-lg border-t-2 border-blk  border-opacity-30"
                      >
                        + Add new Quote
                      </button>
                    </td>
                  )}
                </tr>
              </table>
            </div>
          </div>
          {isCreating && (
            <div className="mt-2 w-full flex flex-row items-center justify-center">
              <button
                className="btn text-white bg-red-500 hover:bg-red-800 transition-all duration-200 p-2 px-6 mr-10 rounded-full font-bold m-0 text-md"
                onClick={() => setIsCreating(false)}
              >
                Cancel
              </button>

              <button
                className="text-white bg-green-500 hover:bg-green-800 transition-all duration-200 p-2 px-6 m-2 rounded-full font-bold text-md"
                onClick={saveQuote}
              >
                Save
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
