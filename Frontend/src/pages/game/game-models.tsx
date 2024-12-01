export interface gameStates {
  state: "waiting" | "question" | "answer" | "rebuttal" | "results";
}

export interface GameInfoOwner {
  gameCode: string;
  playersJoined: Player[];
  gameState: gameStates;
  currentQuestion: Question | null;
  currentVotes: Vote[];
  currentAccused: string;
  timeLimit: number;
  questionNum: string;
}

export interface GameInfoPlayer {}

export interface Question {
  question: string;
  options?: string[];
  answer?: string | null;
}

export interface Player {
  name: string;
  score: number;
  hasAnswered: boolean;
  scoreIncrease: number;
}

export interface Vote {
  voteCaster: string;
  score: number;
}
