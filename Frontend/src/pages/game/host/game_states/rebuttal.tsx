import client, { endGame } from "../../socket-connection";
import { Player, Question, Vote } from "../../game-models";
import { useEffect, useState, useRef } from "react";
import CountdownTimerExternal from "../../../../components/TimerExternal";
import ProgressBar from "../../../../components/game/progress-bar";
import ExitButton from "../../../../components/game/exit-button";
import useWindowDimensions from "../../../../components/window-dimentions";
import { backendURL } from "../../../../constants";
import "./rebuttal.css";
import { gsap } from "gsap";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
interface props {
  gameCode: string | null;
  accusedName: string;
  players: Player[];
  currentVotes: Vote[];
}

function shuffle(oldArray: any[]) {
  const newArray = oldArray.slice();
  let currentIndex = newArray.length;

  while (currentIndex != 0) {
    let randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [newArray[currentIndex], newArray[randomIndex]] = [
      newArray[randomIndex],
      newArray[currentIndex],
    ];
  }
  return newArray;
}

export default function HostRebuttal({
  gameCode,
  accusedName: currentAccused,
  players,
  currentVotes,
}: props) {
  const questionNum = "1/4";
  const timeLimit = 30;
  const [hasTimerRunOut, setHasTimerRunOut] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const [delayArray, setDelayArray] = useState(Array(7));
  const [showingAnimation, setShowingAnimation] = useState(false);
  const [currentXPos, setCurrentXPos] = useState(100);
  const [filteredPlayers, setFilteredPlayers] =
    useState<Player[]>(getFilteredArray());

  useEffect(() => {
    console.log(height);
    setFilteredPlayers(getFilteredArray());
  }, players);

  useState(() => {
    const arr = Array(7);
    for (let i = 0; i < 7; i++) {
      arr[i] = -Math.random() * 3;
    }
    setDelayArray(arr);
  });

  function moveLeft() {
    setCurrentXPos((prev) => Math.max(0, prev - 10));
    console.log(currentXPos);
    updatePos();
  }

  function moveRight() {
    setCurrentXPos((prev) => Math.min(100, prev + 10));
    console.log(currentXPos);
    updatePos();
  }

  useEffect(() => {
    client.emit("current-game-info", {
      game_code: sessionStorage.getItem("game_code"),
    });
    const timer = setTimeout(() => {
      // setShowingAnimation(false);
    }, 3000);

    return () => clearTimeout(timer);
  });

  function getFilteredArray(): Player[] {
    return shuffle(players.filter((player) => player.name != currentAccused));
  }

  const [positionX, setPositionX] = useState(50); // Vertical position in %
  const [prevPositionX, setPrevPositionX] = useState(50); // Previous Y position
  const imageRef = useRef<HTMLImageElement>(null); // Ref for the larger image
  const [smallImageShift, setSmallImageShift] = useState(0); // Small image shift in px

  function updatePos() {
    const newPositionX = currentXPos;

    if (imageRef.current) {
      // Get intrinsic dimensions of the image
      const imageWidth = imageRef.current.naturalWidth;
      const containerWidth = imageRef.current.offsetWidth;

      // Calculate how far the image moves in px
      const visibleImageHeight = Math.max(imageWidth, containerWidth); // Visible height
      const shift = ((newPositionX - prevPositionX) * visibleImageHeight) / 100;

      // Update the shift for the smaller image
      setSmallImageShift((prevShift) => prevShift + shift);
      console.log("shift:");
      console.log(smallImageShift);
    }

    setPrevPositionX(newPositionX);
    setPositionX(newPositionX);
  }

  const { height, width } = useWindowDimensions();
  function getXPos(index: number) {
    return positions[index][0] + height / 120 - 8;
  }
  function getYPos(index: number) {
    return positions[index][1] + height / 55 - 15;
  }

  function nextQuestion() {
    client.emit("rebuttal-end", {
      game_code: gameCode,
      game_token: sessionStorage.getItem("game_token"),
    });
  }
  // TODO set accused name
  const accusedName = "Billy";
  currentVotes = [
    {
      score: 1,
      voteCaster: "Barry",
    },
  ];
  players = ["Billy", "Bobby", "Barry", "Billy", "Bobby", "Barry", "Barry"];
  const positions = [
    [32, 47],
    [17, 46],
    [47, 47],
    [9, 51],
    [25, 50],
    [40, 51],
    [56, 50],
  ];

  const accusedPosition = [133, 52];

  const scoreMap: { [index: number]: string } = {
    1: "happy.png",
    2: "surprised.png",
    3: "confused.png",
    4: "sad.png",
    5: "angry.png",
  };

  function getCorrectEmoji(player: string) {
    // console.log("emoji:");
    // console.log(currentVotes);
    // console.log(player);
    const score = currentVotes.find((vote) => vote.voteCaster == player)?.score;
    if (score == undefined) {
      return (
        <>
          <img
            src={`/reactions/angry.png`}
            alt="positive vote icon"
            className="vote-before"
          />
        </>
      );
    }
    const image = scoreMap[score];
    return (
      <>
        <img
          src={`/reactions/${image}`}
          alt="positive vote icon"
          className="vote-after"
        />
      </>
    );
  }

  function timerRanOut() {
    setHasTimerRunOut(true);

    console.log("time has run out");
    // client.emit("question-finished", {
    //   game_code: game_code,
    //   game_token: sessionStorage.getItem("game_token"),
    // });
  }

  return (
    <>
      {/* <div className="game-bg relative z-0"> */}
      {showingAnimation ? (
        <div className="game-bg relative max-w-full">
          <img
            src="/images/objection.png"
            alt="objection image"
            className="w-full h-full object-contain block"
          />
        </div>
      ) : (
        <>
          <div
            className="bg-accent1 w-full flex flex-col rounded-b-[100%] shadow-inner absolute md:pb-0 pb-6"
            style={{
              boxShadow: "0 -20px 20px rgba(0,0,0,0.2) inset",
            }}
          >
            <div className="flex h-24 flex-row justify-between p-4">
              <div className="flex items-start opacity-0">
                <div className="flex flex-row justify-center py-2 px-2 bg-accent2 text-white shadow-lg rounded-full w-28 min-w-fit">
                  <img
                    src={"/icons/checkpoint.png"}
                    alt="checkpoint image"
                    className="size-6 mr-1"
                  ></img>
                  <div>1111 pts</div>
                </div>
              </div>
              <ProgressBar questionNum={questionNum} />
              <div>
                <div
                  className="flex flex-row justify-center py-2 px-4 text-white shadow-lg rounded-full w-28"
                  style={{
                    backgroundColor: `rgb(${132 + (timeLimit - timeLeft) * 3},57,${246 - (timeLimit - timeLeft) * 6})`,
                  }}
                >
                  <img
                    src={"/icons/hourglass.png"}
                    alt="checkpoint image"
                    className="size-6 mr-1"
                  ></img>
                  <div>
                    <CountdownTimerExternal
                      onFinish={timerRanOut}
                      timeLeft={timeLeft}
                      setTimeLeft={setTimeLeft}
                    />
                  </div>
                </div>
              </div>
            </div>
            {/* <div className="flex sm:hidden items-end flex-1 px-10">
                <div className="flex flex-col w-full items-center">
                  <div className="bg-gradient-to-r from-green-500 from-10% via-[#230453] via-15% to-[#230453] h-2 w-full rounded-full"></div>
                  <div className="text-white">2/15</div>
                </div>
              </div> */}
            <div className="flex text-inset items-center px-6 text-center justify-center text-[5vh] text-white pb-10">
              How cooked is {currentAccused}
            </div>
          </div>
          <div className="relative z-0 overflow-hidden w-full h-full ">
            <img
              src="/images/court.png"
              className="h-full w-auto object-cover object-right transition-all absolute right-0"
              style={{
                objectPosition: `${currentXPos}% 50%`,
              }}
              ref={imageRef}
            />
            {filteredPlayers.slice(0, 7).map((player, index) => (
              <div
                className="size-fit min-w-[56px] transition-all md:min-w-[96px] rounded-full absolute animate-float object-right "
                style={{
                  right: `${getXPos(index) + currentXPos - 100}vh`,
                  transform: `translateX(${100}px)`,
                  top: `${getYPos(index)}vh`,
                  animationDelay: `${delayArray[index]}s`,
                }}
              >
                <div className="bg-[#492480] p-2 rounded-full big-shadow">
                  <div className="bg-white w-fit h-fit rounded-full">
                    <img
                      key={player.name}
                      src={`${backendURL}/api/author/images?game_code=${sessionStorage.getItem("game_code")}&player_name=${player.name}`}
                      className={`size-12 md:size-20 rounded-full`}
                    />
                  </div>
                </div>
                {getCorrectEmoji(player.name)}
              </div>
            ))}
            <div
              style={{
                top: `${accusedPosition[1]}vh`,
                left: `${-accusedPosition[0] - smallImageShift / 25 + 125 + height / 400}vh`,
              }}
              className="w-fit transition-all h-fit rounded-full p-2 absolute  object-right big-shadow pulse-float"
            >
              <div className="bg-white w-fit h-fit rounded-full">
                <img
                  src={`/author_images/${currentAccused}.png`}
                  className={`size-32 rounded-full`}
                />
              </div>
            </div>
            {/* <img
            src="/author_images/Billy.png"
            className="absolute top-[50%] right-[50vh] transform animate-float size-8 -translate-x-1/2 -translate-y-1/2 object-right"
          /> */}
          </div>
          <FaArrowLeft
            onClick={moveLeft}
            className="absolute left-10 top-10 size-20 text-purple big-drop-shadow"
          />
          <FaArrowRight
            onClick={moveRight}
            className="absolute right-10 top-10 size-20 text-purple big-drop-shadow"
          />

          <div className="absolute bottom-6 left-50% select-none">
            <button className="btn-green mt-4" onClick={nextQuestion}>
              {"Next Round ->"}
            </button>
          </div>
        </>
      )}
      {/* </div> */}
    </>
  );
}
