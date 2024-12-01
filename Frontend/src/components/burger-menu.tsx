import { useEffect, useState } from "react";

export default function BurgerMenu({ burgerOpen, setBurgerOpen }: any) {
  const [bigScreen, setMatches] = useState(
    window.matchMedia("(min-width: 768px)").matches
  );
  useEffect(() => {
    window
      .matchMedia("(min-width: 768px)")
      .addEventListener("change", (e) => setMatches(e.matches));
  }, []);
  return (
    <>
      <div
        className={`relative flex justify-start ${bigScreen && !(location.pathname == "/game/play" || location.pathname == "/game/host") ? "hidden" : ""}`}
      >
        {/* <MdMenu className="text-white mr-4 w-full max-w-14 h-auto " /> */}
        <button
          onClick={() => setBurgerOpen(!burgerOpen)}
          className="group size-10 height-sm:size-20 rounded-lg border-2 border-white hover:border-accent2 hover:bg-white transition-all duration-300"
        >
          <div className="flex flex-col items-center">
            <span
              className={`h-1 my-0.5 height-sm:my-1 w-5 height-sm:w-9 rounded-full bg-white group-hover:bg-accent2 ${burgerOpen && "rotate-45 translate-y-3"} transition-all duration-300`}
            ></span>
            <span
              className={`h-1 my-0.5 height-sm:my-1 w-5 height-sm:w-9 rounded-full bg-white group-hover:bg-accent2 ${burgerOpen && "rotate-45"} transition-all duration-300`}
            ></span>
            <span
              className={`h-1 my-0.5 height-sm:my-1 w-5 height-sm:w-9 rounded-full bg-white group-hover:bg-accent2 ${burgerOpen && "-rotate-45 -translate-y-3"} transition-all duration-300`}
            ></span>
          </div>
        </button>
      </div>
    </>
  );
}
