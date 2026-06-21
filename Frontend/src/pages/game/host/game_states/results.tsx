import { useState, useEffect } from "react";
import Confetti from "react-confetti";
import { Player } from "../../game-models";
import { endGame } from "../../socket-connection";
import "./results.css";
import ExitButton from "../../../../components/game/exit-button";

// Add this comment for the user:
// Make sure to install react-confetti: npm install react-confetti

export default function HostResults({
  authorVotes,
  // players,
}: {
  authorVotes: any;
  // players: Player[];
}) {
    let players = [
        {
            name: "Barry",
            score: 300,
            hasAnswered: false,
            scoreIncrease: 20,
        },
        {
            name: "Bobby",
            score: 200,
            hasAnswered: false,
            scoreIncrease: 20,
        },
        {
            name: "Billy",
            score: 100,
            hasAnswered: false,
            scoreIncrease: 20,
        }
    ]
  const [showScores, setShowScores] = useState(false);
  const [showAllPlayerScores, setShowAllPlayerScores] = useState(false);
  const [showPodium, setShowPodium] = useState({
    third: false,
    second: false,
    first: false,
  });
  const [runConfetti, setRunConfetti] = useState(false);

  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);
  const topThree = {
    first: sortedPlayers[0],
    second: sortedPlayers[1],
    third: sortedPlayers[2],
  };

  useEffect(() => {
    const timers = [
      setTimeout(() => setShowPodium((s) => ({ ...s, third: true })), 500),
      setTimeout(() => setShowPodium((s) => ({ ...s, second: true })), 1500),
      setTimeout(() => {
        setShowPodium((s) => ({ ...s, first: true }));
        setRunConfetti(true);
      }, 3500),
    ];
    return () => timers.forEach((timer) => clearTimeout(timer));
  }, []);

  const votes: any = [];
  for (const [key, value] of Object.entries(authorVotes)) {
    votes.push({ author: key, score: value });
  }

  const podiumData = [
    {
      player: topThree.second,
      place: "second",
      show: showPodium.second,
    },
    {
      player: topThree.first,
      place: "first",
      show: showPodium.first,
    },
    {
      player: topThree.third,
      place: "third",
      show: showPodium.third,
    },
  ];

  return (
    <div className="results-container">
      {runConfetti && <Confetti recycle={false} />}
      <div className="leaderboard">
        <h1>Podium</h1>
        <div className="podium">
          {podiumData.map(({ player, place, show }) =>
            player && show ? (
              <div key={place} className={`podium-place ${place}`}>
                <div className="player-info">
                  <img src={`/author_images/${player.name}.png`} className="player-avatar" alt="abc"></img>
                  <div className="player-name">{player.name}</div>
                  <div className="player-score">{player.score}</div>
                </div>
                <div className="podium-top"></div>
                <div className="podium-front"></div>
              </div>
            ) : (
              // Empty div to maintain space
              <div style={{ width: 160 }}></div>
            )
          )}
        </div>
        <button className="toggle-button" onClick={() => setShowScores(true)}>
          View Author Scores
        </button>
        <button className="toggle-button" onClick={() => setShowAllPlayerScores(true)}>
          View All Player Scores
        </button>
      </div>

      <div className={`scores-view ${showScores ? "visible" : ""}`}>
        <h1>Author Scores</h1>
        <table className="scores-table">
          <thead>
            <tr>
              <th>Author</th>
              <th>Score</th>
            </tr>
          </thead>
          <tbody>
            {votes.map((vote: any) => (
              <tr key={vote.author}>
                <td>{vote.author}</td>
                <td>{vote.score}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <button className="toggle-button" onClick={() => setShowScores(false)}>
          Back to Podium
        </button>
      </div>

      <div className={`scores-view ${showAllPlayerScores ? "visible" : ""}`}>
        <h1>All Player Scores</h1>
        <table className="scores-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Player</th>
              <th>Score</th>
            </tr>
          </thead>
          <tbody>
            {sortedPlayers.map((player: Player, index: number) => (
              <tr key={player.name}>
                <td>{index + 1}</td>
                <td>{player.name}</td>
                <td>{player.score}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <button className="toggle-button" onClick={() => setShowAllPlayerScores(false)}>
          Back to Podium
        </button>
      </div>
    </div>
  );
}

