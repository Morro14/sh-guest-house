import { useRoomContextProvider } from "~/components/index/RoomsContextProvider";

export default function NavLinkRoom({ room, index }) {
  const context = useRoomContextProvider();
  console.log(context.roomSelected);

  return (
    <div className="cursor-pointer z-10 flex flex-col h-[77px]">
      <div

        onClick={() => {
          context.setRoomSelected(index)
          context.setLastSelected({ current: index, prev: context.lastSelected.current })
        }}
        className="bg-transparent hover:bg-peach-superlight hover:transition-colors h-[77px]"
      >
        <div className="text-xl font-serif">{room.name}</div>
        <div className="flex gap-2" key={`${room.slug}-select-room-info`}>
          <div className="font-sans">{`${room.adults_num} Adults ${room.children_num} children`}</div>
          <div>|</div>
          <div className="font-sans" >Beds description</div>
        </div>
      </div>
    </div>
  );
}
