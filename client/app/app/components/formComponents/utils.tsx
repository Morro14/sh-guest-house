import { useEffect, useCallback, type RefObject } from "react";

export function useCloseOnClick<T extends any[]>(
  wrapperRef: RefObject<HTMLElement>,
  switcherRef: RefObject<HTMLInputElement> | null = null,
  callback: (...args: any) => any | null = null,
  callBackArgs: T | [] = []
) {
  const handleClickOutside = useCallback((e: MouseEvent) => {
    const target = e.target as Node;
    if (wrapperRef.current && !wrapperRef.current.contains(target)) {
      if (callback) {
        callback(...callBackArgs);
      }
      if (switcherRef?.current) switcherRef.current.checked = false;
    }
  }, []);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleClickOutside]);
}
