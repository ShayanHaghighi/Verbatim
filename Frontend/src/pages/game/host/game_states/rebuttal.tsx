import client, { endGame } from "../../socket-connection";
import { Question, Vote } from "../../game-models";
import { useState } from "react";
import CountdownTimerExternal from "../../../../components/TimerExternal";
import ProgressBar from "../../../../components/game/progress-bar";
import ExitButton from "../../../../components/game/exit-button";

interface props {
  gameCode: string | null;
  question: Question | null;
  currentVotes: Vote[];
}

export default function HostRebuttal({
  gameCode,
  question,
  currentVotes,
}: props) {
  const questionNum = "1/4";
  const timeLimit = 30;

  const [hasTimerRunOut, setHasTimerRunOut] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState(timeLimit);

  function nextQuestion() {
    client.emit("rebuttal-end", {
      game_code: gameCode,
      game_token: sessionStorage.getItem("game_token"),
    });
  }

  function timerRanOut() {
    setHasTimerRunOut(true);

    console.log("time has run out");
    // client.emit("question-finished", {
    //   game_code: game_code,
    //   game_token: sessionStorage.getItem("game_token"),
    // });
  }

  return (
    // <>
    //   {question?.answer} said: {question?.question}
    //   <div>Votes</div>
    //   {currentVotes.map((vote) => (
    //     <span>
    //       {vote.voteCaster} : {vote.score}
    //     </span>
    //   ))}
    //   <button onClick={nextQuestion}>Next Question</button>
    // </>
    <>
      <div className="w-full h-full relative">
        <div
          className="bg-accent1 w-full flex flex-col rounded-b-[100%] shadow-inner absolute"
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
                ></img>
                <div>1111 pts</div>
              </div>
            </div>
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
                    onFinish={timerRanOut}
                    timeLeft={timeLeft}
                    setTimeLeft={setTimeLeft}
                  />
                </div>
              </div>
            </div>
          </div>
          {/* <div className="flex sm:hidden items-end flex-1 px-10">
                <div className="flex flex-col w-full items-center">
                  <div className="bg-gradient-to-r from-green-500 from-10% via-[#230453] via-15% to-[#230453] h-2 w-full rounded-full"></div>
                  <div className="text-white">2/15</div>
                </div>
              </div> */}
          <div className="flex items-center justify-center text-[5vh] text-white pb-10">
            Who said:
          </div>
        </div>
        <div className="relative  w-full h-full">
          <img
            src="/images/court.png"
            className="absolute  right-0  object-cover"
          ></img>
          <img
            src="/author_images/Billy.png"
            className="size-8 absolute left-12 bottom-20 animate-float"
          />
        </div>
        <ExitButton onConfirm={endGame}/>
      </div>
    </>
  );
}
