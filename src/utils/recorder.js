export class Recorder {
  constructor() {
    this.mediaRecorder = {};
    this.source = {};
    this.audioCtx = new AudioContext();
    this.analyser = this.audioCtx.createAnalyser();

    this.onDataAvailable = () => {};
    this.onStop = () => {};
  }

  async init(){
    this.mediaRecorder = await this.createRecorder();

    this.mediaRecorder.addEventListener("dataavailable", event => {
      this.onDataAvailable(event);
    });

    this.mediaRecorder.addEventListener("stop", () => {
      this.onStop();
    });
  }
  
  start(timeSlice) {
    this.mediaRecorder.start(timeSlice);   
  }

  stop(){
    this.mediaRecorder.stop();
  }
  
  createRecorder() {
    return navigator
      .mediaDevices
      .getUserMedia({audio: true})
      .then(stream => {
        this.source = this.audioCtx
            .createMediaStreamSource(stream)
            .connect(this.analyser);
        return new MediaRecorder(stream);
      })
  }


  
  async getRecorder() {
    return await createRecorder();
  }

}


