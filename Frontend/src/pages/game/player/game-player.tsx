import { useState, useEffect } from "react";
import client from "../socket-connection";
import PlayerQuestion, { setUpQuestionHandlers } from "./game_states/question";
import Player_Waiting from "./game_states/waiting";
import { setUpHandlers } from "./handler-setup";
import PlayerAnswer from "./game_states/answer";
import PlayerRebuttal from "./game_states/rebuttal";
import Player_Join from "./game_states/joining";

interface FormData {
  gameCode: string;
  name: string;
}

interface gameStates {
  state: "joining" | "waiting" | "question" | "answer" | "rebuttal";
}

export interface Question {
  question: string;
  options: string[];
}

function Game_Player() {
  const [gameState, setGameState] = useState<gameStates>({ state: "joining" });
  const [isAnswerCorrect, setAnswerCorrect] = useState<boolean | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [currentAccused, setCurrentAccused] = useState<string | null>(null);

  const [formData, setFormData] = useState<FormData>({
    gameCode: "",
    name: "",
  });

  useEffect(() => {
    setUpQuestionHandlers({
      setAnswerCorrect,
      setCurrentQuestion,
      setGameState,
    });

    setUpHandlers({ setGameState, setCurrentAccused });

    return () => {
      client.removeAllListeners();
    };
  });

  return (
    <>
      {gameState.state == "joining" && (
        <Player_Join
          formData={formData}
          setFormData={setFormData}
        ></Player_Join>
      )}
      {gameState.state == "waiting" && <Player_Waiting></Player_Waiting>}
      {gameState.state == "question" && (
        <PlayerQuestion
          game_code={formData.gameCode}
          question={currentQuestion}
        ></PlayerQuestion>
      )}
      {gameState.state == "answer" && (
        <PlayerAnswer isAnswerCorrect={isAnswerCorrect}></PlayerAnswer>
      )}
      {gameState.state == "rebuttal" && (
        <PlayerRebuttal
          currentAccused={currentAccused}
          gameCode={formData.gameCode}
        ></PlayerRebuttal>
      )}
    </>
  );
}

export default Game_Player;
