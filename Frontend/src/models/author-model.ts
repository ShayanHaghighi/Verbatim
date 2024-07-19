import IQuote from "./quote-model";
import IDeck from "./deck-model";

interface IAuthor {
  id: number;
  name: string;
  quotes?: IQuote[] | null;
  deck?: IDeck | null;
}

export default IAuthor;
