import type { Room } from "~/types/booking"
import { useNavContextProvider } from "../nav/NavContextProvider"
import { useSearchParams } from "react-router"
import { isDigit } from "~/utils/general"

const SERVER_URL = import.meta.env.VITE_SERVER_URL

export default function AvailableRoom({ room, index }: { room: Room, index: number }) {

  const [urlParams] = useSearchParams()
  const days = urlParams.get("days")
  const daysNum = days && isDigit(days) ? Number(days) : 1

  const context = useNavContextProvider()
  return <div key={room.name}>
    <img className="border-2 border-peach object-cover w-[482px] h-[272px]" src={`${SERVER_URL}/${room.images[0].variants.small}`} onClick={() => { context.setFullImageView(true); context.setItemSelected(index) }} />
    <div className="flex flex-col gap-4 mt-4">
      <h4>{room.name}</h4>
      <div className="font-sans flex flex-col text-lg">
        <span className="block">{`Guests: ${room.adults_num + room.children_num}`}</span>
        <span className="block">{`Beds: ${room.beds.slice(0, 20)}`}</span>
      </div>
      <div className="flex items-end gap-24">
        <div className="flex flex-col">
          <div className="font-sans text-base">For one night:</div>
          <span className="font-serif text-green-warm text-2xl">{room.price}</span>
        </div>
        {daysNum > 1 ?
          <div className="flex flex-col">
            <div className="font-sans text-base">{`For ${daysNum} nights:`}</div>
            <div className="flex items-end">
              <span className="font-serif text-green-warm text-2xl">{room.price * daysNum}</span>
            </div>
          </div>
          : ""}
      </div>
    </div>
    <div>{}</div>
  </div>

}
