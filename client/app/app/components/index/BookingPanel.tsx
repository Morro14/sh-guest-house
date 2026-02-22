import { Form } from "react-router";
import SelectGuests from "~/components/formComponents/SelectGuests";
import { useContextProvider } from "~/components/RequestAvailableRoomsContextProvider";
import { useTranslation } from "react-i18next";
import ErrorPanel from "~/components/formComponents/ErrorPanel";
import { Temporal } from "@js-temporal/polyfill";

export default function BookingPannel() {
  const { t } = useTranslation();
  const context = useContextProvider();
  const defaultDate = Temporal.Now.zonedDateTimeISO("Asia/Yerevan")
    .toPlainDate()
    .toString();

  return (
    <div className="sticky top-0 z-30 inline-block w-full drop-shadow-md">
      <div className="flex justify-center items-center bg-peach-light w-full font-sans">
        <Form
          method="post"
          className="flex justify-center h-10 items-center overflow-visible"
        >
          <div className="flex items-center font-normal px-8 h-10">
            {t("create_reservation")}
          </div>
          <div className="w-[1px] bg-line-light h-8"></div>
          <label
            htmlFor="date-picker"
            className="h-10 w-[calc(181px)] flex justify-center items-center hover:bg-apricot-light transition-colors duration-100"
          >
            <div className="border-b border-b-line-light ">
              <input
                id="date-picker"
                name="date"
                type="date"
                defaultValue={defaultDate}
              />
            </div>
          </label>

          <div className="w-[1px] bg-line-light h-8"></div>

          <SelectGuests />

          <div className="w-[1px] bg-line-light h-8"></div>

          <div className="flex h-10 w-[160px] justify-center items-center hover:bg-apricot-light transition-colors duration-100">
            <input
              className="peer text-center font-medium w-12 ml-[-8px] focus:bg-peach-lighter border-b-1 border-line-light"
              name="nights"
              defaultValue={1}
              type="text"
              maxLength={2}
              onChange={(e) => context.setNightsCount(Number(e.target.value))}
            />
            <div className="w-[25px] ml-2">
              {t("day", { count: context.nightsCount })}
            </div>
          </div>

          <div className="w-[1px] bg-line-light h-8"></div>
          <button
            type="submit"
            className="font-medium underline mx-8 cursor-pointer"
          >
            {t("Continue")}
          </button>
        </Form>
      </div>
      <ErrorPanel></ErrorPanel>
    </div>
  );
}
