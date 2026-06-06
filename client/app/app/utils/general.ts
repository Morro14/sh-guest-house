import { useSearchParams } from "react-router";
import { Temporal } from "@js-temporal/polyfill";
import type { Currency } from "~/types/booking";
import { data } from "react-router";
import axios from "axios";
import i18n from "root/src/i18n/i18n";
const SERVER_URL = import.meta.env.VITE_SERVER_URL;
const MEDIA_URL = import.meta.env.VITE_MEDIA_BASE_URL;

export const getAxiosInstance = (baseURL: "media" | "api" = "api") => {
  axios.defaults.withCredentials = true;
  const baseURLs = {
    media: MEDIA_URL,
    api: SERVER_URL,
  };
  const axiosInstance = axios.create({
    baseURL: baseURLs[baseURL] + "/api/",
    // timeout: 10000,
  });
  axiosInstance.interceptors.request.use((config) => {
    // const url = new URL(window.location.pathname);
    const lang =
      i18n.language || getLanguagePathParam(window.location.pathname);
    if (lang) {
      config.headers["X-language"] = lang.split("-")[0];
    }
    return config;
  });
  return axiosInstance;
};

export function isDigit(s: string) {
  const regex = /^\d+$/;
  return regex.test(s);
}

export function getDefaultSearchParams() {
  const today = Temporal.Now.plainDateISO();
  const DATE = today.add({ days: 1 }).toString();
  const ADULTS_NUM = "2";
  const CHIlDREN_NUM = "0";
  const NIGHTS = "1";

  return {
    date: DATE,
    adults: ADULTS_NUM,
    children: CHIlDREN_NUM,
    nights: NIGHTS,
  };
}

export function getLanguagePathParam(pathname: string = null) {
  let segments = [];
  if (!pathname) {
    const url = new URL(document.location.toString());
    segments = url.pathname.split("/");
  } else {
    segments = pathname.split("/");
  }
  return segments[1];
}

export function getUrlSearchParams<const K extends readonly string[]>(keys: K) {
  const [params] = useSearchParams();
  const defaultParams = getDefaultSearchParams();
  const paramsObj = {} as { [P in K[number]]: string | null };

  keys.forEach((k) => {
    if (params.get(k)) {
      paramsObj[k] = isDigit(params.get(k))
        ? Number(params.get(k))
        : params.get(k);
    } else {
      paramsObj[k] = defaultParams[k];
    }
  });

  return paramsObj;
}

export const currencySymbols = {
  AMD: "֏",
  USD: "$",
  EUR: "€",
  RUB: "₽",
};

export function formatPrice(priceNum: number, currency: Currency) {
  const price = String(priceNum);
  const priceLength = price.length;
  const priceWithDot =
    priceLength >= 4
      ? price.slice(0, priceLength - 3) + "." + price.slice(priceLength - 3)
      : price;
  const currencySymbol = currencySymbols[currency] || currency;
  return currencySymbol + " " + priceWithDot;
}

export function toRouteError(error: Response) {
  if (axios.isAxiosError(error) && error.response) {
    throw data(error.response.data, {
      status: error.response.status,
      statusText: error.response.statusText,
    });
  }
  throw error;
}
