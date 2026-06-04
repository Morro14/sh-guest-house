import { useEffect, type RefObject } from "react";
import { useMapContextProvider } from "~/components/index/map/MapContextProvider";

export function useCloseOnClick<T extends any[]>(
  nonClickableRef: RefObject<null | HTMLDivElement>,
  callback: (...args: any) => any | void = null,
  callBackArgs: T | [] = [],
) {
  const context = useMapContextProvider();
  useEffect(() => {
    if (!nonClickableRef.current) return;
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (!nonClickableRef.current.contains(target)) {
        e.stopImmediatePropagation();
        if (callback) {
          callback(...callBackArgs);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [nonClickableRef, callback, callBackArgs]);
}
