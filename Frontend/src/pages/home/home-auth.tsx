import axios from "axios";
import { useNavigate } from "react-router-dom";

// TODO remove any typing
function LoggedInHome(props: any) {
  const navigate = useNavigate();
  function logMeOut() {
    axios({
      method: "POST",
      url: "/logout",
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
    </>
  );
}

export default LoggedInHome;
