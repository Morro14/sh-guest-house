import { useEffect, useRef } from "react"
import { useNavContextProvider } from "./nav/NavContextProvider"
import { useCloseOnClick } from "./formComponents/utils"
import { useState } from "react"
import { Carousel } from "./carousel/Carousel"


export default function MediaFullView({ images, slug }) {
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

  console.log('opacity', opacity)
  console.log('context full view', context.fullImageView)
  console.log('context.item', context.itemSelected)


  return context.fullImageView ?
    <div className={`fixed top-0 left-0 z-50 flex justify-center items-center w-screen h-screen bg-black-transparent transition duration-300 ` + (!opacity ? "opacity-0" : "opacity-100")}>
      <div ref={ref} className="image-full">
        <Carousel name="rooms" slug={slug + "-full"} images={images} imageSize="main"></Carousel>
      </div>
    </div> : ""
}
