import type { DatePickerFieldProps } from "@mui/x-date-pickers/DatePicker";

export default function CustomDateField(props: DatePickerFieldProps) {
  console.log(props);
  return (
    <div className="border-b border-accent py-1">
      <input className="b-0" />
    </div>
  );
}
