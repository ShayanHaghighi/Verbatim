export default function PlayerAnswer({
  isAnswerCorrect,
}: {
  isAnswerCorrect: boolean | null;
}) {
  return isAnswerCorrect ? (
    <span>your answer was correct</span>
  ) : (
    <span>your answer was incorrect</span>
  );
}
