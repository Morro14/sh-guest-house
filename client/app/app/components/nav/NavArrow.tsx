export default function NavArrow({
  direction,
  numElements,
  index,
  func,
}: {
  direction: "left" | "right";
  numElements: number;
  index: number;
  func: () => any;
}) {
  const styleConditions = {
    right: direction === "right" && index < numElements - 1,
    left: direction === "left" && index > 0,
  };
  const styles = {
    active: "stroke-peach hover:stroke-peach-light cursor-pointer",
    inactive: "stroke-gray-warm",
  };
  const active = styleConditions[direction];
  const svgStyle = () => {
    return styles[active ? "active" : "inactive"];
  };
  return (
    <svg
      onClick={func}
      className={
        "group " +
        (direction === "left" ? "rotate-180 " : "") +
        (active ? "cursor-pointer" : "") +
        " transition-colors " +
        svgStyle()
      }
      width="20"
      height="24"
      viewBox="0 0 20 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M1.00006 1C7.61231 9.26922 13.4899 11.8355 19.0001 11.8355"
        stroke-width="2"
        stroke-linecap="round"
      />
      <path
        d="M1.00006 22.6711C7.61231 14.4019 13.4899 11.8356 19.0001 11.8356"
        stroke-width="2"
        stroke-linecap="round"
      />
    </svg>
  );
}
