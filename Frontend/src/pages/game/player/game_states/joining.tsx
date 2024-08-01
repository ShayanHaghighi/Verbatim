import { ChangeEvent, FormEvent, useEffect } from "react";
import client from "../../socket-connection";

interface FormData {
  gameCode: string;
  name: string;
}

interface GameJoinProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
}

function Player_Join({ formData, setFormData }: GameJoinProps) {
  useEffect(() => {
    client.on("game-info", (data) => {
      console.log("game-info recieved");
      if (data.password_needed) {
        console.log("password needed");
        // TODO add user input for password
      } else {
        console.log("no password needed");
        console.log(formData);
        join_game(formData.name, formData.gameCode);
      }
    });
  }, [formData]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    client.emit("game-info-req", { game_code: formData.gameCode });
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="gameCode">Game ID:</label>
          <input
            type="text"
            id="gameCode"
            name="gameCode"
            value={formData.gameCode}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
        </div>
        <button type="submit">Join Game</button>
      </form>
    </>
  );
}

export default Player_Join;

function join_game(name: string, gameCode: string) {
  console.log("sending " + name + ", " + gameCode);
  client.emit("join-game", {
    name: name,
    game_code: gameCode,
  });
}
