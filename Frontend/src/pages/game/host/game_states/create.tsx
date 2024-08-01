import { ChangeEvent, FormEvent, useContext, useEffect, useState } from "react";
import { Player } from "../game-host";
import axios from "axios";
import { TokenContext, SetTokenContext } from "../../../../App";
import { useNavigate } from "react-router-dom";
import Dropdown from "../../../../components/dropdown";

interface FormData {
  numQuestions: number;
  password: string;
  deck: any;
}
interface GameOwnerProps {
  create_game: (pass: string) => void;
  start_game: () => void;
  gameCode: string | null;
  playersJoined: Player[];
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
}

function Host_Create_Game({
  create_game,
  start_game,
  gameCode,
  playersJoined,
  formData,
  setFormData,
}: GameOwnerProps) {
  const [isCreating, setIsCreating] = useState(true);
  const [usingPass, setUsingPass] = useState(false);
  const [decks, setDecks] = useState([]);

  const token = useContext(TokenContext);
  const setToken = useContext(SetTokenContext);

  const navigate = useNavigate();

  useEffect(() => {
    axios({
      method: "GET",
      url: "/api/deck",
      headers: {
        Authorization: "Bearer " + token,
      },
    })
      .then((response) => {
        response.data.access_token && setToken(response.data.access_token);
        setDecks(response.data.decks);
        setFormData((prevData) => ({
          ...prevData,
          deck: response.data.decks[0],
        }));
      })
      .catch((error) => {
        if (error.response) {
          if (error.response.status === 401) {
            console.log(error.response);

            navigate("/login");
            return;
          }
          // TODO show this message to the user
          console.log(error.response.data.message);
          console.log(error.response);
        }
      });
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    const password = usingPass ? formData.password : "";
    create_game(password);
  };

  const listPlayers = playersJoined.map((player) => (
    <li key={player.name}>{player.name}</li>
  ));

  return (
    <>
      <form>
        <div>
          <label htmlFor="numQuestions">Number Questions</label>
          <input
            type="number"
            id="numQuestions"
            name="numQuestions"
            value={formData.numQuestions}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="usingPassword">Password Required?</label>
          <input
            type="checkbox"
            id="usingPassword"
            name="usingPassword"
            checked={usingPass}
            onChange={() => {
              setUsingPass(!usingPass);
            }}
          />
        </div>
        {usingPass && (
          <div>
            <label htmlFor="password">Password:</label>
            <input
              type="text"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>
        )}
        <Dropdown
          list={decks}
          currElement={formData.deck}
          setCurrElement={(deck) =>
            setFormData((prevData) => ({ ...prevData, deck: deck }))
          }
          displayFunc={(deck) => deck.deck_name}
        ></Dropdown>
        {/* <button type="submit">Create Game</button> */}
      </form>
      <button onClick={handleSubmit}>Create Game</button>
      <button onClick={start_game}>Start Game</button>

      <p>{gameCode}</p>
      <ul>{listPlayers}</ul>
    </>
  );
}

export default Host_Create_Game;
