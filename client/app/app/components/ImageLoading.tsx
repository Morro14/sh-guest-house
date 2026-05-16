import { useState } from "react";
import Dots from "./status/Dots";
import Spinner from "./status/Spinner";

interface ImageProps {
  src: string;
}

export function ImageLoading({
  imageAttrs,
  placeholder = ImagePlacesholderDefault,
}: {
  imageAttrs: ImageProps & React.ImgHTMLAttributes<HTMLImageElement>;
  placeholder?: React.ReactNode;
}) {
  const [loaded, setLoaded] = useState(false);
  const { className, ...rest } = imageAttrs;
  return (
    <div className="size-full flex justify-center">
      <img
        {...rest}
        className={`${className ? className : ""} ${loaded ? "block" : "hidden"}`}
        onLoad={() => setLoaded(true)}
      ></img>
      <div
        className={`${!loaded ? "block" : "hidden"} size-full flex items-center justify-center`}
      >
        {placeholder}
      </div>
    </div>
  );
}

const ImagePlacesholderDefault = <Dots></Dots>;
