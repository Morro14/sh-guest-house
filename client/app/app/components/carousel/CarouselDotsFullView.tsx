import type { EmblaViewportRefType } from "embla-carousel-react"
import { useEffect, useRef, useState } from "react"
import { useNavContextProvider } from "../nav/NavContextProvider"
import NavArrow from "app/components/nav/NavArrow"



export default function CarouselDotsFullView({ emblaRef, emblaApi }: { emblaRef: EmblaViewportRefType, emblaApi: any }) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const context = useNavContextProvider()
  const selectorRef = useRef(undefined)
  if (selectorRef.current) {
    selectorRef.current.style.left = String(selectedIndex * 35 + 'px')
  }
  const [dots, setDots] = useState<any>([])
  console.log("full view dots", dots)
  useEffect(() => {
    if (!emblaApi) {
      return
    }
    if (emblaApi) {

      const snapsLength = emblaApi.scrollSnapList().length
      console.log('snapsLength', snapsLength)
      const genMoreDots = (newDotsNum: number, currentDotsNum: number) => Array.from({ length: newDotsNum }, (_, i) => {
        return <div key={`room-dot-${currentDotsNum + i}`} onClick={() => emblaApi?.scrollTo(currentDotsNum + i)} className="w-3.5 h-3.5 rounded-[7px] cursor-pointer hover:bg-peach-light bg-gray-warm"></div>
      })
      const genDots = genMoreDots(snapsLength, 0)
      setDots(genDots)
    }
    emblaApi.on("select", () => {
      setSelectedIndex(emblaApi.selectedScrollSnap())
    })
  }, [emblaApi])

  return <div className={"flex grow gap-[41px] justify-center items-center transtion-all duration-300"}>
    <NavArrow key={'rooms-arrow-left'} direction="left" numElements={dots.length} index={selectedIndex} func={() => selectedIndex > 0 ? emblaApi?.scrollTo(selectedIndex - 1) : undefined} />
    <div className="flex relative gap-[21px]">
      <div ref={selectorRef} className="absolute w-3.5 h-3.5 rounded-[7px] bg-peach transition-all duration-500 ease-out pointer-event-none"></div>
      {dots ? dots : ""}
    </div>
    <NavArrow key={'rooms-arrow-right'} direction="right" index={selectedIndex} func={() => selectedIndex < dots.length - 1 ? emblaApi?.scrollTo(selectedIndex + 1) : undefined} numElements={dots.length} />

  </div>
}

