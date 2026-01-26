import { useSearchParams } from "react-router";
import { Temporal } from "@js-temporal/polyfill";
import type { Currency } from "~/types/booking";

export function isDigit(s: string) {
  const regex = /^\d+$/;
  return regex.test(s);
}

export function getDefaultSearchParams() {
  const today = Temporal.Now.plainDateISO();
  const DATE = today.add({ days: 1 }).toString();
  const ADULTS_NUM = 2;
  const CHIlDREN_NUM = 0;
  const NIGHTS = 1;

  return {
    date: DATE,
    adults: ADULTS_NUM,
    children: CHIlDREN_NUM,
    nights: NIGHTS,
  };
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
