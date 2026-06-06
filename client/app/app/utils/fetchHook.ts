import { useState, useEffect } from "react";
import { getAxiosInstance } from "~/utils/general.ts";
import { logError } from "./logging";

export function useFetchV3(
  pathname: string,
  baseURL: "api" | "media" = "api",
  valid = true,
  timeout = 0,
  dependencies: unknown[] = [],
) {
  const [loading, setLoading] = useState(true);
  const [fetchedData, setFetchedData] = useState(undefined);
  const axiosInstance = getAxiosInstance(baseURL);
  useEffect(() => {
    if (!valid) {
      setLoading(false);
      return;
    }
    if (!loading) {
      return;
    }
    axiosInstance
      .get(pathname, { timeout: timeout })
      .then((r) => {
        setFetchedData({ data: r.data, status: r.status, message: "success" });

        setLoading(false);
      })
      .catch((r) => {
        logError(r);
        setFetchedData({ data: r.data, status: r.status, message: r.message });
        setLoading(false);
      });
  }, dependencies);
  return { validParams: valid, fetchedData, loading };
}

export function useFetchWithTranslation({
  pathname,
  baseURL = "api",
  valid = true,
  timeout = 0,
  dependencies = [],
}: {
  pathname: string;
  baseURL?: "api" | "media";
  valid?: boolean;
  timeout?: number;
  dependencies?: unknown[];
}) {
  const [loading, setLoading] = useState(true);
  const [fetchedData, setFetchedData] = useState(undefined);
  const axiosInstance = getAxiosInstance(baseURL);
  useEffect(() => {
    if (!valid) {
      setLoading(false);
      return;
    }
    // if (!loading) {
    //   return;
    // }
    axiosInstance
      .get(pathname, { timeout: timeout })
      .then((r) => {
        setFetchedData({ data: r.data, status: r.status, message: "success" });

        setLoading(false);
      })
      .catch((r) => {
        logError(r);
        setFetchedData({ data: r.data, status: r.status, message: r.message });
        setLoading(false);
      });
  }, dependencies);
  return { validParams: valid, fetchedData, loading };
}
