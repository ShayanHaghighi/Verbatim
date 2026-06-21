import {Answer, formatQNum, GameStats, Question} from "../game-player";
import client from "../../socket-connection";
import { useEffect, useState } from "react";
import CountdownTimerExternal from "../../../../components/TimerExternal";
import ResultsWaitingScreen from "../../../../components/waiting-screen-2";
import WaitingScreen2 from "../../../../components/waiting-screen-3";
import ProgressBar from "../../../../components/game/progress-bar";
import ScoreComponent from "../../../../components/game/score-component";
import GameHeader from "../../../../components/game/game-header";

const DEFAULT_TIME_LIMIT = 30

function PlayerQuestion({
  gameStats,
  question,
                            playerName
}: {
    playerName:string
    gameStats: GameStats;
  question: Question | null;
}) {
  const [hasAnswered, setHasAnswered] = useState<boolean>(false);
  const [currentOption, setCurrentOption] = useState("");
  const [hasTimerRunOut, setHasTimerRunOut] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState(question?.time_limit ?? DEFAULT_TIME_LIMIT);


  function submitAnswer() {
      console.log("time left",timeLeft)
    client.emit("answer", {
      answer: currentOption,
      player_name: playerName,
      time_taken_ratio: timeLeft / question?.time_limit,
    });
    setHasAnswered(true);
    console.log("answer:");
    console.log("player_name:" + playerName);
    console.log(currentOption + "," + timeLeft / question?.time_limit);
  }

  function timerRanOut() {
    setHasTimerRunOut(true);
    console.log("time has run out");
  }



  return (
    <>
      <div className="w-full h-full bg-accent2">

        {hasAnswered ? (
          <WaitingScreen2 />
        ) : (
          <>
            <GameHeader
              score={gameStats?.score}
              questionNum={formatQNum(gameStats)}
              timerFinishedCallback={timerRanOut}
              timeLimit={question?.time_limit ?? DEFAULT_TIME_LIMIT}
              timeLeft={timeLeft}
              setTimeLeft={setTimeLeft}
              displayText="Who said:"
            />
            <div className="w-full flex items-center justify-center text-white text-4xl md:text-5xl font-bold drop-shadow-lg mt-8 mb-6">
              <span className="font-indie quote-shadow select-none text-center px-4">
                " {question?.question} "
              </span>
            </div>
            <div className=" flex flex-row items-center justify-center flex-wrap">
              {question?.options.map((option) => (
                <button
                  onClick={() => setCurrentOption(option)}
                  className="bg-white text-black py-4 text-3xl rounded-md m-4 flex-[40%] flex-grow-0 focus:bg-[#4800B7] focus:shadow-blue-400 focus:shadow-xl focus:text-white transition-all duration-100"
                  key={option}
                >
                  {option}
                </button>
              ))}
            </div>
            <div className="flex justify-center">
              <button
                className="btn-green mt-4"
                style={{}}
                onClick={submitAnswer}
              >
                {"Next ->"}
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default PlayerQuestion;
