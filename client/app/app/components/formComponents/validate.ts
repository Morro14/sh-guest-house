import { Temporal } from "@js-temporal/polyfill";
import i18n from "root/src/i18n/i18n";
import type { BookingForm } from "~/routes/IndexRoute";

interface Validation {
  valid: boolean;
  name?: ValidationErrorNames;
  message?: string;
}

export type ValidationErrorNames = "guests" | "date" | "nights";

export type ValidationErrors = Partial<
  Record<ValidationErrorNames, { message: string }>
>;

export function validate(formDataObject: BookingForm) {
  const errors: ValidationErrors = {};
  const dateValidation = validateDate(formDataObject.date);
  const guestsValidation = validateGuests(formDataObject.adults);
  const nightsValidation = validateNights(formDataObject.nights);
  const validations = [dateValidation, guestsValidation, nightsValidation];
  validations.forEach((v: Validation) => {
    if (!v.valid) {
      errors[v.name] = { message: "" };
      errors[v.name].message = v.message;
    }
  });
  return errors;
}

function validateDate(date: string): Validation {
  if (date === "") {
    return {
      name: "date",
      valid: false,
      message: i18n.t("Please enter the arival date."),
    };
  }
  const dateObj = Temporal.PlainDate.from(date);
  let selectDatePlusDay = null;
  try {
    selectDatePlusDay = Temporal.PlainDate.from(date)
      .add({ days: 1 })
      .toPlainDateTime({ hour: 0 });
  } catch {
    return {
      name: "date",
      valid: false,
      message: i18n.t("Please enter correct date."),
    };
  }
  const now = Temporal.Now.plainDateTimeISO();

  let boundary = Temporal.PlainDateTime.from({
    year: dateObj.year,
    month: dateObj.month,
    day: dateObj.day + 1,
    hour: 4,
  });

  const isValid = Temporal.PlainDateTime.compare(boundary, now) === 1;
  if (!isValid) {
    return {
      name: "date",
      valid: false,
      message: i18n.t("availableDate", {
        val: Temporal.PlainDate.from(now).add({ days: 1 }),
        formatParams: {
          val: {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          },
        },
      }),
    };
  }
  return { valid: true };
}

function validateGuests(adultsStr: string): Validation {
  const adults = Number(adultsStr);
  if (!adults) {
    return {
      name: "guests",
      valid: false,
      message: i18n.t("There must be at least 1 guest."),
    };
  }
  return { valid: true };
}

function validateNights(nights: string): Validation {
  const isDigit = /^\d+$/g.test(nights.trim());
  if (!isDigit) {
    return {
      name: "nights",
      valid: false,
      message: i18n.t("Nights must be a positive number."),
    };
  }
  const nightsNum = Number(nights);
  const max = 30;
  const min = 1;

  const isAboveMax = nightsNum > max;
  const isBelowMin = nightsNum < min;

  if (isAboveMax) {
    return {
      name: "nights",
      valid: false,
      message: i18n.t("Maximum nights: 30"),
    };
  }
  if (isBelowMin) {
    return {
      name: "nights",
      valid: false,
      message: i18n.t("Minimum nights: 1"),
    };
  }
  return { valid: true };
}
