import { useEffect, useRef, type ReactNode } from "react"
import { useNavContextProvider } from "./nav/NavContextProvider"
import { useCloseOnClickV2 } from "./formComponents/utils"
import { useState } from "react"
import closeButton from 'root/src/assets/close-button.svg'

export default function MediaFullView({ children }: { children: ReactNode }) {
  const context = useNavContextProvider()
  const [opacity, setOpacity] = useState(0)
  const ref = useRef(null)
  useCloseOnClickV2(ref, () => {
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

  return <div className={`fixed top-0 left-0 z-50 flex justify-center items-center w-screen h-screen bg-black-transparent transition duration-300 ` + (!opacity ? "opacity-0" : "opacity-100")}>
    <div className="relative">
      <div ref={ref} className="flex media-full-view">
        {children}
      </div>
      <img src={closeButton} className="absolute top-0 -right-11 cursor-pointer" />
    </div>
  </div>
}
