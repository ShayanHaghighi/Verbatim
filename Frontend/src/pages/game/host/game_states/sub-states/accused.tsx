import React from 'react';

const RevealScreen = ({ guesses, actualAuthor }) => {
    const correctPlayers = [];
    const incorrectPlayers = [];

    // Sort players based on their guesses
    Object.entries(guesses).forEach(([player, guess]) => {
        if (guess.toLowerCase() === actualAuthor.toLowerCase()) {
            correctPlayers.push(player);
        } else {
            incorrectPlayers.push({ player, guess });
        }
    });

    return (
        // Replaced min-h-screen with h-full and flex-wrap to play nicely with a top-bar
        <div className=" h-full w-full p-8 flex justify-between items-start  px-36">

            {/* LEFT & MIDDLE: Grouped the Accused and Correct Guessers so they sit closer together */}
            {/*<div className="flex items-center flex-row gap-6 md:gap-12 flex-1">*/}

                {/* The Accused (Actual Author) */}
                    <div className="w-64 h-64 bg-gray-300 rounded-full flex items-center justify-center text-2xl md:text-3xl font-bold text-center p-6 shadow-lg flex-shrink-0 bg-white w-fit h-fit rounded-full border border-[5px] border-red-500 pulse-float">
                        <img
                            src={`/author_images/${"Barry"}.png`}
                            className={`size-64 min-w-64 min-h-64 rounded-full big-shadow`}
                        />
                    </div>

                {/* Correct Guessers (Now wrap automatically if there are too many) */}
                <div className="grid grid-flow-col grid-rows-3 flex-wrap gap-6 justify-start items-start">
                    {correctPlayers.map((player) => (
                        <div key={player} className="flex items-center gap-2">
                            <span className="text-5xl md:text-6xl">👈</span>
                            <div className="bg-white w-fit h-fit rounded-full border border-[8px] border-green-500">
                                <img
                                    src={`/author_images/${"Barry"}.png`}
                                    className={`size-32 min-w-32 min-h-32 rounded-full big-shadow`}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            {/*</div>*/}

            {/* FAR RIGHT: Incorrect Guessers */}
            <div className="grid grid-flow-row grid-cols-3 flex-wrap gap-x-20 gap-y-28 justify-center items-start lg:justify-end  mt-20 lg:mt-0 pt-8">
                {incorrectPlayers.map(({ player, guess }) => (
                    <div key={player} className="relative flex flex-col items-center mt-2">

                        {/* Thought Bubble - Made slightly bigger and adjusted positioning */}
                        <div className="absolute -top-28 -right-24 flex flex-col items-center z-10">
                            <div className="relative flex justify-center items-center w-[180px] h-[130px]">

                                {/* SVG Cloud Outline */}
                                <svg viewBox="0 0 120 80" className="absolute -top-16 -left-7 size-60 -z-10">
                                    <path
                                        d="M 35 65
                       C 15 65, 15 35, 35 35
                       C 40 15, 80 15, 85 35
                       C 105 35, 105 65, 85 65
                       Z"
                                        fill="white" /* Matches Tailwind background */
                                        stroke="white"
                                        strokeWidth="4"
                                        strokeLinejoin="round"
                                    />
                                </svg>

                                {/* Incorrect Guess Circle Inside Cloud */}
                                <img
                                    key={player.name}
                                    src={`/author_images/Bobby.png`}
                                    className={`size-16 min-w-16 md:size-20 rounded-full z-10`}
                                 alt={"abc"}/>
                            </div>

                            {/* Bubble Trail */}
                            <div className="absolute -bottom-6 left-8 flex flex-col items-start gap-1">
                                <div className="w-5 h-5 rounded-full border-[3px] border-black bg-white"></div>
                                <div className="w-3 h-3 rounded-full border-[3px] border-black bg-white -ml-2"></div>
                            </div>
                        </div>

                        {/* Player Circle */}

                            <div className="bg-white w-fit h-fit rounded-full border border-[8px] border-red-500">
                                <img
                                    src={`/author_images/${"Barry"}.png`}
                                    className={`size-32 min-w-32 min-h-32 rounded-full big-shadow`}
                                />
                            </div>
                        {/* <img
            src="/author_images/Billy.png"
            className="absolute top-[50%] right-[50vh] transform animate-float size-8 -translate-x-1/2 -translate-y-1/2 object-right"
          /> */}

                    </div>
                ))}
            </div>

        </div>
    );
};

export default RevealScreen;