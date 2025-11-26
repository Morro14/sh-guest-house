import { Form } from "react-router"
import { useContextProvider } from "./ContextProvider"
import SelectGuests from "./formComponents/SelectGuests"
import { useTranslation } from "react-i18next"

export default function BookingForm({ date, adults, children, days, setFormChange }) {
  const context = useContextProvider()
  const { t } = useTranslation()
  return <Form
    method="post"
    className="flex flex-col gap-3 items-center w-full"
  >
    <div className="flex justify-between w-full h-10 items-center overflow-visible">
      <div className="h-[25px] border-b w-[132px] border-b-line-light">
        <input
          defaultValue={date}
          id="date-picker"
          name="date"
          type="date"
          placeholder="Date"
        />
      </div>

      <SelectGuests />

      <div className="flex h-10 w-[132px] justify-center items-center hover:bg-peach-lighter">
        <input
          className="text-center font-medium w-12 placeholder:text-center placeholder:text-[#4c3b3350] placeholder:italic focus:placeholder:text-gray-400 border-b-1 border-line-light"
          name="days"
          defaultValue={Number(days)}
          type="text"
          maxLength={2}
          onChange={(e) => context.setDaysCount(Number(e.target.value))}
        />
        <div className="w-[25px] ml-2">
          {t("day", { count: context.daysCount })}
        </div>
      </div>

    </div>
    <div className="flex justify-between items-center py-4 w-[250px]">
      <div>{arrow}</div>
      <button
        type="submit"
        onClick={() => setFormChange(false)}
        className="font-medium italic pb-[1px] underline cursor-pointer"
      >
        Show available rooms
      </button>
      <div className="rotate-180">{arrow}</div>
    </div>
  </Form>
}


const arrow = <svg width="20" height="23" viewBox="0 0 20 23" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M19 1C12.3878 9.01316 6.5102 11.5 1 11.5" stroke="#EFA76A" stroke-width="2" stroke-linecap="round" />
  <path d="M19 22C12.3878 13.9868 6.5102 11.5 1 11.5" stroke="#EFA76A" stroke-width="2" stroke-linecap="round" />
</svg> 
