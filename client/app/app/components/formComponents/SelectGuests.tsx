import { useTranslation } from "react-i18next";
import { useRef, useState } from "react";
import { useCloseOnClickWithSwitcher } from "./utils";

const DEFAULT_PARAMS = {
  adults: "2",
  children: "0",
};

export default function SelectGuests({
  defaultParams = DEFAULT_PARAMS,
  layout: Layout,
}: {
  defaultParams?: typeof DEFAULT_PARAMS;
  layout: ({
    children,
    ref,
  }: {
    children: React.ReactNode;
    ref: React.RefObject<HTMLDivElement>;
  }) => React.ReactNode;
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

      return (
        <option key={key} value={count}>
          {count}
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
    <Layout ref={wrapperRef}>
      <input
        type="checkbox"
        className="peer hidden"
        id="guests-checkbox"
        ref={checkboxRef}
      ></input>
      <label
        className="text-center flex items-center cursor-pointer justify-center border-accent-light"
        htmlFor="guests-checkbox"
      >
        {getGuestSelectLabelText(
          selectedValues.adults,
          selectedValues.children,
        )}
      </label>

      <div className="absolute shadow-sm top-10 z-50 h-0 overflow-hidden peer-checked:h-[180px] w-[200px] ">
        <div className="flex flex-col p-4 bg-bg gap-4 h-full">
          <div className="flex flex-col items-center">
            <label className="text-sm" htmlFor="select-adults">
              {t("adults", { context: "genetive" })}
            </label>
            <select
              id="select-adults"
              defaultValue={selectedValues.adults}
              className="guest-input border border-accent rounded-sm px-2 bg-bg"
              name="adults"
              onChange={(e) =>
                setSelectedValues({
                  ...selectedValues,
                  adults: Number(e.target.value),
                })
              }
            >
              {genGuestOptions(12, "adults")}
            </select>
          </div>
          <div className="flex flex-col items-center">
            <label className="text-sm" htmlFor="select-children">
              {t("children", { context: "genetive" })}
            </label>
            <select
              id="select-children"
              defaultValue={selectedValues.children}
              className="guest-input border border-accent rounded-sm px-2 bg-bg"
              name="children"
              onChange={(e) =>
                setSelectedValues({
                  ...selectedValues,
                  children: Number(e.target.value),
                })
              }
            >
              {genGuestOptions(12, "children")}
            </select>
          </div>
          <div className="flex flex-col items-center">
            {/* <button */}
            {/*   className="underline text-sm text-gray-500 italic" */}
            {/*   onClick={(e) => { */}
            {/*     e.preventDefault(); */}
            {/*     const selectAdults = document.getElementById( */}
            {/*       "select-adults", */}
            {/*     ) as HTMLSelectElement; */}
            {/*     selectAdults.value = "2"; */}
            {/*     const selectChildren = document.getElementById( */}
            {/*       "select-children", */}
            {/*     ) as HTMLSelectElement; */}
            {/*     selectChildren.value = "0"; */}
            {/*     setSelectedValues({ adults: 2, children: 0 }); */}
            {/*   }} */}
            {/* > */}
            {/*   {t("reset")} */}
            {/* </button> */}
            <button
              className="underline cursor-pointer"
              onClick={(e) => {
                e.preventDefault();
                checkboxRef.current.checked = false;
              }}
            >
              {t("continue")}
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
