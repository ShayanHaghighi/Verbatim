import React, { useEffect, useState } from "react";
import { useSpring, animated } from "@react-spring/web";
import { expoOut } from "eases";

type AnimatedNumberProps = {
  from: number;
  to: number;
  duration?: number;
  delay?: number; // Add delay prop
};

const AnimatedNumber: React.FC<AnimatedNumberProps> = ({
  from,
  to,
  duration = 1000,
  delay = 1000,
}) => {
  const [animatedValue, setAnimatedValue] = useState(from); // Local state for animation

  const props = useSpring({
    from: { value: from },
    to: { value: animatedValue },
    config: {
      duration,
      easing: expoOut, // Custom ease-in-out function
      delay, // Set the delay here
    },
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedValue(to); // Update local state after the delay
    }, delay); // Set the delay

    return () => clearTimeout(timer); // Cleanup timer on unmount or delay change
  }, [to, delay]);

  return (
    <animated.span>{props.value.to((val) => val.toFixed(0))}</animated.span>
  );
};

export default AnimatedNumber;
