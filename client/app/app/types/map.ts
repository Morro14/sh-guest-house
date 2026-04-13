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

export interface MapPlaceOptions {
  offsets?: { topOffset: number; leftOffset: number };
  position?: "absolute" | "relative" | "static";
  contentPosition?: "top" | "bottom";
  iconPosition?: "left" | "right" | "top" | "bottom";
  dot?: boolean;
}
