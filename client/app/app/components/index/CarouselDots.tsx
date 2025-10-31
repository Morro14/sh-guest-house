import type { EmblaViewportRefType } from "embla-carousel-react"
import { useCallback, useEffect, useRef, useState } from "react"

export default function CarouselDots({ emblaRef, emblaApi }: { emblaRef: EmblaViewportRefType, emblaApi: any }) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([])
  const selectorRef = useRef(undefined)
  const [selectorPos, setSelectorPos] = useState(0)
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
  console.log('carousel dots: ', selectedIndex, scrollSnaps)
  return <div className="flex grow justify-center">
    <div className="flex relative gap-[21px]">
      <div ref={selectorRef} className="absolute w-3.5 h-3.5 rounded-[7px] bg-peach transition-all duration-500 ease-in-out pointer-event-none"></div>
      {scrollSnaps.map((slide, i) => {
        return <div key={`room-dot-${slide}`} onClick={() => emblaApi?.scrollTo(i)} className="w-3.5 h-3.5 rounded-[7px] bg-gray-warm"></div>
      })}
    </div>
  </div>
}
