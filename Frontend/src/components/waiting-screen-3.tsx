import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaQuestionCircle } from "react-icons/fa";
import Loader from "./loading";

interface ResultsWaitingScreenProps {
  message?: string;
}

function WaitingScreen2({
  message = "Waiting for the results...",
}: ResultsWaitingScreenProps) {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const [questionIndex, setQuestionIndex] = useState(0);

  const suspenseQuotes = [
    "Who guessed right?",
    "Results are coming...",
    "Just a moment longer...",
  ];

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const questionInterval = setInterval(() => {
      setQuestionIndex((prevIndex) => (prevIndex + 1) % suspenseQuotes.length);
    }, 3000);
    return () => clearInterval(questionInterval);
  }, []);

  return (
    <div className="flex flex-col w-full items-center justify-center h-screen bg-[#170A2D] text-white relative overflow-hidden">
      {/* Floating Question Marks */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
        {[...Array(8)].map((_, index) => (
          <motion.div
            key={index}
            initial={{
              y: "-100vh",
              x: Math.random() * windowSize.width,
            }}
            animate={{ y: windowSize.height + 100 }}
            transition={{ duration: Math.random() * 12 + 8, repeat: Infinity }}
            className={`text-6xl text-[#3e1c6b] opacity-50`}
          >
            <FaQuestionCircle />
          </motion.div>
        ))}
      </div>

      {/* Pulsing Central Indicator */}
      <motion.div
        className="relative flex items-center justify-center"
        animate={{ scale: [1, 1.15, 1] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        <div className="bg-gradient-to-r from-purple-500 to-purple-800 w-24 h-24 rounded-full blur-lg opacity-70 animate-pulse"></div>
      </motion.div>

      {/* Suspense Message */}
      <motion.div
        className="text-3xl font-bold text-[#d1b3ff] my-6 text-center mt-12"
        animate={{ opacity: [1, 0.7, 1], rotate: [0, -5, 5, 0] }}
        transition={{ repeat: Infinity, duration: 2.5 }}
      >
        {message}
      </motion.div>
      <div className="absolute top-[35%]">
        <Loader />
      </div>

      {/* Cycling suspense quotes */}
      <div className="text-xl text-center font-semibold relative h-10 mt-20 w-56">
        <AnimatePresence>
          <motion.div
            key={questionIndex}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.5 }}
            className="absolute text-[#cbb1ff]"
          >
            {suspenseQuotes[questionIndex]}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

export default WaitingScreen2;
