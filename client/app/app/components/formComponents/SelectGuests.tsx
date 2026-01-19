import { useTranslation } from "react-i18next";
import { useContextProvider } from "../ContextProvider";
import { useRef } from "react";
import { useCloseOnClick } from "./utils";

export default function SelectGuests() {
  const context = useContextProvider();
  const { t } = useTranslation();
  const [adults, children] = [
    context.guestsSelect.adults,
    context.guestsSelect.children,
  ];
  const wrapperRef = useRef<HTMLDivElement>(null);
  const checkboxRef = useRef<HTMLInputElement>(null);
  useCloseOnClick(wrapperRef, checkboxRef, null, []);
  const genGuestOptions = (num: number, guestType: "adults" | "children") => {
    const guestNum = guestType === "children" ? num + 1 : num;
    return Array.from({ length: guestNum }, (_, i) => {
      const count = guestType === "children" ? i : i + 1;
      const key = `opt-${guestType}-${count}`;
      const translationKey = guestType + "WithCount";

      return (
        <option key={key} value={count}>
          {t(translationKey, { count: count })}
        </option>
      );
    });
  };
  const getGuestSelectLabelText = (adults: number, children: number) => {
    const cases = {
      adultsSelect: t("adultsWithCount", { count: adults }),
      childrenAndAdultsSelect:
        t("adultsWithCount", { count: adults }) +
        " " +
        t("childrenWithCount", { count: children }),
      childrenSelect:
        t("adultsWithCount", { count: adults }) +
        " " +
        t("childrenWithCount", { count: children }),
    };

    const value =
      adults && !children
        ? cases.adultsSelect
        : adults && children
          ? cases.childrenAndAdultsSelect
          : !adults && children
            ? cases.childrenSelect
            : "";
    return value;
  };
  return (
    <div
      ref={wrapperRef}
      className="relative inline-block w-[calc(4rem+128px)] hover:bg-peach-lighter"
    >
      <input
        type="checkbox"
        className="peer hidden"
        id="guests-checkbox"
        ref={checkboxRef}
      ></input>
      <label
        className="text-center flex items-center cursor-pointer justify-center w-full h-10 peer-checked:bg-peach-superlight"
        htmlFor="guests-checkbox"
      >
        {getGuestSelectLabelText(adults, children)}
      </label>

      <div className="absolute z-50 h-0 overflow-hidden peer-checked:h-[150px] peer-checked:[&_.guest-input]:opacity-100 w-full transition-all duration-200">
        <div className="flex flex-col p-4 bg-peach-superlight gap-4">
          <select
            id="select-adults"
            defaultValue="2"
            className="guest-input border-accent border-1 rounded-sm px-2 bg-bg opacity-0 transition-all duration-200"
            name="adults"
            onChange={(e) =>
              context.setGuestsSelect({
                ...context.guestsSelect,
                adults: Number(e.target.value),
              })
            }
          >
            {genGuestOptions(12, "adults")}
          </select>
          <select
            id="select-children"
            defaultValue="0"
            className="guest-input border-accent border-1 rounded-sm px-2 bg-bg opacity-0 transition-all duration-200"
            name="children"
            onChange={(e) =>
              context.setGuestsSelect({
                ...context.setGuestsSelect,
                children: Number(e.target.value),
              })
            }
          >
            {genGuestOptions(12, "children")}
          </select>
          <div className="flex flex-col items-center">
            <button
              className="underline text-sm text-gray-500 italic"
              onClick={(e) => {
                e.preventDefault();
                const selectAdults = document.getElementById(
                  "select-adults",
                ) as HTMLSelectElement;
                selectAdults.value = "2";
                const selectChildren = document.getElementById(
                  "select-children",
                ) as HTMLSelectElement;
                selectChildren.value = "0";
                context.setGuestsSelect({ adults: 2 });
              }}
            >
              reset
            </button>
            <button
              className="underline cursor-pointer"
              onClick={(e) => {
                e.preventDefault();
                checkboxRef.current.checked = false;
              }}
            >
              continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
