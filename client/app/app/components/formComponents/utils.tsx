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


export function useCloseOnClickV2<T extends any[]>(
  nonClickableRef: RefObject<null | HTMLDivElement>,
  callback: (...args: any) => any | null = null,
  callBackArgs: T | [] = [],
) {
  useEffect(() => {
    if (!nonClickableRef.current) return
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (!nonClickableRef.current.contains(target)) {
        if (callback) {
          callback(...callBackArgs);
        }
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);

  }, [nonClickableRef]);
}

