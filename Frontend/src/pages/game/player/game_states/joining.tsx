import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import client from "../../socket-connection";
import { TbCardsFilled } from "react-icons/tb";
import { FaListOl } from "react-icons/fa";
import GameCodeInput from "../../../../components/code-input";

interface FormData {
  gameCode: string;
  name: string;
}

interface GameJoinProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  setPlayerName: React.Dispatch<React.SetStateAction<string>>;
}

function Player_Join({ formData, setFormData, setPlayerName }: GameJoinProps) {
  const [hasEnteredGameCode, setHasEnteredGameCode] = useState(false);
  const [authorNames, setAuthorNames] = useState([]);
  const [isCustomName, setIsCustomName] = useState(false);

  useEffect(() => {
    client.on("game-info", (data) => {
      console.log("game-info recieved");
      console.log(data);
      if (data.password_needed) {
        console.log("password needed");
        // TODO add user input for password
      } else {
        console.log("no password needed");
        // console.log(formData);
        setAuthorNames(data.authors.concat(["Custom"]));
        // join_game(formData.name, formData.gameCode);
      }
    });
  }, [formData]);

  function join_game(name: string, gameCode: string) {
    console.log("sendingggg " + name + ", " + gameCode);
    setPlayerName(name);
    sessionStorage.setItem("game_code", gameCode);
    client.emit("join-game", {
      name: name,
      game_code: gameCode,
    });
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    let { name, value } = e.target;
    if (name == "gameCode") {
      value = value.toUpperCase();
      if (value.length > 6) {
        return;
      }
    }

    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleNameChange = (event: ChangeEvent<HTMLSelectElement>) => {
    let { value } = event.target;
    setIsCustomName(value == "Custom");
    if (value == "Custom") {
      value = "";
    }
    setFormData((prevFormData) => ({
      ...prevFormData,
      ["name"]: value,
    }));
  };

  function handleSubmit() {
    client.emit("game-info-req", { game_code: formData.gameCode });
    setHasEnteredGameCode(true);
  }

  return (
    <>
      {/* <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="gameCode">Game ID:</label>
          <input
            className={`${hasEnteredGameCode ? "pointer-events-none bg-gray" : "pointer-events-auto bg-white"}`}
            type="text"
            id="gameCode"
            name="gameCode"
            value={formData.gameCode}
            onChange={handleChange}
          />
        </div>
        {!hasEnteredGameCode && <button type="submit">Submit game code</button>}
        {hasEnteredGameCode && (
          <>
            <div>
              <label>
                Select Name:
                <select
                  value={isCustomName ? "Custom" : formData.name}
                  onChange={handleNameChange}
                >
                  <option value="" disabled>
                    Select a name
                  </option>
                  {authorNames.map((nameOption) => (
                    <option key={nameOption} value={nameOption}>
                      {nameOption}
                    </option>
                  ))}
                </select>
              </label>

              {isCustomName && (
                <div>
                  <label>
                    Enter Custom Name:
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter your custom name"
                    />
                  </label>
                </div>
              )}
            </div>

            <button onClick={() => join_game(formData.name, formData.gameCode)}>
              Join Game
            </button>
          </>
        )}
      </form> */}

      <>
        <div className="size-full flex items-start justify-center bg-optionbg">
          <div className="bg-whtdarkpp text-blk w-[90%] md:w-[80%] max-w-[60rem] h-fit mt-12 rounded-[2vh] p-10">
            <div className="text-[3em] font-semibold">Options</div>
            <div className="bg-[#A8A8A8] w-full h-[2px]"></div>

            <div className="flex flex-col md:flex-row p-[1vw] justify-between items-center">
              <div className="flex flex-row mt-4 h-full items-center justify-center">
                <TbCardsFilled className="size-8 text-[#7964A3]" />
                <div className="ml-2 text-3xl sm:text-3xl">Game Code:</div>
              </div>
              <div className="flex-1 max-w-[30rem] p-2">
                <input
                  className={`${hasEnteredGameCode ? "pointer-events-none bg-zinc-500 text-zinc-200 mild-shadow" : "bg-black text-white"} font-rubik h-20 p-4 rounded-md  text-[1.5em] sm:text-[2em] w-full text-start md:text-center`}
                  type="text"
                  id="gameCode"
                  name="gameCode"
                  value={formData.gameCode}
                  onChange={handleChange}
                  spellCheck={false}
                />
                {/* <GameCodeInput
                  setFormData={setFormData}
                  isActive={hasEnteredGameCode}
                /> */}
              </div>
            </div>
            {!hasEnteredGameCode && (
              <div className="w-full flex justify-end">
                <button
                  className="btn-purple bg-darkpurple w-1/4 min-w-32"
                  onClick={handleSubmit}
                >
                  Next
                </button>
              </div>
            )}

            {hasEnteredGameCode && (
              <div>
                <div className="flex flex-col p-[1vw] justify-between items-center">
                  <label className="flex w-full flex-row justify-between items-center">
                    <span className="text-2xl">Select Name:</span>
                    <select
                      className="text-white bg-black w-1/4 p-4 rounded-lg"
                      value={isCustomName ? "Custom" : formData.name}
                      onChange={handleNameChange}
                    >
                      <option className="text-white bg-black" value="" disabled>
                        Select a name
                      </option>
                      {authorNames.map((nameOption) => (
                        <option
                          className="text-white bg-black"
                          key={nameOption}
                          value={nameOption}
                        >
                          {nameOption}
                        </option>
                      ))}
                    </select>
                  </label>

                  {isCustomName && (
                    <div className="w-full mt-4">
                      <label className="w-full flex flex-row justify-between items-center">
                        <span className="text-2xl">Enter Custom Name:</span>
                        <input
                          className="text-white bg-black w-1/2 p-4 rounded-lg"
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="Enter your custom name"
                        />
                      </label>
                    </div>
                  )}
                </div>
                <div className="w-full flex justify-end p-4 ">
                  <button
                    className="btn-purple w-1/2"
                    onClick={() => {
                      join_game(formData.name, formData.gameCode);
                    }}
                  >
                    Join Game
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </>
    </>
  );
}

export default Player_Join;
