import { useParams } from "react-router-dom";
import IDeck from "../../models/deck-model";
import deckHelper from "../../service/deck-helper";
import { ChangeEvent, useEffect, useState } from "react";
import IAuthor from "../../models/author-model";
import { FaEdit } from "react-icons/fa";
import quoteHelper from "../../service/quote-helper";
import SideBar from "./sidebar";
import QuoteModal from "./quote-modal";

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
        <>Loading</>
      ) : (
        <div className="flex flex-col items-center w-full">
          <div
            className="w-3/4 min-w-96 max-w-5xl h-fit mt-8 rounded-md rounded-b-md"
            style={{
              boxShadow: "0 0 20px #000000",
            }}
          >
            <div className="bg-gradient-to-br from-darkpurple to-accent1 text-white flex flex-row justify-between items-center rounded-t-md p-4">
              <div className="font-jockey text-5xl">{deck?.deck_name}</div>
              <div>
                <div>colon : {deck?.quotes?.length}</div>
                <div>colon : {authors.length}</div>
              </div>
            </div>
            <div className="w-full text-blk ">
              <table className="w-full table-fixed">
                <tr className=" font-jockey font-medium text-3xl h-16 bg-whtpp border-purple border-b-2 text-purple">
                  <th className=" font-jockey font-medium min-40 border-purple border-e-2">
                    Quote
                  </th>
                  <th className="font-jockey font-medium w-36 border-purple border-e-2">
                    Author
                  </th>
                  <th className="font-jockey font-medium w-48  border-purple border-e-2">
                    Date Entered
                  </th>
                  <th className="font-jockey font-medium w-20">Edit</th>
                </tr>
                {deck?.quotes?.map((quote, index) => (
                  <tr
                    className={`bg-${index % 2 ? "whtpp" : "gray"} h-12 text-center hover:brightness-75 cursor-pointer`}
                    onClick={() => {
                      setCurrentQuote({
                        quote: quote.quote_text,
                        author: quote.author,
                      });
                      console.log(currentQuote);
                    }}
                  >
                    <td className="border-purple border-e-2 font-medium">
                      {quote.quote_text}
                    </td>
                    <td className="border-purple border-e-2 font-medium">
                      {quote.author?.author_name}
                    </td>
                    <td className="border-purple border-e-2 font-medium">
                      {new Date(quote.date_created).toLocaleDateString()}
                    </td>
                    <td>
                      <button className="bg-red-600 hover:bg-red-800 rounded-md p-2">
                        <FaEdit className="text-white h-6 w-auto relative" />
                      </button>
                    </td>
                  </tr>
                ))}
                <tr>
                  {isCreating ? (
                    <>
                      <td className="border-purple border-e-2 justify-center items-center h-12">
                        <input
                          id="quote_text"
                          name="quote_text"
                          type="text"
                          className=" p-4 w-3/4 h-10 text-wht bg-blk border-slate-400 border-2 relative left-1/2 -translate-x-1/2"
                          value={formData?.quote_text}
                          onChange={handleChange}
                        />
                      </td>
                      <td className="border-purple border-e-2">
                        <button className="btn-white text-sm text-nowrap pl-3">
                          Choose Author
                        </button>
                      </td>
                      <td className="border-purple border-e-2">
                        <input
                          id="date"
                          name="date"
                          type="date"
                          className="text-zinc-800 bg-zinc-50 rounded-sm relative left-1/2 -translate-x-1/2 p-2 pt-4 pb-4"
                          value={formData?.date}
                          onChange={handleChange}
                        />
                      </td>
                    </>
                  ) : (
                    <td colSpan={4} className=" col-span-4">
                      <button
                        onClick={() => setIsCreating(true)}
                        className="w-full h-12 text-center bg-gradient-to-br from-purple to-accent1 hover:to-purple hover:from-accent1 hover:brightness-75 text-wht font-semibold rounded-b-lg border-t-2 border-blk border-dotted "
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
            <div className="mt-4 w-full flex flex-row items-center justify-center">
              <button
                className="text-white bg-red-500 hover:bg-red-800 transition-all duration-200 p-4 px-6 rounded-full font-bold m-2 text-xl"
                onClick={() => setIsCreating(false)}
              >
                Cancel
              </button>

              <button
                className="text-white bg-green-500 hover:bg-green-800 transition-all duration-200 p-4 px-8 m-2 rounded-full font-bold text-xl"
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
