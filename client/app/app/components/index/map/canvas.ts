export default function draw(
  canvas: HTMLCanvasElement,
  pathsImage: HTMLImageElement,
  zoom: number = 1,
  size: { x: number; y: number },
) {
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    return;
  }
  const naturalWidth = pathsImage.naturalWidth * zoom;
  const naturalHeight = pathsImage.naturalHeight * zoom;

  const dpr = 2 * zoom;

  const displayWidth = Math.floor(size.x);
  const displayHeight = Math.floor(size.y);

  canvas.width = Math.floor(displayWidth * dpr);
  canvas.height = Math.floor(displayHeight * dpr);

  ctx.scale(dpr, dpr);
  canvas.style.width = `${displayWidth}px`;
  canvas.style.height = `${displayHeight}px`;
  // ctx.scale(zoom, zoom);
  // console.dir(canvas);
  const imageOffsets = {
    x: Math.floor((displayWidth - naturalWidth) / 2),
    y: Math.floor((displayHeight - naturalHeight) / 2),
  };
  ctx.drawImage(
    pathsImage,
    imageOffsets.x,
    imageOffsets.y,
    naturalWidth,
    naturalHeight,
  );
}
