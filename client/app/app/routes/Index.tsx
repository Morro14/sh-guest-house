import { useTranslation } from "react-i18next";
import LocationMain from "~/components/index/Location";
import Paragraph, { type ParagraphType } from "~/components/index/Paragraph";
import RoomsPreview from "~/components/index/Rooms";
import NavContextProvider from "~/components/nav/NavContextProvider";
import CarouselWide from "~/components/carousel/CarouselWide";
import { useFetchWithTranslation } from "~/utils/fetchHook";
import CarouselGrid from "~/components/carousel/CarouselGrid";
import CarouselGridContextProvider from "~/components/carousel/CarouselGridContext";
import Map from "~/components/index/map/Map";
import MapContextProvider from "~/components/index/map/MapContextProvider";
import NavHorizontal from "~/components/index/NavHorizontal";
import CarouselReviews from "~/components/carousel/CarouselReviews";
import eternity from "src/assets/eternity-main.png";
import MapNav from "~/components/index/map/MapNav";
import OpenMap from "~/components/index/map/OpenMap";
import { MAP_OPTIONS } from "~/components/index/map/utils";
import { useEffect } from "react";
import { useSearchParams } from "react-router";

export default function Index() {
  const { t, i18n } = useTranslation();
  const { fetchedData } = useFetchWithTranslation({
    pathname: "content/page-content",
    dependencies: [i18n.language],
  });
  const pageContent = (fetchedData?.data?.data as ParagraphType[]) || [];
  const extraPageContent = pageContent.filter(
    (item) => item.tag === "additional",
  );
  const [URLSearchParams] = useSearchParams();
  useEffect(() => {
    const scrollTo = URLSearchParams.get("scroll-to");
    if (scrollTo) {
      const el = document.getElementById(scrollTo);
      el.scrollIntoView({ behavior: "smooth" });
    }
  }, [URLSearchParams]);
  return (
    <div className="flex grow flex-col items-stretch text-text-main bg-bg min-h-screen ">
      <div className="flex flex-col items-center md:gap-8 gap-6">
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
        <div className="index-container-1 relative flex flex-col items-center gap-8">
          <div className="mt-8 w-full space-y-3">
            <NavHorizontal></NavHorizontal>
            {/* {line} */}
          </div>
          <div className="w-8 h-8 md:mt-4 md:mb-2">
            <img src={eternity} />
          </div>
          <div id="about" className="w-full">
            <Paragraph
              content={pageContent.find((item) => item.tag === "about")}
            />
          </div>
          <div className="w-full space-y-8">
            <Paragraph
              content={pageContent.find((item) => item.tag === "rooms-preview")}
            />
            <NavContextProvider>
              <RoomsPreview></RoomsPreview>
            </NavContextProvider>
          </div>
          <div className="flex flex-col gap-4 w-full" id="location">
            <Paragraph
              content={pageContent.find((item) => item.tag === "location")}
            />
            <LocationMain></LocationMain>
          </div>
          <div className="" id="contacts">
            <Paragraph
              content={pageContent.find((item) => item.tag === "contacts")}
            ></Paragraph>
          </div>
          {extraPageContent.length > 0 ? (
            <div id="additional-paragraphs w-full">
              {extraPageContent.map((item, i) => (
                <Paragraph
                  key={`additional-content-page-${i}`}
                  content={item}
                ></Paragraph>
              ))}
            </div>
          ) : (
            ""
          )}
          <div className="w-8 h-8 mb-10 md:mt-10 mt-8">
            <img src={eternity} />
          </div>
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
        <div className="flex flex-col items-center grow gap-8 2xl:w-[1000px] mt-11 relative">
          <Paragraph
            content={pageContent.find((item) => item.tag === "places")}
          ></Paragraph>
          <MapContextProvider>
            <div className="sm:block hidden max-md:w-screen w-full md:h-250 h-190">
              <MapNav></MapNav>
              <div className="md:border border-t border-b border-text-main w-full h-full">
                <Map options={{ ...MAP_OPTIONS, wheelZoom: false }}></Map>
              </div>
            </div>
            <OpenMap></OpenMap>
          </MapContextProvider>
        </div>
      </section>
    </div>
  );
}
