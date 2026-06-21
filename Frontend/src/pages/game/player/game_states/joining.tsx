import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import client, { leaveGame } from "../../socket-connection";
import { TbCardsFilled } from "react-icons/tb";
import { FaListOl } from "react-icons/fa";
import GameCodeInput from "../../../../components/code-input";
import ExitButton from "../../../../components/game/exit-button";
import {gameStates} from "../../game-models.tsx";
import getAllPlayers from "../../../../service/author-helper.tsx";



interface GameJoinProps {
    playerName: string;
  setPlayerName: (player_name: string) => void;
  setGameState: (gameStates) => void;
}

function Player_Join({ playerName, setPlayerName,setGameState }: GameJoinProps) {
  const [authorNames, setAuthorNames] = useState([]);

    useEffect(() => {
        getAllPlayers().then(res => {
            console.log(res);
            setAuthorNames(res);
        })
    }, []);

  function join_game() {
    console.log("sendingggg " + playerName );
    setGameState({state:"waiting"})
    client.emit("join-game", {
      name: playerName,
    });

  }



  const handleNameChange = (event: ChangeEvent<HTMLSelectElement>) => {
      console.log(event.target.value);
    setPlayerName(event.target.value);
  };


  return (
    <>
      <>
        <div className="game-bg bg-optionbg">
          <div className="bg-whtdarkpp text-blk w-[90%] md:w-[80%] max-w-[60rem] h-fit mt-12 rounded-[2vh] p-10 mb-6">

            <div className="bg-[#A8A8A8] w-full h-[2px]"></div>





              <div>
                <div className="flex flex-col p-[1vw] justify-between items-center">
                  <label className="flex w-full flex-row justify-between items-center">
                    <span className="text-2xl">Select Name:</span>
                    <select
                      className="text-white bg-black w-1/4 min-w-fit p-4 rounded-lg"
                      value={playerName}
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


                </div>
                <div className="w-full flex justify-end p-4 ">
                  <button
                    className="btn-purple w-1/2 min-w-fit px-4"
                    onClick={() => {
                      join_game();
                    }}
                  >
                    Join Game
                  </button>
                </div>
              </div>

          </div>
          <ExitButton onConfirm={leaveGame} />
        </div>
      </>
    </>
  );
}

export default Player_Join;
