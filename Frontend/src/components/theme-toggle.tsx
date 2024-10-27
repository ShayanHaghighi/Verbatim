import { useEffect, useState } from "react";
import { FaSun, FaMoon } from "react-icons/fa";

const ThemeToggle = () => {
  const [isDark, setIsDark] = useState(
    sessionStorage.getItem("theme") == "dark"
  );

  useEffect(() => {
    const root = document.documentElement;

    if (isDark) {
      root.dataset.theme = "dark";
      sessionStorage.setItem("theme", "dark");
    } else {
      root.dataset.theme = "light";
      sessionStorage.setItem("theme", "light");
    }
  }, [isDark]);
  return (
    <label className="relative inline-flex items-center cursor-pointer ">
      <input
        type="checkbox"
        className="sr-only peer"
        onChange={() => setIsDark(!isDark)}
      />
      <div className="w-24 h-12 bg-purple rounded-full peer-checked:bg-violet-400 transition duration-300 ease-in-out"></div>
      <span
        className="absolute ml-1.5 w-10 h-10 bg-wht  rounded-full 
        shadow-md peer-checked:translate-x-11 transition-transform duration-300 ease-in-out flex items-center justify-center"
      >
        {isDark ? (
          <FaMoon className="text-blue-500 peer-checked:block w-7 h-auto" />
        ) : (
          <FaSun className="text-yellow-500 peer-checked:hidden w-7 h-auto" />
        )}
      </span>
    </label>
  );
};

export default ThemeToggle;
