import { useTranslation } from "react-i18next";

export default function Paragraph(params: {
  content: string;
  titleSize: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  centered?: boolean;
  subtitle?: string;
}) {
  const { t } = useTranslation();
  const title = t(params.content + ".title");
  const body = t(params.content + ".body");
  const TitleTag = params.titleSize;

  return (
    <div className={`${params.centered ? "flex flex-col items-center text-center" : ""}`}>
      <TitleTag>{title}</TitleTag>
      {params.subtitle ? <h3>{params.subtitle}</h3> : ""}
      <p className="font-sans 2xl:text-lg">{body}</p>
    </div>
  );
}
