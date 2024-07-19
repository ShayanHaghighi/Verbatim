import { useNavigate } from "react-router-dom";
import { useState } from "react";
import UnLoggedInHome from "./home-unauth";
import LoggedInHome from "./home-auth";

function Home(props: any) {
  const navigate = useNavigate();
  // const [isAuthenticated, setAuthenticated] = useState(false);
  const isAuthenticated = !!sessionStorage.getItem("token");

  // setAuthenticated(!!sessionStorage.getItem("token"));

  return (
    <>
      {isAuthenticated ? (
        <LoggedInHome removeToken={props.removeToken} />
      ) : (
        <UnLoggedInHome />
      )}
    </>
  );
}

export default Home;
