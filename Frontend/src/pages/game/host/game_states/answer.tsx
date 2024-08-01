import client from "../../socket-connection";
import { Player } from "../game-host";

export default function HostAnswer({
  gameCode,
  players,
}: {
  gameCode: string | null;
  players: Player[];
}) {
  function startRebuttal() {
    client.emit("start-rebuttal", {
      game_code: gameCode,
      game_token: sessionStorage.getItem("game_token"),
    });
  }
  return (
    <>
      <table>
        <tr>
          <th>Name</th>
          <th>Score</th>
        </tr>
        <tbody>
          {players.map((player: Player) => (
            <tr>
              <td>{player.name}</td>
              <td>{player.score}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={startRebuttal}>move to rebuttal</button>
    </>
  );
}
