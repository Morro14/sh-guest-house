import { useEffect, useRef, type ReactNode } from "react"
import { useNavContextProvider } from "./nav/NavContextProvider"
import { useCloseOnClick } from "./formComponents/utils"
import { useState } from "react"
import { Carousel } from "./carousel/Carousel"
import type { Image } from "~/types/nav"


export default function MediaFullView({ images = [], slug = "", imageSize = "main", children }: { images?: Array<Image>, slug?: string, imageSize: "main" | "full", children: ReactNode }) {
  const context = useNavContextProvider()
  const ref = useRef(undefined)
  const [opacity, setOpacity] = useState(0)

  useCloseOnClick(ref, null, () => {
    setOpacity(0)
    setTimeout(

      context.setFullImageView
      , 300, false)
  })

  useEffect(() => {
    if (context.fullImageView) {
      requestAnimationFrame(() => setOpacity(100))
      // return () => context.setItemSelected()
    }
  }, [context.fullImageView])


  return context.fullImageView ?
    <div className={`fixed top-0 left-0 z-50 flex justify-center items-center w-screen h-screen bg-black-transparent transition duration-300 ` + (!opacity ? "opacity-0" : "opacity-100")}>
      <div ref={ref} className="image-full">
        {children}
      </div>
    </div> : ""
}
