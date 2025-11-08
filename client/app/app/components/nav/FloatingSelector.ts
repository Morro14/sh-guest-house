import { useEffect, useState } from "react";


export default function useFloatingSelector(prevPos: number, loaded = false, position: number, scrollElement: React.RefObject<HTMLDivElement>, selectorElement: React.RefObject<HTMLDivElement>) {

  const selectorHeight = loaded ? selectorElement.current.clientHeight : undefined
  const [scrollPos, setScrollPos] = useState(0)
  console.log("floating selector: loaded:", loaded, "position:", position)
  useEffect(() => {
    if (!loaded) return
    // if selector is at 2nd to bottom position of visible part
    let newPos = 0
    if ((prevPos < position) && (selectorHeight * position - scrollElement.current.scrollTop) >= 4 * selectorHeight) {
      console.log('cond 1')
      if (scrollElement.current.scrollTopMax - scrollElement.current.scrollTop <= selectorHeight) {
        console.log('cond 1 1')
        newPos = scrollElement.current.scrollTopMax
      } else {
        newPos = scrollElement.current.scrollTop + selectorHeight
      }
    } else
      // if selector is at 2nd position of visible part
      if ((prevPos > position) && (selectorHeight * position - scrollElement.current.scrollTop <= selectorHeight)) {
        console.log('cond 2')
        if (scrollElement.current.scrollTop !== 0 && scrollElement.current.scrollTop <= selectorHeight) {
          console.log('cond 2 1')
          newPos = 0
        } else {
          newPos = scrollElement.current.scrollTop - selectorHeight
        }
      } else {
        newPos = scrollElement.current.scrollTop
      }
    setScrollPos(newPos)
  }, [position])

  return { scrollPos }

}

