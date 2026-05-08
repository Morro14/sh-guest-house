import { useTranslation } from "react-i18next";
import LocationMain from "~/components/index/Location";
import Paragraph from "~/components/index/Paragraph";
import RoomsPreview from "~/components/index/Rooms";
import NavContextProvider from "~/components/nav/NavContextProvider";
import CarouselWide from "~/components/carousel/CarouselWide";
import { useFetchV3 } from "~/utils/fetchHook";
import { formatPageContentData } from "~/utils/format";
import CarouselGrid from "~/components/carousel/CarouselGrid";
import CarouselGridContextProvider from "~/components/carousel/CarouselGridContext";
import Map from "~/components/index/map/Map";
import MapContextProvider from "~/components/index/map/MapContextProvider";
import NavHorizontal from "~/components/index/NavHorizontal";
import CarouselReviews from "~/components/carousel/CarouselReviews";

export default function Index() {
  const { t } = useTranslation();
  const { fetchedData } = useFetchV3("content/page-content");
  const pageContent = fetchedData?.data?.data;
  const pageContentObj = pageContent
    ? formatPageContentData(pageContent)
    : null;
  return (
    <div className="flex grow flex-col items-stretch text-text-main bg-bg gap-7 min-h-screen ">
      <div className="flex flex-col items-center">
        <h1 className="mt-14 mb-3 tracking-wide">{t("index-title")}</h1>
        <h2 className="mb-14!">{t("Some subtitle")}</h2>
        <NavContextProvider>
          <CarouselGridContextProvider>
            <CarouselGrid name="index"></CarouselGrid>
          </CarouselGridContextProvider>
        </NavContextProvider>
        <CarouselReviews></CarouselReviews>
        <NavHorizontal></NavHorizontal>
      </div>
      <div className="flex flex-col items-center">
        <div className="index-container-1 relative flex flex-col items-center gap-12 mt-14">
          <Paragraph
            content={pageContentObj ? pageContentObj["about"] : null}
            titleSize="h3"
            centered={true}
          />
          <Paragraph
            content={pageContentObj ? pageContentObj["rooms-preview"] : null}
            titleSize="h3"
            centered={true}
          />
          <NavContextProvider>
            <RoomsPreview></RoomsPreview>
          </NavContextProvider>
          <div className="flex flex-col gap-4">
            <Paragraph
              content={pageContentObj ? pageContentObj["location"] : null}
              titleSize="h3"
              centered={true}
            />
            <LocationMain></LocationMain>
          </div>
        </div>
      </div>

      <div className="h-[42px]"></div>

      <div className="flex flex-col gap-6 mt-[18px] relative">
        <div>
          <h2 className="text-center">{t("Vayots Dzor")}</h2>
          <h3 className="text-center -mt-6">
            {t("Points of interest in the province")}
          </h3>
        </div>
        <NavContextProvider>
          <CarouselWide tag="place"></CarouselWide>
        </NavContextProvider>
      </div>

      <div className="flex flex-col items-center">
        <div className="index-container-1 flex flex-col grow gap-12 2xl:w-[1000px] pt-8 relative">
          <Paragraph
            content={pageContentObj ? pageContentObj["places"] : null}
            titleSize="h4"
            centered={true}
          ></Paragraph>
          <MapContextProvider>
            <Map></Map>
          </MapContextProvider>
        </div>
      </div>
    </div>
  );
}
