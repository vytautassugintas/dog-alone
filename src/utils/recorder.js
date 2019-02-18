// @see {@link https://en.wikipedia.org/wiki/Bit_rate}
const BITS_PER_SECOND = 96 * 1000;
const MAX_DECIBELS = -10;

export class Recorder {
  constructor() {
    this.mediaRecorder = {};
    this.source = {};
    this.audioCtx = new AudioContext();
    this.analyser = this.audioCtx.createAnalyser();
    this.analyser.maxDecibels = MAX_DECIBELS;
    this.startTime = null;
    this.endTime = null;

    this.onDataAvailable = () => {};
    this.onStop = () => {};
  }

  async init() {
    this.mediaRecorder = await this.createRecorder();

    this.mediaRecorder.addEventListener("dataavailable", event => {
      this.onDataAvailable(event);
    });

    this.mediaRecorder.addEventListener("stop", () => {
      this.onStop();
    });
  }

  createRecorder() {
    return navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
      this.source = this.audioCtx
        .createMediaStreamSource(stream)
        .connect(this.analyser);
      return new MediaRecorder(stream, {
        audioBitsPerSecond: BITS_PER_SECOND
      });
    });
  }

  start(timeSlice) {
    this.startTime = new Date();
    this.mediaRecorder.start(timeSlice);
  }

  stop() {
    this.endTime = new Date();
    this.mediaRecorder.stop();
  }

  getAudioUrl() {
    return URL.createObjectURL(this.getAudioBlob());
  }

  getAudio() {
    return new Audio(this.getAudioUrl());
  }
}
