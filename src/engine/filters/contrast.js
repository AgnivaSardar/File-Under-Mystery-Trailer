export function contrast(imageData, { contrast = 0 }) {
  const d = imageData.data;
  const factor = (259 * (contrast + 255)) / (255 * (259 - contrast));
  for (let i = 0; i < d.length; i += 4) {
    d[i] = Math.min(255, Math.max(0, factor * (d[i] - 128) + 128));
    d[i+1] = Math.min(255, Math.max(0, factor * (d[i+1] - 128) + 128));
    d[i+2] = Math.min(255, Math.max(0, factor * (d[i+2] - 128) + 128));
  }
  return imageData;
}
