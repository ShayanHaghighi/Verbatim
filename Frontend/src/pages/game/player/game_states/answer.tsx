import { useEffect, useState } from "react";
import CountdownTimerExternal from "../../../../components/TimerExternal";
import client from "../../socket-connection";
import { backendURL } from "../../../../constants";
import { motion } from "framer-motion";
import ProgressBar from "../../../../components/game/progress-bar";
import ScoreComponent from "../../../../components/game/score-component";

export default function PlayerAnswer({
  isAnswerCorrect,
  questionNum,
  score,
  currentAccused,
}: {
  isAnswerCorrect: boolean | null;
  questionNum: string;
  score: number;
  currentAccused: string | null;
}) {
  const [scoreIncrease, setScoreIncrease] = useState(0);

  const objects = [
    { id: 2, x: -250, y: -175, rotate: 45 },
    { id: 6, x: -300, y: 0, rotate: 0 },
    { id: 1, x: -250, y: 175, rotate: -45 },

    { id: 3, x: 250, y: -175, rotate: 135 },
    { id: 4, x: 300, y: 0, rotate: 180 },
    { id: 5, x: 250, y: 175, rotate: 225 },
  ];
  const yOffset = -100;

  // Define motion variants for animation

  useEffect(() => {
    client.on("score-increase", (res) => {
      setScoreIncrease(res.increase);
    });
    client.emit("get-increase", {
      game_code: sessionStorage.getItem("game_code"),
      game_token: sessionStorage.getItem("game_token"),
    });
    client.emit("current-game-info", {
      game_code: sessionStorage.getItem("game_code"),
      game_token: sessionStorage.getItem("game_token"),
    }),
      [];
  });
  return (
    <>
      <div className="w-full h-full bg-accent2">
        <div
          className="bg-accent1 w-full flex flex-col rounded-b-[100%] shadow-inner"
          style={{
            boxShadow: "0 -20px 20px rgba(0,0,0,0.2) inset",
          }}
        >
          <div className="flex h-24 flex-row justify-between p-4">
            <ScoreComponent score={score} />
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
              <div className="text-white">2/15</div>
            </div>
          </div>
          <div className="flex items-center justify-center text-[5vh] text-white pb-10">
            It was:
          </div>
        </div>
        <div className="relative">
          <div className="absolute w-full h-full scale-[0.5] -translate-y-[5%] sm:translate-y-0 sm:scale-100 flex items-center justify-center ">
            {objects.map((obj, index) => (
              <motion.div
                key={obj.id}
                custom={index}
                initial={{
                  x: obj.x,
                  y: obj.y + yOffset,
                  rotate: `${obj.rotate}deg`,
                }}
                animate={{
                  x: obj.x * 1.1,
                  y: obj.y * 1.1 + yOffset,
                  transition: {
                    duration: 1,
                    repeat: Infinity,
                    repeatType: "reverse",
                    delay: 0,
                    ease: "easeInOut",
                  },
                }}
                // className={`${obj.id > 1 ? "md:flex hidden" : "flex"}`}
                style={{
                  width: "100px",
                  height: "100px",
                  position: "absolute",
                  // backgroundColor: "purple",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {/* Replace with an icon or image of a pointing finger */}
                <img
                  src={"/icons/point.png"}
                  alt="checkpoint image"
                  className="size-20"
                ></img>
              </motion.div>
            ))}
          </div>
          <div className="w-full flex flex-col items-center justify-center mt-8">
            <div
              className={`${scoreIncrease > 0 ? "bg-green-500" : "bg-red-600"} w-fit h-fit rounded-full p-4 shadow-2xl`}
            >
              <div className="bg-zinc-100 w-fit h-fit rounded-full shadow-lg">
                <img
                  className="size-[50vw] max-w-[40vh] max-h-[40vh]  rounded-full"
                  alt="accused player profile picture"
                  src={`${backendURL}/api/author/images?game_code=${sessionStorage.getItem("game_code")}&player_name=${currentAccused}`}
                />
              </div>
            </div>
            <span
              className={`${scoreIncrease > 0 ? "text-green-300" : "text-red-400"} text-[3rem] mt-4 mild-shadow`}
            >
              {currentAccused}
            </span>
          </div>

          <div className="w-full flex p-6 justify-center items-center">
            <span className="text-white text-xl flex flex-row">
              <span>+ {scoreIncrease}</span>
              <img
                src={"/icons/checkpoint.png"}
                alt="checkpoint image"
                className="size-7 ml-2"
              />
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
