import { useFetchV3 } from "~/utils/fetchHook";
import Nav from "../nav/Nav";
import { useNavContextProvider } from "../nav/NavContextProvider";
import MediaFullView from "../MediaFullView";
import { Carousel } from "../carousel/Carousel";
import type { Room } from "app/types/general";

export default function RoomsPreview() {
  const { fetchedData, loading } = useFetchV3("rooms");
  const rooms = fetchedData?.data.data as Array<Room>;
  const context = useNavContextProvider();
  const roomCarousels = !loading
    ? rooms.map((room) => {
        return (
          <div>
            <Carousel
              name="rooms"
              key={`room-carousel-${room.slug}`}
              images={room.images}
              imageSize="small"
              imageRes="main"
              border={true}
            ></Carousel>
          </div>
        );
      })
    : [];
  // const cachedRoomCarousels = useMemo(roomCarousels, [data])
  const currentRoomCarousel = roomCarousels[context.itemSelected];
  context.preStateChangeCallback = (callback: () => void) => {
    callback();
  };
  // setOpacity(0)
  // setTimeout(() => {
  //   setOpacity(100)
  //   callback()
  // },
  //   300

  return loading ? (
    <div className="flex justify-center items-center w-[688px] h-[388px] bg-olive-light text-gray-500 font-serif">
      Loading...
    </div>
  ) : (
    <div className="flex justify-between pt-9">
      {currentRoomCarousel}
      {context.fullImageView ? (
        <MediaFullView>
          <Carousel
            name="rooms"
            key={`room-carousel-${rooms[context.itemSelected].slug}`}
            images={rooms[context.itemSelected].images}
            imageSize="full"
            imageRes="original"
            fullView={true}
          ></Carousel>
        </MediaFullView>
      ) : (
        ""
      )}
      <Nav
        items={rooms}
        slug="rooms"
        contextProvider={useNavContextProvider}
        template={NavLinkTemplate}
      ></Nav>{" "}
    </div>
  );
}

function NavLinkTemplate({ item }) {
  return (
    <div>
      <div className="text-xl font-sans">{item.name}</div>
      <div className="flex gap-2">
        <div className="font-sans text-base">{`${item.adults_num} Adults ${item.children_num} children`}</div>
        <div>|</div>
        <div className="font-sans">Beds description</div>
      </div>
    </div>
  );
}
