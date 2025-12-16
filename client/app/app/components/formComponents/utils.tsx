import { useEffect, useState, type RefObject } from "react";
import type { Room } from "~/types/booking";

export function useCloseOnClick<T extends any[]>(
  wrapperRef: RefObject<HTMLElement>,
  switcherRef: RefObject<HTMLInputElement> | null = null,
  callback: (...args: any) => any | null = null,
  callBackArgs: T | [] = [],
) {
  const handleClickOutside = (e: MouseEvent) => {
    if (!switcherRef.current?.checked) return
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
    if (!switcherRef.current) return

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

export function isInsideSubtractArea(outerNode: Element, innerNode: Element, e: MouseEvent) {
  // checks if coords are in outer node area but not inside inner node area

  if (!outerNode && !innerNode) {
    return false
  }

  const { clientX: x, clientY: y } = e
  const outerRect = outerNode.getBoundingClientRect()
  const innderRect = innerNode.getBoundingClientRect()

  const inOuterRect = x >= outerRect.left && x <= outerRect.right && y <= outerRect.bottom && y >= outerRect.top
  const inInnerRect = x >= innderRect.left && x <= innderRect.right && y <= innderRect.bottom && y >= innderRect.top

  if (inOuterRect && !inInnerRect) {
    return true
  }
  return false
}

export function getSelectedRooms(form: HTMLFormElement) {
  const children = Array.from(form.getElementsByTagName("input")) as HTMLInputElement[]
  const selectedRooms = children.filter((el) => el.checked === true)
  return selectedRooms
}

export function requireMoreRooms(selectedRoomInputs: HTMLCollectionOf<HTMLInputElement>, rooms: Room[], adults: number, children: number) {
  const selectedRooms = rooms.filter((r) => Array.from(selectedRoomInputs).find((r_) => r_.value === r.slug))
  const adultsCanAccommodate = selectedRooms.reduce((p, c) => c.adults_num + p, 0)
  const onlyChildrenCanAccommodate = selectedRooms.reduce((p, c) => c.children_num + p, 0)
  if (adultsCanAccommodate - adults < 0) {
    return adultsCanAccommodate - adults
  } else if (adultsCanAccommodate - adults < children - onlyChildrenCanAccommodate) {
    return children - onlyChildrenCanAccommodate - (adultsCanAccommodate - adults)
  }
  return false
}

export function selectedRoomsToObjects(selectedRooms: HTMLInputElement[], rooms: Room[]) {
  const selectedSlugs = new Set(selectedRooms.map((r) => r.value))
  const roomsObj = rooms.filter((r) => selectedSlugs.has(r.slug))
  return roomsObj
}

export function getTotalPrice(rooms: Room[], adults: number, children: number, days: number) {
  // example price calculation
  //
  // sort rooms by price
  const roomsSorted = rooms.sort((a, b) => a.price - b.price)
  console.log('rooms sorted', roomsSorted)
  const middlePricedRoomsIndex = Math.floor((rooms.length - adults) / 2) + 1
  console.log('middle price', middlePricedRoomsIndex)

  // total price for one adult per room (if there are less adults than rooms less extreme priced rooms are chosen)
  const baseRoomPrice = 0

  return
}
