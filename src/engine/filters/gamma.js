export function gamma(imageData, { gamma = 1.0 }) {
  const d = imageData.data;
  const gCorrection = 1 / gamma;
  for (let i = 0; i < d.length; i += 4) {
    d[i] = 255 * Math.pow(d[i] / 255, gCorrection);
    d[i+1] = 255 * Math.pow(d[i+1] / 255, gCorrection);
    d[i+2] = 255 * Math.pow(d[i+2] / 255, gCorrection);
  }
  return imageData;
}
