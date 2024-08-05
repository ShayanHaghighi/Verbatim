import client from "../../socket-connection";
import { Question, Vote } from "../../game-models";

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
  function nextQuestion() {
    client.emit("rebuttal-end", {
      game_code: gameCode,
      game_token: sessionStorage.getItem("game_token"),
    });
  }
  return (
    <>
      {question?.answer} said: {question?.question}
      <div>Votes</div>
      {currentVotes.map((vote) => (
        <span>
          {vote.voteCaster} : {vote.score}
        </span>
      ))}
      <button onClick={nextQuestion}>Next Question</button>
    </>
  );
}
