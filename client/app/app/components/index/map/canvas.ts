import mapPaths from "src/assets/map-paths.svg";

export default function draw(canvasRef: React.RefObject<HTMLCanvasElement>) {
  const ctx = canvasRef.current.getContext("2d");
  // const dpr = window.devicePixelRatio || 1;
  const dpr = 2;
  ctx.scale(dpr, dpr);
  const pathsImage = new Image();
  pathsImage.src = mapPaths;
  const naturalWidth = pathsImage.naturalWidth;
  const naturalHeight = pathsImage.naturalHeight;
  pathsImage.onload = function () {
    canvasRef.current.width = canvasRef.current.width;
    canvasRef.current.height = canvasRef.current.height;
    const imageOffsets = {
      x: Math.floor((canvasRef.current.width - naturalWidth) / 2),
      y: Math.floor((canvasRef.current.height - naturalHeight) / 2),
    };
    ctx.drawImage(
      pathsImage,
      imageOffsets.x,
      imageOffsets.y,
      naturalWidth,
      naturalHeight,
    );
    const canvasWidth = 1600;
    const canvasHeight = 1600;
    ctx.lineWidth = 0.1;
    // ctx.fillStyle = "#D0D0D0";
    // ctx.fillRect(0, 0, canvasWidth, 20);
    // ctx.fillText("test", 60, 60);
    for (let i = 1; i < canvasWidth / 20; i++) {
      // ctx.font = "10px sans";
      ctx.moveTo(i * 20, 0);
      ctx.lineTo(i * 20, canvasHeight);
      ctx.save();
      ctx.translate(i * 20, 0);
      ctx.rotate(Math.PI / 2);
      ctx.fillStyle = "black";
      ctx.fillText(String(i * 20), 0, 0);
      ctx.restore();
    }
    for (let i = 1; i < canvasHeight / 20; i++) {
      ctx.moveTo(0, i * 20);
      ctx.fillStyle = "black";
      ctx.fillText(String(i * 20), 0, i * 20);
      ctx.lineTo(canvasWidth, i * 20);
    }
    ctx.stroke();
  };
}
