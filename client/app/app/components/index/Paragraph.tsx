import { useOnInView, useInView } from "react-intersection-observer";
import PlaceholderParagraph from "../placeholders/PlaceholderParagraph";
export interface ParagraphType {
  tag: string;
  title: string;
  body: string;
}

export default function Paragraph({
  content,
  titleSize = "h3",
  centered = true,
  subtitle,
}: {
  content: ParagraphType | null;
  titleSize?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  centered?: boolean;
  subtitle?: string;
}) {
  const TitleTag = titleSize;
  const { ref, inView, entry } = useInView({
    threshold: 0.1,
    // triggerOnce: true,
  });
  return !content ? (
    <PlaceholderParagraph></PlaceholderParagraph>
  ) : (
    <div
      className={`${centered ? "relative flex flex-col items-center text-center " : ""}`}
    >
      <div
        ref={ref}
        className={`max-w-[698px] md:max-w-[880px] relative transition-all duration-800 ease-out ${inView ? "opacity-100" : "opacity-0"}`}
      >
        {content.title.length > 0 ? <TitleTag>{content.title}</TitleTag> : ""}
        {subtitle ? <h3>{subtitle}</h3> : ""}
        <p className="font-sans font-[350] md:text-base text-pretty w-full whitespace-pre-wrap">
          {content.body}
        </p>
      </div>
    </div>
  );
}
