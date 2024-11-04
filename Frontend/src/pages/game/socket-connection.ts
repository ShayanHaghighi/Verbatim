import { io, Socket } from "socket.io-client";
import { backendURL } from "../../constants";
import { useNavigate } from "react-router-dom";

const client: Socket = io(backendURL, {
  transports: ["websocket"],
});

export default client;

export function leaveGame(){
  const navigate = useNavigate();
  client.emit("leave-game", {
    game_code: sessionStorage.getItem("game_code"),
    game_token: sessionStorage.getItem("game_token"),
  });
  navigate("/");
}

export function endGame() {
  client.emit("end-game", {
    game_code: sessionStorage.getItem("game_code"),
    game_token: sessionStorage.getItem("game_token"),
  });
}