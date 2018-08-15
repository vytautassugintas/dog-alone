export const calculateDecibels = (fft, data) => {
  const total = data.reduce((prev, curr) => {
    const float = (curr / 0x80) - 1;
    return prev + (float * float);
  }, 0);
  const rms = Math.sqrt(total / fft);

  return 20 * (Math.log(rms) / Math.log(10));
}