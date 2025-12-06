import { useSearchParams } from "react-router"

export function isDigit(s: string) {
  const regex = /^\d+$/
  return regex.test(s)
}

export function getUrlSearchParams<const K extends readonly string[]>(keys: K) {
  const [params] = useSearchParams()
  const paramsObj = {} as { [P in K[number]]: string | null }
  keys.forEach((k) => paramsObj[k] = params.get(k))
  return paramsObj
}

