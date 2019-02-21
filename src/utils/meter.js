let audioContext = null;
let meter = null;
let canvasContext = null;
let WIDTH = 500;
let HEIGHT = 50;
let rafID = null;

window.onload = function() {
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
      gotStream,
      didntGetStream
    );
  } catch (e) {
    alert("getUserMedia threw exception :" + e);
  }
};

function didntGetStream() {
  alert("Stream generation failed.");
}

let mediaStreamSource = null;

function gotStream(stream) {
  mediaStreamSource = audioContext.createMediaStreamSource(stream);

  meter = createAudioMeter(audioContext);
  mediaStreamSource.connect(meter);

  drawLoop();
}

function drawLoop(time) {
  canvasContext.clearRect(0, 0, WIDTH, HEIGHT);

  if (meter.checkClipping()) canvasContext.fillStyle = "red";
  else canvasContext.fillStyle = "green";

  canvasContext.fillRect(0, 0, meter.volume * WIDTH * 1.4, HEIGHT);

  rafID = window.requestAnimationFrame(drawLoop);
}

function createAudioMeter(audioContext, clipLevel, averaging, clipLag) {
  let processor = audioContext.createScriptProcessor(512);
  processor.onaudioprocess = volumeAudioProcess;
  processor.clipping = false;
  processor.lastClip = 0;
  processor.volume = 0;
  processor.clipLevel = clipLevel || 0.98;
  processor.averaging = averaging || 0.95;
  processor.clipLag = clipLag || 750;

  processor.connect(audioContext.destination);

  processor.checkClipping = function() {
    if (!this.clipping) return false;
    if (this.lastClip + this.clipLag < window.performance.now())
      this.clipping = false;
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
    console.log(this.volume);
  }
}
