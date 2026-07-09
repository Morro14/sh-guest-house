import { useTranslation } from "react-i18next";
import { useRef, useState } from "react";
import { useCloseOnClick, useCloseOnClickWithSwitcher } from "./utils";

const DEFAULT_PARAMS = {
  adults: "2",
  children: "0",
};

export default function SelectGuestsMobile({
  defaultParams = DEFAULT_PARAMS,
}: {
  defaultParams?: typeof DEFAULT_PARAMS;
}) {
  const { t } = useTranslation();
  const [selectedValues, setSelectedValues] = useState({
    adults: Number(defaultParams.adults),
    children: Number(defaultParams.children),
  });
  const wrapperRef = useRef<HTMLDivElement>(null);
  const checkboxRef = useRef<HTMLInputElement>(null);

  useCloseOnClickWithSwitcher(wrapperRef, checkboxRef, null, []);

  const genGuestOptions = (num: number, guestType: "adults" | "children") => {
    const guestNum = guestType === "children" ? num + 1 : num;
    return Array.from({ length: guestNum }, (_, i) => {
      const count = guestType === "children" ? i : i + 1;
      const key = `opt-${guestType}-${count}`;
      // const translationKey = guestType + "WithCount";

      return (
        <option key={key} value={count}>
          {count}
        </option>
      );
    });
  };
  return (
    <fieldset className="flex flex-col gap-1">
      <legend className="">{t("Number of guests") + ":"}</legend>
      <div className="flex gap-6">
        <div className="flex flex-col items-center">
          <select name="adults" id="select-adults">
            {genGuestOptions(12, "adults")}
          </select>
          <label htmlFor="select-adults" className="text-sm text-gray-warm-mid">
            {t("adults")}
          </label>
        </div>
        <div className="flex flex-col items-center">
          <select name="children" id="select-children">
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
