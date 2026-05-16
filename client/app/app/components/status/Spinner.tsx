import eternityMain from "src/assets/eternity-main.png";
import eternityAccent from "src/assets/eternity-accent.png";
import eternityGrayMid from "src/assets/eternity-gray-mid.png";
import eternityWhite from "src/assets/eternity-white.png";

export default function Spinner({
  variation = "main",
  size = 32,
  speed = "normal",
}: {
  variation?: "main" | "accent" | "grayMid" | "white";
  size?: number;
  speed?: "slow" | "normal" | "fast";
}) {
  const speedStyles = {
    slow: "animate-[spin_4s_linear_infinite]",
    normal: "animate-[spin_2s_linear_infinite]",
    fast: "animate-[spin_0.5s_linear_infinite]",
  };
  const spinnerImg = {
    main: eternityMain,
    accent: eternityAccent,
    grayMid: eternityGrayMid,
    white: eternityWhite,
  };
  return (
    <div
      className={`text-center ${speedStyles[speed]}`}
      style={{
        height: size,
        width: size,
      }}
    >
      <img src={spinnerImg[variation]} className="-scale-x-100" />
    </div>
  );
}
