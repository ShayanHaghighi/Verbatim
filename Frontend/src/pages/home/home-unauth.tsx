import { useNavigate } from "react-router-dom";

function UnLoggedInHome() {
  const navigate = useNavigate();

  return (
    <>
      <button onClick={() => navigate("/login")}>Login</button>
      <button onClick={() => navigate("/signup")}>Sign Up</button>
    </>
  );
}

export default UnLoggedInHome;
