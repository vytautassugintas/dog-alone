import React, { useState, useEffect } from "react";
import "./App.css";

import { initSocket } from "./utils/sockets";

import { AudioRecorder } from "./components/AudioRecorder";
import { DecibelsListener } from "./components/DecibelsListener";
import { VolumeMeter } from "./components/VolumeMeter";

function App() {
  const [ready, setReady] = useState(false);

  // if (ready) {
  //   initSocket();
  // }

  return (
    <div className="App container">
      {ready ? (
        <React.Suspense fallback="">
          <VolumeMeter />
          <AudioRecorder />
          <DecibelsListener />
        </React.Suspense>
      ) : (
        <button
          onClick={() => {
            setReady(true);
          }}
        >
          {" "}
          Ready{" "}
        </button>
      )}
    </div>
  );
}

export default App;
