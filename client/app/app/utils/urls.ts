const BASE_URL = import.meta.env.VITE_SERVER_URL
export function createMediaLink(path: string) {
  return BASE_URL + path
}
