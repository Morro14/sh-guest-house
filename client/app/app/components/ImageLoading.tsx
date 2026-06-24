import { useState } from "react";
import Placeholder from "./Placeholder";
import PlaceholderLoading from "./PlaceholderLoading.tsx";

interface ImageProps {
  src: string;
}

export function ImageLoading({
  imageAttrs,
  placeholder = Placeholder({ text: "" }),
}: {
  imageAttrs: ImageProps & React.ImgHTMLAttributes<HTMLImageElement>;
  placeholder?: React.ReactNode;
}) {
  const [loaded, setLoaded] = useState(false);
  const [loadedError, setLoadedError] = useState(false);
  const { className, src, ...rest } = imageAttrs;
  const placeholderStatic = <Placeholder></Placeholder>;
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
        placeholderStatic
      )}
      <div
        className={`${!loaded && !loadedError ? "block" : "hidden"} size-full flex items-center justify-center`}
      >
        {placeholder}
      </div>
    </div>
  );
}
