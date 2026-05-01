interface Options {
  moveEnabled: boolean;
}
export default function useMoveMap(
  container: HTMLDivElement,
  map: HTMLDivElement,
  options: Options,
) {
  if (!map || !container) {
    return;
  }
  let mouseDownX: number, mouseDownY: number;
  let mapOffsetX: number = map.offsetLeft;
  let mapOffsetY: number = map.offsetTop;

  const move = (e: MouseEvent) => {
    map.style.cursor = "grabbing";
    const deltaX = e.clientX - mouseDownX;
    const deltaY = e.clientY - mouseDownY;

    const minX = container.clientWidth - map.clientWidth;
    const minY = container.clientHeight - map.clientHeight;

    let newX = mapOffsetX + deltaX;
    let newY = mapOffsetY + deltaY;

    newX = Math.min(Math.max(newX, minX), 0);
    newY = Math.min(Math.max(newY, minY), 0);
    map.style.left = `${newX}px`;
    map.style.top = `${newY}px`;
  };
  const registerMouseDown = (e: MouseEvent) => {
    const target = e.target as Element;
    const includesMapElements = ["map-surface", "map-img"].includes(target.id);
    if (!includesMapElements) {
      return;
    }
    mouseDownX = e.clientX;
    mouseDownY = e.clientY;
    mapOffsetX = map.offsetLeft;
    mapOffsetY = map.offsetTop;
    document.addEventListener("mousemove", move);
    document.addEventListener(
      "mouseup",
      () => {
        map.style.cursor = "grab";
        document.removeEventListener("mousemove", move);
        mapOffsetX = map.offsetLeft;
        mapOffsetY = map.offsetTop;
      },
      { once: true },
    );
  };
  if (options.moveEnabled) {
    map.addEventListener("mousedown", registerMouseDown);
  } else {
    map.removeEventListener("mousedown", registerMouseDown);
  }
}
