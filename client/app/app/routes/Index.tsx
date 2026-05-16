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
import eternity from "src/assets/eternity-main.png";

export default function Index() {
  const { t } = useTranslation();
  const { fetchedData } = useFetchV3("content/page-content");
  const pageContent = fetchedData?.data?.data;
  const pageContentObj = pageContent
    ? formatPageContentData(pageContent)
    : null;
  return (
    <div className="flex grow flex-col items-stretch text-text-main bg-bg min-h-screen ">
      <div className="flex flex-col items-center md:gap-11 gap-6">
        <div className="flex flex-col items-center">
          <h1 className="mt-11 mb-3 tracking-wide">{t("index-title")}</h1>
          <h2 className="mb-0!">{t("Some subtitle")}</h2>
        </div>
        <NavContextProvider>
          <CarouselGridContextProvider>
            <CarouselGrid name="index"></CarouselGrid>
          </CarouselGridContextProvider>
        </NavContextProvider>
        <CarouselReviews></CarouselReviews>
      </div>
      <div className="flex flex-col items-center gap-15">
        <div className="index-container-1 relative flex flex-col items-center gap-12">
          <div className="mt-11 w-full">
            <NavHorizontal></NavHorizontal>
          </div>
          <div className="w-8 h-8 md:my-4">
            <img src={eternity} />
          </div>
          <Paragraph
            content={pageContentObj?.about}
            titleSize="h3"
            centered={true}
          />
          <div className="w-full space-y-8">
            <Paragraph
              content={pageContentObj?.["rooms-preview"]}
              titleSize="h3"
              centered={true}
            />
            <NavContextProvider>
              <RoomsPreview></RoomsPreview>
            </NavContextProvider>
          </div>
          <div className="flex flex-col gap-4">
            <Paragraph
              content={pageContentObj?.location}
              titleSize="h3"
              centered={true}
            />
            <LocationMain></LocationMain>
          </div>
        </div>
        <div className="w-8 h-8 md:mb-15 mb-10 md:mt-5 mt-1">
          <img src={eternity} />
        </div>
      </div>

      {/* <div className="h-20"></div> */}

      <div
        id="points-of-interest"
        className="flex flex-col gap-6 mt-[18px] relative scroll-mt-15"
      >
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

      <section id="places" className="flex flex-col items-center">
        <div className="index-container-1 flex flex-col grow gap-12 2xl:w-[1000px] mt-11 relative">
          <Paragraph
            content={pageContentObj?.places}
            titleSize="h3"
            centered={true}
          ></Paragraph>
          <MapContextProvider>
            <Map></Map>
          </MapContextProvider>
        </div>
      </section>
    </div>
  );
}
