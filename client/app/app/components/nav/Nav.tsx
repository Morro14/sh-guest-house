import { useEffect, useRef, useState } from "react";
import NavLink from "./NavLink.tsx";
import NavScrollArrow from "./NavScrollArrow.tsx";
import { useNavContextProvider } from "./NavContextProvider.tsx";

export default function Nav({ slug, items, template: NavLinkTemplate }) {
  const context = useNavContextProvider();
  const scrollRef = useRef<HTMLDivElement>(null);
  const selectorRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState<number>(0);

  useEffect(() => {
    if (!scrollRef) return;
    const scrollEl = scrollRef.current;
    // TODO: get NavTemplate height instead of fixed value
    const navItemHeight = 60;
    if (
      context.itemSelected * navItemHeight <=
      scrollEl.scrollTop + navItemHeight
    ) {
      // if (context.lastItemSelected > context.itemSelected) {
      scrollEl.scrollBy({ top: -navItemHeight });
      // }
    }
    if (
      context.itemSelected * navItemHeight >
      scrollEl.scrollTop + scrollEl.clientHeight - 2 * navItemHeight
    ) {
      scrollEl.scrollBy({ top: navItemHeight });
    }
  }, [context.itemSelected, context.lastItemSelected]);
  return (
    <div className="flex flex-col items-center relative max-2xl:hidden">
      <NavScrollArrow
        direction="up"
        scrollEl={scrollRef?.current}
        scrollTop={scrollTop}
      ></NavScrollArrow>
      <div
        ref={scrollRef}
        onScroll={(e) => {
          const target = e.target as HTMLDivElement;
          setScrollTop(target.scrollTop);
        }}
        className="scroll-smooth overflow-scroll relative flex flex-col 2xl:w-[296px] 2xl:h-[388px]"
      >
        <div
          className={`absolute w-[2px] h-[60px] bg-peach transition-all ease-out`}
          style={{
            top: `${selectorRef?.current?.offsetHeight * context.itemSelected || 0}px`,
          }}
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
      <NavScrollArrow
        direction="down"
        scrollEl={scrollRef?.current}
        scrollTop={scrollTop}
      ></NavScrollArrow>
    </div>
  );
}
