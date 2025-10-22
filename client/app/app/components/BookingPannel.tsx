import { Form } from "react-router";
import SelectGuests from "./form_components/SelectGuests";
import { useRef, useEffect, useCallback } from "react";
import { useContextProvider } from "./ContextPorvider";
import { useTranslation } from "react-i18next";
import ErrorPannel from "./form_components/ErrorPannel";

export default function BookingPannel() {
	const { t } = useTranslation();
	const context = useContextProvider();
	const [adults, children] = [context.select.adults, context.select.children];
	const wrapperRef = useRef<HTMLDivElement>(null);
	const checkboxRef = useRef<HTMLInputElement>(null);

	if (checkboxRef.current && !context.displaySelect) {
		checkboxRef.current.checked = false;
	}

	const handleClickOutside = useCallback((e: MouseEvent) => {
		if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
			if (checkboxRef.current) checkboxRef.current.checked = false;
		}
	}, []);

	useEffect(() => {
		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [handleClickOutside]);

	const getGuestSelectLabelText = () => {
		const cases = {
			adultsSelect: t("adultsWithCount", { count: context.select.adults }),
			childrenAndAdultsSelect:
				t("adultsWithCount", { count: context.select.adults }) +
				" " +
				t("childrenWithCount", { count: context.select.children }),
			childrenSelect:
				"? " +
				t("adults_other") +
				" " +
				t("childrenWithCount", { count: context.select.children }),
		};
		const value =
			adults && !children ? cases.adultsSelect
			: adults && children ? cases.childrenAndAdultsSelect
			: !adults && children ? cases.childrenSelect
			: "";
		return value;
	};
	return (
		<div className="relative inline-block w-full">
			<div className="flex justify-center items-center bg-peach-light h-10 w-full font-sans">
				<Form
					method="post"
					className="flex justify-center items-center overflow-visible"
				>
					<div className="w-[1px] bg-line h-8"></div>
					<div className="font-medium px-8">BOOK NOW</div>
					<div className="w-[1px] bg-line h-8"></div>
					<input
						id="date-checkbox"
						className="hidden peer"
						type="checkbox"
					/>
					<label
						htmlFor="date-checkbox"
						className="h-10 w-[calc(181px)] flex justify-center"
					>
						<input
							name="date"
							type="date"
							placeholder="Date"
							className=""
						/>
					</label>

					<div className="w-[1px] bg-line h-8"></div>
					<div
						ref={wrapperRef}
						className="relative inline-block w-[calc(4rem+128px)]"
					>
						<input
							type="checkbox"
							className="peer hidden"
							id="guests-checkbox"
							ref={checkboxRef}
						></input>
						<label
							className="text-center flex items-center justify-center w-full h-10 peer-checked:bg-peach-superlight"
							htmlFor="guests-checkbox"
						>
							{getGuestSelectLabelText()}
						</label>

						<div className="absolute z-10 h-0 overflow-hidden peer-checked:h-[150px] peer-checked:[&_.guest-input]:opacity-100 w-full transition-all duration-200">
							<SelectGuests />
						</div>
					</div>
					<div className="w-[1px] bg-line h-8"></div>
					<div className="flex w-[160px] justify-center">
						<input
							className="peer text-center w-12 ml-[-8px] focus:bg-peach-superlight placeholder:text-center placeholder:text-[#4c3b3350] placeholder:italic focus:placeholder:text-gray-400 border-b-1 border-text-main"
							name="days"
							defaultValue={1}
							type="text"
							maxLength={2}
							onChange={(e) => context.setDaysCount(Number(e.target.value))}
						/>
						<div className="w-[25px] ml-2">
							{t("day", { count: context.daysCount })}
						</div>
					</div>
					<div className="w-[1px] bg-line h-8"></div>
					<button
						type="submit"
						className="font-medium underline mx-8"
					>
						CHECK
					</button>
					<div className="w-[1px] bg-line h-8"></div>
				</Form>
			</div>
			<ErrorPannel></ErrorPannel>
		</div>
	);
}
