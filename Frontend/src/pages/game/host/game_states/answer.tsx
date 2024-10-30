import client from "../../socket-connection";
import { Player } from "../../game-models";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Accused from "./sub-states/accused";
import RunningResults from "./sub-states/running-results";

interface props {
  gameCode: string | null;
  players: Player[];
  currentAccused: string;
  questionNum: string;
}

export default function HostAnswer({
  gameCode,
  players,
  currentAccused,
  questionNum,
}: props) {
  // players = [
  //   { name: "billy", score: 1273, scoreIncrease: 561, hasAnswered: false },
  //   { name: "barry", score: 1205, scoreIncrease: 700, hasAnswered: false },
  //   { name: "benny", score: 1315, scoreIncrease: 1090, hasAnswered: false },
  //   { name: "bobby", score: 1298, scoreIncrease: 901, hasAnswered: false },
  //   { name: "baldy", score: 900, scoreIncrease: 0, hasAnswered: false },
  //   { name: "john", score: 1100, scoreIncrease: 811, hasAnswered: false },
  // ];
  const [showFirstDiv, setShowFirstDiv] = useState(true);

  function startRebuttal() {
    client.emit("start-rebuttal", {
      game_code: gameCode,
      game_token: sessionStorage.getItem("game_token"),
    });
  }

  const gradientStyle = {
    background: `linear-gradient(to right, #22c55e ${barProgress() - 5}%, #230453 ${barProgress() + 5}%, #230453 100%)`,
  };

  function barProgress() {
    const fromNum = Number(questionNum.split("/")[0]);
    const toNum = Number(questionNum.split("/")[1]);
    return Math.round((fromNum / toNum) * 100);
  }
  useEffect(() => {
    client.emit("current-game-info", {
      game_code: sessionStorage.getItem("game_code"),
    });
    const timer = setTimeout(() => {
      setShowFirstDiv(false);
    }, 3000); // Show the first div for 3 seconds

    return () => clearTimeout(timer);
    // client.emit("get-players", {
    //   game_code: sessionStorage.getItem("game_code"),
    // });
  }, []);

  return (
    <div className="w-full h-full bg-accent2 flex flex-col">
      <div
        className="bg-accent1 w-full flex flex-col rounded-b-[100%] shadow-inner"
        style={{
          boxShadow: "0 -20px 20px rgba(0,0,0,0.2) inset",
        }}
      >
        <div className="flex h-24 flex-row justify-between p-4">
          <div className="flex items-start opacity-0">
            <div className="flex flex-row justify-center py-2 px-2 bg-accent2 text-white shadow-lg rounded-full w-28 min-w-fit">
              <img
                src={"/icons/checkpoint.png"}
                alt="checkpoint image"
                className="size-6 mr-1"
              />
              <div>000 pts</div>
            </div>
          </div>
          <div className="sm:flex hidden items-end flex-1 px-10">
            <div className="flex flex-col w-full items-center">
              <div
                className={` h-2 w-full rounded-full`}
                style={gradientStyle}
              ></div>
              <div>{questionNum}</div>
            </div>
          </div>
          <div>
            <div className="flex flex-row justify-center py-2 px-4 text-white shadow-lg rounded-full w-28 bg-accent2">
              <img
                src={"/icons/hourglass.png"}
                alt="checkpoint image"
                className="size-6 mr-1"
              ></img>
              --:--
            </div>
          </div>
        </div>
        <div className="flex sm:hidden items-end flex-1 px-10">
          <div className="flex flex-col w-full items-center">
            <div className="bg-gradient-to-r from-green-500 from-10% via-[#230453] via-15% to-[#230453] h-2 w-full rounded-full"></div>
            <div className="text-white">{questionNum}</div>
          </div>
        </div>
        <div className="flex font-extrabold items-center justify-center text-[5vh] text-white pb-10">
          It was:
        </div>
      </div>
      <div className="relative w-full h-full flex items-center justify-center">
        <AnimatePresence>
          {showFirstDiv ? (
            <motion.div
              key="first"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 1 }}
              className="absolute w-full h-full"
            >
              <Accused currentAccused={currentAccused} />
            </motion.div>
          ) : (
            <motion.div
              key="second"
              // initial={{ opacity: 0, y: 10 }}
              initial={{ opacity: 1, y: 0 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 1 }}
              className="absolute w-full h-full"
            >
              <RunningResults startRebuttal={startRebuttal} players={players} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
