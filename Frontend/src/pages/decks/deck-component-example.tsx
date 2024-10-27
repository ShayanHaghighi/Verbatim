import { IDeckShort } from "../../models/deck-model";

export default function DeckComponent({ deck }: { deck: IDeckShort }) {
  return (
    <>
      <div>deck name: {deck.deck_name}</div>
    </>
  );
}
