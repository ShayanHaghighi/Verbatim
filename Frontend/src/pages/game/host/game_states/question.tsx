import client from "../../socket-connection";
import { Player, Question } from "../../game-models";

// function Host_Question({ question, game_code, players }: props) {

//   return (
//     <>
{
  /* {question?.question}
      {question?.options == null ? (
        <span>error - no options</span>
      ) : (
        <ul>
          {question?.options.map((option) => (
            <li key={option}>{option}</li>
          ))}
        </ul>
      )}
      <button onClick={endRound}>Next round</button>
      <ul>
        {players.map((player) =>
          player.hasAnswered ? (
            <li key={player.name}>{player.name} has answered</li>
          ) : (
            <></>
          )
        )}
      </ul> */
}
//     </>
//   );
// }

import { useEffect, useState } from "react";
import CountdownTimerExternal from "../../../../components/TimerExternal";
import { backendURL } from "../../../../constants";

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

function Host_Question({
  game_code,
  question,
  timeLimit,
  players,
  questionNum,
}: {
  game_code: string | null;
  question: Question | null;
  timeLimit: number;
  players: Player[];
  questionNum: string;
}) {
  const [hasAnswered, setHasAnswered] = useState<boolean>(false);
  const [hasTimerRunOut, setHasTimerRunOut] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState(timeLimit);

  // players = [
  //   { name: "Bobby", score: 0, hasAnswered: false },
  //   { name: "Billy", score: 0, hasAnswered: false },
  //   { name: "Barry", score: 0, hasAnswered: true },
  //   { name: "Barry", score: 0, hasAnswered: true },
  //   { name: "Badrry", score: 0, hasAnswered: false },
  //   { name: "Barfry", score: 0, hasAnswered: false },
  //   { name: "Berry", score: 0, hasAnswered: true },
  //   { name: "Barary", score: 0, hasAnswered: true },
  // ];
  const gradientStyle = {
    background: `linear-gradient(to right, #22c55e ${barProgress() - 5}%, #230453 ${barProgress() + 5}%, #230453 100%)`,
  };

  function barProgress() {
    const fromNum = Number(questionNum.split("/")[0]);
    const toNum = Number(questionNum.split("/")[1]);
    return Math.round((fromNum / toNum) * 100);
  }

  function endRound() {
    client.emit("question-finished", {
      game_code: game_code,
      game_token: sessionStorage.getItem("game_token"),
    });
  }

  // question = { question: "quesion", options: ["op1", "op2", "op3", "op4"] };
  useEffect(() => {
    client.emit("current-game-info", {
      game_code: game_code,
    });
  }, []);

  function timerRanOut() {
    setHasTimerRunOut(true);

    console.log("time has run out");
    // client.emit("question-finished", {
    //   game_code: game_code,
    //   game_token: sessionStorage.getItem("game_token"),
    // });
  }

  return (
    <>
      <div className="w-full h-full bg-accent2">
        {hasAnswered ? (
          <span>answered question</span>
        ) : (
          <>
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
                    ></img>
                    <div>1111 pts</div>
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
            <div className="w-full flex items-center justify-center text-white text-[4vh] font-bold drop-shadow-lg mt-8 mb-6">
              <span className="font-indie quote-shadow select-none">
                " {question?.question} "
              </span>
            </div>
            <div>
              <ul className="flex flex-row flex-wrap justify-evenly w-full">
                {players.map((player) => (
                  <li className="relative flex flex-col p-4" key={player.name}>
                    <div className="bg-[#492480] w-fit h-fit rounded-full p-2">
                      <div className="bg-white w-fit h-fit rounded-full">
                        <img
                          className="size-24 rounded-full"
                          // src={`/author_images/${player.name}.png`}
                          src={`${backendURL}/api/author/images?game_code=${game_code}&player_name=${player.name}`}
                          alt="profile picture"
                        />
                      </div>
                    </div>
                    <img
                      src="/icons/positive-vote.png"
                      alt="positive vote icon"
                      className={`
                        ${player.hasAnswered ? "vote-after" : "vote-before"}
                      `}
                    />
                    <span className="text-center text-white text-bold text-xl mt-2">
                      {player.name}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex justify-center">
              <button className="btn-green mt-4" style={{}} onClick={endRound}>
                {"End Round ->"}
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default Host_Question;
