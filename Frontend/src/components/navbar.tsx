import "../global.css";
import { useNavigate } from "react-router-dom";
import ThemeToggle from "./theme-toggle";

export default function Navbar() {
  const navigate = useNavigate();
  return (
    <>
      <div className="navbar-container">
        <div className="flex-1">
          <span
            onClick={() => navigate("/")}
            className="cursor-pointer text-white text-5xl ml-4 font-serif font-bold"
          >
            Verbatim
          </span>
        </div>

        <div className="flex-1 flex justify-center">
          <button className="btn-white " onClick={() => navigate("/game/play")}>
            Join Game
          </button>
        </div>

        <div className="flex-1 flex justify-end">
          <ThemeToggle />
          <button className="btn-white" onClick={() => navigate("/login")}>
            Login
          </button>
          <button className="btn-white" onClick={() => navigate("/signup")}>
            Sign Up
          </button>
        </div>
      </div>
    </>
  );
}
