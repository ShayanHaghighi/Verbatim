import IDeck from "../../models/deck-model";

export default function DeckComponent({ deck }: { deck: IDeck }) {
  //   console.log(deck.quotes);
  return (
    <li key={deck.id}>
      <h1>{deck.deck_name}</h1>
      <ul>
        {deck.quotes ? (
          deck.quotes.map((quote) => (
            <li key={quote.id}>
              <div>{quote.quote_text}</div>
              <div>{quote.author?.author_name}</div>
            </li>
          ))
        ) : (
          <li>no quotes found</li>
        )}
      </ul>
    </li>
  );
}
