// app/page.js
export default async function Page({ params: { lng } }: { params: { lng: string } }) {
  return (
    <div className="note--empty-state">
      <span className="note-text--empty-state">
        Click a {lng} note on the left to view something! 🥺
      </span>
    </div>
  )
}
