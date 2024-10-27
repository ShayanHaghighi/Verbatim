import { useState } from "react";
import { IoIosArrowDropdownCircle } from "react-icons/io";

import "./styles/dropdown.css";

export default function Dropdown({
  list,
  currElement,
  setCurrElement,
  displayFunc,
}: {
  list: any[];
  currElement: any;
  setCurrElement: React.Dispatch<any>;
  displayFunc: (obj: any) => string;
}) {
  const [showing, setShowing] = useState(false);
  function toggleDropdown() {
    setShowing(!showing);
  }
  return (
    <>
      <div className="container w-full">
        <div className="head w-full" onClick={toggleDropdown}>
          <div>{currElement != null && displayFunc(currElement)}</div>
          <IoIosArrowDropdownCircle
            className={`dropdown-icon ${showing ? "rotated" : ""}`}
          />
        </div>
        <div className={`content ${showing ? "showing" : ""}`}>
          {showing &&
            list.map((elem) => (
              <div
                key={displayFunc(elem)}
                className="option"
                onClick={() => {
                  setCurrElement(elem);
                  toggleDropdown();
                }}
              >
                {displayFunc(elem)}
              </div>
            ))}
        </div>
      </div>
    </>
  );
}
