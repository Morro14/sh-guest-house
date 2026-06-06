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
          <div id="about">
            <Paragraph
              content={pageContentObj?.about}
              titleSize="h3"
              centered={true}
            />
          </div>
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
          <div className="flex flex-col gap-4" id="location">
            <Paragraph
              content={pageContentObj?.location}
              titleSize="h3"
              centered={true}
            />
            <LocationMain></LocationMain>
          </div>
          <div className="" id="contacts"></div>
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
        <div className="index-container-1 flex flex-col grow gap-8 2xl:w-[1000px] mt-11 relative">
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

const line = (
  <svg
    className="md:h-0.5 h-3"
    width="100%"
    viewBox="0 0 1280 2"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M716.98 0.37985C745.233 0.512837 767.473 -0.0749272 801.908 0.00815345C836.344 0.0912353 841.501 0.403014 880.938 0.332867C920.373 0.262734 959.831 0.475984 977.39 0.34789C994.949 0.219759 996.802 0.607151 1021.74 0.521112C1046.67 0.435085 1061.78 0.485652 1083.59 0.611571C1105.4 0.737493 1172.39 0.844999 1196.75 0.690317C1221.12 0.535635 1248.9 0.804034 1265.61 0.867691C1270.82 0.887519 1274.91 0.914655 1278.05 0.942887C1279.39 0.954858 1280 0.9799 1280 1.00462C1280 1.00464 1280 1.00465 1280 1.00467C1280 1.03545 1279.05 1.06571 1277.34 1.0696C1269.04 1.08847 1256.63 1.13828 1241.98 1.24989C1214.66 1.45801 1211.67 1.22803 1174.78 1.33497C1137.88 1.44191 1115.72 1.65572 1072.3 1.51745C1028.89 1.3792 1018.92 1.95775 957.644 1.62987C896.367 1.30201 889.917 1.90707 828.852 1.98753C767.787 2.06797 690.704 1.73412 653.893 1.7618C617.082 1.78948 567.642 1.85996 515.458 1.7801C463.274 1.70025 398.854 1.90181 341.251 1.75933C283.648 1.61686 202.211 1.43691 164.587 1.31632C126.966 1.19575 117.796 1.16855 81.5829 1.24222C60.7674 1.28457 32.092 1.24465 7.87063 1.08889C-4.31912 1.01051 -1.55692 0.901368 10.7125 0.849148C28.6543 0.772791 43.3826 0.823805 52.6273 0.687409C71.1 0.414816 78.9512 0.310245 102.272 0.468908C125.591 0.62755 136.579 0.267014 150.173 0.308511C163.767 0.35003 163.544 0.56269 232.665 0.398851C301.787 0.235005 339.68 0.1932 365.856 0.153867C392.032 0.114534 446.689 0.299106 489.349 0.232491C532.01 0.165881 618.737 0.226941 653.698 0.117882C688.657 0.00883103 688.729 0.246864 716.98 0.37985Z"
      fill="#FB966E"
    />
  </svg>
);
