import { ImageLoading } from "../ImageLoading";
import { useCarouselGridContextProvider } from "./CarouselGridContext.tsx";
import { useNavContextProvider } from "../nav/NavContextProvider.tsx";
import PlaceholderGrayBox from "../placeholders/PlaceholderGrayBox.tsx";
import type { Grid, GridImageFormats } from "~/types/grid.ts";
import { index } from "@react-router/dev/routes";

const MEDIA_URL = import.meta.env.VITE_MEDIA_BASE_URL;

// type GridFormats = "wide" | "medium" | "portrait" | "small";
// export interface GridImage extends Image {
//   format_in_grid: GridFormats;
// }

export default function ImageGrid({
  grid,
  gridIndex,
  gridLen,
}: {
  grid: Grid | 0;
  gridIndex: number;
  gridLen: number | undefined;
}) {
  const gridContext = useCarouselGridContextProvider();
  const navContext = useNavContextProvider();
  function genImageNode(format: GridImageFormats, index: number) {
    if (grid === 0 || !grid) {
      return <PlaceholderGrayBox></PlaceholderGrayBox>;
    }
    const targetImages = grid.grid_images.filter(
      (image) => image.format_in_grid === format,
    );
    let targetImage = null;
    if (targetImages.length >= index + 1) {
      targetImage = targetImages[index];
    }
    if (!targetImage) {
      return <PlaceholderGrayBox></PlaceholderGrayBox>;
    }
    const imgRes = {
      wide: "main",
      medium: "small",
      portrait: "small",
      small: "small",
    };
    return (
      <ImageLoading
        imageAttrs={{
          className:
            "object-cover hover:cursor-pointer size-full select-none hover:scale-102 transition-scale duration-600 origin-center",
          src: `${MEDIA_URL}${targetImage.variants[imgRes[format]]}`,
          alt: `grid-${gridIndex}-image-${format}-${index}`,
          onClick: () => {
            navContext.setFullImageView(true);
            gridContext.setFullView(targetImage);
          },
        }}
        placeholderStatic=<PlaceholderGrayBox></PlaceholderGrayBox>
      ></ImageLoading>
    );
  }
  const heightFirstRow = `2xl:h-92 md:h-55 h-27`;
  const heightRow = `2xl:h-92 md:h-55 h-27`;
  const heightGridFull = `2xl:h-187 md:h-112 h-55`;
  const heightHalfRow = `2xl:h-45 md:h-26.5 h-13`;
  const gap = "2xl:gap-3 md:gap-2 gap-1 ";
  // flip layout
  const midGidsToReverse = Array.from(
    { length: gridLen - 3 },
    (_, i) => 3 + i,
  ).filter((_, i) => i % 2 === 0);
  const reverseLayoutIndecies = [1, ...midGidsToReverse, gridLen - 1];
  return (
    <div
      className={`index-container-1 ${gap} grid grid-cols-4 ${gridContext.showMoreImages ? heightGridFull : heightFirstRow} transition-all duration-300 overflow-hidden`}
    >
      {!reverseLayoutIndecies.includes(gridIndex) ? (
        <div className={`col-span-4 overflow-hidden ${heightFirstRow}`}>
          {genImageNode("wide", 0)}
        </div>
      ) : (
        <div
          className={`grid col-span-4 grid-cols-subgrid ${gap} ${heightRow}`}
        >
          <div className={`col-span-2 row-span-2 overflow-hidden ${heightRow}`}>
            {genImageNode("medium", 0)}
          </div>
          <div className={`row-span-2 overflow-hidden ${heightRow}`}>
            {genImageNode("portrait", 0)}
          </div>
          <div className={`${heightHalfRow} overflow-hidden row-span-1`}>
            {genImageNode("small", 0)}
          </div>
          <div className={`${heightHalfRow} overflow-hidden row-span-1`}>
            {genImageNode("small", 1)}
          </div>
        </div>
      )}
      {gridContext.showMoreImages ? (
        !reverseLayoutIndecies.includes(gridIndex) ? (
          <div
            className={`grid col-span-4 grid-cols-subgrid ${gap} ${heightRow}`}
          >
            <div
              className={`col-span-2 row-span-2 overflow-hidden ${heightRow}`}
            >
              {genImageNode("medium", 0)}
            </div>
            <div className={`row-span-2 overflow-hidden ${heightRow}`}>
              {genImageNode("portrait", 0)}
            </div>
            <div className={`${heightHalfRow} overflow-hidden row-span-1`}>
              {genImageNode("small", 0)}
            </div>
            <div className={`${heightHalfRow} overflow-hidden row-span-1`}>
              {genImageNode("small", 1)}
            </div>
          </div>
        ) : (
          <div className={`col-span-4 overflow-hidden ${heightFirstRow}`}>
            {genImageNode("wide", 0)}
          </div>
        )
      ) : (
        ""
      )}
    </div>
  );
}
