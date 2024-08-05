import { useParams } from "react-router-dom";
import IDeck from "../../models/deck-model";

export default function DeckView() {
  const { id } = useParams();
  console.log(id);
  return <></>;
}
