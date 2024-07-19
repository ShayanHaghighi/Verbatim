import IDeck from "./deck-model";
import IAuthor from "./author-model";

interface IQuote {
  id: number;
  text: string;
  date_created: Date;
  deck?: IDeck | null;
  author?: IAuthor | null;
}

export default IQuote;
