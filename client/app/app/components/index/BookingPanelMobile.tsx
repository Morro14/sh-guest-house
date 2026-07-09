import { Form, useNavigation } from "react-router";
import SelectGuestsMobile from "~/components/formComponents/SelectGuestsMobile";
import { useTranslation } from "react-i18next";
import { useRef, useState } from "react";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import Spinner from "../status/Spinner";
import { desktopDatePickerSx } from "../formComponents/mui";

export default function BookingPannelMobile() {
  const { t } = useTranslation();
  const formRef = useRef(null);
  const today = dayjs();
  const [date, setDate] = useState(today);
  const navigation = useNavigation();
  let modalShow = false;
  const dialogRef = useRef<null | HTMLDialogElement>(null);
  return (
    <div className="group xl:hidden fixed bottom-0 z-30 w-full">
      <dialog
        aria-disabled={modalShow ? "false" : "true"}
        className={`starting:opacity-0 opacity-100 transition-opacity duration-100 backdrop:bottom-10`}
        ref={dialogRef}
        closedby="any"
      >
        <Form
          ref={formRef}
          method="post"
          className={`fixed bottom-10 flex w-screen flex-col items-center overflow-visible bg-bg gap-6 py-6 font-sans text-text-main h-[336px]`}
        >
          <div className="flex flex-col items-center gap-1">
            <label className="" htmlFor="checkin-date-input">
              {t("Check-in date") + ":"}
            </label>
            {/* <DatePicker */}
            {/*   disablePast */}
            {/*   maxDate={today.set("year", today.get("year") + 1)} */}
            {/*   defaultValue={today} */}
            {/*   value={date} */}
            {/*   onChange={(date) => setDate(date)} */}
            {/*   slotProps={{ */}
            {/*     textField: { */}
            {/*       variant: "standard", */}
            {/*       sx: desktopDatePickerSx, */}
            {/*     }, */}
            {/*   }} */}
            {/* ></DatePicker> */}
            <input
              name="date"
              className=""
              type="date"
              id="checkin-date-input"
              value={date.format().slice(0, 10)}
            />
          </div>
          <SelectGuestsMobile />
          <div className="flex flex-col items-center gap-1 ">
            <label htmlFor="input-nights" className="">
              {t("Nights", { context: "genetive" }) + ":"}
            </label>
            <div className="flex w-40 justify-center items-center hover:bg-apricot-light">
              <input
                defaultValue={1}
                type="number"
                className="w-9 text-center border border-line-light rounded"
                name="nights"
              />
            </div>
          </div>
          {navigation.state === "submitting" ? (
            <Spinner></Spinner>
          ) : (
            <button
              type="submit"
              className="font-medium underline mx-9 cursor-pointer"
            >
              {t("Continue")}
            </button>
          )}
        </Form>
      </dialog>
      <button
        onClick={() => {
          if (modalShow) {
            dialogRef.current.close();
            modalShow = false;
          } else {
            dialogRef.current.showModal();
            modalShow = true;
          }
        }}
        className="relative bottom-0 flex justify-center z-100 items-center bg-primary size-full font-sans h-10"
      >
        <div className={`flex items-center justify-between px-2 w-full`}>
          <div className="w-5"></div>
          <div
            className={`capitalize font-semibold font-sans text-white cursor-pointer ${!modalShow ? "text-lg" : "text-base"}`}
          >
            <span className="group-has-open:block! hidden">{t("close")}</span>
            <span className="group-has-open:hidden! block">{t("book")}</span>
          </div>
          <div className="group-has-open:flex! hidden cursor-pointer w-5 h-5 items-center justify-center">
            {closeCross}
          </div>
          <div className="group-has-open:hidden! block w-5"></div>
        </div>
      </button>
    </div>
  );
}

const closeCross = (
  <svg
    width="16"
    height="16"
    viewBox="0 0 21 21"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <line
      x1="0.707107"
      y1="0.707078"
      x2="19.7071"
      y2="19.7071"
      stroke="#FFF"
      strokeWidth="3"
    />
    <line
      x1="19.7071"
      y1="1.12129"
      x2="0.707107"
      y2="20.1213"
      stroke="#FFF"
      strokeWidth="3"
    />
  </svg>
);
