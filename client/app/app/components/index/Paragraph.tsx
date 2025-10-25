import { useTranslation } from "react-i18next";

export default function Paragraph(params: {
	content: string;
	titleSize: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
}) {
	const { t } = useTranslation();
	const slug = t(params.content + ".slug");
	const title = t(params.content + ".title");
	const body = t(params.content + ".body");
	const TitleTag = params.titleSize;

	return (
		<div className="">
			<TitleTag>{title}</TitleTag>
			<p className="font-sans 2xl:text-lg">{body}</p>
		</div>
	);
}
