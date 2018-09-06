export const calculateDecibels = (fft, data) => {
    const total = data.reduce((prev, curr) => {
        const float = curr / 0x80 - 1
        return prev + (float * float);
    }, 0)
    const rms = Math.sqrt(total / fft)
    if (!rms){
        return 0;
    } 
    return 20.0 * Math.log10(rms);
}
