import { io, Socket } from "socket.io-client";

const client: Socket = io("http://127.0.0.1:5000", {
  transports: ["websocket"],
});

export default client;
