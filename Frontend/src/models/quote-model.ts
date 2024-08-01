import IAuthor from "./author-model";

interface IQuote {
  id: number;
  quote_text: string;
  date_created: Date;
  deck_id: number | null;
  author: IAuthor | null; // in backend, can be null
}

export default IQuote;
