import React, {Component} from 'react'
import Link from 'gatsby-link'
import {getRecorder} from '../utils/recorder';

export class AudioRecorder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isFinished: false
    }

    this.audioCtx = new AudioContext();
    this.analyser = this
      .audioCtx
      .createAnalyser();
    this.dataArray = []
  }

  async componentDidMount() {
    const recorder = await getRecorder();
    this.mediaRecorder = recorder.mediaRecorder;
    this.stream = recorder.stream;

    const audioChunks = [];

    let source = this
      .audioCtx
      .createMediaStreamSource(this.stream);
    source.connect(this.analyser)

    this.bufferLength = this.analyser.frequencyBinCount;
    this.dataArray = new Uint8Array(this.bufferLength);

    const timeSlice = 300;

    this
      .mediaRecorder
      .start(timeSlice);

    this
      .mediaRecorder
      .addEventListener("dataavailable", event => {
        audioChunks.push(event.data);
        this.analyser.fftSize = 2048;
        this
          .analyser
          .getByteTimeDomainData(this.dataArray);

        this.draw();
      });

    this
      .mediaRecorder
      .addEventListener("stop", () => {
        const audioBlob = new Blob(audioChunks);
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        audio.play();
      });

    setTimeout(() => {
      this
        .mediaRecorder
        .stop();
    }, 3000);

    this.canvas = document.getElementById("oscilloscope");
    this.canvasCtx = this
      .canvas
      .getContext("2d");
  }

  draw() {
    this
      .analyser
      .getByteTimeDomainData(this.dataArray);

    this.canvasCtx.fillStyle = "rgb(200, 200, 200)";
    this
      .canvasCtx
      .fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.canvasCtx.lineWidth = 2;
    this.canvasCtx.strokeStyle = "rgb(0, 0, 0)";

    this
      .canvasCtx
      .beginPath();

    let sliceWidth = this.canvas.width * 1.0 / this.bufferLength;
    let x = 0;

    for (let i = 0; i < this.bufferLength; i++) {
      let v = this.dataArray[i] / 128.0;
      let y = v * this.canvas.height / 2;

      i === 0
        ? this
          .canvasCtx
          .moveTo(x, y)
        : this
          .canvasCtx
          .lineTo(x, y)

      x += sliceWidth;
    }

    this
      .canvasCtx
      .lineTo(this.canvas.width, this.canvas.height / 2);
    this
      .canvasCtx
      .stroke();
  }

  render() {
    return (
      <div>
        <p>Audio controller</p>

      </div>
    )
  }

}