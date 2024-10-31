export default function ScoreComponent({ score }: { score: number }) {
  return (
    <div className="flex items-start">
      <div className="flex flex-row justify-center py-2 px-2 bg-accent2 text-white shadow-lg rounded-full w-28 min-w-fit">
        <img
          src={"/icons/checkpoint.png"}
          alt="checkpoint image"
          className="size-6 mr-1"
        />
        <div>{score} pts</div>
      </div>
    </div>
  );
}
