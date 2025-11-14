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
  return (
    <div className="flex grow flex-col items-stretch text-text-main bg-bg gap-8 min-h-screen">

      <div className="flex flex-col items-center">
        <h1 className="mt-[42px] mb-3">Shushan guest house</h1>
        <div className="flex flex-col gap-6 mt-10">
          <Line></Line>
          <NavContextProvider>
            <CarouselWide></CarouselWide>
          </NavContextProvider>

          <Line></Line>
        </div>

        <div className="index-container-1 flex flex-col gap-9 2xl:w-[1000px] mt-10">
          <Paragraph
            content="about"
            titleSize="h2"
          />

          <Paragraph
            content="rooms-preview"
            titleSize="h3"
          />
          <NavContextProvider>
            <RoomsPreview></RoomsPreview>
          </NavContextProvider>
          <Paragraph content="location" titleSize="h3" />
          <LocationMain></LocationMain>

        </div>
      </div>

      {/* <CarouselPanorama></CarouselPanorama> */}
      <div className="flex flex-col gap-6 mt-10">
        <Line></Line>
        <div className="flex justify-center">
          <img src="src/assets/mountains_full_width.png" className="2xl:w-[1282px]" />
        </div>
        <Line></Line>
      </div>
      <div className="flex flex-col items-center">
        <div className="flex flex-col grow gap-9 2xl:w-[1000px] mt-2">
          <Paragraph content="places" titleSize="h2"></Paragraph>
          <NavContextProvider>
            <Places></Places>
          </NavContextProvider>
        </div>

      </div>
      <Footer></Footer>
    </div>
  );
}
