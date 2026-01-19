import { useTranslation } from "react-i18next";
import Header from "~/components/Header";
import { axiosInstance } from "~/root";

export async function clientLoader() {
  const response = await axiosInstance.get("booking/validate");
  return response;
}
export default function BookingConfirmResponse({ loaderData }) {
  console.log("loaderData", loaderData);
  const validated = loaderData.status === 200;
  const email = loaderData.data.user_email;
  const { t } = useTranslation();
  return (
    <div className="flex flex-col items-center min-h-screen min-w-screen text-text-main">
      <Header bookingPannelEnabled={false} />
      {!validated ? (
        <div className="flex flex-col items-center">
          <h3 className="mt-6">{t("Something went wrong")}</h3>
          <div className="index-container-1">
            <p className="font-sans">{t("booking-validation-error")}</p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <h3 className="mt-6">
            {t("Your booking request has been submitted!")}
          </h3>
          <div className="index-container-1">
            <p className="font-sans">
              {t("booking-success-contact-msg", { email })}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
