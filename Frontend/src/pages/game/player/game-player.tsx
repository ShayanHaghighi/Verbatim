import { useState, useEffect } from "react";
import client from "../socket-connection";
import PlayerQuestion from "./game_states/question";
import Player_Waiting from "./game_states/waiting";
import { setUpHandlers } from "./handler-setup";
import PlayerAnswer from "./game_states/answer";
import PlayerRebuttal from "./game_states/rebuttal";
import Player_Join from "./game_states/joining";
import { useNavigate } from "react-router-dom";
import ConfirmationModal from "../../../components/game/confirm-modal";
import WaitingScreen from "../../../components/waiting-screen.tsx";

export interface FormData {
  name: string;
}

interface gameStates {
  state: "joining" | "waiting" | "question" | "answer" | "rebuttal";
}

export interface GameStats {
    question_number: number;
    total_questions: number;
    score: number;
}

export interface Question {
  question: string;
  options: string[];
  time_limit: number;

}

export interface Answer {
    score_increase: number;
    answer: string;
}

export function formatQNum(gameStats: GameStats | null) {
    return gameStats ? `${gameStats.question_number}/${gameStats.total_questions}` : "";
}

export function setUpQuestionHandlers({
                                          setCurrentQuestion,
                                          setGameState,
                                          setCurrentAnswer,
                                          setGameStats,
                                      }: any) {
    client.on("question", (res) => {
        console.log("game has started");
        setCurrentQuestion(res);
        setGameStats(res)
        setGameState({ state: "question" });
    });
    client.on("results", (res) => {
        console.log(res.isCorrect);
        setCurrentAnswer(res)
        setGameStats(res)
        setGameState({ state: "answer" });
    });
    client.on("start-rebuttal", (res) => {
        setGameState({ state: "rebuttal" });
    });
}

function Game_Player() {

    const [gameState, setGameState] = useState<gameStates>({ state: "joining" });
    const [playerName, setPlayerName] = useState<string>("");
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [gameStats, setGameStats] = useState<GameStats>({player_name: "", score:0,total_questions:0,question_number:0});

  const [currentAnswer, setCurrentAnswer] = useState<Answer>({score_increase:0,answer:""});
  const navigate = useNavigate();

  useEffect(() => {
    setUpQuestionHandlers({
      setCurrentQuestion,
      setGameState,
        setCurrentAnswer,
        setGameStats
    });

    setUpHandlers({ setGameState });

    client.on("force-end", (_) => {
      navigate("/");
    });


    return () => {
      client.removeAllListeners();
    };
  });


  return (
    <>
      {gameState.state == "joining" && (
        <Player_Join
          playerName={playerName}
          setPlayerName={setPlayerName}
          setGameState={setGameState}
        ></Player_Join>
      )}
      {gameState.state == "waiting" && <WaitingScreen player_name={playerName}></WaitingScreen>}
      {gameState.state == "question" && (
        <PlayerQuestion
            playerName={playerName}
          question={currentQuestion}
          gameStats={gameStats}
        ></PlayerQuestion>
      )}
      {gameState.state == "answer" && (
        <PlayerAnswer
          answer={currentAnswer}
          gameStats={gameStats}
        ></PlayerAnswer>
      )}
      {gameState.state == "rebuttal" && (
        <PlayerRebuttal
          currentAccused={currentAnswer.answer}
          gameStats={gameStats}
          myName={playerName}
        ></PlayerRebuttal>
      )}
    </>
  );
}

export default Game_Player;
