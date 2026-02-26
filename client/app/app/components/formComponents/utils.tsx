import { useEffect, type RefObject } from "react";
import type { Room } from "~/types/booking";
import i18n from "root/src/i18n/i18n";
import { createTheme } from "@mui/material/styles";
import { enUS, ruRU } from "@mui/x-date-pickers/locales";

export function useCloseOnClick<T extends any[]>(
  wrapperRef: RefObject<HTMLElement>,
  switcherRef: RefObject<HTMLInputElement> | null = null,
  callback: (...args: any) => any | null = null,
  callBackArgs: T | [] = [],
) {
  const handleClickOutside = (e: MouseEvent) => {
    if (!switcherRef.current?.checked) return;
    const target = e.target as Node;
    if (wrapperRef.current && !wrapperRef.current.contains(target)) {
      e.stopPropagation();
      if (switcherRef?.current) switcherRef.current.checked = false;
      if (callback) {
        callback(...callBackArgs);
      }
    }
  };

  useEffect(() => {
    if (!switcherRef.current) return;

    document.addEventListener("click", handleClickOutside, true);
  });
}
export function useCloseOnClickV2<T extends any[]>(
  nonClickableRef: RefObject<null | HTMLDivElement>,
  callback: (...args: any) => any | null = null,
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

export function isInsideSubtractArea(
  outerNode: Element,
  innerNode: Element,
  e: MouseEvent,
) {
  // checks if coords are in outer node area but not inside inner node area

  if (!outerNode && !innerNode) {
    return false;
  }

  const { clientX: x, clientY: y } = e;
  const outerRect = outerNode.getBoundingClientRect();
  const innderRect = innerNode.getBoundingClientRect();

  const inOuterRect =
    x >= outerRect.left &&
    x <= outerRect.right &&
    y <= outerRect.bottom &&
    y >= outerRect.top;
  const inInnerRect =
    x >= innderRect.left &&
    x <= innderRect.right &&
    y <= innderRect.bottom &&
    y >= innderRect.top;

  if (inOuterRect && !inInnerRect) {
    return true;
  }
  return false;
}

export function getSelectedRooms(form: HTMLFormElement) {
  const children = Array.from(
    form.getElementsByTagName("input"),
  ) as HTMLInputElement[];
  const selectedRooms = children.filter((el) => el.checked === true);
  return selectedRooms;
}

export function selectedRoomsToObjects(
  selectedRooms: HTMLInputElement[],
  rooms: Room[],
) {
  const selectedSlugs = new Set(selectedRooms.map((r) => r.value));
  const roomsObj = rooms.filter((r) => selectedSlugs.has(r.slug));
  return roomsObj;
}

type Languages = (typeof i18n.languages)[number];
function getPickerLocale(lang: Languages) {
  const locales = {
    en: enUS,
    ru: ruRU,
  };
  return locales[lang];
}
export const datePickerTheme = createTheme(
  {
    palette: {
      primary: {
        main: "#EFA76A",
        dark: "#EFA76A",
      },
    },
  },
  getPickerLocale(i18n.language),
);
