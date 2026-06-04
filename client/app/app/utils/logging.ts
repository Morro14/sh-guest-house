import { getAxiosInstance } from "./general";
import { isRouteErrorResponse } from "react-router";
import { isAxiosError } from "axios";
// import type { AxiosError } from "axios";
import type { ErrorResponse } from "react-router";
import { AxiosError } from "axios";

type ErrorGeneral = Error | ErrorResponse | AxiosError | unknown;

const axiosInstance = getAxiosInstance();
export function logError(error: ErrorGeneral, info: React.ErrorInfo = null) {
  const logData = {
    data: JSON.stringify({
      level: "error",
      error: serializeError(error),
      url: window.location.href,
      userAgent: navigator.userAgent,
      language: navigator.language,
      frontendVersion: import.meta.env.VITE_APP_VERSION,
    }),
  };
  if (info) {
    logData["componentStack"] = info.componentStack;
  }

  axiosInstance.post("logs-frontend", logData, {
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
  });
}

function serializeError(error: unknown) {
  if (isAxiosError(error)) {
    const axiosError = error as AxiosError;
    if (axiosError.code === AxiosError.ERR_NETWORK) {
      return {
        type: "network_error",
      };
    }
    return {
      type: "axios_response",
      status: error.response.status,
      statusText: error.response.statusText,
      url: error.response.config.url,
    };
  }

  if (error instanceof Error) {
    return {
      type: "error",
      name: error.name,
      message: error.message,
      stack: error.stack,
    };
  }

  // AxiosError is thrown and is used for logging instead of ErrorResponse if response error happens inside route module
  if (isRouteErrorResponse(error)) {
    return {
      type: "route_response",
      status: error.status,
      statusText: error.statusText,
      data: error.data,
    };
  }
  return {
    type: "unknown",
    value: String(error),
  };
}
