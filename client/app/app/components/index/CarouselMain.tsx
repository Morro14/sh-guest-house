import useEmblaCarousel from "embla-carousel-react";
import { useEffect } from "react";

export function CarouselMain() {
	const [emblaRef, emblaApi] = useEmblaCarousel({
		startIndex: 1,

		align: "center",
		loop: true,
	});
	const images = [
		"/public/img/landscape-1.png",
		"/public/img/landscape-2.png",
		"/public/img/landscape-3.png",
		"/public/img/landscape-1.png",
		"/public/img/landscape-2.png",
		"/public/img/landscape-3.png",
	];
	return (
		<div
			className="embla"
			ref={emblaRef}
		>
			<div className="embla__container">
				{images.map((img, i) => (
					<div
						key={`img-frame-1i${i}`}
						className="embla__slide mr-2 shrink-0"
					>
						<img
							className="w-auto h-full object-cover "
							// className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
							src={img}
							alt={"landscape-1" + "-" + i}
							key={"landscape-1" + "-" + i}
						/>
					</div>
				))}
			</div>
		</div>
	);
}
