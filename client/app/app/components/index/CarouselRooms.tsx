import useEmblaCarousel from "embla-carousel-react";
import { useEffect } from "react";

const BASE_URL = import.meta.env.VITE_SERVER_URL;
export function CarouselMain() {
	const [emblaRef, emblaApi] = useEmblaCarousel({
		startIndex: 1,

		align: "center",
		loop: true,
	});
	const images = [
		BASE_URL + "/static/img/20250930_160958_C2CHhI8.jpg",
		BASE_URL + "/static/img/755336123.jpg",
	];
	return (
		<div
			className="embla"
			ref={emblaRef}
		>
			<div className="embla__container">
				{images.map((img, i) => (
					<div
						key={`img-frame-2-${i}`}
						className="embla__slide shrink-0"
					>
						<img
							className="w-auto h-full object-cover "
							// className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
							src={img}
							alt={"room-" + img}
							key={"room" + img}
						/>
					</div>
				))}
			</div>
		</div>
	);
}
