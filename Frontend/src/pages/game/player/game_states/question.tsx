import { Question } from "../game-player";
import client from "../../socket-connection";
import { useEffect, useState } from "react";
import CountdownTimerExternal from "../../../../components/TimerExternal";
import ResultsWaitingScreen from "../../../../components/waiting-screen-2";
import WaitingScreen2 from "../../../../components/waiting-screen-3";
import ProgressBar from "../../../../components/game/progress-bar";
import ScoreComponent from "../../../../components/game/score-component";

export function setUpQuestionHandlers({
  setAnswerCorrect,
  setCurrentQuestion,
  setGameState,
  setTimeLimit,
  setCurrentScore,
}: any) {
  client.on("question", (res) => {
    console.log("game has started");
    setTimeLimit(res.time_limit);
    setCurrentQuestion({ question: res.question, options: res.options });
    setGameState({ state: "question" });
    // setCurrentScore(res.score);
  });
  client.on("answer-correctness", (res) => {
    console.log(res.isCorrect);
    setAnswerCorrect(res.isCorrect);
  });
}

function PlayerQuestion({
  questionNum,
  score,
  question,
  timeLimit,
}: {
  questionNum: string;
  score: number;
  question: Question | null;
  timeLimit: number;
}) {
  const [hasAnswered, setHasAnswered] = useState<boolean>(false);
  const [currentOption, setCurrentOption] = useState("");
  const [hasTimerRunOut, setHasTimerRunOut] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState(timeLimit);

  // question = { question: "quesion", options: ["op1", "op2", "op3", "op4"] };
  useEffect(() => {
    client.emit("current-game-info", {
      game_code: sessionStorage.getItem("game_code"),
      game_token: sessionStorage.getItem("game_token"),
    });
  }, []);

  function submitAnswer() {
    client.emit("my-answer", {
      game_code: sessionStorage.getItem("game_code"),
      answer: currentOption,
      game_token: sessionStorage.getItem("game_token"),
      time_taken_ratio: timeLeft / timeLimit,
    });
    setHasAnswered(true);
    console.log("answer:");
    console.log(currentOption + "," + timeLeft / timeLimit);
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
                        onFinish={timerRanOut}
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
                  <div className="text-white">2/15</div>
                </div>
              </div>
              <div className="flex items-center justify-center text-[5vh] text-white pb-10">
                Who said:
              </div>
            </div>
            <div className="w-full flex items-center justify-center text-white text-[4vh] font-bold drop-shadow-lg mt-8 mb-6">
              <span className="font-indie quote-shadow select-none">
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
