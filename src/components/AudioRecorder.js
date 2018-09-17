import React, { Component } from 'react';
import { Timer } from './Timer';
import { Recorder } from '../utils/recorder';
import { calculateDecibels } from '../utils/decibels';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { emitDecibelIncrease } from '../utils/sockets';
import { getTimeDiff } from '../utils/time';

const TIME_SLICE = 60;
const FFT = 2048;
const AUDIO_FORMAT = 'mp4';
const BYTES_TO_MEGABYTES = 1000000;
const MIN_TIME_FRAME = 3;
const dB_EMIT_TRESHOLD = -30;

export class AudioRecorder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isRecording: false,
      recordingSize: 0,
      decibels: 0
    };

    this.dataArray = new Uint8Array(FFT);
    this.toggleRecording = this.toggleRecording.bind(this);

    this.startTimer = () => {};
    this.stopTimer = () => {};
  }

  async componentDidMount() {
    this.mediaRecorder = new Recorder();
    await this.mediaRecorder.init();

    this.mediaRecorder.analyser.fftSize = FFT;
    this.bufferLength = this.mediaRecorder.analyser.frequencyBinCount;

    let eventTime = new Date();

    this.mediaRecorder.onDataAvailable = () => {
      const { analyser } = this.mediaRecorder;
      analyser.getByteTimeDomainData(this.dataArray);
      const decibels = calculateDecibels(FFT, this.dataArray);

      if (
        decibels >= dB_EMIT_TRESHOLD &&
        getTimeDiff({ eventTime }) > MIN_TIME_FRAME
      ) {
        emitDecibelIncrease({ decibels });
        eventTime = new Date();
      }

      this.setState(() => ({
        decibels
      }));
      this.draw(this.dataArray, this.bufferLength);
    };

    this.canvasCtx = this.refs.canvas.getContext('2d');
    this.draw(this.dataArray, this.bufferLength, true);
  }

  toggleRecording() {
    this.setState(
      prevState => ({
        isRecording: !prevState.isRecording
      }),
      () => {
        if (this.state.isRecording) {
          this.mediaRecorder.start(TIME_SLICE);
          this.timerInstanse.startTimer();
        } else {
          this.mediaRecorder.stop();
          this.timerInstanse.stopTimer();
        }
      }
    );
  }

  draw(data, bufferLength, isInitial = false) {
    const { width, height } = this.refs.canvas;
    this.canvasCtx.fillStyle = '#ffffff';
    this.canvasCtx.fillRect(0, 0, width, height);
    this.canvasCtx.lineWidth = 2;
    this.canvasCtx.strokeStyle = '#000000';
    this.canvasCtx.beginPath();

    let sliceWidth = (width * 1.0) / bufferLength;
    let x = 0;

    if (!isInitial) {
      data.forEach((data, index) => {
        let v = data / 128;
        let y = (v * height) / 2;

        index === 0 ? this.canvasCtx.moveTo(x, y) : this.canvasCtx.lineTo(x, y);

        x += sliceWidth;
      });
    } else {
      this.canvasCtx.moveTo(0, height / 2);
    }
    this.canvasCtx.lineTo(width, height / 2);
    this.canvasCtx.stroke();
  }

  render() {
    const { isRecording, decibels } = this.state;
    return (
      <div>
        <div style={{ marginBottom: 12 }}>
          <button onClick={this.toggleRecording}>
            {isRecording ? 'Stop monitoring' : 'Start monitoring'}
          </button>
        </div>
        <div>
          <canvas ref="canvas" width={640} height={80} />
        </div>
        <div className="info-wrapper">
          <span className="info-item">
            <FontAwesomeIcon className="icon" icon="clock" />
            <Timer
              ref={instance => {
                this.timerInstanse = instance;
              }}
            />
          </span>
          <span className="info-item">
            <FontAwesomeIcon className="icon" icon="drum" />
            {decibels.toFixed(2)} decibels
          </span>
        </div>
      </div>
    );
  }
}
