import client from "../../socket-connection";
import { useState } from 'react';
import { User, ChevronLeft, ChevronRight } from 'lucide-react';
import GameHeaderWait from "../../../../components/game/game-header-wait.tsx";
import {get_question_progress} from "./answer.tsx";
import {GameStats} from "../game-player.tsx";

const commentMap = {
    1: "Can walk it off",
    2: "🤨",
    3: "Never getting a job",
    4: "Life with no parole",
    5: "The guillotine for you AND your lawyer",
}

const colorMap = {
    1: "#4ade80", // green-400
    2: "#ebfd47", // yellow-300
    3: "#fbbf24", // amber-400
    4: "#ec3700", // orange-600
    5: "#880000", // red-600
};

export default function PlayerRebuttal({
  currentAccused,
  gameStats,
  myName,
}: {
  currentAccused: string | null;
    gameStats: GameStats;
  myName: string;
}) {


  const [myVote, setMyVote] = useState<number>(1);
  const [hasVoted, setHasVoted] = useState(false);
  const amIAccused = myName == currentAccused;
  function castVote() {
    setHasVoted(true);
    client.emit("rebuttal-vote", {
      score: myVote,
      player_name: myName,
    });
  }




    // Helper to calculate percentage position for 1-5 scale
    const getLeftPercentage = (value) => {
        return ((value - 1) / 4) * 100;
    };

    return (
        <div className="w-full  h-full bg-accent2 flex flex-col items-center overflow-hidden">
            {/* Background decoration */}
            <GameHeaderWait
                score={gameStats.score}
                questionNum={get_question_progress(gameStats)}
                displayText={amIAccused ? "Look Up!" :           <div className="bg-[#2e0f5e]/40 px-6 py-2 rounded-full mb-8 backdrop-blur-sm border border-white/10 shadow-lg">  <span className="text-xl md:text-2xl font-bold tracking-wide">
How cooked is: <span className="text-yellow-300">{currentAccused}?</span>            </span>   </div>
                }
            />
            {amIAccused ? (
                <div className=" mt-6 text-center animate-pulse">
                    <p className="text-xl mt-2">You're being accused - defend yourself</p>
                </div>
            ) : (
                <div className="mt-4 text-white w-full max-w-4xl flex flex-col items-center justify-center">

                    {/* Header */}




                    {/* Main Body */}
                    <div className="flex flex-col md:flex-row items-center justify-center w-full mb-8 gap-8">
                        {/* Avatar */}


                        <div

                            className="w-fit h-fit rounded-full p-2 object-right big-shadow pulse-float"
                            style={{'--pulse-color': `${colorMap[myVote]}` }}
                        >
                            <div className="bg-white w-fit h-fit rounded-full">
                                <img
                                    className="size-20 md:size-52 rounded-full"
                                    alt="accused player profile picture"
                                    src={`/author_images/${currentAccused}.png`}
                                />
                            </div>
                        </div>

                        {/* Quote */}
                        <div className="text-center md:text-left flex flex-col items-center justify-between ">
                            <h1 className="w-96 text-center min-h-20 text-3xl md:text-5xl font-black  leading-tight tracking-wider"
                                style={{ fontFamily: '"Comic Sans MS", "Chalkboard SE", sans-serif', textShadow: '2px 2px 0px rgba(0,0,0,0.2)' }}>
                                {commentMap[myVote]}
                            </h1>
                        </div>
                    </div>

                    {/* Voting Interactive Component */}
                    {hasVoted ? (
                        <div className="bg-white/20 p-6 rounded-xl backdrop-blur-md animate-bounce">
                            <div className="text-2xl font-bold">You voted: {myVote}</div>
                        </div>
                    ) : (
                        <div className="w-full max-w-2xl flex flex-col items-center gap-6 px-4">

                            {/* SLIDER CONTAINER */}
                            {/* We add padding-x (px-12) to give the thumb room to sit at 0% and 100% without hanging off the visual track */}
                            <div className="relative w-full h-16 flex items-center justify-center px-12">

                                {/* 1. VISUAL TRACK (White Bar) */}
                                <div className="absolute left-0 right-0 h-14 bg-white rounded-lg shadow-lg"></div>

                                {/* 2. DOTS LAYER */}
                                {/* We render dots exactly where the steps fall */}
                                <div className="absolute left-12 right-12 h-14 flex items-center pointer-events-none">
                                    {[1, 2, 3, 4, 5].map((val) => (
                                        <div
                                            key={val}
                                            className="absolute w-4 h-4 bg-gray-300 rounded-full"
                                            style={{
                                                left: `${getLeftPercentage(val)}%`,
                                                transform: 'translateX(-50%)'
                                            }}
                                        />
                                    ))}
                                </div>

                                {/* 3. SLIDING THUMB (Purple Box) */}
                                {/* - transitions: duration-100 makes it snap quickly ("click") rather than glide
                    - left: calculated percentage based on vote
                    - translateX(-50%): centers the box perfectly on that percentage
                */}
                                <div
                                    className="absolute h-16 w-24 bg-[#3d008d] rounded-lg border-4 border-white flex items-center justify-center shadow-xl pointer-events-none z-10 transition-all duration-100 ease-out"
                                    style={{
                                        left: `calc(3rem + (100% - 6rem) * ${(myVote - 1) / 4})`, // Matches the padding logic (3rem = px-12)
                                        transform: 'translateX(-50%)'
                                    }}
                                >
                                    <ChevronLeft size={24} className="text-white opacity-80" />
                                    <div className="w-2 h-2 mx-1 opacity-0"></div>
                                    <ChevronRight size={24} className="text-white opacity-80" />
                                </div>

                                {/* 4. ACTUAL INPUT (Invisible) */}
                                {/* The width must align with the visual track area to ensure clicks map correctly */}
                                <input
                                    type="range"
                                    step={1}
                                    min={1}
                                    max={5}
                                    value={myVote}
                                    onChange={(e) => setMyVote(Number(e.target.value))}
                                    className="absolute left-12 right-12 h-16 opacity-0 cursor-pointer z-20"
                                />
                            </div>
                            <h3 className="opacity-50 text-3xl">{myVote}</h3>

                            {/* Drag Label */}
                            <div className="text-white/80 font-bold text-sm tracking-widest uppercase flex items-center gap-2 mt-2">
                                <span>&larr;</span> Drag <span>&rarr;</span>
                            </div>

                            {/* Submit Button */}
                            <div className="w-full flex justify-end mt-4">
                                <button
                                    onClick={castVote}
                                    className="bg-[#26890c] hover:bg-[#1f7a08] text-white text-xl font-bold py-3 px-10 rounded-md shadow-[0_4px_0_rgba(0,0,0,0.2)] active:shadow-none active:translate-y-1 transition-all"
                                >
                                    Next
                                </button>
                            </div>

                        </div>
                    )}
                </div>
            )}
        </div>
    );
}