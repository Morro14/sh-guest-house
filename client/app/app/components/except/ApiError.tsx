import { useTranslation } from "react-i18next"

export default function ApiError() {
  const { t } = useTranslation()
  return <p>{t("api-error-message")}</p>
}
