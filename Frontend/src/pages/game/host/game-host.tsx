import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Host_Create_Game from "./game_states/create";
import Host_Question from "./game_states/question";
import HostAnswer from "./game_states/answer";
import HostRebuttal from "./game_states/rebuttal";
import HostResults from "./game_states/results";

import { Vote, gameStates, Player, Question } from "../game-models";

import client, { endGame } from "../socket-connection";
import ConfirmationModal from "../../../components/game/confirm-modal";
import ExitButton from "../../../components/game/exit-button";

interface FormData {
  numQuestions: number;
  password: string;
  deck: any;
}

function Game_Owner() {
  const [gameCode, setGameCode] = useState<string | null>(null);
  const [playersJoined, setPlayersJoined] = useState<Player[]>([]);
  const [gameState, setGameState] = useState<gameStates>({ state: "waiting" });
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [currentVotes, setCurrentVotes] = useState<Vote[]>([]);
  const [currentAccused, setCurrentAccused] = useState("");
  const [authorVotes, setAuthorVotes] = useState({});
  const [timeLimit, setTimeLimit] = useState(60);
  const [questionNum, setQuestionNum] = useState("0/1");

  const navigate = useNavigate();
  useEffect(() => {
    if (sessionStorage.getItem("game_code")) {
      console.log("asking for updates");
      client.emit("update", {
        game_token: sessionStorage.getItem("game_token"),
        game_code: sessionStorage.getItem("game_code"),
      });
    }
  }, []);

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

    client.on("current-game-info", (res) => {
      setQuestionNum(res.question_no);
    });

    client.on("update", (data) => {
      setGameCode(sessionStorage.getItem("game_code"));
      setGameState({ state: data.state });
      switch (data.state) {
        case "waiting": {
          // TODO change players object to incorporate 'hasAnswered'
          let temp: Player[] = [];
          data.players.forEach((player_name: any) => {
            temp.push({
              name: player_name,
              score: 0,
              hasAnswered: false,
              scoreIncrease: 0,
            });
          });
          setPlayersJoined(temp);
          break;
        }
        case "question": {
          setCurrentQuestion({
            question: data.question.question,
            options: data.question.options,
          });
          break;
        }
        case "answer": {
          setPlayersJoined(data.scores);
          break;
        }
        case "rebuttal": {
          setCurrentQuestion({
            question: data.question.quote,
            answer: data.question.author,
          });
          setCurrentVotes([]);
          break;
        }
        case "results": {
          setAuthorVotes(data.authorVotes);
          break;
        }
      }
    });

    client.on("code", (data) => {
      console.log("Received message:", data);
      setGameCode(data.game_code);
      sessionStorage.setItem("game_code", data.game_code);

      sessionStorage.setItem("game_token", data.game_token);
    });
    client.on("players-update", (data) => {
      console.log("Update to players:", data.players);
      let temp: Player[] = [];
      data.players.forEach((player_name: any) => {
        temp.push({
          name: player_name,
          score: 0,
          hasAnswered: false,
          scoreIncrease: 0,
        });
      });
      setPlayersJoined(temp);
    });
    // client.on("updated-players", (res) => {
    //   let temp: Player[] = [];
    //   console.log("updated-players");
    //   console.log(res);
    //   res.forEach((player: any) => {
    //     temp.push({
    //       name: player.name,
    //       score: player.score,
    //       hasAnswered: false,
    //       scoreIncrease: player.score_increase,
    //     });
    //   });
    //   setPlayersJoined(temp);
    // });

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
      sessionStorage.setItem("state", "question");
      setTimeLimit(res.time_limit);
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
      console.log("player-scores");
      console.log(res);

      setCurrentAccused(res.answer);

      let temp: Player[] = [];
      console.log("updated-players");
      console.log(res);
      res.scores.forEach((player: any) => {
        temp.push({
          name: player.name,
          score: player.score,
          hasAnswered: false,
          scoreIncrease: player.score_increase,
        });
      });
      setPlayersJoined(temp);

      setGameState({ state: "answer" });
      sessionStorage.setItem("state", "answer");
    });
    client.on("rebuttal-details", (res) => {
      console.log("rebbutal details:");
      console.log(res);
      setCurrentQuestion({
        question: res.question.quote,
        answer: res.question.author,
      });
      setCurrentVotes([]);
      setGameState({ state: "rebuttal" });
      sessionStorage.setItem("state", "rebuttal");
    });
    client.on("rebuttal-vote", (res) => {
      console.log("rebuttal vote:");
      console.log(currentVotes);
      setCurrentVotes((prevVotes) => {
        return [...prevVotes, { voteCaster: res.name, score: res.score }];
      });
    });

    client.on("game-end", (res) => {
      setAuthorVotes(res.authorVotes);
      setGameState({ state: "results" });
      sessionStorage.setItem("state", "results");
    });

    client.on("game-deleted", () => {
      sessionStorage.removeItem("game_token");
      sessionStorage.removeItem("game_code");

      navigate("/home");
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
      {/* <div className="h-full w-full"> */}
      <div className="game-bg bg-accent2 relative overflow-auto">
        {gameState.state == "waiting" && (
          <Host_Create_Game
            setPlayersJoined={setPlayersJoined}
            start_game={start_game}
            gameCode={gameCode}
            playersJoined={playersJoined}
          ></Host_Create_Game>
        )}
        {gameState.state == "question" && (
          <Host_Question
            question={currentQuestion}
            game_code={gameCode}
            players={playersJoined}
            timeLimit={timeLimit}
            questionNum={questionNum}
          ></Host_Question>
        )}
        {gameState.state == "answer" && (
          <HostAnswer
            gameCode={gameCode}
            players={playersJoined}
            currentAccused={currentAccused}
            questionNum={questionNum}
          ></HostAnswer>
        )}
        {gameState.state == "rebuttal" && (
          <HostRebuttal
            gameCode={gameCode}
            accusedName={currentAccused}
            currentVotes={currentVotes}
            players={playersJoined}
          ></HostRebuttal>
        )}
        {gameState.state == "results" && (
          <HostResults
            players={playersJoined}
            authorVotes={authorVotes}
          ></HostResults>
        )}
      </div>
      {<ExitButton onConfirm={endGame} />}
      {/* <div className="w-full h-4 absolute bottom-0 bg-black"></div> */}
    </>
  );
}

export default Game_Owner;
