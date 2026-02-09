import { useTranslation } from "react-i18next";
import LocationMain from "~/components/index/location/LocationMain";
import Paragraph from "~/components/index/Paragraph";
import RoomsPreview from "~/components/index/Rooms";
import NavContextProvider from "~/components/nav/NavContextProvider";
import Places from "~/components/index/Places";
import CarouselWide from "~/components/index/CarouselWide";

export default function Index() {
  const { t } = useTranslation();
  return (
    <div className="flex grow flex-col items-stretch text-text-main bg-bg gap-7 min-h-screen ">
      <div className="flex flex-col items-center">
        <h1 className="mt-[42px] mb-3">{t("index-title")}</h1>
        <div className="flex flex-col gap-6 mt-10 relative">
          <NavContextProvider>
            <CarouselWide tag="main"></CarouselWide>
          </NavContextProvider>
          <div className="w-full h-[1px] absolute bg-gray-line -bottom-7"></div>
        </div>
      </div>

      <div className="flex flex-col items-center">
        <div className="index-container-1 relative flex flex-col gap-9 pt-8">
          <div className="h-[120%] w-[1px] line-gray-gradient absolute -left-7 top-0"></div>
          <Paragraph content="about" titleSize="h3" centered={false} />

          <Paragraph content="rooms-preview" titleSize="h4" />
          <NavContextProvider>
            <RoomsPreview></RoomsPreview>
          </NavContextProvider>
          <Paragraph content="location" titleSize="h4" />
          <LocationMain></LocationMain>
        </div>
      </div>

      <div className="h-[72px]"></div>

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
        <div className="w-full h-[1px] absolute bg-gray-line -bottom-7"></div>
      </div>

      <div className="flex flex-col items-center">
        <div className="index-container-1 flex flex-col grow gap-9 2xl:w-[1000px] pt-8 relative">
          <div className="h-[120%] w-[1px] line-gray-gradient absolute -left-7 top-0"></div>
          <Paragraph
            content="places"
            titleSize="h4"
            centered={false}
          ></Paragraph>
          <NavContextProvider>
            <Places></Places>
          </NavContextProvider>
        </div>
      </div>
    </div>
  );
}
