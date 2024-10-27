import React, { useState } from "react";

interface GameCodeInputProps {
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  isActive: boolean;
}
interface FormData {
  gameCode: string;
  name: string;
}
function GameCodeInput({ setFormData, isActive }: GameCodeInputProps) {
  const [code, setCode] = useState<string[]>(Array(6).fill(""));

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const value = e.target.value.toUpperCase();
    if (/^[A-Z0-9]$/.test(value)) {
      // Only accept alphanumeric characters
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);
      //   setFormData(newCode.join(""));
      setFormData((prevFormData) => ({
        ...prevFormData,
        ["gameCode"]: newCode.join(""),
      }));

      // Move to the next input
      if (index < 5 && value) {
        const nextInput = document.getElementById(`code-input-${index + 1}`);
        nextInput?.focus();
      }
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace") {
      const newCode = [...code];
      if (!code[index] && index > 0) {
        // Move to previous input if current input is empty
        newCode[index - 1] = "";
        setCode(newCode);
        setFormData((prevData) => ({
          ...prevData,
          gameCode: newCode.join(""),
        }));
        const prevInput = document.getElementById(`code-input-${index - 1}`);
        prevInput?.focus();
      } else {
        // Clear the current input if not empty
        newCode[index] = "";
        setCode(newCode);
        setFormData((prevData) => ({
          ...prevData,
          gameCode: newCode.join(""),
        }));
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("Text").toUpperCase();

    if (/^[A-Z0-9]{0,6}$/.test(pasteData)) {
      // Ensure exactly 6 alphanumeric characters
      const newCode = pasteData.split("");
      setCode(newCode);
      setFormData((prevData) => ({
        ...prevData,
        gameCode: newCode.join(""),
      }));
      const newInput = document.getElementById(
        `code-input-${Math.min(5, pasteData.length)}`
      );
      newInput?.focus();
    }
  };

  return (
    <>
      <div className="flex space-x-1 sm:space-x-2">
        {code.map((char, index) => (
          <input
            key={index}
            id={`code-input-${index}`}
            type="text"
            maxLength={1}
            value={char}
            onChange={(e) => handleChange(e, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            onPaste={handlePaste}
            className={`w-full h-14 sm:h-20 text-center border rounded-md bg-blk text-wht text-[1.5em] sm:text-[3em]`}
          />
        ))}
      </div>
    </>
  );
}

export default GameCodeInput;
