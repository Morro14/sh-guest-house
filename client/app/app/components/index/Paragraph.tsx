import { useOnInView, useInView } from "react-intersection-observer";
export interface Paragraph {
  slug: string;
  title: string;
  body: string;
}

export default function Paragraph({
  content,
  titleSize,
  centered,
  subtitle,
}: {
  content: Paragraph | null;
  titleSize: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  centered?: boolean;
  subtitle?: string;
}) {
  const TitleTag = titleSize;
  const { ref, inView, entry } = useInView({
    threshold: 0.1,
    // triggerOnce: true,
  });

  return !content ? (
    <div className="w-full  h-10 bg-gray-warm-light"></div>
  ) : (
    <div
      className={`${centered ? "relative flex flex-col items-center text-center " : ""}`}
    >
      <div
        ref={ref}
        className={`md:w-[780px] relative transition-all duration-800 ease-out ${inView ? "opacity-100" : "opacity-0"}`}
      >
        {content.title.length > 0 ? <TitleTag>{content.title}</TitleTag> : ""}
        {subtitle ? <h3>{subtitle}</h3> : ""}
        <p className="font-sans font-[350] md:text-lg text-pretty">
          {content.body}
        </p>
      </div>
    </div>
  );
}
