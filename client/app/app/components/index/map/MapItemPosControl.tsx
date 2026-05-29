import { useState, type RefObject } from "react";

export default function MapItemPosControl({
  itemElRef,
  dotElRef,
}: {
  itemElRef: RefObject<HTMLDivElement>;
  dotElRef: RefObject<HTMLDivElement>;
}) {
  const itemEl = itemElRef.current;
  const dotEl = dotElRef.current;
  const [show, setShow] = useState(false);
  return itemEl || dotEl ? (
    <div className="absolute text-left left-[calc(100%+10px)] text-xs font-sans font-light text-gray-warm-mid">
      <button className="underline text-left" onClick={() => setShow(!show)}>
        {show ? "hide" : "edit"}
      </button>
      {show ? (
        <div className="flex flex-col text-nowrap text-left items-start">
          <button
            onClick={() => {
              dotEl.style.left = `${Math.floor(itemEl.clientWidth / 2 - 5)}px`;
            }}
          >
            center hor
          </button>
          <button
            onClick={() => {
              const lineHeight = 24;
              const offsetToLineHeight = Math.floor(
                dotEl.offsetTop / lineHeight,
              );
              const lineSnapTo = offsetToLineHeight;
              dotEl.style.top = `${lineSnapTo * lineHeight - lineHeight + 9}px`;
            }}
          >
            1 line up
          </button>
          <button
            onClick={() => {
              const lineHeight = 24;
              const offsetToLineHeight = Math.floor(
                dotEl.offsetTop / lineHeight,
              );
              const lineSnapTo = offsetToLineHeight;
              dotEl.style.top = `${lineSnapTo * lineHeight + lineHeight + 9}px`;
            }}
          >
            1 line down
          </button>
          <button
            onClick={() => {
              dotEl.style.top = `${dotEl.offsetTop - 1}px`;
            }}
          >
            move up
          </button>
          <button
            onClick={() => {
              dotEl.style.top = `${dotEl.offsetTop + 1}px`;
            }}
          >
            move down
          </button>
        </div>
      ) : (
        ""
      )}
    </div>
  ) : (
    ""
  );
}
