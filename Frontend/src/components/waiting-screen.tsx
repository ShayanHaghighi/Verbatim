import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Confetti from "react-confetti";
import { FaQuoteLeft, FaQuoteRight } from "react-icons/fa";

interface WaitingScreenProps {
  message?: string;
}

const WaitingScreen: React.FC<WaitingScreenProps> = ({
  message = "Waiting for the game to start...",
}) => {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  //   const [showConfetti, setShowConfetti] = useState(true);
  const [quoteIndex, setQuoteIndex] = useState(0);

  const quotes = [
    "Who said it?",
    "Guess the quote!",
    "Are you ready?",
    "Loading the game...",
    "Get ready to guess!",
  ];

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  //   useEffect(() => {
  //     const interval = setInterval(() => setShowConfetti((prev) => !prev), 5000);
  //     return () => clearInterval(interval);
  //   }, []);

  // Cycle through quotes every 2 seconds
  useEffect(() => {
    const quoteInterval = setInterval(() => {
      setQuoteIndex((prevIndex) => (prevIndex + 1) % quotes.length);
    }, 2000);
    return () => clearInterval(quoteInterval);
  }, []);

  return (
    <div className="flex flex-col w-full items-center justify-center h-screen bg-[#220f4e] text-white relative overflow-hidden">
      {/* Confetti effect */}
      {/* {showConfetti && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={100}
        />
      )} */}

      {/* Floating Quotes */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
        {[...Array(10)].map((_, index) => (
          <motion.div
            key={index}
            initial={{
              y: "-100vh",
              x: Math.random() * windowSize.width,
            }}
            animate={{ y: windowSize.height + 100 }}
            transition={{ duration: Math.random() * 10 + 10, repeat: Infinity }}
            className={`text-6xl text-purple-300 opacity-50`}
          >
            {index % 2 === 0 ? <FaQuoteLeft /> : <FaQuoteRight />}
          </motion.div>
        ))}
      </div>

      {/* Rotating game message */}
      <motion.div
        className="text-3xl font-bold text-purple-100 my-6 text-center"
        animate={{ scale: [1, 0.9, 1], rotate: [0, 5, -5, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        {message}
      </motion.div>

      {/* Cycling quote messages */}
      <div className="text-xl text-center font-semibold relative h-10 mt-20 w-40">
        <AnimatePresence>
          <motion.div
            key={quoteIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="absolute"
            style={{ color: ["#bb86fc", "#7964A3", "#701CF9"][quoteIndex % 3] }}
          >
            {quotes[quoteIndex]}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default WaitingScreen;
