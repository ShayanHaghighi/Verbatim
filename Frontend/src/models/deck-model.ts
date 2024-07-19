interface IDeck {
  id: number;
  deck_name: string;
  owner_id: number;
  quotes?: any | null;
  authors?: any | null;
}

export default IDeck;
