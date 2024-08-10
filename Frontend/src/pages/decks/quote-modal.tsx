import { FaQuoteLeft } from "react-icons/fa6";
import { IQuoteModal } from "./deck-view";
import { FaQuoteRight } from "react-icons/fa6";
import { useEffect, useState } from "react";

export default function QuoteModal({
  currentQuote,
  setCurrentQuote,
}: {
  currentQuote: IQuoteModal;
  setCurrentQuote: any;
}) {
  const [textSize, setTextSize] = useState("");

  useEffect(() => {
    setTextSize(
      `${Number(document.getElementById("quote")?.offsetWidth) / (currentQuote.quote.length * 20) + 3}rem`
    );
  }, []);
  const colors = [
    ["#4158D0", "#C850C0", "#FFCC70"],
    ["#D9AFD9", "#97D9E1"],
    ["#08AEEA", "#2AF598"],
    ["#FA8BFF", "#2BD2FF", "#2BFF88"],
  ];

  function getRandomInt(max: number) {
    return Math.floor(Math.random() * max);
  }

  const stopProp = (event: any) => {
    event.stopPropagation(); // Prevents the event from bubbling up to the parent
    // alert('Child div clicked');
  };

  const colorSet = colors[getRandomInt(colors.length)];
  const gradient =
    colorSet.length == 3
      ? `linear-gradient(to bottom right,${colorSet[0]},${colorSet[1]},${colorSet[2]})`
      : `linear-gradient(to bottom right,${colorSet[0]},${colorSet[1]})`;

  return (
    <>
      <div
        className="cursor-pointer absolute w-full h-full bg-black bg-opacity-85 z-50 text-white flex justify-center"
        onClick={() => setCurrentQuote(null)}
      >
        <div
          className="cursor-default w-3/4 h-fit max-w-screen-lg mt-20 flex flex-col items-stretch"
          // background-color: #4158D0;
          // background-image: linear-gradient(43deg, #4158D0 0%, #C850C0 46%, #FFCC70 100%);

          style={{
            boxShadow: "0 10px 30px 10px #000000",
            background: gradient,
          }}
          onClick={stopProp}
        >
          <div className="m-4 flex flex-col items-stretch justify-between">
            <FaQuoteLeft className="w-12 h-auto" />
            <span
              id="quote"
              className="drop-shadow-lg text-center break-words font-playfair italic font-semibold"
              style={{
                fontSize: textSize,
                filter: "drop-shadow(0 10px 8px rgb(0 0 0 / 0.8))",
              }}
            >
              {currentQuote.quote}
            </span>
            <div className="flex justify-end">
              <FaQuoteRight className="w-12 h-auto" />
            </div>
          </div>
          <div
            className="text-end opacity-[80%] pr-4 text-5xl font-jockey mb-8"
            style={{
              filter: "drop-shadow(0 5px 2px rgb(0 0 0 / 0.5))",
            }}
          >
            {" "}
            - {currentQuote.author?.author_name}
          </div>
        </div>
      </div>
    </>
  );
}
