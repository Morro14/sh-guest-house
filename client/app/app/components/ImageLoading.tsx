import { useState } from "react";
import { useTranslation } from "react-i18next";

export function ImageLoading({
  attributes,
}: {
  attributes: React.ComponentProps<"img">;
}) {
  const { t } = useTranslation();
  const [loaded, setLoaded] = useState(false);
  const { className, ...rest } = attributes;
  return (
    <div>
      <span className={`text-white font-sans ${loaded ? "hidden" : "block"}`}>
        {t("loading...")}
      </span>
      <img
        {...rest}
        onLoad={() => setLoaded(true)}
        className={`${className} ${loaded ? "block" : "hidden"} ${attributes}`}
      />
    </div>
  );
}
