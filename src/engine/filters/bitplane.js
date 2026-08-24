export function bitplane(imageData, { channel = 2, bit = 0 }) {
  const d = imageData.data;
  for (let i = 0; i < d.length; i += 4) {
    const val = (d[i + channel] >> bit) & 1;
    const color = val ? 255 : 0;
    d[i] = color;
    d[i+1] = color;
    d[i+2] = color;
  }
  return imageData;
}
