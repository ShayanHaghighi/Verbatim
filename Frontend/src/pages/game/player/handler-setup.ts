import client from "../socket-connection";

export function setUpHandlers({ setGameState }: any) {
  client.once("connect", () => {
    console.log("Connected to server");
  });

  client.on("joined-game", (res) => {
    sessionStorage.setItem("game_token", res.game_token);
    console.log("joined game");
    setGameState({ state: "waiting" });
  });


  client.on("user-error", (error) => {
    console.error("User error:", error);
  });

  client.on("disconnect", (reason) => {
    console.log("Disconnected from server:", reason);
  });
}
