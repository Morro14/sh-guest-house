import { useTranslation } from "react-i18next";
import { useContextProvider } from "../ContextPorvider";

export default function SelectGuests() {
	const context = useContextProvider();
	const { t } = useTranslation();
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

	return (
		<div className="flex flex-col p-4 bg-peach-superlight gap-4">
			<select
				id="select-adults"
				defaultValue={2}
				className="guest-input border-accent border-1 rounded-sm px-2 bg-bg opacity-0 transition-all duration-200"
				name="num-adults"
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
				name="num-children"
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
					onClick={() => {
						const selectAdults = document.getElementById(
							"select-adults"
						) as HTMLSelectElement;
						selectAdults.value = "1";
						const selectChildren = document.getElementById(
							"select-children"
						) as HTMLSelectElement;
						selectChildren.value = "0";
						console.log(selectAdults);
						context.setDisplaySelect(false);
						context.setSelect({ adults: 0 });
					}}
				>
					reset
				</button>
				<button
					className="underline"
					onClick={() => context.setDisplaySelect(false)}
				>
					continue
				</button>
			</div>
		</div>
	);
}
