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
  offsets?: { x: number; y: number };
  position?: "absolute" | "relative" | "static";
  contentPosition?: "top" | "bottom";
  iconPosition?: "left" | "right" | "top" | "bottom";
  dot?: boolean;
  grouped: boolean;
}

export interface MapLabelPosData {
  name: string;
  options: MapLabelOptions;
}

export interface MapOptions {
  // actual size of the map content without padding
  mapContentSize: Size;
  mapPadding: number;
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
