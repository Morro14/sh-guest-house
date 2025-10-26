import { useTranslation } from "react-i18next";
import { CarouselMain } from "~/components/index/Carousel";
import Line from "~/components/index/Line";
import Paragraph from "~/components/index/Paragraph";
import RoomsPreview from "~/components/index/Rooms";

export default function Index() {
	const { t, i18n } = useTranslation();
	return (
		<div className="flex grow flex-col items-center text-text-main bg-bg gap-8 min-h-screen">
			<h1 className="mt-[42px] mb-3">Shushan guest house</h1>

			<div className="flex flex-col gap-6 mb-2">
				<Line></Line>
				<CarouselMain></CarouselMain>
				<Line></Line>
			</div>

			<div className="index-container-1 flex flex-col gap-9 2xl:w-[1000px] ">
				<Paragraph
					content="about"
					titleSize="h2"
				/>

				<Paragraph
					content="rooms-preview"
					titleSize="h3"
				/>

				<RoomsPreview></RoomsPreview>
			</div>
		</div>
	);
}
