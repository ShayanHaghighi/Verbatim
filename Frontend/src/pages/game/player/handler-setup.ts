import client from "../socket-connection";

export function setUpHandlers({ setGameState, setCurrentAccused }: any) {
  client.once("connect", () => {
    console.log("Connected to server");
  });

  client.on("joined-game", (res) => {
    sessionStorage.setItem("game_token", res.game_token);
    console.log("joined game");
    setGameState({ state: "waiting" });
  });

  client.on("question-finished", (res) => {
    setGameState({ state: "answer" });
    setCurrentAccused(res.answer);
  });

  client.on("start-rebuttal", (res) => {
    setCurrentAccused(res.author_name);
    setGameState({ state: "rebuttal" });
  });

  client.on("user-error", (error) => {
    console.error("User error:", error);
  });

  client.on("disconnect", (reason) => {
    console.log("Disconnected from server:", reason);
  });
}
