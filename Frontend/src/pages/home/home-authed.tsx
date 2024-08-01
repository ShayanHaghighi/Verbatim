import axios from "axios";
import { useEffect, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

import { TokenContext, SetTokenContext } from "../../App";

// TODO remove any typing
function LoggedInHome(props: any) {
  const [isLoading, setIsLoading] = useState(false);

  const token = useContext(TokenContext);
  const setToken = useContext(SetTokenContext);

  const navigate = useNavigate();

  useEffect(() => {
    if (!sessionStorage.getItem("token")) {
      navigate("/");
    }
    axios({
      method: "GET",
      // TODO: what endpoint do I want to query to test if access-token works?
      url: "/api/test",
      headers: {
        Authorization: "Bearer " + token,
      },
    })
      .then((response) => {
        response.data.access_token && setToken(response.data.access_token);
        return;
      })
      .catch((error) => {
        if (error.response) {
          if (error.response.status === 401) {
            navigate("/");
          }
          // TODO show this message to the user
          console.log(error.response.data.message);
          console.log(error.response);
        }
      });
  }, []);

  function logMeOut() {
    setIsLoading(true);
    axios({
      method: "POST",
      url: "/api/logout",
    })
      .then((response) => {
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
      <button onClick={logMeOut}>Logout</button>
      <p>logged in home page</p>
      <button onClick={() => navigate("/deck")}>Decks</button>
      <button onClick={() => navigate("/deck/create")}>Create Deck</button>
      <button onClick={() => navigate("/game/host")}>Host Game</button>
      <button onClick={() => navigate("/game/play")}>Join Game</button>
      {isLoading && <p>loading...</p>}
    </>
  );
}

export default LoggedInHome;
