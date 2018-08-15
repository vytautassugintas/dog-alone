export class Recorder {
    constructor() {
        this.mediaRecorder = {}
        this.source = {}
        this.audioChunks = []
        this.audioCtx = new AudioContext()
        this.analyser = this.audioCtx.createAnalyser()

        this.startTime;
        this.endTime;

        this.onDataAvailable = () => {}
        this.onStop = () => {}
    }

    async init() {
        this.mediaRecorder = await this.createRecorder()

        this.mediaRecorder.addEventListener('dataavailable', event => {
            this.audioChunks.push(event.data)
            this.onDataAvailable(event)
        })

        this.mediaRecorder.addEventListener('stop', () => {
            this.onStop()
        })
    }

    createRecorder() {
        return navigator.mediaDevices
            .getUserMedia({ audio: true })
            .then(stream => {
                this.source = this.audioCtx
                    .createMediaStreamSource(stream)
                    .connect(this.analyser)
                return new MediaRecorder(stream, {
                    audioBitsPerSecond: 12800,
                })
            })
    }

    start(timeSlice) {
        this.startTime = new Date();
        this.mediaRecorder.start(timeSlice)
    }

    stop() {
        this.endTime = new Date();
        this.mediaRecorder.stop()
    }

    getAudioBlob() {
        return new Blob(this.audioChunks)
    }

    getAudioUrl() {
        return URL.createObjectURL(this.getAudioBlob())
    }

    getAudio() {
        return new Audio(this.getAudioUrl())
    }
}
