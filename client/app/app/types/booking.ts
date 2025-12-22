import type { Image } from "./nav";


export interface Room {
  slug: string;
  name: string;
  adults_num: number;
  children_num: number;
  images: Array<Image>;
  price: number;
  beds: string;
}


export type Currency = "AMD" | "USD" | "EUR" | "RUB"


