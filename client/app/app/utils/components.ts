import { useEffect, type RefObject } from "react";

export function useCloseOnClick<T extends any[]>(
  nonClickableRef: RefObject<null | HTMLDivElement>,
  callback: (...args: any) => any | void = null,
  callBackArgs: T | [] = [],
) {
  useEffect(() => {
    if (!nonClickableRef.current) return;
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (!nonClickableRef.current.contains(target)) {
        if (callback) {
          callback(...callBackArgs);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [nonClickableRef, callback, callBackArgs]);
}
