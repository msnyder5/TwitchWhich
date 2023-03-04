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
    <div className="flex flex-col gap-5 place-items-center p-10 min-h-full w-full overflow-y-auto">
      {settings && inProgress ? (
        <Game settings={settings} setInProgress={setInProgress} />
      ) : (
        <StartMenu callback={startCallback} />
      )}
    </div>
  );
}
