import { useTranslation } from "react-i18next";

export default function HeaderIndexNav() {
  const { t } = useTranslation();
  return (
    <div className="md:flex gap-5 2xl:gap-10 hidden justify-between font-serif font-light">
      <button
        className="hover:underline "
        onClick={() => {
          const el = document.getElementById("about");
          el.scrollIntoView({ behavior: "smooth" });
        }}
      >
        {t("About")}
      </button>
      <button
        className=" hover:underline "
        onClick={() => {
          const el = document.getElementById("contacts");
          el.scrollIntoView({ behavior: "smooth" });
        }}
      >
        {t("Contacts")}
      </button>
      <button
        className="hover:underline"
        onClick={() => {
          const el = document.getElementById("location");
          el.scrollIntoView({ behavior: "smooth" });
        }}
      >
        {t("Location")}
      </button>
      <button
        className="hover:underline "
        onClick={() => {
          const el = document.getElementById("points-of-interest");
          el.scrollIntoView({ behavior: "smooth" });
        }}
      >
        {t("Points of interest")}
      </button>
    </div>
  );
}
