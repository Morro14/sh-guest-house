import { useFetchV3 } from "~/utils/fetchHook";
import Nav from "../nav/Nav";
import { useNavContextProvider } from "../nav/NavContextProvider";
import MediaFullView from "../MediaFullView";
import { Carousel } from "../carousel/Carousel";
import type { Room } from "app/types/booking";
import NavRows from "../nav/NavRows";
import { useTranslation } from "react-i18next";

export default function RoomsPreview() {
  const { fetchedData, loading } = useFetchV3("content/rooms");
  const { t } = useTranslation();
  const rooms = fetchedData?.data?.data as Array<Room>;
  const context = useNavContextProvider();
  const roomCarousels =
    !loading && rooms
      ? rooms.map((room) => {
          return (
            <Carousel
              name="rooms"
              key={`room-carousel-${room.slug}`}
              images={room.images}
              imageSize="small"
              imageRes="main"
              border={true}
            ></Carousel>
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
  return loading || !rooms || rooms.length === 0 ? (
    <div className="flex justify-cventer items-center carousel-small bg-olive-light text-gray-500 font-serif">
      {!rooms || rooms.length === 0 ? t("No data") : t("Loading...")}
    </div>
  ) : (
    <div className="flex flex-col md:items-center 2xl:items-start 2xl:justify-between relative">
      <div className="carousel-small-width text-sm italic ">
        <h5 className="font-medium mb-2">{rooms[context.itemSelected].name}</h5>
        <p className="h-15 md:h-10 overflow-hidden">
          {rooms[context.itemSelected].beds}
        </p>
      </div>
      <div className="flex 2xl:flex-row pt-4 max-2xl:flex-col max-2xl:items-center 2xl:items-start max-2xl:gap-6 2xl:gap-0 w-full">
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
        ></Nav>
        <NavRows
          items={rooms}
          slug="rooms"
          contextProvider={useNavContextProvider}
          template={NavRowsLinkTemplate}
        ></NavRows>
      </div>
    </div>
  );
}

function NavLinkTemplate({ item, isSelected }) {
  return (
    <div
      className={`hover:cursor-pointer ${isSelected ? "font-medium bg-apricot-light" : "font-normal"} transition-all px-3 py-1 ease-out h-[60px]`}
    >
      <div className="text-lg font-sans">{item.name}</div>
      <div className="flex gap-2 text-sm">
        <div className="font-sans">{`${item.adults_num} Adults ${item.children_num} children`}</div>
        <div>|</div>
        <div className="font-sans">Beds description</div>
      </div>
    </div>
  );
}
function NavRowsLinkTemplate({ item, isSelected }) {
  return (
    <div
      className={`hover:cursor-pointer border-gray-warm-light border-1 border-collapse ${isSelected ? "font-medium bg-apricot-light" : "font-normal"} transition-all py-1 px-3 ease-out md:h-[70px] h-16 `}
    >
      <div className="text-lg font-sans">{item.name}</div>
      <div className="flex items-end gap-2">
        <div className="font-sans text-sm">{`${item.adults_num} Adults ${item.children_num} children`}</div>
        <div>|</div>
        <div className="font-sans text-sm">Beds description</div>
      </div>
    </div>
  );
}
