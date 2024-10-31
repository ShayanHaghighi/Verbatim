export default function ProgressBar({ questionNum }: { questionNum: string }) {
  const gradientStyle = {
    background: `linear-gradient(to right, #22c55e ${barProgress() - 5}%, #230453 ${barProgress() + 5}%, #230453 100%)`,
  };

  function barProgress() {
    const fromNum = Number(questionNum.split("/")[0]);
    const toNum = Number(questionNum.split("/")[1]);
    return Math.round((fromNum / toNum) * 100);
  }
  return (
    <div className="sm:flex hidden items-end flex-1 px-10">
      <div className="flex flex-col w-full items-center">
        <div className={` h-2 w-full rounded-full`} style={gradientStyle}></div>
        <div>{questionNum}</div>
      </div>
    </div>
  );
}
