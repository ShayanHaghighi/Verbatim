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

  function logMeOut() {
    setIsLoading(true);
    axios({
      method: "POST",
      url: "/api/logout",
    })
      .then(() => {
        props.removeToken();
        navigate("/");
      })
      .catch((error) => {
        if (error.response) {
          console.log(error.response);
          console.log(error.response.status);
          console.log(error.response.headers);
        }
      });
  }

  return (
    <>
      <button className="bg-black" onClick={() => navigate("/deck")}>
        Decks
      </button>
      <button onClick={() => navigate("/deck/create")}>Create Deck</button>
      <button onClick={() => navigate("/game/host")}>Host Game</button>
      <button
        onClick={() => {
          navigate("/");
          logMeOut();
        }}
      >
        Logout
      </button>
      {isLoading && <Loader />}
    </>
  );
}

export default LoggedInHome;
