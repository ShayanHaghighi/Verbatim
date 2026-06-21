import { useEffect, useState } from "react";
import CountdownTimerExternal from "../../../../components/TimerExternal";
import client from "../../socket-connection";
import { backendURL } from "../../../../constants";
import { motion } from "framer-motion";
import ProgressBar from "../../../../components/game/progress-bar";
import ScoreComponent from "../../../../components/game/score-component";
import GameHeaderWait from "../../../../components/game/game-header-wait";
import {Answer, GameStats} from "../game-player.tsx";
import {gameStates} from "../../game-models.tsx";

export function get_question_progress(gameStats: GameStats) {
    return `${gameStats.question_number}/${gameStats.total_questions}`;
}

export default function PlayerAnswer(
    {answer,gameStats}
:
    { answer: Answer ,gameStats :GameStats,},
) {


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

  return (
    <>
      <div className="w-full h-full bg-accent2">
        <GameHeaderWait
          score={gameStats.score}
          questionNum={get_question_progress(gameStats)}
          displayText="It was:"
        />
        <div className="relative mt-20">
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
              className={`${answer.score_increase > 0 ? "bg-green-500" : "bg-red-600"} w-fit h-fit rounded-full p-4 shadow-2xl`}
            >
              <div className="bg-zinc-100 w-fit h-fit rounded-full shadow-lg">
                <img
                  className="size-[50vw] max-w-[40vh] max-h-[40vh]  rounded-full"
                  alt="accused player profile picture"
                  src={`/author_images/${answer.answer}.png`}
                />
              </div>
            </div>
            <span
              className={`${answer.score_increase > 0 ? "text-green-300" : "text-red-400"} text-[3rem] mt-4 mild-shadow`}
            >
              {answer.answer}
            </span>
          </div>

          <div className="w-full flex p-6 justify-center items-center">
            <span className="text-white text-xl flex flex-row">
              <span>+ {answer.score_increase}</span>
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
