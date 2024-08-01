import { useState, ChangeEvent, FormEvent, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { TokenContext, SetTokenContext } from "../../App";

interface FormData {
  deck_name: string;
}

function Create_Deck() {
  const token = useContext(TokenContext);
  const setToken = useContext(SetTokenContext);

  const [formData, setFormData] = useState<FormData>({
    deck_name: "",
  });

  const navigate = useNavigate();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formData.deck_name !== "") {
      axios({
        method: "POST",
        url: "/api/deck",
        headers: {
          Authorization: "Bearer " + token,
        },
        data: {
          deck_name: formData.deck_name,
        },
      })
        .then((response) => {
          response.data.access_token && setToken(response.data.access_token);
          navigate("/deck");
        })
        .catch((error) => {
          if (error.response) {
            if (error.response.status === 401) {
              navigate("/login");
              return;
            }
            // TODO show this message to the user
            console.log(error.response.data.message);
            console.log(error.response);
          }
        });
    } else {
      // TODO Change to send user valid warning
      console.log("please enter deck name");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="deck_name">Deck Name:</label>
        <input
          id="deck_name"
          name="deck_name"
          value={formData.deck_name}
          onChange={handleChange}
        />
      </div>
      <button type="submit">Create Deck</button>
    </form>
  );
}

export default Create_Deck;
