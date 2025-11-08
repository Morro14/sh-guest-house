import { useEffect, useRef, useState } from "react";
import NavLink from "./NavLink.tsx";
import useFloatingSelector from "./FloatingSelector.ts";


type NavProps<T> = {
  items: T[];
  template: React.ComponentType<{ item: T }>;
  slug: string;
  contextProvider: () => NavContextValue

}
type NavContextValue = {
  itemSelected: number;
  setItemSelected: (i: number) => void;
  lastSelected: { current: number, prev: number };
  setLastSelected: ({ current: number, prev: number })
}
export default function Nav<T>({ slug, items, contextProvider, template: NavLinkTemplate }: NavProps<T>) {
  const context = contextProvider()
  const selectorRef = useRef<HTMLDivElement>(undefined)
  const scrollRef = useRef<HTMLDivElement>(undefined)
  const [loaded, setLoaded] = useState(false)
  useEffect(() => setLoaded(true))
  const { scrollPos } = useFloatingSelector(context.lastSelected.prev, loaded, context.lastSelected.current, scrollRef, selectorRef)
  if (selectorRef.current) { selectorRef.current.style.top = String(context.lastSelected.current * selectorRef.current.clientHeight) + 'px' }
  if (scrollRef.current) { scrollRef.current.scrollTop = scrollPos }
  return (
    <div ref={scrollRef} className="scroll-smooth relative flex flex-col 2xl:w-[296px] overflow-hidden 2xl:h-[388px]">
      <div className={`absolute 2xl:w-[296px] h-[77px] bg-peach-superlight transition-all ease-out`} ref={selectorRef}></div>
      {items.map((item, i) => {
        return (
          <NavLink
            key={`${slug}-nav-link-${i}`}
            index={i}
            context={context}
          >
            <NavLinkTemplate item={item}></NavLinkTemplate>
          </NavLink>
        );
      })}
    </div>
  );
}
