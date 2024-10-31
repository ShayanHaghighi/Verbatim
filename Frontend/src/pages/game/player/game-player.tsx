import { useState, useEffect } from "react";
import client from "../socket-connection";
import PlayerQuestion, { setUpQuestionHandlers } from "./game_states/question";
import Player_Waiting from "./game_states/waiting";
import { setUpHandlers } from "./handler-setup";
import PlayerAnswer from "./game_states/answer";
import PlayerRebuttal from "./game_states/rebuttal";
import Player_Join from "./game_states/joining";
import { useNavigate } from "react-router-dom";
import ConfirmationModal from "../../../components/game/confirm-modal";

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
  const [currentScore, setCurrentScore] = useState<string | null>(null);
  const [myPlayerName, setMyPlayerName] = useState<string>("");
  const [timeLimit, setTimeLimit] = useState(60);
  const [questionNum, setQuestionNum] = useState("0/1");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [score, setScore] = useState(0);

  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    gameCode: "",
    name: "",
  });
  function leaveGame() {
    client.emit("leave-game", {
      game_code: sessionStorage.getItem("game_code"),
      game_token: sessionStorage.getItem("game_token"),
    });
    navigate("/");
  }

  useEffect(() => {
    setUpQuestionHandlers({
      setAnswerCorrect,
      setCurrentQuestion,
      setGameState,
      setTimeLimit,
      setCurrentScore,
    });

    setUpHandlers({ setGameState, setCurrentAccused });

    client.on("force-end", (_) => {
      navigate("/");
    });
    client.on("current-game-info", (res) => {
      setQuestionNum(res.question_no);
      setScore(res.score);
    });

    return () => {
      client.removeAllListeners();
    };
  });

  // function rejoinGame(){
  //   if(sessionStorage.getItem('game_code')!=null && sessionStorage.getItem('game_token')!=null){
  //     client.emit('rejoin-game'){

  //     }
  //   }
  //   }

  return (
    <>
      {gameState.state == "joining" && (
        <Player_Join
          formData={formData}
          setFormData={setFormData}
          setPlayerName={setMyPlayerName}
        ></Player_Join>
      )}
      {gameState.state == "waiting" && <Player_Waiting></Player_Waiting>}
      {gameState.state == "question" && (
        <PlayerQuestion
          questionNum={questionNum}
          question={currentQuestion}
          timeLimit={timeLimit}
          score={score}
        ></PlayerQuestion>
      )}
      {gameState.state == "answer" && (
        <PlayerAnswer
          isAnswerCorrect={isAnswerCorrect}
          questionNum={questionNum}
          score={score}
          currentAccused={currentAccused}
        ></PlayerAnswer>
      )}
      {gameState.state == "rebuttal" && (
        <PlayerRebuttal
          currentAccused={currentAccused}
          gameCode={formData.gameCode}
          currentScore={currentScore}
          myName={myPlayerName}
        ></PlayerRebuttal>
      )}
      <div
        className={`w-full ${gameState.state == "joining" ? "bg-optionbg" : gameState.state == "waiting" ? "bg-[#220f4e]" : "bg-accent2"}`}
      >
        <button
          className="bg-accent1 hover:brightness-75 text-white pt-3 pb-2 pl-6 pr-10 rounded-tr-full"
          onClick={() => setIsModalOpen(true)}
        >
          exit
        </button>
      </div>
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={leaveGame}
      />
    </>
  );
}

export default Game_Player;
