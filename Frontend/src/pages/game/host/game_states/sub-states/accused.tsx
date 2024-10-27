import { motion } from "framer-motion";
import { backendURL } from "../../../../../constants";

export default function Accused({
  currentAccused,
}: {
  currentAccused: string;
}) {
  const objects = [
    { id: 2, x: -250, y: -175, rotate: 45 },
    { id: 6, x: -300, y: 0, rotate: 0 },
    { id: 1, x: -250, y: 175, rotate: -45 },

    { id: 3, x: 250, y: -175, rotate: 135 },
    { id: 4, x: 300, y: 0, rotate: 180 },
    { id: 5, x: 250, y: 175, rotate: 225 },
  ];
  const yOffset = -100;
  console.log("current accused :" + currentAccused);
  return (
    <>
      <div className="relative">
        <div className="absolute w-full h-full scale-[0.5] -translate-y-[5%] sm:translate-y-0 sm:scale-100 flex items-center justify-center ">
          {objects.map((obj, index) => (
            <motion.div
              key={obj.id}
              custom={index}
              initial={{
                x: obj.x,
                y: obj.y + yOffset,
                rotate: `${obj.rotate}deg`,
              }}
              animate={{
                x: obj.x * 1.1,
                y: obj.y * 1.1 + yOffset,
                transition: {
                  duration: 1,
                  repeat: Infinity,
                  repeatType: "reverse",
                  delay: 0,
                  ease: "easeInOut",
                },
              }}
              // className={`${obj.id > 1 ? "md:flex hidden" : "flex"}`}
              style={{
                width: "100px",
                height: "100px",
                position: "absolute",
                // backgroundColor: "purple",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {/* Replace with an icon or image of a pointing finger */}
              <img
                src={"/icons/point.png"}
                alt="checkpoint image"
                className="size-20"
              ></img>
            </motion.div>
          ))}
        </div>
        <div className="w-full flex flex-col items-center justify-center mt-8">
          <div
            className={`bg-green-500  w-fit h-fit rounded-full p-4 shadow-2xl`}
          >
            <div className="bg-zinc-100 w-fit h-fit rounded-full shadow-lg">
              <img
                className="size-[50vw] max-w-[40vh] max-h-[40vh]  rounded-full"
                alt="accused player profile picture"
                src={`${backendURL}/api/author/images?game_code=${sessionStorage.getItem("game_code")}&player_name=${currentAccused}`}
              />
            </div>
          </div>
          <span className={` text-green-300  text-[3rem] mt-4 mild-shadow`}>
            {currentAccused}
          </span>
        </div>
      </div>
    </>
  );
}
