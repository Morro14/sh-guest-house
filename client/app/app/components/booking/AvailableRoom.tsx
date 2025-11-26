import type { Room } from "~/types/booking"
import { useNavContextProvider } from "../nav/NavContextProvider"

const SERVER_URL = import.meta.env.VITE_SERVER_URL

export default function AvailableRoom({ room, index }: { room: Room, index: number }) {
  const context = useNavContextProvider()
  return <div key={room.name}>
    <img className="border-2 border-peach object-cover w-[482px] h-[272px]" src={`${SERVER_URL}/${room.images[0].variants.small}`} onClick={() => { context.setFullImageView(true); context.setItemSelected(index) }} />
    <h4>{room.name}</h4>
    <div className="flex gap-16 font-sans">
      <span>{`Guests: ${room.adults_num + room.children_num}`}</span>
      <span>{`Beds: ${room.beds.slice(0, 20)}`}</span>
    </div>
    <p className=""></p>
  </div>
}
