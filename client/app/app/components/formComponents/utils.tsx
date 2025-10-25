import { useEffect, useCallback, type RefObject } from "react";

export function useCloseOnClick<T extends any[]>(
	wrapperRef: RefObject<HTMLElement>,
	switcherRef: RefObject<HTMLInputElement>,
	callback: (...args: T) => any | null = null,
	callBackArgs: T | null = null
) {
	const handleClickOutside = useCallback((e: MouseEvent) => {
		const target = e.target as Node;
		if (wrapperRef.current && !wrapperRef.current.contains(target)) {
			if (callback) {
				callback(...callBackArgs);
			}
			if (switcherRef.current) switcherRef.current.checked = false;
		}
	}, []);

	useEffect(() => {
		// Close SelectGuest element on click outside
		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [handleClickOutside]);
}
