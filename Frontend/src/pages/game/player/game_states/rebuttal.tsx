import { useState } from "react";
import client from "../../socket-connection";

export default function PlayerRebuttal({
  currentAccused,
  gameCode,
  currentScore,
  myName,
}: {
  currentAccused: string | null;
  gameCode: string;
  currentScore: string | null;
  myName: string;
}) {
  currentAccused = "john";

  const [myVote, setMyVote] = useState<number>(1);
  const [hasVoted, setHasVoted] = useState(false);
  const amIAccused = myName == currentAccused;
  function castVote() {
    setHasVoted(true);
    client.emit("rebuttal-vote", {
      score: myVote,
      game_code: sessionStorage.getItem("game_code"),
      game_token: sessionStorage.getItem("game_token"),
    });
  }

  return (
    <>
      {amIAccused ? (
        <div>you're being accused mate</div>
      ) : (
        <>
          <div>{currentScore}</div>
          <span>chat how screwed is: {currentAccused}</span>
          {hasVoted ? (
            <div> You voted: {myVote}</div>
          ) : (
            <>
              <input
                type="range"
                step={1}
                min={1}
                max={6}
                value={myVote}
                onChange={(value) => setMyVote(Number(value.target.value))}
              />
              <div>{myVote}</div>
              <button onClick={castVote}>submit answer</button>
            </>
          )}
        </>
      )}
    </>
  );
}
