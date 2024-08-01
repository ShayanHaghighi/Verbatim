import { Question } from "../game-player";
import client from "../../socket-connection";
import { useEffect, useState } from "react";

export function setUpQuestionHandlers({
  setAnswerCorrect,
  setCurrentQuestion,
  setGameState,
}: any) {
  client.on("question", (res) => {
    console.log("game has started");
    setCurrentQuestion({ question: res.question, options: res.options });
    setGameState({ state: "question" });
  });
  client.on("answer-correctness", (res) => {
    console.log(res.isCorrect);
    setAnswerCorrect(res.isCorrect);
  });
}

function PlayerQuestion({
  game_code,
  question,
}: {
  game_code: string;
  question: Question | null;
}) {
  const [hasAnswered, setHasAnswered] = useState<boolean>(false);

  useEffect(() => {});

  function submitAnswer(option: string) {
    client.emit("my-answer", {
      game_code: game_code,
      answer: option,
      game_token: sessionStorage.getItem("game_token"),
    });
    setHasAnswered(true);
  }

  return (
    <>
      {hasAnswered ? (
        <span>answered question</span>
      ) : (
        <>
          {question?.question}
          <div>
            {question?.options.map((option) => (
              <button
                key={option}
                onClick={() => {
                  submitAnswer(option);
                }}
              >
                {option}
              </button>
            ))}
          </div>
        </>
      )}
    </>
  );
}

export default PlayerQuestion;
