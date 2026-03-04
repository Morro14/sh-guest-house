import { useRef, useState } from "react";
import NavLink from "./NavLink.tsx";
import NavScrollArrow from "./NavScrollArrow.tsx";
import { useNavContextProvider } from "./NavContextProvider.tsx";

type NavProps<T> = {
  items: T[];
  template: React.ComponentType<{ item: T; isSelected: boolean }>;
  slug: string;
  contextProvider: () => NavContextValue;
};
type NavContextValue = {
  itemSelected: number;
  setItemSelected: (i: number) => void;
  lastSelected: number;
  setLastSelected: (i: number) => void;
};
export default function Nav<T>({
  slug,
  items,
  template: NavLinkTemplate,
}: NavProps<T>) {
  const context = useNavContextProvider();
  const selectorRef = useRef<HTMLDivElement>(undefined);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollRefState, setScrollRefState] = useState({
    scrollTop: 0,
    scrollTopMax: 0 || scrollRef?.current?.scrollTopMax,
  });
  if (selectorRef.current) {
    selectorRef.current.style.top =
      String(context.selectorPos * selectorRef.current.clientHeight) + "px";
  }

  return (
    <div className="flex flex-col items-center relative max-2xl:hidden">
      <NavScrollArrow
        direction="up"
        scrollPos={scrollRefState}
        scrollEl={scrollRef?.current}
      ></NavScrollArrow>
      <div
        ref={scrollRef}
        onScroll={() =>
          setScrollRefState({
            scrollTop: scrollRef.current.scrollTop,
            scrollTopMax: scrollRef.current.scrollTopMax,
          })
        }
        className="scroll-smooth overflow-scroll relative flex flex-col 2xl:w-[296px] 2xl:h-[388px]"
      >
        <div
          className={`absolute w-[2px] h-[60px] bg-peach transition-all ease-out`}
          ref={selectorRef}
        ></div>
        {items.map((item, i) => {
          return (
            <NavLink key={`${slug}-nav-link-${i}`} index={i} context={context}>
              <NavLinkTemplate
                item={item}
                isSelected={context.itemSelected === i}
              ></NavLinkTemplate>
            </NavLink>
          );
        })}
      </div>
      {/* <div className={`${scrollRef?.current.scrollTop !== scrollRef?.current.scrollTopMax ? "h-[2px] bg-peach" : ""} w-full`}></div> */}
      <NavScrollArrow
        direction="down"
        scrollPos={scrollRefState}
        scrollEl={scrollRef?.current}
      ></NavScrollArrow>
    </div>
  );
}
