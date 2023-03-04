import { Dispatch, SetStateAction, useState } from "react";
import { Settings } from "./start";
import Question from "./question";
import Scoreboard from "./scoreboard";

export type ChatterScores = Map<string, number>;

type GameProps = {
  settings: Settings;
  setInProgress: Dispatch<SetStateAction<boolean>>;
};

export default function Game({ settings, setInProgress }: GameProps) {
  const [currentRound, setCurrentRound] = useState(1);
  const [votingActive, setVotingActive] = useState(true);
  const [scores, setScores] = useState<ChatterScores>(new Map());

  function votingCallback(questionScores: ChatterScores) {
    const newScores = new Map(scores);
    for (const [username, score] of questionScores) {
      const currentScore = newScores.get(username) ?? 0;
      newScores.set(username, currentScore + score);
    }
    setScores(newScores);
    setVotingActive(false);
  }

  function nextRoundCallback() {
    if (currentRound == settings.numberRounds) {
      endGame();
    }
    setCurrentRound(currentRound + 1);
    setVotingActive(true);
  }

  function endGame() {
    setCurrentRound(1);
    setVotingActive(true);
    setInProgress(false);
    setScores(new Map());
    settings.twitchClient.disconnect();
  }
  return (
    <>
      <button
        className="negative-button place-self-start"
        onClick={() => endGame()}
      >
        Exit
      </button>
      {votingActive ? (
        <Question
          currentRound={currentRound}
          client={settings.twitchClient}
          callback={votingCallback}
        />
      ) : (
        <Scoreboard
          scores={scores}
          nextRoundCallback={nextRoundCallback}
          final={currentRound == settings.numberRounds}
        />
      )}
    </>
  );
}
