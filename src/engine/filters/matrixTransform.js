export function unscrambleTiles(sourceCtx, targetCtx, width, height, gridSize, permutation) {
  const tileW = width / gridSize;
  const tileH = height / gridSize;
  for (let i = 0; i < permutation.length; i++) {
    const srcIndex = permutation[i];
    const sx = (srcIndex % gridSize) * tileW;
    const sy = Math.floor(srcIndex / gridSize) * tileH;
    const dx = (i % gridSize) * tileW;
    const dy = Math.floor(i / gridSize) * tileH;
    targetCtx.drawImage(sourceCtx.canvas, sx, sy, tileW, tileH, dx, dy, tileW, tileH);
  }
}
