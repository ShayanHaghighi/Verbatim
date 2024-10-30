declare module "animated-number-react" {
  import React from "react";

  interface AnimatedNumberProps {
    value: number;
    formatValue?: (value: number) => string | number;
    duration?: number;
    delay?: number;
    easing?: (t: number) => number;
    style?: React.CSSProperties;
    className?: string;
  }

  const AnimatedNumber: React.FC<AnimatedNumberProps>;
  export default AnimatedNumber;
}
