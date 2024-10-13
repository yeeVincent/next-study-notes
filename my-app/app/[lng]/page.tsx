import { useTranslation } from "@/i18n"

// app/page.js
export default async function Page({ params: { lng } }: { params: { lng: string } }) {
  const { t } = await useTranslation(lng)
  return (
    <div className="note--empty-state">
      <span className="note-text--empty-state">
        {t('initText')}
      </span>
    </div>
  )
}
