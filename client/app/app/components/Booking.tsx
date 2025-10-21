import { Form } from "react-router";
import SelectGuests from "./form_components/SelectGuests";
import { useState, useRef, useEffect, useCallback } from "react";

export default function BookingPannel() {
	const wrapperRef = useRef<HTMLDivElement>(null);
	const checkboxRef = useRef<HTMLInputElement>(null);
	const handleClickOutside = useCallback((e: MouseEvent) => {
		// console.log(e.target);
		if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
			console.log("Clicked outside");
			if (checkboxRef.current) checkboxRef.current.checked = false;
		}
	}, []);
	useEffect(() => {
		console.log("useEffect mounting");
		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			console.log("unmounting");
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [handleClickOutside]);

	return (
		<div className="flex justify-center items-center bg-peach-light h-10 w-full font-sans">
			<Form className="flex justify-center items-center overflow-visible">
				<div className="w-[1px] bg-line h-8"></div>
				<div className="font-medium px-8">BOOK NOW</div>
				<div className="w-[1px] bg-line h-8"></div>
				<input
					name="date"
					type="date"
					placeholder="Date"
					className="px-8"
				/>
				<div className="w-[1px] bg-line h-8"></div>
				<div
					ref={wrapperRef}
					className="relative inline-block w-[calc(4rem+171px)]"
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
						Number of guests
					</label>

					<div className="absolute z-10 hidden peer-checked:block w-full">
						<SelectGuests />
					</div>
				</div>
				<div className="w-[1px] bg-line h-8"></div>
				<input
					name="days"
					type="text"
					placeholder="Days"
				/>
				<div className="w-[1px] bg-line h-8"></div>
				<button
					type="submit"
					className="font-medium underline"
				>
					CHECK
				</button>
				<div className="w-[1px] bg-line h-8"></div>
			</Form>
		</div>
	);
}
