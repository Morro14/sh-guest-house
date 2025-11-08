import type { EmblaViewportRefType } from "embla-carousel-react"
import { useEffect, useRef, useState } from "react"
import NavArrow from "../nav/NavArrow.tsx"

export default function CarouselDots({ emblaRef, emblaApi }: { emblaRef: EmblaViewportRefType, emblaApi: any }) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([])
  const selectorRef = useRef(undefined)
  useEffect(() => {
    if (!emblaApi) {
      return
    }
    setScrollSnaps(emblaApi.scrollSnapList())
    emblaApi.on("select", () => {
      setSelectedIndex(emblaApi.selectedScrollSnap())
    })
  }, [emblaApi, emblaRef])
  if (selectorRef.current) {
    selectorRef.current.style.left = String(selectedIndex * 35 + 'px')
  }
  return <div className={"flex grow gap-[41px] justify-center"}>
    <NavArrow key={'rooms-arrow-left'} direction="left" numElements={scrollSnaps.length} index={selectedIndex} func={() => selectedIndex > 0 ? emblaApi?.scrollTo(selectedIndex - 1) : undefined} />
    <div className="flex relative gap-[21px]">
      <div ref={selectorRef} className="absolute w-3.5 h-3.5 rounded-[7px] bg-peach transition-all duration-500 ease-out pointer-event-none"></div>
      {scrollSnaps.map((slide, i) => {
        return <div key={`room-dot-${slide}`} onClick={() => emblaApi?.scrollTo(i)} className="w-3.5 h-3.5 rounded-[7px] cursor-pointer hover:bg-peach-light bg-gray-warm"></div>
      })}
    </div>

    <NavArrow key={'rooms-arrow-right'} direction="right" index={selectedIndex} func={() => selectedIndex < scrollSnaps.length - 1 ? emblaApi?.scrollTo(selectedIndex + 1) : undefined} numElements={scrollSnaps.length} />
  </div>
}
