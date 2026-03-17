export interface Image {
  order: number;
  variants: {
    blur: string;
    small: string;
    main: string;
    original?: string;
    full?: string;
  };
  alt_text: string;
}
export interface Room {
  slug: string;
  name: string;
  adults_num: number;
  children_num: number;
  images: Array<Image>;
  price: number;
  beds: string;
}

export type Currency = "AMD" | "USD" | "EUR" | "RUB";
