import { Outlet, useLocation, Navigate } from "react-router";
import { LANGUAGES, DEFAULT_LANGUAGE } from "~/vars";
import { useRouteError } from "react-router";
import { useEffect } from "react";
import { logError } from "~/utils/logging";
import ErrorFallback from "~/components/ErrorFallback";
import { getLanguagePathParam } from "~/utils/general";

export function ErrorBoundary() {
  const error = useRouteError();
  useEffect(() => {
    logError(error);
  }, [error]);
  return <ErrorFallback />;
}
export default function Language() {
  const loc = useLocation();
  const pathname = loc.pathname;
  const searchParams = loc.search;
  const lang = getLanguagePathParam(pathname);
  if (!lang) {
    const cleanPathname = pathname === "/" ? "" : pathname;
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
