import { useTranslation } from "react-i18next";
import { getAxiosInstance, getLanguagePathParam } from "~/utils/general.ts";
import ErrorFallback from "~/components/ErrorFallback";
import Fallback from "~/components/Fallback";
import { useRouteError, Link } from "react-router";
import { logError } from "~/utils/logging";
import { isAxiosError } from "axios";

export function ErrorBoundary() {
  const error = useRouteError();
  const { t } = useTranslation();
  logError(error);
  if (isAxiosError(error)) {
    const sessionError = error.status === 403;
    return sessionError ? (
      <Fallback
        link={"/booking"}
        linkText={t("back to booking")}
        message={t("Your session has expired")}
      ></Fallback>
    ) : (
      <ErrorFallback />
    );
  } else return <ErrorFallback />;
}
export async function clientLoader() {
  const axiosInstance = getAxiosInstance();
  const response = await axiosInstance.get("booking/validate");
  return response;
}
export default function BookingConfirmResponse({ loaderData }) {
  const validated = loaderData.status === 200;
  const email = loaderData.data.user_email;
  const { t } = useTranslation();
  return (
    <div className="flex flex-col items-center min-h-screen min-w-screen text-text-main">
      {!validated ? (
        <div className="flex flex-col items-center">
          <h3 className="mt-6">{t("Something went wrong")}</h3>
          <div className="index-container-1">
            <p className="font-sans">
              {t("We could not verify your request. Please try again later.")}
            </p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <h3 className="mt-6">
            {t("Your booking request has been submitted!")}
          </h3>
          <div className="index-container-1 flex justify-center text-center">
            <p className="font-sans">
              {t("booking-success-contact-msg", { email })}
            </p>
          </div>
        </div>
      )}
      <Link
        className="text-sm text-gray-warm-mid underline"
        to={`/${getLanguagePathParam()}`}
      >
        {t("back to the main page")}
      </Link>
    </div>
  );
}
