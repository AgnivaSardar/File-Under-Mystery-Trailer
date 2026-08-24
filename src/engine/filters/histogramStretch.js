export function histogramStretch(imageData, { min = 0, max = 255 }) {
  const d = imageData.data;
  const range = (max - min) || 1;
  const scale = 255 / range;
  for (let i = 0; i < d.length; i += 4) {
    d[i] = Math.min(255, Math.max(0, (d[i] - min) * scale));
    d[i+1] = Math.min(255, Math.max(0, (d[i+1] - min) * scale));
    d[i+2] = Math.min(255, Math.max(0, (d[i+2] - min) * scale));
  }
  return imageData;
}
