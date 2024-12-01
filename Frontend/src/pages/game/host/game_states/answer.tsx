import client, { endGame } from "../../socket-connection";
import { Player } from "../../game-models";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Accused from "./sub-states/accused";
import RunningResults from "./sub-states/running-results";
import ProgressBar from "../../../../components/game/progress-bar";
import ExitButton from "../../../../components/game/exit-button";
import { Shake } from "reshake";
import { tr } from "framer-motion/client";

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
  const [showFirstDiv, setShowFirstDiv] = useState(false);
  const [objectionScreen, setObjectionScreen] = useState(false);
  const [shakeVelocity, setShakeVelocity] = useState(0.01);

  function easeOutCubic(x: number): number {
    // console.log(x);
    return 1 - Math.pow(1 - x, 3);
  }

  function startRebuttal() {
    setObjectionScreen(true);
    const shakeId = setInterval(() => {
      setShakeVelocity((prev) => easeOutCubic(prev));
    }, 100);

    setTimeout(() => {
      clearInterval(shakeId);
      console.log("starting rebuttal");
      client.emit("start-rebuttal", {
        game_code: gameCode,
        game_token: sessionStorage.getItem("game_token"),
      });
    }, 3000);
  }

  useEffect(() => {
    client.emit("current-game-info", {
      game_code: sessionStorage.getItem("game_code"),
    });
    const timer = setTimeout(() => {
      setShowFirstDiv(false);
    }, 3000);

    return () => clearTimeout(timer);
    // client.emit("get-players", {
    //   game_code: sessionStorage.getItem("game_code"),
    // });
  }, []);

  return (
    <>
      {/* <div className="game-bg bg-accent2 relative"> */}
      {objectionScreen && (
        <div className="w-[100%] h-[100%] animate-float-smal absolute z-20 left-0 top-0">
          <Shake
            h={(1 - shakeVelocity) * 100}
            v={(1 - shakeVelocity) * 100}
            r={0}
            fixed={true}
          >
            <img
              src="/images/objection.png"
              alt="objection image"
              className="w-full h-full object-contain"
            />
          </Shake>
        </div>
      )}
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
          <ProgressBar questionNum={questionNum} />
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

      {/* </div> */}
    </>
  );
}
