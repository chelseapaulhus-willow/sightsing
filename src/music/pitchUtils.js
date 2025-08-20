// music/pitchUtils.js
export const midiToHz = (m) => 440 * Math.pow(2, (m - 69) / 12);
export const hzToMidi = (hz) => 69 + 12 * Math.log2(hz / 440);

// percent difference from the target frequency
export const percentDiff = (hz, targetHz) =>
  targetHz > 0 ? ((hz - targetHz) / targetHz) * 100 : 0;
