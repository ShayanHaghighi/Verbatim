import "../global.css";
import { useLocation, useNavigate } from "react-router-dom";
import ThemeToggle from "./theme-toggle";
import { useEffect, useState } from "react";
import { MdMenu } from "react-icons/md";
import { GoHome } from "react-icons/go";
import { FaGamepad, FaQuestion } from "react-icons/fa";
import { CiLogin } from "react-icons/ci";
import BurgerMenu from "./burger-menu";
import { RiQuestionMark } from "react-icons/ri";
import { TbCards } from "react-icons/tb";
import { GiPodium } from "react-icons/gi";

export default function Navbar(props: any) {
  const navigate = useNavigate();
  const [matches, setMatches] = useState(
    window.matchMedia("(min-width: 768px)").matches
  );
  useEffect(() => {
    window
      .matchMedia("(min-width: 768px)")
      .addEventListener("change", (e) => setMatches(e.matches));
  }, []);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>();
  const [burgerOpen, setBurgerOpen] = useState(false);
  useEffect(() => {
    setIsAuthenticated(!!sessionStorage.getItem("token"));
  });
  const location = useLocation();

  return (
    <>
      <div className="flex flex-col h-full w-full">
        <div className="bg-darkpurple flex flex-row p-4 justify-between items-center">
          <div className="flex flex-row">
            <BurgerMenu burgerOpen={burgerOpen} setBurgerOpen={setBurgerOpen} />
            <div className="w-4"></div>
            <ThemeToggle />
          </div>

          <div
            onClick={() => navigate("/")}
            className="text-white text-2xl font-bold"
          >
            Verbatim
          </div>
        </div>
        <div className="relative flex flex-row flex-1 overflow-y-auto">
          {true && (
            <div
              className={`z-10 absolute ${location.pathname == "/game/play" && (burgerOpen ? "md:absolute" : "hidden")} md:static h-full flex flex-col bg-[#210067] items-center justify-center ${burgerOpen ? "w-[100vw] left-0" : "w-[0vw] left-[-100px]"} transition-all duration-500 md:w-1/4 font-josefin`}
            >
              <div className="flex flex-row relative text-white items-center justify-center w-full h-max md:h-1/2">
                <div className="flex flex-col w-fit px-6 xl:px-10 py-4 text-lg lg:text-2xl">
                  <div className="text-[#B592FF] font-bold">
                    <RiQuestionMark className="absolute -z-10 top-0 right-0 rotate-[20deg] size-3/4 text-[#29096B]" />
                    <RiQuestionMark className="absolute -z-10 bottom-10 left-0 -rotate-[35deg] size-1/4 text-[#29096B]" />
                    <div className="absolute -z-10 bottom-5 right-10 rotate-[20deg] size-12 bg-[#29096B]" />
                    <div className="space-y-10">
                      <div
                        onClick={() => {
                          if (sessionStorage.getItem("token")) {
                            navigate("/home");
                          } else {
                            navigate("/");
                          }
                          setBurgerOpen(false);
                        }}
                        className="flex flex-row items-center px-10 py-4 cursor-pointer"
                      >
                        <GoHome className="mr-6 w-6 h-auto" />
                        <span
                          className={`${location.pathname == "/home" && "brightness-150"}`}
                        >
                          Home
                        </span>
                      </div>
                      <div
                        onClick={() => {
                          navigate("/game/play");
                          setBurgerOpen(false);
                        }}
                        className="flex flex-row items-center px-10 py-4 cursor-pointer"
                      >
                        <FaGamepad className="mr-6 w-6 h-auto" />
                        <span
                          className={`${location.pathname == "/game/play" && "brightness-150"}`}
                        >
                          Join Game
                        </span>
                      </div>
                    </div>
                    <div
                      id="loggedInIcons"
                      className={`mt-10 space-y-10 ${!isAuthenticated && "hidden"}`}
                    >
                      <div
                        onClick={() => {
                          navigate("/game/host");
                          setBurgerOpen(false);
                        }}
                        className="flex flex-row items-center px-10 py-4 cursor-pointer"
                      >
                        <GiPodium className="mr-6 w-6 h-auto" />
                        <span
                          className={`${location.pathname == "/game/host" && "brightness-150"}`}
                        >
                          Host Game
                        </span>
                      </div>

                      <div
                        onClick={() => {
                          navigate("/deck");
                          setBurgerOpen(false);
                        }}
                        className="flex flex-row items-center px-10 py-4 cursor-pointer"
                      >
                        <TbCards className="mr-6 w-6 h-auto" />
                        <span
                          className={`${location.pathname == "/deck" && "brightness-150"}`}
                        >
                          Decks
                        </span>
                      </div>
                    </div>
                    <div
                      id="loggedOutIcons"
                      className={`pt-10 ${isAuthenticated && "hidden"}`}
                    >
                      {!(
                        location.pathname == "/login" ||
                        location.pathname == "/signup"
                      ) && (
                        <div
                          onClick={() => {
                            navigate("/login");
                            setBurgerOpen(false);
                          }}
                          className="flex flex-row  items-center px-10 py-4 cursor-pointer"
                        >
                          <CiLogin className="mr-6 w-6 h-auto" />
                          <span>Login</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              {(location.pathname == "/login" ||
                location.pathname == "/signup") && (
                <div className="flex flex-col items-center justify-evenly py-10 text-center bg-[#29096B] text-white h-full w-full">
                  <div className="font-bold px-2 text-[200%]">
                    Welcome back!
                  </div>
                  <div className="text-sm md:text-lg font-light px-4">
                    got a new quote you want to add?
                  </div>
                  {location.pathname == "/login" && (
                    <button
                      onClick={() => {
                        navigate("/signup");
                      }}
                      className="btn-line"
                    >
                      SIGN UP
                    </button>
                  )}
                  {location.pathname == "/signup" && (
                    <button
                      onClick={() => {
                        navigate("/login");
                      }}
                      className="btn-line"
                    >
                      LOG IN
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
          {props.children}
        </div>
      </div>
    </>
  );
}
