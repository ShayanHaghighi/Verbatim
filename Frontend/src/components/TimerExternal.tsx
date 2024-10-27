import React, { useState, useEffect } from "react";

interface CountdownTimerExternalProps {
  onFinish: () => void;
  timeLeft: number;
  setTimeLeft: React.Dispatch<React.SetStateAction<number>>;
}

function CountdownTimerExternal({
  onFinish,
  timeLeft,
  setTimeLeft,
}: CountdownTimerExternalProps) {
  useEffect(() => {
    if (timeLeft <= 0) {
      onFinish(); // Notify parent that countdown is finished
      return;
    }

    // Set up an interval to count down every second
    const timerId = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 0.1);
    }, 100);

    // Clean up interval on component unmount or if timeLeft changes
    return () => clearInterval(timerId);
  }, [timeLeft, onFinish]);

  function formatTime(timeLeft: number) {
    let secondsLeft = Math.ceil(timeLeft % 60);
    let minutesLeft = Math.max(Math.floor(timeLeft / 60), 0);
    return `${String(minutesLeft).padStart(2, "0")}:${String(secondsLeft).padStart(2, "0")}`;
  }

  return (
    <div>
      <h2>{formatTime(timeLeft)}</h2>
    </div>
  );
}

export default CountdownTimerExternal;
