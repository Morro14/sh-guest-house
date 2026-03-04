import { Link } from "react-router";
import { useTranslation } from "react-i18next";

export default function ErrorFallback() {
  const { t } = useTranslation();
  const message = t("Something went wrong");
  const link = "/";
  const linkText = t("back to the main page");
  return (
    <div className="flex flex-col justify-center items-center min-w-screen mt-10 text-text-main">
      <div className="text-gray-2 font-semibold text-lg">{message}</div>
      <Link to={link} className="font-light underline">
        {linkText}
      </Link>
    </div>
  );
}
