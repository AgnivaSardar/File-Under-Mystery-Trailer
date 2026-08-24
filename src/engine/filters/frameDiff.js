export function frameDiff(frameA, frameB, output) {
  const a = frameA.data;
  const b = frameB.data;
  const out = output.data;
  for (let i = 0; i < a.length; i += 4) {
    const dr = Math.abs(a[i] - b[i]);
    const dg = Math.abs(a[i+1] - b[i+1]);
    const db = Math.abs(a[i+2] - b[i+2]);
    const diff = (dr + dg + db) / 3 > 30 ? 255 : 0;
    out[i] = diff;
    out[i+1] = diff;
    out[i+2] = diff;
    out[i+3] = 255;
  }
  return output;
}
