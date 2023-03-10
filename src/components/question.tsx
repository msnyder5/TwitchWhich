import { useEffect, useState } from "react";
import { Client } from "tmi.js";
import questionsJSON from "./questions.json";
import { ChatterScores } from "./game";

type StreamerAnswer = 0 | 1 | 2;

type QuestionOptions = {
  option1: string;
  option2: string;
};

function getRandomQuestion(): QuestionOptions {
  return questionsJSON[Math.floor(Math.random() * questionsJSON.length)];
}

type Respondents = Map<string, number>;

type QuestionProps = {
  currentRound: number;
  client: Client;
  callback: (scores: ChatterScores) => void;
};

export default function Question({
  currentRound,
  client,
  callback,
}: QuestionProps) {
  // The Question
  const [question, setQuestion] = useState(getRandomQuestion());
  const [startTime, setStartTime] = useState(0);
  // Chat's Repsonses
  const [respondents1, setRespondents1] = useState<Respondents>(new Map());
  const [respondents2, setRespondents2] = useState<Respondents>(new Map());
  // Streamers Response
  const [streamerResponse, setStreamerResponse] = useState<StreamerAnswer>(0);
  // Reseting when we advance the round number
  useEffect(() => {
    setStartTime(Date.now());
    setQuestion(getRandomQuestion());
    setRespondents1(new Map());
    setRespondents2(new Map());
  }, [currentRound]);
  // Listener for scores
  client.on("message", (target, context, msg, self) => {
    const trimmed_msg = msg.trim();
    const is_one = trimmed_msg === "1";
    const is_two = trimmed_msg === "2";
    if (!is_one && !is_two) {
      return;
    }
    function addRespondent(
      username: string,
      respondents: Respondents
    ): Respondents {
      const copy = new Map(respondents);
      copy.set(username, Date.now());
      return copy;
    }
    function deleteRespondent(
      username: string,
      respondents: Respondents
    ): Respondents {
      const copy = new Map(respondents);
      copy.delete(username);
      return copy;
    }
    if (context.username) {
      if (is_one) {
        setRespondents1(addRespondent(context.username, respondents1));
        setRespondents2(deleteRespondent(context.username, respondents2));
      } else {
        setRespondents2(addRespondent(context.username, respondents2));
        setRespondents1(deleteRespondent(context.username, respondents1));
      }
    }
  });
  // End of the round
  function endRound() {
    const numOption1 = respondents1.size;
    const numOption2 = respondents2.size;
    const scores: ChatterScores = new Map();
    const option1Base =
      (streamerResponse == 1 ? 100 : 0) + (numOption1 >= numOption2 ? 100 : 0);
    const option2Base =
      (streamerResponse == 2 ? 100 : 0) + (numOption2 >= numOption1 ? 100 : 0);
    if (option1Base) {
      for (const [username, respondedAt] of respondents1) {
        scores.set(
          username,
          (20 / (4 + (respondedAt - startTime) / 1000)) * option1Base
        );
      }
    }
    if (option2Base) {
      for (const [username, respondedAt] of respondents2) {
        scores.set(
          username,
          (20 / (4 + (respondedAt - startTime) / 1000)) * option2Base
        );
      }
    }
    callback(scores);
  }
  return (
    <>
      <h2 className="text-2xl font-bold">Round {currentRound}</h2>
      <span className="grow" />
      <div className="flex flex-col lg:flex-row gap-5 w-full">
        <div className="flex flex-col gap-5 flex-1 h-full">
          <div className="text-3xl">{respondents1.size}</div>
          <div
            className={
              "option-card-1 flex-1 flex items-center justify-center" +
              (streamerResponse == 1
                ? " shadow-[0_0_15px_1px] shadow-purple-500"
                : "")
            }
            onClick={() => setStreamerResponse(1)}
          >
            {question.option1}
          </div>
          <div className="text-xl">Type 1 in chat.</div>
        </div>
        <div className="flex flex-col gap-5 flex-1">
          <div className="text-3xl">{respondents2.size}</div>
          <div
            className={
              "option-card-2 flex-1 flex items-center justify-center" +
              (streamerResponse == 2
                ? " shadow-[0_0_15px_1px] shadow-fuchsia-500"
                : "")
            }
            onClick={() => setStreamerResponse(2)}
          >
            {question.option2}
          </div>
          <div className="text-xl">Type 2 in chat.</div>
        </div>
      </div>
      <span className="grow" />
      <button
        className={
          streamerResponse ? "button-hover" : "disabled-positive-button"
        }
        onClick={() => (streamerResponse ? endRound() : null)}
      >
        End Round
      </button>
    </>
  );
}
