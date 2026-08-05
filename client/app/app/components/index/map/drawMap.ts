import { MAP_OPTIONS, MAP_SIZE_INIT } from "./utils";

export default function drawMap() {
  const canvas = document.getElementById("map-canvas") as HTMLCanvasElement;
  const ctx = canvas.getContext("2d");
  const dpr = 2;
  // const rect = canvas.getBoundingClientRect();

  const mapImage = new Image();
  mapImage.src = "src/assets/map-paths.svg";
  canvas.width = MAP_OPTIONS.mapPadding + MAP_SIZE_INIT.x * dpr;
  canvas.height = MAP_OPTIONS.mapPadding + MAP_SIZE_INIT.y * dpr;

  const camera = {
    x: 0,
    y: 0,
    zoom: 1,
  };

  function resize() {
    // canvas.width = mapImage.naturalWidth;
    // canvas.height = mapImage.naturalHeight;
    draw();
  }

  window.addEventListener("resize", resize);

  mapImage.onload = () => {
    resize();
  };

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.save();

    // Camera transform
    ctx.translate(camera.x, camera.y);
    ctx.scale(camera.zoom, camera.zoom);

    // Draw map at world origin
    ctx.drawImage(mapImage, 0, 0);

    ctx.restore();
  }
}
