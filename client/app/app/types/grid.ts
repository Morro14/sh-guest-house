import type { Image } from "./images.ts";

type GRID_IMAGE_FORMATS = "wide" | "medium" | "portrait" | "small";

export interface GridImage extends Image {
  format_in_grid: GridImageFormat;
}
type GridImageFormat = GRID_IMAGE_FORMATS;

export class Grid {
  wide = { maxImages: 1, images: [] };
  medium = { maxImages: 1, images: [] };
  portrait = { maxImages: 1, images: [] };
  small = { maxImages: 2, images: [] };

  addImage(image: GridImage) {
    this[image.format_in_grid].images.push(image);
  }

  hasFreeImageSlot(image: GridImage) {
    return (
      this[image.format_in_grid].images.length <
      this[image.format_in_grid].maxImages
    );
  }

  getImages() {}
}
