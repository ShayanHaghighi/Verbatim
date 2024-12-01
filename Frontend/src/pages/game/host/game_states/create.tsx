import { ChangeEvent, useEffect, useState } from "react";
import { Player } from "../../game-models";
import Dropdown from "../../../../components/dropdown";
import deckHelper from "../../../../service/deck-helper";
import IDeck, { IDeckShort } from "../../../../models/deck-model";
import client, { endGame } from "../../socket-connection";
import { TbCardsFilled } from "react-icons/tb";
import { FaCheck, FaListOl, FaRegCopy } from "react-icons/fa";
import { GoTriangleDown, GoTriangleUp } from "react-icons/go";
import ConfirmationModal from "../../../../components/game/confirm-modal";
import { backendURL } from "../../../../constants";
import ExitButton from "../../../../components/game/exit-button";
import { div } from "framer-motion/client";
import { TiTick } from "react-icons/ti";
import { MdContentCopy } from "react-icons/md";

interface FormData {
  numQuestions: number;
  password: string;
  deck: any;
}
interface GameOwnerProps {
  setPlayersJoined: any;
  start_game: () => void;
  gameCode: string | null;
  playersJoined: Player[];
}

function Host_Create_Game({
  setPlayersJoined,
  start_game,
  gameCode,
  playersJoined,
}: GameOwnerProps) {
  const [isCreating, setIsCreating] = useState(true);
  const [usingPass, setUsingPass] = useState(false);
  const [decks, setDecks] = useState<IDeckShort[]>([]);
  const [copiedGameCode, setCopiedGameCode] = useState(false);
  const { getAllDecks } = deckHelper();

  const [formData, setFormData] = useState<FormData>({
    numQuestions: 1,
    password: "",
    deck: null,
  });

  function copyGameCode() {
    if (gameCode != null) {
      setCopiedGameCode(true);
      navigator.clipboard.writeText(gameCode);
      setInterval(() => setCopiedGameCode(false), 2000);
    }
  }

  function create_game(password: string) {
    console.log("sending req to server");
    client.emit("create-game", {
      deck_id: formData.deck.id,
      password: password,
      num_questions: formData.numQuestions,
    });
    setPlayersJoined([]);
  }

  useEffect(() => {
    getAllDecks()
      .then((response) => {
        setDecks(response);
        setFormData((prevData) => ({
          ...prevData,
          deck: response[0],
          numQuestions:
            response[0].num_quotes == undefined ? 1 : response[0].num_quotes,
        }));
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

  const handleSubmit = () => {
    const password = usingPass ? formData.password : "";
    create_game(password);
  };

  return (
    <>
      {isCreating && (
        <div className="w-full h-full min-h-fit overflow-visible">
          <div className="size-full flex flex-col items-center justify-between bg-optionbg mb-16">
            <div className="bg-whtdarkpp text-blk w-[80%] max-w-[60rem] h-fit mt-12 rounded-[2vh] p-10 ">
              <div className="text-[5vw] font-semibold">Options</div>
              <div className="bg-[#A8A8A8] w-full h-[2px]"></div>
              <div className="flex flex-row p-[1vw] justify-between">
                <div className="flex flex-row items-center flex-1">
                  <TbCardsFilled className="size-8 text-[#7964A3]" />
                  <div className="ml-2 text-xl">Deck:</div>
                </div>
                <div className="flex-1 p-2">
                  <Dropdown
                    list={decks}
                    currElement={formData.deck}
                    setCurrElement={(deck) =>
                      setFormData((prevData) => ({ ...prevData, deck: deck }))
                    }
                    displayFunc={(deck) => deck.deck_name}
                  ></Dropdown>
                </div>
              </div>
              <div className="flex flex-row p-[1vw] justify-between">
                <div className="flex flex-row items-center flex-1">
                  <FaListOl className="size-8 text-[#7964A3]" />
                  <label className="ml-2 text-lg" htmlFor="numQuestions">
                    No. of Questions
                  </label>
                </div>
                <div className="flex-1 p-2 flex flex-row items-center">
                  <input
                    className="bg-blk w-full sm:h-[60%] text-wht px-4 py-2 rounded-md"
                    type="number"
                    id="numQuestions"
                    name="numQuestions"
                    value={formData.numQuestions}
                    onChange={handleChange}
                  />
                  <div className="hidden sm:block">
                    <div
                      className="p-2 cursor-pointer"
                      onClick={() =>
                        setFormData((prevData) => ({
                          ...prevData,
                          numQuestions:
                            formData.deck.num_quotes == formData.numQuestions
                              ? formData.numQuestions
                              : formData.numQuestions + 1,
                        }))
                      }
                    >
                      <div className="w-0 h-0 border-l-[18px] border-l-transparent border-r-[18px] border-r-transparent border-b-[18px] border-b-[#7964A3] hover:border-b-[#4b3b6a] rounded-[5px]"></div>
                    </div>
                    <div
                      className="p-2 cursor-pointer"
                      onClick={() =>
                        setFormData((prevData) => ({
                          ...prevData,
                          numQuestions:
                            formData.numQuestions > 1
                              ? formData.numQuestions - 1
                              : 1,
                        }))
                      }
                    >
                      <div className="w-0 h-0 border-l-[18px] border-l-transparent border-r-[18px] border-r-transparent border-t-[18px] border-t-[#7964A3] hover:border-t-[#4b3b6a] rounded-[5px]"></div>
                    </div>
                  </div>
                </div>
              </div>
              <button
                className="block btn-purple"
                onClick={() => {
                  handleSubmit();
                  setIsCreating(false);
                }}
              >
                Create Game
              </button>
            </div>
            <ExitButton onConfirm={endGame} />
          </div>
        </div>
      )}
      {!isCreating && (
        <div className="game-bg bg-optionbg">
          <div className="mt-4 w-[80%] md:w-[50%] min-w-fit h-fit flex justify-center items-center text-center font-bold py-2 px-2 text-[6vw] bg-white text-black">
            <div className="border-black border-4 size-full text-[16vw] md:text-[6vw] text-nowrap font-bowlby font-medium flex justify-center items-center">
              {gameCode}
              <div className="flex justify-center items-center">
                <MdContentCopy
                  className="text-zinc-400 font-bold size-8 ml-8 cursor-pointer"
                  onClick={copyGameCode}
                />
                <FaCheck
                  className={`${copiedGameCode ? "opacity-100" : "opacity-0"} transition-all duration-200 size-4 text-zinc-400 `}
                />
              </div>
            </div>
          </div>
          <div className="mt-4 text-2xl font-bold text-darkpurple">
            Players Joining...
          </div>
          <div className="flex flex-row flex-wrap justify-evenly">
            {playersJoined.length == 0 && (
              <div className="mt-8 mb-8 text-blk text-3xl">
                No one has joined yet
              </div>
            )}
            {playersJoined.map((player) => (
              <li className="relative flex flex-col p-4" key={player.name}>
                <div className="bg-[#492480] w-fit h-fit rounded-full p-2">
                  <div className="bg-white w-fit h-fit rounded-full">
                    <img
                      className="size-24 rounded-full"
                      // src={`/author_images/${player.name}.png`}
                      src={`${backendURL}/api/author/images?game_code=${sessionStorage.getItem("game_code")}&player_name=${player.name}`}
                      alt="profile picture"
                    />
                  </div>
                </div>
                <span className="text-center text-blk text-bold text-xl mt-2">
                  {player.name}
                </span>
              </li>
            ))}
          </div>
          <div className="w-[40%]">
            <button
              className="btn-purple mb-12 p-4 h-fit text-nowrap min-w-fit"
              onClick={start_game}
            >
              Start Game
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default Host_Create_Game;
