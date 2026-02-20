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

  return !content ? (
    <div className="w-full h-10 bg-gray-warm-light"></div>
  ) : (
    <div
      className={`${centered ? "flex flex-col items-center text-center" : ""}`}
    >
      {content.title.length > 0 ? <TitleTag>{content.title}</TitleTag> : ""}
      {subtitle ? <h3>{subtitle}</h3> : ""}
      <p className="font-sans text-lg">{content.body}</p>
    </div>
  );
}
