import { Outlet, useLocation, Navigate } from "react-router";
import { LANGUAGES, DEFAULT_LANGUAGE } from "~/vars";
import { useRouteError } from "react-router";
import { useEffect } from "react";
import { logError } from "~/utils/logging";
import ErrorFallback from "~/components/ErrorFallback";
import { getLanguagePathParam } from "~/utils/general";
import { useTranslation } from "react-i18next";

export function ErrorBoundary() {
  const error = useRouteError();
  useEffect(() => {
    logError(error);
  }, [error]);
  return <ErrorFallback />;
}
export default function Language() {
  const { i18n } = useTranslation();
  const detectedLang = i18n.language;
  const loc = useLocation();
  const pathname = loc.pathname;
  const searchParams = loc.search;
  const lang = getLanguagePathParam(pathname);
  if (!lang && detectedLang && LANGUAGES.includes(detectedLang)) {
    const cleanPathname = pathname.replace("/", "");
    return (
      <Navigate
        to={`/${detectedLang}${cleanPathname}${searchParams}`}
        replace
      ></Navigate>
    );
  }
  if (!lang) {
    const cleanPathname = pathname.replace("/", "");
    return (
      <Navigate
        to={`/${DEFAULT_LANGUAGE}${cleanPathname}${searchParams}`}
        replace
      ></Navigate>
    );
  }

  if (!LANGUAGES.includes(lang)) {
    const segments = pathname.split("/");
    segments[1] = DEFAULT_LANGUAGE;
    const newPathname = segments.join("/");
    return <Navigate to={`${newPathname}${searchParams}`} replace></Navigate>;
  }
  return <Outlet></Outlet>;
}
