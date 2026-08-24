import FFT from "fft.js";

export function applyRadialBandpass(fftData, width, height, rMin, rMax) {
  const cx = width / 2;
  const cy = height / 2;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const r = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2);
      const idx = (y * width + x) * 2;
      if (r < rMin || r > rMax) {
        fftData[idx] = 0;
        fftData[idx + 1] = 0;
      }
    }
  }
  return fftData;
}
