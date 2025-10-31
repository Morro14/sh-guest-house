import { useEffect, useRef, useState } from "react";
import NavLinkRoom from "./NavLinkRoom.tsx";
import type { Room } from "./Rooms.tsx";
import { useRoomContextProvider } from "./RoomsContextProvider.tsx";
import useFloatingSelector from "../FloatingSelector.ts";

export default function Nav({ rooms }: { rooms: Array<Room> }) {
  const selectorRef = useRef<HTMLDivElement>(undefined)
  const scrollRef = useRef<HTMLDivElement>(undefined)
  const context = useRoomContextProvider()
  const [loaded, setLoaded] = useState(false)
  useEffect(() => setLoaded(true))
  const { scrollPos } = useFloatingSelector(context.lastSelected.prev, loaded, context.roomSelected, scrollRef, selectorRef)
  if (selectorRef.current) { selectorRef.current.style.top = String(context.roomSelected * selectorRef.current.clientHeight) + 'px' }
  if (scrollRef.current) { scrollRef.current.scrollTop = scrollPos }
  return (
    <div ref={scrollRef} className="scroll-smooth relative flex flex-col 2xl:w-[296px] overflow-hidden 2xl:h-[388px]">
      <div className={`absolute 2xl:w-[296px] h-[77px] bg-peach-superlight transition-all ease-out`} ref={selectorRef}></div>
      {rooms.map((room, i) => {
        return (
          <NavLinkRoom
            key={`room-select-nav-${i}`}
            index={i}
            room={room}
          ></NavLinkRoom>
        );
      })}
    </div>
  );
}
