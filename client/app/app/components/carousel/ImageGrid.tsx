import { useTranslation } from "react-i18next";
import { ImageLoading } from "../ImageLoading";
import type { Image } from "~/types/booking";
import { Grid } from "~/types/grid.ts";
import { useCarouselGridContextProvider } from "./CarouselGridContext.tsx";
import { useNavContextProvider } from "../nav/NavContextProvider.tsx";

const MEDIA_URL = import.meta.env.VITE_MEDIA_BASE_URL;

type GridFormats = "wide" | "medium" | "portrait" | "small";
export interface GridImage extends Image {
  format_in_grid: GridFormats;
}

const defaultGrid = new Grid();
export default function ImageGrid({
  grid = defaultGrid,
  gridIndex,
}: {
  grid: Grid;
  gridIndex: number;
}) {
  const { t } = useTranslation();
  const gridContext = useCarouselGridContextProvider();
  const navContext = useNavContextProvider();
  // const [displayMore, setDisplayMore] = useState(false);
  function genImageNode(format: GridFormats, index: number) {
    const targetImage = grid[format].images[index];
    if (!targetImage) {
      return ImagePlacesholder;
    }
    return (
      <ImageLoading
        imageAttrs={{
          className: "object-cover hover:cursor-pointer size-full",
          src: `${MEDIA_URL}${targetImage.variants.small}`,
          alt: `grid-${gridIndex}-image-${format}-${index}`,
          onClick: () => {
            navContext.setFullImageView(true);
            gridContext.setFullView(targetImage);
          },
        }}
        placeholder={ImagePlacesholder}
      ></ImageLoading>
    );
  }
  return (
    <div
      className={`index-container-1 gap-3 grid grid-cols-4 ${gridContext.showMoreImages ? "h-208" : "h-92"} transition-all duration-300 overflow-hidden`}
    >
      <div className={`col-span-4 h-92`}>{genImageNode("wide", 0)}</div>
      {gridContext.showMoreImages ? (
        <div className={`col-span-4 grid grid-cols-subgrid gap-y-3`}>
          <div className="col-span-2 row-span-2">
            {genImageNode("medium", 0)}
          </div>
          <div className="row-span-2">{genImageNode("portrait", 0)}</div>
          <div className="h-55">{genImageNode("small", 0)}</div>
          <div className="h-55">{genImageNode("small", 1)}</div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
}

const ImagePlacesholder = <div className="bg-gray-warm-light size-full"></div>;
