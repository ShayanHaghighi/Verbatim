import { useState, ChangeEvent, FormEvent, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { TokenContext } from "../../App";

interface FormData {
  deck_name: string;
  owner_id: string;
}

function Create_Quote() {
  const token = useContext(TokenContext);

  const [formData, setFormData] = useState<FormData>({
    deck_name: "",
    owner_id: "",
  });

  const navigate = useNavigate();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  // function that sends a http request to the backend
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formData.deck_name !== "" && formData.owner_id !== "") {
      axios({
        method: "POST",
        url: "/deck",
        headers: {
          Authorization: "Bearer " + token,
        },
        data: {
          deck_name: formData.deck_name,
          owner_id: formData.owner_id,
        },
      })
        .then((response) => {
          navigate("/deck");
        })
        .catch((error) => {
          if (error.response) {
            // TODO show this message to the user
            console.log(error.response.data.message);
            console.log(error.response);
          }
        });
    } else {
      // TODO Change to send user valid warning
      console.log("please enter deck name/owner id");
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
        <label htmlFor="owner_id">Onwer Id:</label>
        <input
          id="owner_id"
          name="owner_id"
          value={formData.owner_id}
          onChange={handleChange}
        />
      </div>
      <button type="submit">Create Deck</button>
    </form>
  );
}

export default Create_Quote;
