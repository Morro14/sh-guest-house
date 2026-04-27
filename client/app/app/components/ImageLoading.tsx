import { useState } from "react";

interface ImageProps {
  src: string;
}

export function ImageLoading({
  imageAttrs,
  placeholder = ImagePlacesholder,
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
      <div className={!loaded ? "block" : "hidden"}>{placeholder}</div>
    </div>
  );
}

const ImagePlacesholder = <div className="bg-gray-warm-light size-full"></div>;
