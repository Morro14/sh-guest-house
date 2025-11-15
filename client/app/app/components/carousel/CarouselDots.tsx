import type { EmblaViewportRefType } from "embla-carousel-react"
import { useEffect, useMemo, useRef, useState } from "react"
import { useNavContextProvider } from "../nav/NavContextProvider"

export default function CarouselDots({ emblaRef, emblaApi }: { emblaRef: EmblaViewportRefType, emblaApi: any }) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  // const [scrollSnaps, setScrollSnaps] = useState<number[]>([])
  const scrollSnaps = emblaApi?.scrollSnapList() || []
  const context = useNavContextProvider()
  const selectorRef = useRef(undefined)
  if (selectorRef.current) {
    selectorRef.current.style.left = String(selectedIndex * 35 + 'px')
  }
  // const dotsInit = scrollSnaps.map((slide, i) => {
  //   return <div key={`room-dot-${slide}`} onClick={() => emblaApi?.scrollTo(i)} className="w-3.5 h-3.5 rounded-[7px] cursor-pointer hover:bg-peach-light bg-gray-warm"></div>
  // })

  useEffect(() => {
    if (!emblaApi) {
      return
    }
    const snapsLength = emblaApi.scrollSnapList().length
    const dotsLength = context.dots.length
    const genMoreDots = (newDotsNum: number, currentDotsNum: number) => Array.from({ length: newDotsNum }, (_, i) => {
      return <div key={`room-dot-${currentDotsNum + i}`} onClick={() => emblaApi?.scrollTo(currentDotsNum + i)} className="w-3.5 h-3.5 rounded-[7px] cursor-pointer hover:bg-peach-light bg-gray-warm"></div>
    })
    if (dotsLength === 0) {
      const moreDots = genMoreDots(snapsLength, 0)
      context.setDots(moreDots)

    }
    if (dotsLength > snapsLength) {
      context.setDots(context.dots.slice(0, snapsLength))
    }
    if (dotsLength < snapsLength) {
      const moreDots = genMoreDots(snapsLength - dotsLength, dotsLength)
      context.setDots(context.dots.concat(moreDots))
    }
    emblaApi.on("select", () => {
      setSelectedIndex(emblaApi.selectedScrollSnap())
    })
  }, [emblaApi])
  console.log('dots', context.dots)
  return <div className={"flex grow gap-[41px] justify-center items-center transtion-all duration-300"}>
    <NavArrow key={'rooms-arrow-left'} direction="left" numElements={scrollSnaps.length} index={selectedIndex} func={() => selectedIndex > 0 ? emblaApi?.scrollTo(selectedIndex - 1) : undefined} />
    <div className="flex relative gap-[21px]">
      <div ref={selectorRef} className="absolute w-3.5 h-3.5 rounded-[7px] bg-peach transition-all duration-500 ease-out pointer-event-none"></div>
      {context.dots ? context.dots : ""}
    </div>
    <NavArrow key={'rooms-arrow-right'} direction="right" index={selectedIndex} func={() => selectedIndex < scrollSnaps.length - 1 ? emblaApi?.scrollTo(selectedIndex + 1) : undefined} numElements={scrollSnaps.length} />
  </div>
}

export function NavArrow({ direction, numElements, index, func }: { direction: "left" | "right", numElements: number, index: number, func: () => any }) {
  const styleConditions = { right: direction === 'right' && index < numElements - 1, left: direction === 'left' && index > 0 }
  const styles = { active: "stroke-peach group-hover:stroke-peach cursor-pointer", inactive: "stroke-gray-warm" }
  const active = styleConditions[direction]
  const svgStyle = () => {
    return styles[active ? "active" : "inactive"]
  }
  return <svg onClick={func}
    className={"group " + (direction === 'left' ? "rotate-180 " : "") + (active ? "cursor-pointer" : "")} width="20" height="23" viewBox="0 0 20 23" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path className={"transition-all " + svgStyle()} d="M1 1C7.61224 9.01316 13.4898 11.5 19 11.5" stroke="#EFA76A" stroke-width="2" stroke-linecap="round" />
    <path className={"transition-all " + svgStyle()} d="M1 22C7.61224 13.9868 13.4898 11.5 19 11.5" stroke="#EFA76A" stroke-width="2" stroke-linecap="round" />
  </svg>
}

