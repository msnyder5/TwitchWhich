import { useEffect, useState } from "react";
import { ChatterScores } from "./game";

type ScoreboardProps = {
  scores: ChatterScores;
  final: boolean;
  nextRoundCallback: () => void;
};

export default function Scoreboard({
  scores,
  final,
  nextRoundCallback,
}: ScoreboardProps) {
  const [topScores, setTopScores] = useState<Array<[string, number]>>([]);

  useEffect(() => {
    setTopScores(
      Array.from(scores.entries()).sort(
        ([_, scoreA], [__, scoreB]) => scoreB - scoreA
      )
    );
  }, [scores]);

  return (
    <>
      <h2 className="text-2xl font-bold">
        {final ? "Final Scoreboard" : "Top Scores"}
      </h2>
      <ol className="w-full h-5/6 overflow-y-scroll text-xl">
        {topScores.map(([username, score], index) => (
          <li
            key={index}
            className="bg-primary-800 my-3 mr-2 py-2 px-4 rounded-lg text-left"
          >
            <b>{Math.round(score)}</b>: {username}
          </li>
        ))}
      </ol>
      <span className="grow" />
      <button className="button-hover" onClick={() => nextRoundCallback()}>
        {final ? "Exit Game" : "Next Round"}
      </button>
    </>
  );
}
