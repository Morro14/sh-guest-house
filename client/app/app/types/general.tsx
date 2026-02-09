export interface HttpError {
  status: number;
  message: string;
  data?: unknown;
}
export type ImageSize = "small" | "main" | "full";
export type ImageRes = "small" | "blur" | "main" | "original";
