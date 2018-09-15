import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { AudioRecorder } from './components/AudioRecorder';
import { DecibelsListener } from './components/DecibelsListener';

class App extends Component {
  render() {
    return (
      <div className="App">
        <AudioRecorder />
        <DecibelsListener />
      </div>
    );
  }
}

export default App;
