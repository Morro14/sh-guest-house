export default function NavScrollArrow({
  direction,
  scrollEl,
  scrollTop,
}: {
  direction: "up" | "down";
  scrollEl: HTMLElement;
  scrollTop: number;
}) {
  const styleConditions = {
    up: direction === "up" && scrollTop !== 0,
    down:
      direction === "down" &&
      scrollTop + 4 <= scrollEl?.scrollHeight - scrollEl?.offsetHeight,
  };
  const styles = {
    active: "stroke-peach group-hover:fill-peach cursor-pointer",
    inactive: "stroke-gray-warm-mid",
  };
  const active = styleConditions[direction];
  const svgStyle = () => {
    return styles[active ? "active" : "inactive"];
  };
  const handleClick = () => {
    if (!scrollEl) return;
    if (direction === "down") {
      scrollEl.scrollTop += 1000;
    } else {
      scrollEl.scrollTop -= 1000;
    }
  };
  return (
    <div
      onClick={handleClick}
      className={`absolute w-10 h-7 ${direction === "up" ? "rotate-180 -top-[38px]" : "-bottom-[44px]"} ${active ? "cursor-pointer" : "opacity-0"} transition-opacity duration-150`}
    >
      <svg
        className={`${svgStyle()} stroke-2 ${active ? "hover:stroke-3" : ""} transition-[stroke-width] duration-100`}
        width="38"
        height="15"
        viewBox="0 0 38 15"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M37.0002 1.00024C23.2634 6.1431 19.0002 10.7145 19.0002 15.0002C19.0002 10.7145 14.7371 6.1431 1.00024 1.00024"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}
