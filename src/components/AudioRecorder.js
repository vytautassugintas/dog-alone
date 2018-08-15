import React, {Component} from 'react'
import Link from 'gatsby-link'
import {Recorder} from '../utils/recorder';
import {calculateDecibels} from '../utils/decibels';

const TIME_SLICE = 300;
const FFT = 1024;

export class AudioRecorder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isRecording: false
    }
    
    this.dataArray = []

    this.toggleRecording = this.toggleRecording.bind(this);
  }

  async componentDidMount() {
    this.mediaRecorder = new Recorder();
    await this.mediaRecorder.init();

    this.bufferLength = this.mediaRecorder.analyser.frequencyBinCount;
    this.dataArray = new Uint8Array(this.bufferLength);

    this.mediaRecorder.onDataAvailable = (() => {
      this.mediaRecorder.analyser.fftSize = FFT;
      this.mediaRecorder.analyser.getByteTimeDomainData(this.dataArray);

      const decibels = calculateDecibels(FFT, this.dataArray);

      this.draw();      
    })

    this.mediaRecorder.onStop = (() => {
      const audio = this.mediaRecorder.getAudio();
      audio.play();
    })

    this.canvas = this.refs.canvas;
    this.canvasCtx = this.refs.canvas.getContext("2d");
    this.draw();
  }

  toggleRecording(){
    this.setState(prevState => ({
      isRecording: !prevState.isRecording
    }), () => {
      if (this.state.isRecording) {
        this.mediaRecorder.start(TIME_SLICE);
      } else {
        this.mediaRecorder.stop()
      }
    })
  }

  draw() {
    this.canvasCtx.fillStyle = "rgb(200, 200, 200)";
    this.canvasCtx.fillRect(0, 0, this.refs.canvas.width, this.refs.canvas.height);

    this.canvasCtx.lineWidth = 1;
    this.canvasCtx.strokeStyle = "rgb(0, 0, 0)";

    this.canvasCtx.beginPath();

    let sliceWidth = this.canvas.width * 1.0 / this.bufferLength;
    let x = 0;

    for (let i = 0; i < this.bufferLength; i++) {
      let v = this.dataArray[i] / 128.0;
      let y = v * this.canvas.height / 2;

      i === 0
        ? this.canvasCtx.moveTo(x, y)
        : this.canvasCtx.lineTo(x, y)

      x += sliceWidth;
    }

    this.canvasCtx.lineTo(this.canvas.width, this.canvas.height / 2);
    this.canvasCtx.stroke();
  }

  render() {
    const {isRecording} = this.state;
    return (
      <div>
        <button onClick={this.toggleRecording}>
          {isRecording ? 'Stop recording' : 'Start recording'}
        </button>
        <p>Audio controller</p>
        <canvas ref="canvas" width={640} height={480}/>
      </div>
    )
  }

}