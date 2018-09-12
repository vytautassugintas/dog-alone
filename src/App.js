import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { AudioRecorder } from './components/AudioRecorder';

class App extends Component {
  render() {
    return (
      <div className="App">
        <AudioRecorder />
      </div>
    );
  }
}

export default App;
