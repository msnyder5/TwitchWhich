import { useState, Dispatch, SetStateAction } from "react";
import { Client } from "tmi.js";

export type Settings = {
  twitchClient: Client;
  numberRounds: number;
};

function useLocalState<Type>(
  item: string,
  defaultValue: Type
): [Type, Dispatch<SetStateAction<Type>>] {
  const count = window.localStorage.getItem(item);
  if (count) {
    return useState(JSON.parse(count));
  } else {
    return useState(defaultValue);
  }
}

function setLocalStorage(item: string, value: any): void {
  window.localStorage.setItem(item, JSON.stringify(value));
}
type StartMenuProps = {
  callback: (settings: Settings) => void;
};
export default function StartMenu({ callback }: StartMenuProps) {
  const [channelName, setChannelName] = useLocalState("channelName", "");
  const [numberRounds, setNumberRounds] = useLocalState("numberRounds", 0);
  const [errorText, setErrorText] = useState("");
  const [startButtonText, setStartButtonText] = useState("Start");

  function tryStart() {
    if (!channelName) {
      setErrorText("You must enter a channel name.");
      return;
    }
    setStartButtonText("Loading");
    const client = Client({
      options: { debug: false },
      channels: [channelName.toLowerCase()],
    });
    client.connect().then((value) => {
      if (value) {
        setLocalStorage("channelName", channelName);
        setLocalStorage("numberRounds", numberRounds);
        callback({
          twitchClient: client,
          numberRounds: numberRounds,
        });
      } else {
        setErrorText("An unknown error occured.");
      }
      setStartButtonText("Start");
    });
  }

  return (
    <>
      <span className="grow" />
      <h2 className="text-2xl font-bold">Rules</h2>
      <div className="flex flex-col gap-2 place-items-left text-left text-lg max-w-xl">
        <h3 className="px-10 py-3 bg-primary-800 rounded-lg">
          Each round a <b>would you rather</b> style question is asked.
        </h3>
        <h3 className="px-10 py-3 bg-primary-800 rounded-lg">
          Points are awarded to both the option with the <b>majority vote</b>,
          and the option that the <b>streamer chooses</b>.
        </h3>
        <h3 className="px-10 py-3 bg-primary-800 rounded-lg">
          The <b>faster</b> you answer, the more points you get.
        </h3>
        <h3 className="px-10 py-3 bg-primary-800 rounded-lg">
          Only your <b>last answer</b> counts, but beware the time dropoff is
          sharp.
        </h3>
      </div>
      <span className="grow" />
      <h2 className="text-2xl font-bold">Settings</h2>
      {/* Channel Name */}
      <div>
        <p className="text-left leading-none">Channel Name</p>
        <input
          className="text-box mt-1"
          value={channelName}
          onChange={(e) => setChannelName(e.target.value)}
          placeholder="xQc"
        />
      </div>
      {/* Number of Rounds */}
      <div>
        <p className="text-left leading-none">Number of Rounds </p>
        <p className="text-left leading-none">
          <i className="text-left text-xs text-gray-400">
            Blank for endless, you can end the game whenever.
          </i>
        </p>
        <input
          className="text-box mt-1"
          value={numberRounds ? numberRounds : ""}
          onChange={(e) => setNumberRounds(parseInt(e.target.value))}
          placeholder="20"
        />
      </div>
      <span className="grow" />
      {/* Start Button and Error Text */}
      <p className="text-red-400">{errorText}&#8203;</p>
      <button className="button-hover text-2xl" onClick={() => tryStart()}>
        {startButtonText}
      </button>
    </>
  );
}
