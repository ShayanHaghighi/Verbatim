import IQuote from "./quote-model";
import IAuthor from "./author-model";

interface IDeck {
  id: number;
  deck_name: string;
  owner_id: number;
  quotes?: IQuote[] | null;
  authors?: IAuthor[] | null;
}

export default IDeck;
