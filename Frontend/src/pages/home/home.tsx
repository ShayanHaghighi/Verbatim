import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <>
      <button onClick={() => navigate("/login")}>Login</button>
      <button onClick={() => navigate("/signup")}>Sign Up</button>
      <button onClick={() => navigate("/game/play")}>Join Game</button>
    </>
  );
}

export default Home;
