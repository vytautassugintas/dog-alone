let audioContext = null;
let meter = null;
let canvasContext = null;
let rafID = null;
let mediaStreamSource = null;

const WIDTH = 500;
const HEIGHT = 50;

export function init({ onExcessVolume = () => {}, shouldDraw = true }) {
  canvasContext = document.getElementById("meter").getContext("2d");
  window.AudioContext = window.AudioContext || window.webkitAudioContext;
  audioContext = new AudioContext();

  try {
    navigator.getUserMedia =
      navigator.getUserMedia ||
      navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia;

    navigator.getUserMedia(
      {
        audio: {
          mandatory: {
            googEchoCancellation: "false",
            googAutoGainControl: "false",
            googNoiseSuppression: "false",
            googHighpassFilter: "false"
          },
          optional: []
        }
      },
      function onSuccess(stream) {
        mediaStreamSource = audioContext.createMediaStreamSource(stream);

        meter = createAudioMeter({ audioContext, onExcessVolume });
        mediaStreamSource.connect(meter);
        if (shouldDraw) {
          drawLoop();
        }
      },
      function onError() {
        alert("Stream generation failed.");
      }
    );
  } catch (e) {
    alert("getUserMedia threw exception :" + e);
  }
}

function drawLoop() {
  canvasContext.clearRect(0, 0, WIDTH, HEIGHT);

  if (meter.checkClipping()) {
    canvasContext.fillStyle = "#e74c3c";
  } else {
    canvasContext.fillStyle = "#38ada9";
  }

  canvasContext.fillRect(0, 0, meter.volume * WIDTH * 2, HEIGHT);

  rafID = window.requestAnimationFrame(drawLoop);
}

function createAudioMeter({
  audioContext,
  onExcessVolume = () => {},
  clipLevel,
  averaging,
  clipLag
}) {
  let processor = audioContext.createScriptProcessor(512);

  processor.onaudioprocess = volumeAudioProcess;
  processor.onExcessVolume = onExcessVolume;
  processor.clipping = false;
  processor.lastClip = 0;
  processor.volume = 0;
  processor.clipLevel = clipLevel || 0.98;
  processor.averaging = averaging || 0.95;
  processor.clipLag = clipLag || 750;

  processor.connect(audioContext.destination);

  processor.checkClipping = function() {
    if (!this.clipping) {
      return false;
    }

    if (this.lastClip + this.clipLag < window.performance.now()) {
      this.clipping = false;
    }

    return this.clipping;
  };

  processor.shutdown = function() {
    this.disconnect();
    this.onaudioprocess = null;
  };

  return processor;
}

function volumeAudioProcess(event) {
  let buf = event.inputBuffer.getChannelData(0);
  let bufLength = buf.length;
  let sum = 0;
  let x;

  for (let i = 0; i < bufLength; i++) {
    x = buf[i];
    if (Math.abs(x) >= this.clipLevel) {
      this.clipping = true;
      this.lastClip = window.performance.now();
    }
    sum += x * x;
  }

  let rms = Math.sqrt(sum / bufLength);

  this.volume = Math.max(rms, this.volume * this.averaging);

  if (this.volume > 0.1) {
    this.onExcessVolume(this.volume);
  }
}
