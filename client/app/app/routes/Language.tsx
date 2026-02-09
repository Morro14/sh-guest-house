import i18n from "root/src/i18n/i18n";
import { useParams, Outlet, useLocation, Navigate } from "react-router";
import { LANGUAGES, DEFAULT_LANGUAGE } from "~/vars";
import { useRouteError } from "react-router";
import { useEffect } from "react";
import { logError } from "~/utils/logging";
import ErrorFallback from "~/components/ErrorFallback";

export function ErrorBoundary() {
  const error = useRouteError();
  useEffect(() => {
    logError(error);
  }, [error]);
  console.log("error router boundary", error);
  return <ErrorFallback />;
}
export default function Language() {
  const { lang } = useParams();
  const loc = useLocation();
  const pathname = loc.pathname;
  const searchParams = loc.search;

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
  if (i18n.language !== lang) {
    i18n.changeLanguage(lang);
  }
  return <Outlet></Outlet>;
}
