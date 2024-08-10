import "../global.css";
import { useNavigate } from "react-router-dom";
import ThemeToggle from "./theme-toggle";
import { useEffect, useState } from "react";
import { MdMenu } from "react-icons/md";

export default function Navbar() {
  const navigate = useNavigate();
  const [matches, setMatches] = useState(
    window.matchMedia("(min-width: 768px)").matches
  );
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>();
  const [burgerOpen, setBurgerOpen] = useState(false);

  useEffect(() => {
    setIsAuthenticated(!!sessionStorage.getItem("token"));
  });
  useEffect(() => {
    window
      .matchMedia("(min-width: 768px)")
      .addEventListener("change", (e) => setMatches(e.matches));
  }, []);

  return (
    <>
      <div className="navbar-container">
        <div className="flex-1">
          <span
            onClick={() => navigate("/")}
            className="cursor-pointer text-white ml-4 font-serif font-bold"
            style={{
              fontSize: "2rem",
            }}
          >
            {matches ? "Verbatim" : "V"}
          </span>
        </div>

        <div className="flex-1 flex justify-center">
          <button className="btn-white " onClick={() => navigate("/game/play")}>
            Join Game
          </button>
        </div>

        <div className="flex-1 flex justify-end">
          <ThemeToggle />
          {isAuthenticated ? (
            <button
              onClick={() => {
                sessionStorage.removeItem("token");
                navigate("/");
              }}
              className="btn-black"
            >
              Logout
            </button>
          ) : (
            <>
              <button className="btn-black" onClick={() => navigate("/login")}>
                Login
              </button>
              <button
                className="btn-white hidden md:block"
                onClick={() => navigate("/signup")}
              >
                Sign Up
              </button>
            </>
          )}
        </div>
        <div className="relative flex-1 flex justify-end md:hidden">
          {/* <MdMenu className="text-white mr-4 w-full max-w-14 h-auto " /> */}
          <button
            onClick={() => setBurgerOpen(!burgerOpen)}
            className="group h-20 w-20 rounded-lg border-2 border-white hover:border-accent2 hover:bg-white transition-all duration-300"
          >
            <div className="flex flex-col items-center">
              <span
                className={`h-1 my-1 w-9 rounded-full bg-white group-hover:bg-accent2 ${burgerOpen && "rotate-45 translate-y-3"} transition-all duration-300`}
              ></span>
              <span
                className={`h-1 my-1 w-9 rounded-full bg-white group-hover:bg-accent2 ${burgerOpen && "rotate-45"} transition-all duration-300`}
              ></span>
              <span
                className={`h-1 my-1 w-9 rounded-full bg-white group-hover:bg-accent2 ${burgerOpen && "-rotate-45 -translate-y-3"} transition-all duration-300`}
              ></span>
            </div>
          </button>
          {
            <div
              className={`absolute top-[5.5rem] text-black flex flex-col justify-end text-end w-fit bg-white  transition-all duration-300`}
            >
              <div
                className={` ${burgerOpen ? "p-2 w-32 opacity-100" : "border-none h-0 opacity-0"} text-center border-gray border-0 border-b-2 border-l-2 transition-all duration-300`}
              >
                Item 1
              </div>
              <div
                className={` ${burgerOpen ? "p-2 w-32 opacity-100" : "border-none h-0 opacity-0"} text-center border-gray border-0 border-b-2 border-l-2 transition-all duration-300`}
              >
                Item 1
              </div>
              <div
                className={` ${burgerOpen ? "p-2 w-32 opacity-100 " : "h-0 border-none p-0 w-32 opacity-0"} border-gray border-0 border-b-2 border-l-2 transition-all duration-300 text-center`}
              >
                Item 1
              </div>
            </div>
          }
        </div>
      </div>
    </>
  );
}
