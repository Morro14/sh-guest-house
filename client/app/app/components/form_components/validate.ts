import { Temporal } from "@js-temporal/polyfill";
import i18n from "root/src/i18n/i18n";

export function validate(formData: any) {
	console.log("validate formData", formData, typeof formData);

	const isDateValid = validateDate(formData.get("date"));
	const isGuestsValid = validateGuests(
		formData.get("adults"),
		formData.get("children")
	);
	console.log(isDateValid, isGuestsValid);
	return [isDateValid, isGuestsValid];
}

function validateDate(date: string) {
	if (date === "") {
		return { valid: false, message: i18n.t("Please, enter the arival date.") };
	}
	const selectDatePlusDay = Temporal.PlainDate.from(date)
		.add({ days: 1 })
		.toPlainDateTime({ hour: 0 });
	const now = Temporal.Now.plainDateTimeISO();

	let boundary = Temporal.PlainDateTime.from({
		year: now.year,
		month: now.month,
		day: now.day,
		hour: 4,
	});

	const boundaryNextDay = boundary.add({ days: 1 });

	if (Temporal.PlainDateTime.compare(now, boundaryNextDay) === 1) {
		boundary = boundaryNextDay;
	}
	const isValid =
		Temporal.PlainDateTime.compare(selectDatePlusDay, boundary) === 1;
	if (!isValid) {
		return {
			valid: false,
			message: i18n.t("availableDateTime", {
				val: now.toLocaleString(),
				formatParams: {
					weekday: "long",
					year: "numeric",
					month: "long",
					day: "numeric",
				},
			}),
		};
	}
	return { valid: true };
}

function validateGuests(adultsStr: string, childrenStr: string) {
	const [adults, children] = [Number(adultsStr), Number(adultsStr)];
	if (!adults) {
		return {
			valid: false,
			message: i18n.t("There must be at least 1 guest."),
		};
	}
	return { valid: true };
}
