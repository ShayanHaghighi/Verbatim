import React, { useState, useEffect } from "react";

interface CountdownTimerProps {
  timeLimit: number;
  onFinish: () => void;
}

function CountdownTimer({ timeLimit, onFinish }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<number>(timeLimit);

  useEffect(() => {
    if (timeLeft <= 0) {
      onFinish(); // Notify parent that countdown is finished
      return;
    }

    // Set up an interval to count down every second
    const timerId = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    // Clean up interval on component unmount or if timeLeft changes
    return () => clearInterval(timerId);
  }, [timeLeft, onFinish]);

  function formatTime(timeLeft: number) {
    let secondsLeft = timeLeft % 60;
    let minutesLeft = Math.floor(timeLeft / 60);
    return `${String(minutesLeft).padStart(2, "0")}:${String(secondsLeft).padStart(2, "0")}`;
  }

  return (
    <div>
      <h2 className={`${timeLeft < 5 && "text-red-400"}`}>
        {formatTime(timeLeft)}
      </h2>
    </div>
  );
}

export default CountdownTimer;
