import { io, Socket } from "socket.io-client";
import { backendURL } from "../../constants";
import { useNavigate } from "react-router-dom";
import { navigateTo } from "../../utils/navigate";

const client: Socket = io(backendURL, {
  transports: ["websocket"],
});

export default client;

export function leaveGame() {
  client.emit("leave-game", {
    game_code: sessionStorage.getItem("game_code"),
    game_token: sessionStorage.getItem("game_token"),
  });
  navigateTo("/");
}

export function endGame() {
  client.emit("end-game", {
    game_code: sessionStorage.getItem("game_code"),
    game_token: sessionStorage.getItem("game_token"),
  });
  navigateTo("/");
  // TODO: show results?
}
