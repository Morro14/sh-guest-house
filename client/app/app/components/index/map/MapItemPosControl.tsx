import { useState, type RefObject } from "react";
import { writeMapItemPosData } from "./utils";

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
              const newOffset = Math.floor(itemEl.clientWidth / 2 - 5);
              dotEl.style.left = `${newOffset}px`;
              writeMapItemPosData(
                itemEl.dataset.slug,
                { x: newOffset, y: dotEl.offsetTop },
                "placeDot",
              );
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
              const newOffset = lineSnapTo * lineHeight - lineHeight + 9;
              dotEl.style.top = `${newOffset}px`;
              writeMapItemPosData(
                itemEl.dataset.slug,
                { x: dotEl.offsetLeft, y: newOffset },
                "placeDot",
              );
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
              const newOffset = lineSnapTo * lineHeight + lineHeight + 9;
              dotEl.style.top = `${newOffset}px`;
              writeMapItemPosData(
                itemEl.dataset.slug,
                { x: dotEl.offsetLeft, y: newOffset },
                "placeDot",
              );
            }}
          >
            1 line down
          </button>
          <button
            onClick={() => {
              const newOffset = dotEl.offsetTop - 1;
              dotEl.style.top = `${newOffset}px`;
              writeMapItemPosData(
                itemEl.dataset.slug,
                { x: dotEl.offsetLeft, y: newOffset },
                "placeDot",
              );
            }}
          >
            move up
          </button>
          <button
            onClick={() => {
              const newOffset = dotEl.offsetTop + 1;
              dotEl.style.top = `${newOffset}px`;
              writeMapItemPosData(
                itemEl.dataset.slug,
                { x: dotEl.offsetLeft, y: newOffset },
                "placeDot",
              );
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
