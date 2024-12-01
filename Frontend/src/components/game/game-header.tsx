import { useState } from "react";
import CountdownTimerExternal from "../TimerExternal";
import ProgressBar from "./progress-bar";
import ScoreComponent from "./score-component";

interface GameHeaderProps {
  score: number;
  questionNum: string;
  timeLimit: number;
  timerFinishedCallback: any;
  displayText: string;
}

export default function GameHeader({
  score,
  questionNum,
  timeLimit,
  timerFinishedCallback,
  displayText,
}: GameHeaderProps) {
  const [timeLeft, setTimeLeft] = useState(timeLimit);

  return (
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
          <div
            className="flex flex-row justify-center py-2 px-4 text-white shadow-lg rounded-full w-28"
            style={{
              backgroundColor: `rgb(${132 + (timeLimit - timeLeft) * 3},57,${246 - (timeLimit - timeLeft) * 6})`,
            }}
          >
            <img
              src={"/icons/hourglass.png"}
              alt="checkpoint image"
              className="size-6 mr-1"
            ></img>
            <div>
              <CountdownTimerExternal
                onFinish={timerFinishedCallback}
                timeLeft={timeLeft}
                setTimeLeft={setTimeLeft}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="flex sm:hidden items-end flex-1 px-10">
        <div className="flex flex-col w-full items-center">
          <div className="bg-gradient-to-r from-green-500 from-10% via-[#230453] via-15% to-[#230453] h-2 w-full rounded-full"></div>
          <div className="text-white">{questionNum}</div>
        </div>
      </div>
      <div className="flex items-center justify-center text-[5vh] text-white pb-10">
        {displayText}
      </div>
    </div>
  );
}
