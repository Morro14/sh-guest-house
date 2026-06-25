import Dots from "~/components/status/Dots";

interface PlaceholderLoadingOptions {
  minWidth?: number;
  minHeight?: number;
  spinner?: React.JSX.Element;
  attrs?: React.HTMLAttributes<HTMLDivElement>;
}
export default function PlaceholderLoading({
  minWidth = 0,
  minHeight = 0,
  spinner = Dots(),
  attrs = {},
}: PlaceholderLoadingOptions = {}) {
  const { className, ...restAttrs } = attrs;
  return (
    <div
      {...restAttrs}
      className={`${className ? className : ""} w-full h-full bg-gray-warm-light flex justify-center items-center`}
      aria-disabled
      style={{ minWidth: minWidth, minHeight: minHeight }}
    >
      {spinner}
    </div>
  );
}
