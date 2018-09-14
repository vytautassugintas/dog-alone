import React, { Component } from 'react';
import { Timer } from './Timer';
import { Recorder } from '../utils/recorder';
import { calculateDecibels } from '../utils/decibels';
import { saveBlob, getFileNameAppendix } from '../utils/file';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const TIME_SLICE = 60;
const FFT = 2048;
const AUDIO_FORMAT = 'mp4';
const BYTES_TO_MEGABYTES = 1000000;
const dB_EMIT_TRESHOLD = -30;

export class AudioRecorder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isRecording: false,
      recorded: false,
      recordingSize: 0,
      decibels: 0
    };

    this.dataArray = new Uint8Array(FFT);

    this.toggleRecording = this.toggleRecording.bind(this);
    this.onSaveAudio = this.onSaveAudio.bind(this);
    this.onPlayAudio = this.onPlayAudio.bind(this);

    this.startTimer = () => {};
    this.stopTimer = () => {};
  }
  async componentDidMount() {
    this.mediaRecorder = new Recorder();
    await this.mediaRecorder.init();

    this.mediaRecorder.analyser.fftSize = FFT;
    this.bufferLength = this.mediaRecorder.analyser.frequencyBinCount;

    this.mediaRecorder.onDataAvailable = () => {
      const { analyser, recordingSize } = this.mediaRecorder;
      analyser.getByteTimeDomainData(this.dataArray);
      const decibels = calculateDecibels(FFT, this.dataArray);

      if (decibels >= dB_EMIT_TRESHOLD){
          // todo: emit here
      }
      
      this.setState(() => ({
        recordingSize: recordingSize,
        decibels
      }));
      this.draw(this.dataArray, this.bufferLength);
    };

    this.mediaRecorder.onStop = () => {
      this.setState(() => ({
        recorded: true
      }));
    };

    this.canvas = this.refs.canvas;
    this.canvasCtx = this.refs.canvas.getContext('2d');
    this.draw(this.dataArray, this.bufferLength);
  }

  onSaveAudio() {
    saveBlob(
      this.mediaRecorder.getAudioBlob(),
      `ramplis_${getFileNameAppendix()}.${AUDIO_FORMAT}`
    );
  }

  onPlayAudio() {
    const audio = this.mediaRecorder.getAudio();
    audio.play();
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

  draw(data, bufferLength) {
    this.canvasCtx.fillStyle = 'rgb(200, 200, 200)';
    this.canvasCtx.fillRect(
      0,
      0,
      this.refs.canvas.width,
      this.refs.canvas.height
    );
    this.canvasCtx.lineWidth = 1;
    this.canvasCtx.strokeStyle = 'rgb(0, 0, 0)';
    this.canvasCtx.beginPath();

    let sliceWidth = (this.canvas.width * 1.0) / bufferLength;
    let x = 0;

    data.forEach((data, index) => {
      let v = data / 128.0;
      let y = (v * this.canvas.height) / 2;

      index === 0 ? this.canvasCtx.moveTo(x, y) : this.canvasCtx.lineTo(x, y);

      x += sliceWidth;
    });

    this.canvasCtx.lineTo(this.canvas.width, this.canvas.height / 2);
    this.canvasCtx.stroke();
  }

  render() {
    const { isRecording, recorded, recordingSize, decibels } = this.state;
    return (
      <div>
        <p>Audio controller</p>
        <div>
          <FontAwesomeIcon icon="clock" />
          <Timer
            ref={instance => {
              this.timerInstanse = instance;
            }}
          />
        </div>
        <div>
          <FontAwesomeIcon icon="weight-hanging" />
          {(recordingSize / BYTES_TO_MEGABYTES).toFixed(2)} mb
        </div>
        <div>
          <FontAwesomeIcon icon="drum" />
          {decibels.toFixed(2)} decibels
        </div>
        <div style={{ marginBottom: 12 }}>
          <button onClick={this.toggleRecording}>
            {isRecording ? 'Stop recording' : 'Start recording'}
          </button>
          {recorded && (
            <span>
              <button style={{ marginLeft: 12 }} onClick={this.onSaveAudio}>
                Save
              </button>
              <button style={{ marginLeft: 12 }} onClick={this.onPlayAudio}>
                Play
              </button>
            </span>
          )}
        </div>
        <div>
          <canvas ref="canvas" width={640} height={480} />
        </div>
      </div>
    );
  }
}
