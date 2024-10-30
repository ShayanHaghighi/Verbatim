import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Canvas } from "@react-three/fiber";
import { Stars, OrbitControls } from "@react-three/drei";
import Loader from "./loading";

interface ResultsWaitingScreenProps {
  message?: string;
}

const ResultsWaitingScreen: React.FC<ResultsWaitingScreenProps> = ({
  message = "Waiting for the results...",
}) => {
  const [tileIndex, setTileIndex] = useState(0);

  // Placeholder tiles for leaderboard effect
  const playerTiles = [
    "Player 1",
    "Player 2",
    "Player 3",
    "Player 4",
    "Player 5",
    "You",
  ];

  // Cycle tiles
  useEffect(() => {
    const tileInterval = setInterval(() => {
      setTileIndex((prevIndex) => (prevIndex + 1) % playerTiles.length);
    }, 2500);
    return () => clearInterval(tileInterval);
  }, []);

  return (
    <div className="relative w-full h-screen bg-[#0d021f] flex flex-col items-center justify-center overflow-hidden text-white">
      {/* Background 3D Stars */}
      <Canvas>
        <Stars count={1000} fade factor={4} />
        <OrbitControls autoRotate enableZoom={false} />
      </Canvas>

      {/* Pulsating Background Glow */}
      <div className="absolute w-full h-full bg-gradient-to-br from-[#460b83] via-[#280552] to-[#0d021f] opacity-70 blur-3xl animate-pulse"></div>

      {/* Neon Grid for larger screens */}
      <div className="hidden md:grid md:absolute inset-0 grid-cols-3 grid-rows-3 gap-4 opacity-50">
        {[...Array(9)].map((_, i) => (
          <div
            key={i}
            className="border border-[#801bda] rounded-lg shadow-neon"
          ></div>
        ))}
      </div>

      {/* Floating Player Tiles */}
      <AnimatePresence>
        {playerTiles.map((player, index) => (
          <motion.div
            key={index}
            className="relative p-2 md:p-4 m-2 text-center text-[#ffeeff] bg-[#370b5f] rounded-md shadow-glow font-semibold text-sm md:text-lg"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{
              opacity: index === tileIndex ? 1 : 0.5,
              scale: index === tileIndex ? 1.05 : 0.95,
              y: index === tileIndex ? -5 : 0,
            }}
            transition={{ duration: 0.5 }}
          >
            {player}
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Rotating Central Message */}
      <motion.div
        className="absolute bottom-12 text-lg md:text-2xl font-bold text-center text-[#f5d9ff]"
        animate={{ rotate: [0, 3, -3, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        {message}
      </motion.div>
      <Loader />
    </div>
  );
};

export default ResultsWaitingScreen;
