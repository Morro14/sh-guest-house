import { Form } from "react-router";
import SelectGuests from "./formComponents/SelectGuests";
import { useContextProvider } from "./ContextPorvider";
import { useTranslation } from "react-i18next";
import ErrorPanel from "./formComponents/ErrorPanel";

export default function BookingPannel() {
	const { t } = useTranslation();
	const context = useContextProvider();

	return (
		<div className="relative inline-block w-full">
			<div className="flex justify-center items-center bg-peach-light w-full font-sans">
				<Form
					method="post"
					className="flex justify-center h-10 items-center overflow-visible"
				>
					<div className="w-[1px] bg-line-light h-8"></div>
					<div className="flex items-center font-medium px-8 h-10">
						BOOK NOW
					</div>
					<div className="w-[1px] bg-line-light h-8"></div>
					<label
						htmlFor="date-picker"
						className="h-10 w-[calc(181px)] flex justify-center items-center hover:bg-peach-lighter"
					>
						<div className="h-[25px] border-b border-b-line-light">
							<input
								id="date-picker"
								name="date"
								type="date"
								placeholder="Date"
							/>
						</div>
					</label>

					<div className="w-[1px] bg-line-light h-8"></div>

					<SelectGuests />

					<div className="w-[1px] bg-line-light h-8"></div>

					<div className="flex h-10 w-[160px] justify-center items-center hover:bg-peach-lighter">
						<input
							className="peer text-center font-medium w-12 ml-[-8px] focus:bg-peach-superlight placeholder:text-center placeholder:text-[#4c3b3350] placeholder:italic focus:placeholder:text-gray-400 border-b-1 border-line-light"
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

					<div className="w-[1px] bg-line-light h-8"></div>
					<button
						type="submit"
						className="font-medium underline mx-8"
					>
						CHECK
					</button>
					<div className="w-[1px] bg-line-light h-8"></div>
				</Form>
			</div>
			<ErrorPanel></ErrorPanel>
		</div>
	);
}
