import { useTranslation } from "react-i18next";

export default function Placeholder({ text }: { text?: string }) {
  const { t } = useTranslation();
  const DEFAULT_TEXT = t("No data");
  return (
    <div
      className="size-full bg-gray-warm-light flex justify-center items-center text-gray-warm-inactive text-sm font-sans"
      aria-disabled
    >
      {text || DEFAULT_TEXT}
    </div>
  );
}
