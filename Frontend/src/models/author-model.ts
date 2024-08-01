import IQuote from "./quote-model";

interface IAuthor {
  id: number;
  author_name: string;
  quotes?: IQuote[] | null;
  deck_id: number | null;
}

export default IAuthor;
