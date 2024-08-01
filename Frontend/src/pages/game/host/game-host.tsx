import { useEffect, useState } from "react";
import Host_Create_Game from "./game_states/create";
import Host_Question from "./game_states/question";
import client from "../socket-connection";
import HostAnswer from "./game_states/answer";
import HostRebuttal from "./game_states/rebuttal";
import HostResults from "./game_states/results";

interface gameStates {
  state: "waiting" | "question" | "answer" | "rebuttal" | "results";
}

export interface Question {
  question: string;
  options?: string[];
  answer?: string | null;
}

export interface Player {
  name: string;
  score: number;
  hasAnswered: boolean;
}

export interface Vote {
  voteCaster: string;
  score: number;
}
interface FormData {
  numQuestions: number;
  password: string;
  deck: any;
}

function Game_Owner() {
  const [gameCode, setGameCode] = useState(null);
  const [playersJoined, setPlayersJoined] = useState<Player[]>([]);
  const [gameState, setGameState] = useState<gameStates>({ state: "waiting" });
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [currentVotes, setCurrentVotes] = useState<Vote[]>([]);
  const [authorVotes, setAuthorVotes] = useState({});
  const [formData, setFormData] = useState<FormData>({
    numQuestions: 1,
    password: "",
    deck: null,
  });

  function create_game(password: string) {
    console.log("sending req to server");
    client.emit("create-game", {
      deck_id: formData.deck.id,
      password: password,
      num_questions: formData.numQuestions,
    });
    setPlayersJoined([]);
  }

  function start_game() {
    client.emit("start-game", {
      game_code: gameCode,
      game_token: sessionStorage.getItem("game_token"),
    });
  }

  useEffect(() => {
    client.once("connect", () => {
      console.log("Connected to server");
    });
    client.on("code", (data) => {
      console.log("Received message:", data);
      setGameCode(data.game_code);
      sessionStorage.setItem("game_token", data.game_token);
    });
    client.on("players-update", (data) => {
      console.log("Update to players:", data.players);
      let temp: Player[] = [];
      data.players.forEach((player_name: any) => {
        temp.push({ name: player_name, score: 0, hasAnswered: false });
      });
      setPlayersJoined(temp);
    });

    client.on("connect_error", (error) => {
      console.error("Connection error:", error);
    });
    client.on("user-error", (error) => {
      console.error("User error:", error);
    });
    client.on("question", (res) => {
      // console.log("game has started");

      setCurrentQuestion({ question: res.question, options: res.options });
      setGameState({ state: "question" });
      setPlayersJoined((prevPlayers) => {
        return prevPlayers.map((player: Player) => ({
          ...player,
          hasAnswered: false,
        }));
      });
    });
    client.on("new-answer", (res) => {
      setPlayersJoined((prevPlayers) => {
        return prevPlayers.map((player: Player) =>
          player.name == res.name ? { ...player, hasAnswered: true } : player
        );
      });
    });

    client.on("player-scores", (res) => {
      console.log(res);
      setPlayersJoined(res);
      setGameState({ state: "answer" });
    });
    client.on("rebuttal-details", (res) => {
      console.log("rebbutal details:");
      console.log(res);
      setCurrentQuestion({
        question: res.question.quote,
        answer: res.question.author,
      });
      setGameState({ state: "rebuttal" });
      setCurrentVotes([]);
    });
    client.on("rebuttal-vote", (res) => {
      console.log(currentVotes);
      setCurrentVotes((prevVotes) => {
        return [...prevVotes, { voteCaster: res.name, score: res.score }];
      });
    });

    client.on("game-end", (res) => {
      setAuthorVotes(res.authorVotes);
      setGameState({ state: "results" });
    });

    client.on("disconnect", (reason) => {
      console.log("Disconnected from server:", reason);
    });
    return () => {
      client.removeAllListeners();
    };
  }, [client]);

  return (
    <>
      {gameState.state == "waiting" && (
        <Host_Create_Game
          create_game={create_game}
          start_game={start_game}
          gameCode={gameCode}
          playersJoined={playersJoined}
          formData={formData}
          setFormData={setFormData}
        ></Host_Create_Game>
      )}
      {gameState.state == "question" && (
        <Host_Question
          question={currentQuestion}
          game_code={gameCode}
          players={playersJoined}
        ></Host_Question>
      )}
      {gameState.state == "answer" && (
        <HostAnswer gameCode={gameCode} players={playersJoined}></HostAnswer>
      )}
      {gameState.state == "rebuttal" && (
        <HostRebuttal
          gameCode={gameCode}
          question={currentQuestion}
          currentVotes={currentVotes}
        ></HostRebuttal>
      )}
      {gameState.state == "results" && (
        <HostResults
          players={playersJoined}
          authorVotes={authorVotes}
        ></HostResults>
      )}
    </>
  );
}

export default Game_Owner;
