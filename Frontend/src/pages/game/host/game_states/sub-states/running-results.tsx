import { useState, useEffect } from "react";
import { Player } from "../../../game-models";
import { AnimatePresence, motion } from "framer-motion";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";
import { useSpring, animated } from "@react-spring/web";
import AnimatedNumber from "../../../../../components/animated-number";

export default function RunningResults({
  startRebuttal,
  players,
}: {
  startRebuttal: () => void;
  players: Player[];
}) {
  const [displayedPlayers, setDisplayedPlayers] = useState<Player[]>([]);
  const [animatedScores, setAnimatedScores] = useState<{
    [key: string]: number;
  }>({});
  const [previousRanks, setPreviousRanks] = useState<string[]>([]);
  const [rowColors, setRowColors] = useState<boolean>(false);
  const [previousRanksUnchanged, setPreviousRanksUnchanged] = useState<
    string[]
  >([]);

  function getFinalRanking() {
    const finalRanking = [...players]
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);
    return finalRanking.map((p) => p.name);
  }

  // Initialize leaderboard to show previous rankings and animate score increases
  useEffect(() => {
    const initialRanking = [...players]
      .map((p) => ({
        ...p,
        oldScore: p.score - p.scoreIncrease,
      }))
      .sort((a, b) => b.oldScore - a.oldScore)
      .slice(0, 5);

    setDisplayedPlayers(initialRanking);
    setPreviousRanks(initialRanking.map((p) => p.name));
    setPreviousRanksUnchanged(initialRanking.map((p) => p.name));

    // Initialize animated scores to previous scores
    const initialAnimatedScores: { [key: string]: number } = {};
    initialRanking.forEach((player) => {
      initialAnimatedScores[player.name] = player.oldScore;
    });
    setAnimatedScores(initialAnimatedScores);
  }, [players]);

  // Trigger ranking and score animation
  useEffect(() => {
    const timeout = setTimeout(() => {
      const newRanking = [...players]
        .sort((a, b) => b.score - a.score)
        .slice(0, 5);

      // Start animated score increments for each player
      newRanking.forEach((player) => {
        const interval = setInterval(() => {
          setAnimatedScores((prevScores) => {
            const currentScore = prevScores[player.name] || 0;
            const targetScore = player.score;

            if (currentScore >= targetScore) {
              clearInterval(interval);
              return prevScores;
            }

            // Increment score in steps to target score
            return {
              ...prevScores,
              [player.name]:
                currentScore + Math.ceil((targetScore - currentScore) / 10),
            };
          });
        }, 30); // Adjust interval speed here for faster/slower counting
      });

      setDisplayedPlayers(newRanking);
      setPreviousRanks(newRanking.map((p) => p.name));
      setRowColors(true);
    }, 1000); // Initial delay to show previous rankings

    return () => clearTimeout(timeout);
  }, [players]);

  const UP = 50;
  const DOWN = -50;
  const STATIONARY = 0;

  // Determine the movement direction of each player based on rank change
  const getRankChange = (playerName: string, newIndex: number) => {
    const oldRank = previousRanksUnchanged.indexOf(playerName);
    if (oldRank === -1) return UP; // New entry
    console.log(playerName + "," + oldRank);

    return oldRank > newIndex ? UP : oldRank < newIndex ? DOWN : STATIONARY;
  };

  return (
    <>
      <div className="w-full h-full flex flex-col sm:flex-col justify-center items-center">
        <div className="flex mt-8 flex-col items-center w-[90%] max-w-[60rem] p-4 bg-[#220f4e] text-white rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Leaderboard</h2>
          <div className="w-full h-full max-h-[20rem]">
            <AnimatePresence>
              {displayedPlayers.map((player, index) => {
                const rankChange = getRankChange(player.name, index);
                const backgroundColor = !rowColors
                  ? "#370b5f"
                  : index == 0
                    ? "#8D4F3B"
                    : index == 1
                      ? "#7858A8"
                      : index == 2
                        ? "#6A2131"
                        : "#370b5f";
                console.log(rankChange);
                return (
                  <motion.div
                    key={player.name}
                    initial={{
                      opacity: rankChange ? 0 : 1,
                      y: rankChange,
                      backgroundColor: backgroundColor,
                    }}
                    animate={{ opacity: 1, y: 0, backgroundColor }}
                    // exit={{ opacity: 0, y: 50 }}
                    transition={{
                      duration: 2,
                      type: "tween",
                      ease: "easeInOut",
                    }}
                    layout // ${!rowColors ? "bg-[#370b5f]" : index == 0 ? "bg-yellow-700" : index == 1 ? "bg-zinc-600" : index == 2 ? "bg-orange-800" : "bg-[#370b5f]"}
                    className={` w-full flex justify-between items-center p-2   mb-2 rounded-md shadow-md h-14`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-lg text-[#8d71cf] opacity-90">
                        {index + 1}.
                      </span>
                      <span className="text-xl">{player.name}</span>
                    </div>
                    <div className="flex flex-row">
                      <span className="text-xl  text-gray-300 flex flex-row items-center">
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{
                            duration: 2,
                            type: "tween",
                            ease: "linear",
                            delay: 1,
                          }}
                        >
                          {rankChange === UP && (
                            <FaArrowUp className="text-green-500 animate-bounce mr-1" />
                          )}
                          {rankChange === DOWN && (
                            <FaArrowDown className="text-red-500 animate-bounce mr-1" />
                          )}
                        </motion.div>
                        <motion.div
                          initial={{ opacity: 1, x: 0 }}
                          animate={{ opacity: 0, x: 40 }}
                          transition={{
                            duration: 1,
                            type: "tween",
                            ease: "linear",
                            delay: 0.5,
                          }}
                          className="text-sm w-10 text-center"
                        >
                          +{player.scoreIncrease}
                        </motion.div>
                      </span>
                      <span className="ml-2 font-bold text-lg w-10 text-center">
                        <AnimatedNumber
                          from={player.score - player.scoreIncrease}
                          to={player.score}
                          duration={2500}
                        />
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
        <div className="flex justify-start sm:h-full sm:w-fit mb-4 mx-4">
          <button
            onClick={startRebuttal}
            className="btn-purple p-8 flex justify-center items-center w-fit"
          >
            {"Next"}
          </button>
        </div>
      </div>
    </>
  );
}
