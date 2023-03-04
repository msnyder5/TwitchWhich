import { useState } from "react";
import "./App.css";
import StartMenu, { Settings } from "./components/start";
import Game from "./components/game";

export default function App() {
  const [inProgress, setInProgress] = useState(false);
  const [settings, setSettings] = useState<Settings | undefined>(undefined);
  function startCallback(returnedSettings: Settings) {
    setSettings(returnedSettings);
    setInProgress(true);
  }

  return (
    <div className="flex flex-col gap-5 place-items-center bg-primary-800/30 p-10 rounded-xl h-5/6 w-9/12 overflow-y-clip">
      {settings && inProgress ? (
        <Game settings={settings} setInProgress={setInProgress} />
      ) : (
        <StartMenu callback={startCallback} />
      )}
    </div>
  );
}
