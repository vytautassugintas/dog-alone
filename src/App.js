import React, { useState } from "react";
import "./App.css";
import { AudioRecorder } from "./components/AudioRecorder";
import { DecibelsListener } from "./components/DecibelsListener";

const LazyVolumeMeter = React.lazy(() => import("./components/VolumeMeter"));

function App() {
  const [ready, setReady] = useState(false);
  return (
    <div className="App container">
      {ready ? (
        <React.Suspense fallback="">
          <LazyVolumeMeter />
          <AudioRecorder />
          <DecibelsListener />
        </React.Suspense>
      ) : (
        <button onClick={() => setReady(true)}> Ready </button>
      )}
    </div>
  );
}

export default App;
