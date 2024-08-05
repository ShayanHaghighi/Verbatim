import client from "../../socket-connection";
import { Player, Question } from "../../game-models";

interface props {
  question: Question | null;
  game_code: string | null;
  players: Player[];
}

function Host_Question({ question, game_code, players }: props) {
  function endRound() {
    client.emit("question-finished", {
      game_code: game_code,
      game_token: sessionStorage.getItem("game_token"),
    });
  }
  return (
    <>
      {question?.question}
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
      </ul>
    </>
  );
}

export default Host_Question;
