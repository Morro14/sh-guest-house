import { useTranslation } from "react-i18next";
import Line from "~/components/index/Line";
import LocationMain from "~/components/index/location/LocationMain";
import Paragraph from "~/components/index/Paragraph";
import RoomsPreview from "~/components/index/Rooms";
import NavContextProvider from "~/components/nav/NavContextProvider";
import Places from "~/components/index/Places";
import Footer from "~/components/Footer";
import CarouselWide from "~/components/index/CarouselWide";

export default function Index() {
  const { t } = useTranslation();
  return (
    <div className="flex grow flex-col items-stretch text-text-main bg-bg gap-8 min-h-screen">
      <div className="flex flex-col items-center">
        <h1 className="mt-[42px] mb-3">{t("index-title")}</h1>
        <div className="flex flex-col gap-6 mt-10">
          <Line></Line>
          <NavContextProvider>
            <CarouselWide></CarouselWide>
          </NavContextProvider>

          <Line></Line>
        </div>

        <div className="index-container-1 flex flex-col gap-9 mt-10">
          <Paragraph content="about" titleSize="h3" centered={false} />

          <Paragraph content="rooms-preview" titleSize="h4" />
          <NavContextProvider>
            <RoomsPreview></RoomsPreview>
          </NavContextProvider>
          <Paragraph content="location" titleSize="h4" />
          <LocationMain></LocationMain>
        </div>
      </div>

      {/* <CarouselPanorama></CarouselPanorama> */}
      <div className="flex flex-col gap-6 mt-10">
        <Line></Line>
        <NavContextProvider>
          <CarouselWide></CarouselWide>
        </NavContextProvider>
        {/* <div className="flex justify-center"> */}
        {/*   <img */}
        {/*     src="src/assets/mountains_full_width.png" */}
        {/*     className="2xl:w-[1282px]" */}
        {/*   /> */}
        {/* </div> */}
        <Line></Line>
      </div>
      <div className="flex flex-col items-center">
        <div className="flex flex-col grow gap-9 2xl:w-[1000px] mt-2">
          <h2 className="text-center">{t("Vayots Dzor")}</h2>
          <Paragraph
            content="places"
            titleSize="h4"
            centered={true}
          ></Paragraph>
          <NavContextProvider>
            <Places></Places>
          </NavContextProvider>
        </div>
      </div>
      <Footer></Footer>
    </div>
  );
}
