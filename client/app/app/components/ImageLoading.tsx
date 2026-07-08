import { useEffect, useRef, useState } from "react";
import PlaceholderGrayBox from "./placeholders/PlaceholderGrayBox";
import PlaceholderLoading from "./placeholders/PlaceholderLoading";

interface ImageProps {
  src: string;
}

export function ImageLoading({
  imageAttrs,
  placeholderStatic = <PlaceholderGrayBox></PlaceholderGrayBox>,
  placeholderLoading = <PlaceholderLoading></PlaceholderLoading>,
}: {
  imageAttrs: ImageProps & React.ImgHTMLAttributes<HTMLImageElement>;
  placeholderStatic?: React.ReactNode;
  placeholderLoading?: React.ReactNode;
}) {
  const [loaded, setLoaded] = useState(false);
  const [loadedError, setLoadedError] = useState(false);
  const { className, src, ...rest } = imageAttrs;
  return (
    <div className={`size-full block`}>
      {src && !loadedError ? (
        <img
          {...rest}
          src={src}
          className={`${className ? className : ""} ${loaded ? "block" : "hidden"}`}
          onLoad={() => setLoaded(true)}
          onError={() => setLoadedError(true)}
        ></img>
      ) : (
        placeholderStatic
      )}
      <div
        className={`${!loaded && !loadedError ? "block" : "hidden"} size-full flex items-center justify-center`}
      >
        {placeholderLoading}
      </div>
    </div>
  );
}
