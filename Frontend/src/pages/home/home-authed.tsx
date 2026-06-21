import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Loader from "../../components/loading";

// TODO remove any typing
function LoggedInHome(props: any) {
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (!sessionStorage.getItem("token")) {
      navigate("/");
    }
  }, []);


  return (
    <>
      <button className="bg-white" onClick={() => navigate("/deck")}>
        View Quotes
      </button>
      <button className="bg-white" onClick={() => navigate("/game/play")}>
        Join Game
      </button>
      <button onClick={() => navigate("/game/host")}>Host Game</button>
      {isLoading && <Loader />}
    </>
  );
}

export default LoggedInHome;
