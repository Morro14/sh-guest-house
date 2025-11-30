import { useEffect, useState, type RefObject } from "react";

export function useCloseOnClick<T extends any[]>(
  wrapperRef: RefObject<HTMLElement>,
  switcherRef: RefObject<HTMLInputElement> | null = null,
  callback: (...args: any) => any | null = null,
  callBackArgs: T | [] = [],
) {
  const [elOpen, setElOpen] = useState(false)
  const handleClickOutside = (e: MouseEvent) => {
    if (!switcherRef.current.checked) return
    const target = e.target as Node;
    if (wrapperRef.current && !wrapperRef.current.contains(target)) {
      e.stopPropagation()
      if (switcherRef?.current) switcherRef.current.checked = false;
      if (callback) {
        callback(...callBackArgs);
      }
    }
  }

  useEffect(() => {
    document.addEventListener("click", handleClickOutside, true)

  }, []);
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

