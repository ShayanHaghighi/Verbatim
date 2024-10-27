import { ChangeEvent, useEffect, useState } from "react";
import { Player } from "../../game-models";
import Dropdown from "../../../../components/dropdown";
import deckHelper from "../../../../service/deck-helper";
import IDeck, { IDeckShort } from "../../../../models/deck-model";
import client from "../../socket-connection";
import { TbCardsFilled } from "react-icons/tb";
import { FaListOl } from "react-icons/fa";
import { GoTriangleDown, GoTriangleUp } from "react-icons/go";
import ConfirmationModal from "../../../../components/confirm-modal";
import { backendURL } from "../../../../constants";

interface FormData {
  numQuestions: number;
  password: string;
  deck: any;
}
interface GameOwnerProps {
  create_game: (pass: string) => void;
  start_game: () => void;
  gameCode: string | null;
  playersJoined: Player[];
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
}

function Host_Create_Game({
  create_game,
  start_game,
  gameCode,
  playersJoined,
  formData,
  setFormData,
}: GameOwnerProps) {
  const [isCreating, setIsCreating] = useState(true);
  const [usingPass, setUsingPass] = useState(false);
  const [decks, setDecks] = useState<IDeckShort[]>([]);
  const { getAllDecks } = deckHelper();

  useEffect(() => {
    getAllDecks()
      .then((response) => {
        setDecks(response);
        setFormData((prevData) => ({
          ...prevData,
          deck: response[0],
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
        <div className="size-full flex items-start justify-center bg-optionbg">
          <div></div>
          <div className="bg-whtdarkpp text-blk w-[80%] max-w-[60rem] h-fit mt-12 rounded-[2vh] p-10">
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
        </div>
      )}
      {!isCreating && (
        <div className="size-full flex flex-col items-center justify-start bg-optionbg">
          <div className="mt-4 w-[50%] text-center font-bold py-2 px-2 text-[6vw] bg-white text-black">
            <div className="border-black border-4 size-full ">{gameCode}</div>
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
            <button className="btn-purple p-6 h-fit" onClick={start_game}>
              Start Game
            </button>
          </div>
        </div>
      )}
      {/* <form>
        <div>
          <label htmlFor="numQuestions">Number Questions</label>
          <input
            type="number"
            id="numQuestions"
            name="numQuestions"
            value={formData.numQuestions}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="usingPassword">Password Required?</label>
          <input
            type="checkbox"
            id="usingPassword"
            name="usingPassword"
            checked={usingPass}
            onChange={() => {
              setUsingPass(!usingPass);
            }}
          />
        </div>
        {usingPass && (
          <div>
            <label htmlFor="password">Password:</label>
            <input
              type="text"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>
        )}
        <Dropdown
          list={decks}
          currElement={formData.deck}
          setCurrElement={(deck) =>
            setFormData((prevData) => ({ ...prevData, deck: deck }))
          }
          displayFunc={(deck) => deck.deck_name}
        ></Dropdown>
        {/* <button type="submit">Create Game</button> 
      </form>
      <button onClick={handleSubmit}>Create Game</button>
      <button onClick={start_game}>Start Game</button>

      <p>{gameCode}</p>
      <ul>{listPlayers}</ul> */}
    </>
  );
}

export default Host_Create_Game;
