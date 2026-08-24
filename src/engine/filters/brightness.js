export function brightness(imageData, { value = 0 }) {
  const d = imageData.data;
  for (let i = 0; i < d.length; i += 4) {
    d[i] = Math.min(255, Math.max(0, d[i] + value));
    d[i+1] = Math.min(255, Math.max(0, d[i+1] + value));
    d[i+2] = Math.min(255, Math.max(0, d[i+2] + value));
  }
  return imageData;
}
