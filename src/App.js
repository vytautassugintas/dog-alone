import React, { useState } from "react";
import "./App.css";
import { AudioRecorder } from "./components/AudioRecorder";

const LazyVolumeMeter = React.lazy(() => import("./components/VolumeMeter"));
const LazyDecibelsListener = React.lazy(() =>
  import("./components/DecibelsListener")
);

function App() {
  const [ready, setReady] = useState(false);
  return (
    <div className="App container">
      {ready ? (
        <React.Suspense fallback="">
          <LazyVolumeMeter />
          <AudioRecorder />
          <LazyDecibelsListener />
        </React.Suspense>
      ) : (
        <button onClick={() => setReady(true)}> Ready </button>
      )}
    </div>
  );
}

export default App;
