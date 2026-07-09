import { useEffect, type RefObject } from "react";
import type { Room } from "~/types/booking";

export function useCloseOnClickWithSwitcher<T extends any[]>(
  nonClickableRef: RefObject<HTMLElement>,
  switcherRef: RefObject<HTMLInputElement>,
  callback: (...args: any) => any | null = null,
  callBackArgs: T | [] = [],
) {
  const handleClickOutside = (e: MouseEvent) => {
    if (!switcherRef.current?.checked) return;
    const target = e.target as Node;
    if (nonClickableRef.current && !nonClickableRef.current.contains(target)) {
      e.preventDefault();
      e.stopPropagation();
      if (switcherRef?.current) {
        switcherRef.current.checked = false;
      }
      if (callback) {
        callback(...callBackArgs);
      }
    }
  };

  useEffect(() => {
    if (!switcherRef.current) return;

    document.addEventListener("click", handleClickOutside, true);
    return () => document.removeEventListener("click", handleClickOutside);
  });
}
export function useCloseOnClick<T extends any[]>(
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
export const genGuestOptions = (
  num: number,
  guestType: "adults" | "children",
) => {
  const guestNum = guestType === "children" ? num + 1 : num;
  return Array.from({ length: guestNum }, (_, i) => {
    const count = guestType === "children" ? i : i + 1;
    const key = `opt-${guestType}-${count}`;

    return (
      <option key={key} value={count}>
        {count}
      </option>
    );
  });
};

export function selectedRoomsToObjects(
  selectedRooms: HTMLInputElement[],
  rooms: Room[],
) {
  const selectedSlugs = new Set(selectedRooms.map((r) => r.value));
  const roomsObj = rooms.filter((r) => selectedSlugs.has(r.slug));
  return roomsObj;
}

// type Languages = (typeof i18n.languages)[number];
