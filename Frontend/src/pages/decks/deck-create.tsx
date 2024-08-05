import { useState, ChangeEvent, FormEvent } from "react";
import deckHelper from "../../service/deck-helper";

interface FormData {
  deck_name: string;
}

function Create_Deck() {
  const { createDeck } = deckHelper();

  const [formData, setFormData] = useState<FormData>({
    deck_name: "",
  });

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
      createDeck(formData.deck_name);
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
