import { Player } from "../game-host";

export default function HostResults({
  authorVotes,
  players,
}: {
  authorVotes: any;
  players: Player[];
}) {
  const votes: any = [];
  for (const [key, value] of Object.entries(authorVotes)) {
    {
      votes.push({ author: key, score: value });
    }
  }
  return (
    <>
      <div>
        <table>
          <tr>
            <th>Player</th>
            <th>Score</th>
          </tr>
          {players.map((player: Player) => (
            <>
              <tr>
                <td>{player.name}</td>
                <td>{player.score}</td>
              </tr>
            </>
          ))}
        </table>
      </div>
      <div>
        <table>
          <tr>
            <th>Author</th>
            <th>Score</th>
          </tr>
          {votes.map((vote: any) => (
            <>
              <tr>
                <td>{vote.author}</td>
                <td>{vote.score}</td>
              </tr>
            </>
          ))}
        </table>
      </div>
    </>
  );
}
