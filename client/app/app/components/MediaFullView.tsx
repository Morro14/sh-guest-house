import { useEffect, useRef, type ReactNode } from "react"
import { useNavContextProvider } from "./nav/NavContextProvider"
import { isInsideSubtractArea, useCloseOnClickV2 } from "./formComponents/utils"
import { useState } from "react"
import closeButton from 'root/src/assets/close-button.svg'

export default function MediaFullView({ children }: { children: ReactNode }) {
  const context = useNavContextProvider()
  const [opacity, setOpacity] = useState(0)
  const contentRef = useRef(null)

  const contentInnerRef = useRef(null)
  const outsideContentFieldRef = useRef(null)
  const messageOnCursorRef = useRef(null)
  useCloseOnClickV2(contentRef, () => {
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
  useEffect(() => {
    const eventListener = (e: MouseEvent) => {
      setShowOnCursorMessage(isInsideSubtractArea(outsideContentFieldRef.current, contentRef.current, e))
      messageOnCursorRef.current.style.left = e.clientX + 'px'
      messageOnCursorRef.current.style.top = e.clientY + 'px'
    }
    document.addEventListener("mousemove", eventListener)
    return () => document.removeEventListener("mousemove", eventListener)
  }, [])
  const [showOnCursorMessage, setShowOnCursorMessage] = useState<boolean>()
  return <div ref={outsideContentFieldRef} className={`fixed top-0 left-0 z-50 flex justify-center items-center w-screen h-screen bg-black-transparent transition duration-300 ` + (!opacity ? "opacity-0" : "opacity-100")}>
    <div ref={messageOnCursorRef} className={`${showOnCursorMessage ? "opacity-100" : "opacity-0"} transition-opacity duration-500 absolute text-gray-300 pt-4 pl-4 overflow-visible`}>Click to close</div>
    <div ref={contentRef} className="flex justify-center media-full-view">
      {children}
    </div>
    <img src={closeButton} className="fixed top-5 right-5 cursor-pointer" />
  </div>
}
