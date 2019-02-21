import React from "react";
import "./App.css";
import { AudioRecorder } from "./components/AudioRecorder";
import { DecibelsListener } from "./components/DecibelsListener";

function App() {
  return (
    <div className="App container">
      <AudioRecorder />
      <DecibelsListener />
    </div>
  );
}

export default App;
