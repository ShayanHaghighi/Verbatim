import { io, Socket } from "socket.io-client";
import { backendURL } from "../../constants";

const client: Socket = io(backendURL, {
  transports: ["websocket"],
});

export default client;
