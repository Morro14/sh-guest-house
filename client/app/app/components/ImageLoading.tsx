import { useState } from "react";
import Dots from "./status/Dots";
import Spinner from "./status/Spinner";
import Placeholder from "./Placeholder";

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
  const [loadedError, setLoadedError] = useState(false);
  const { className, src, ...rest } = imageAttrs;
  return (
    <div className="size-full flex justify-center">
      {src && !loadedError ? (
        <img
          {...rest}
          src={src}
          className={`${className ? className : ""} ${loaded ? "block" : "hidden"}`}
          onLoad={() => setLoaded(true)}
          onError={() => setLoadedError(true)}
        ></img>
      ) : (
        <Placeholder></Placeholder>
      )}
      <div
        className={`${!loaded && !loadedError ? "block" : "hidden"} size-full flex items-center justify-center`}
      >
        {placeholder}
      </div>
    </div>
  );
}

const ImagePlacesholderDefault = <Dots></Dots>;
