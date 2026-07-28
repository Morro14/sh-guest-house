import { useTranslation } from "react-i18next";

export default function SelectGuestsMobile() {
  const { t } = useTranslation();

  const genGuestOptions = (num: number, guestType: "adults" | "children") => {
    const guestNum = guestType === "children" ? num + 1 : num;
    return Array.from({ length: guestNum }, (_, i) => {
      const count = guestType === "children" ? i : i + 1;
      const key = `opt-${guestType}-${count}`;
      return (
        <option key={key} value={count}>
          {count}
        </option>
      );
    });
  };
  return (
    <fieldset className="flex flex-col items-center gap-1">
      <legend className="text-center">{t("Number of guests") + ":"}</legend>
      <div className="flex gap-6 mt-1">
        <div className="flex flex-col items-center">
          <select
            name="adults"
            id="select-adults"
            className="border border-gray-line rounded px-2 py-1"
          >
            {genGuestOptions(12, "adults")}
          </select>
          <label htmlFor="select-adults" className="text-sm text-gray-warm-mid">
            {t("adults")}
          </label>
        </div>
        <div className="flex flex-col items-center">
          <select
            name="children"
            id="select-children"
            className="border border-gray-line rounded px-2 py-1"
          >
            {genGuestOptions(12, "children")}
          </select>
          <label
            htmlFor="select-children"
            className="text-sm text-gray-warm-mid"
          >
            {t("children")}
          </label>
        </div>
      </div>
    </fieldset>
  );
}
