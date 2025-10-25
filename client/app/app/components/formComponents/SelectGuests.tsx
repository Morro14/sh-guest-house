import { useTranslation } from "react-i18next";
import { useContextProvider } from "../ContextPorvider";
import { useRef } from "react";
import { useCloseOnClick } from "../utils/components";

export default function SelectGuests() {
	const context = useContextProvider();
	const { t } = useTranslation();
	const [adults, children] = [context.select.adults, context.select.children];
	const wrapperRef = useRef<HTMLDivElement>(null);
	const checkboxRef = useRef<HTMLInputElement>(null);
	useCloseOnClick(wrapperRef, checkboxRef);
	const genGuestOptions = (num: number, guestType: "adults" | "children") => {
		const guestNum = guestType === "children" ? num + 1 : num;
		return Array.from({ length: guestNum }, (_, i) => {
			const count = guestType === "children" ? i : i + 1;
			const key = `opt-${guestType}-${count}`;
			const translationKey = guestType + "WithCount";

			return (
				<option
					key={key}
					value={count}
				>
					{t(translationKey, { count: count })}
				</option>
			);
		});
	};
	const getGuestSelectLabelText = (adults: number, children: number) => {
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
				className="text-center flex items-center justify-center w-full h-10 peer-checked:bg-peach-superlight"
				htmlFor="guests-checkbox"
			>
				{getGuestSelectLabelText(adults, children)}
			</label>

			<div className="absolute z-10 h-0 overflow-hidden peer-checked:h-[150px] peer-checked:[&_.guest-input]:opacity-100 w-full transition-all duration-200">
				<div className="flex flex-col p-4 bg-peach-superlight gap-4">
					<select
						id="select-adults"
						defaultValue={2}
						className="guest-input border-accent border-1 rounded-sm px-2 bg-bg opacity-0 transition-all duration-200"
						name="adults"
						onChange={(e) =>
							context.setSelect({
								...context.select,
								adults: Number(e.target.value),
							})
						}
					>
						{genGuestOptions(12, "adults")}
					</select>
					<select
						id="select-children"
						className="guest-input border-accent border-1 rounded-sm px-2 bg-bg opacity-0 transition-all duration-200"
						name="children"
						onChange={(e) =>
							context.setSelect({
								...context.select,
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
									"select-adults"
								) as HTMLSelectElement;
								selectAdults.value = "2";
								const selectChildren = document.getElementById(
									"select-children"
								) as HTMLSelectElement;
								selectChildren.value = "0";
								context.setSelect({ adults: 2 });
							}}
						>
							reset
						</button>
						<button
							className="underline in-checked:"
							onClick={(e) => e.preventDefault()}
						>
							continue
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
