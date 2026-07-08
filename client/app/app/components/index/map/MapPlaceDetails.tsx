import type { MapPlaceData } from "~/types/map";
import wikiLogo from "src/assets/wikipedia-logo.svg";
import geolocIcon from "src/assets/google-map-icon.svg";
import { CarouselSimple } from "~/components/carousel/CarouselSimple";

export default function MapPlaceDetails({ place }: { place: MapPlaceData }) {
  return (
    <div
      className="flex flex-col gap-5 p-5 place-details h-[90vh] bg-bg overflow-y-scroll"
      onScroll={(e) => {
        e.stopPropagation();
      }}
    >
      <div className="min-h-[30vh] border-b border-gray-300 pb-5">
        <CarouselSimple
          name={`${place.slug}-carousel`}
          images={place.images}
          imageRes="small"
          border={false}
        ></CarouselSimple>
      </div>
      <div className="flex">
        <h3 className="mb-0! ">{place.name}</h3>

        <div className="flex w-full justify-end gap-2 items-center">
          <a href={place.info_link}>
            <img src={wikiLogo} className="w-5" />
          </a>
          <a href={place.geoloc}>
            <img src={geolocIcon} className="w-3" />
          </a>
        </div>
      </div>
      <div className=" pb-5 text-[17px] border-b  border-gray-300 whitespace-pre-wrap">
        {place.description}
      </div>
    </div>
  );
}
