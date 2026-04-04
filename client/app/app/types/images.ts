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
