import type { Image } from "./images";

export interface MapPlaceData {
  slug: string;
  name: string;
  distance: number;
  distance_comment: string;
  description: string;
  geoloc: string;
  info_link: string;
  images: Image[];
  iconURL?: string;
}

// export interface MapPlaceOptions {
//   offsets?: { x: number; y: number };
//   position?: "absolute" | "relative" | "static";
//   contentPosition?: "top" | "bottom";
//   iconPosition?: "left" | "right" | "top" | "bottom";
//   dot?: boolean;
//   group?: string;
// }
export interface MapLabelOptions {
  offsets?: Coords;
  position?: "absolute" | "relative" | "static";
  dot?: boolean;
  grouped?: boolean;
  group?: string;
  importanceLevel?: number;
}

export interface MapLabelPosData {
  name: string;
  options: MapLabelOptions;
  type?: "placeLabel";
}
export interface MapItemPosData {
  name: string;
  offsets: Coords;
  type?: "townLabel" | "placeDot";
}
export interface TownLabelPosData {
  name: string;
  offsets: Coords;
  type?: "townLabel";
}
export interface MapLabelGroupPosData {
  name: string;
  offsets: Coords;
}

export interface MapLabelGroupData {
  name: string;
  places: string[];
  offsets: Coords;
}

export interface Coords {
  x: number;
  y: number;
}

export interface Size {
  x: number;
  y: number;
}
export interface MapZoomArgs {
  container: HTMLDivElement;
  mapSurface: HTMLDivElement;
  mapContent: HTMLDivElement;
  newZoom: number;
  pinchCenter?: Coords;
}
export interface MapZoom2Args {
  mapSurfaceOffsets: Coords;
  mapContainerSize: Size;
  mapSurfaceSize: Size;
  mapContentSize: Size;
  currentZoom: number;
  newZoom: number;
  pinchCenter?: Coords;
}
export type MapZoom = (args: MapZoomArgs) => void;

export interface MapElements {
  mapSurface: HTMLDivElement;
  mapContainer: HTMLDivElement;
  mapContent: HTMLDivElement;
}
export interface MapMessagesModal {
  name: string;
  message: string;
}
const movableItems = ["placeLabel", "townLabel", "placeDot"] as const;
export type MovableItem = (typeof movableItems)[number];
