import type { Image } from "./images.ts";

export type GridImageFormats = "wide" | "medium" | "portrait" | "small";

export interface GridImage extends Image {
  format_in_grid: GridImageFormat;
  grid: number;
}
type GridImageFormat = GridImageFormats;
export interface Grid {
  index: number;
  grid_images: GridImage[];
}
// export class Grid {
//   index: number;
//   images: GridImage[];
//
//   addImage(image: GridImage) {
//     this[image.format_in_grid].images.push(image);
//   }
//
//   hasFreeImageSlot(image: GridImage) {
//     return (
//       this[image.format_in_grid].images.length <
//       this[image.format_in_grid].maxImages
//     );
//   }
//
//   getImages() {}
// }
