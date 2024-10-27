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
  const [myVote, setMyVote] = useState<number | null>(null);
  const amIAccused = myName == currentAccused;
  console.log(currentScore);
  function castVote(score: number) {
    setMyVote(score);
    client.emit("rebuttal-vote", {
      score: score,
      game_code: gameCode,
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
          {myVote ? (
            <div> You voted: {myVote}</div>
          ) : (
            <>
              <button
                onClick={() => {
                  castVote(1);
                }}
              >
                Vote 1
              </button>
              <button
                onClick={() => {
                  castVote(2);
                }}
              >
                Vote 2
              </button>
            </>
          )}
        </>
      )}
    </>
  );
}
