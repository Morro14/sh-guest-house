import { useTranslation } from "react-i18next";

export default function SelectGuests() {
	const { t } = useTranslation();
	const genGuestOptions = (num: number, guestType: "adult" | "child") => {
		return Array.from({ length: num }, (_, i) => {
			const count = i + 1;
			const key = `opt-${guestType}-${count}`;
			const translationKey =
				count === 1 ?
					guestType + "WithCount_one"
				:	guestType + "WithCount_many";
			return (
				<option
					key={key}
					value={count}
				>
					{t(translationKey, { count })}
				</option>
			);
		});
	};

	return (
		<div className="flex flex-col p-4 bg-peach-superlight gap-4">
			<select
				className="border-accent border-1 rounded-sm px-2 bg-bg"
				name="num-adults"
			>
				{genGuestOptions(12, "adult")}
			</select>
			<select
				className="border-accent border-1 rounded-sm px-2 bg-bg"
				name="num-children"
			>
				{genGuestOptions(12, "child")}
			</select>
		</div>
	);
}
