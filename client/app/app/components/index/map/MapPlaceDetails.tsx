import type { MapPlaceData } from "~/types/map";
import wikiLogo from "src/assets/wikipedia-logo.svg";
import geolocIcon from "src/assets/google-map-icon.svg";
import Placeholder from "~/components/Placeholder";

export default function MapPlaceDetails({ place }: { place: MapPlaceData }) {
  return (
    <div className="flex flex-col gap-5 p-0.5 md:w-173 md:max-h-163 bg-bg pb-5">
      {place.images.length > 0 ? (
        <img
          className="w-full h-[265px]"
          src={place.images[0].variants.small}
        />
      ) : (
        <div className="w-full h-[265px]">
          <Placeholder></Placeholder>
        </div>
      )}

      <h4 className="px-6 mb-0!">{place.name}</h4>
      <div className="px-6 pb-3 md:max-h-40 overflow-y-scroll border-b border-gray-300">
        {place.description +
          place.description +
          place.description +
          place.description}
      </div>
      <div className="flex w-full justify-end gap-5 items-center px-6">
        <a href={place.info_link}>
          <img src={wikiLogo} className="w-8" />
        </a>
        <a href={place.geoloc}>
          <img src={geolocIcon} className="w-4" />
        </a>
      </div>
    </div>
  );
}
