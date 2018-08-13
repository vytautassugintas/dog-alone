function createRecorder() {
  return navigator
    .mediaDevices
    .getUserMedia({audio: true})
    .then(stream => ({stream, mediaRecorder: new MediaRecorder(stream)}))
}

export async function getRecorder() {
  return await createRecorder();
}