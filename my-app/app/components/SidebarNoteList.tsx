import { getAllNotes } from '@/lib/prisma'
import { sleep } from '@/lib/utils'
import SidebarNoteListFilter from './SidebarNoteListFilter'
import SidebarNoteItem from './SidebarNoteItem'
export default async function NoteList() {
  await sleep(1000)
  const notes = await getAllNotes()
  if(!notes)return
  const arr = Object.entries(notes)
  if (arr.length == 0) {
    return <div className="notes-empty">{'No notes created yet!'}</div>
  }

  return (
    <ul className="notes-list">
      {Object.entries(notes).map(([noteId, note]) => {
        return (
          <li key={noteId}>
            <SidebarNoteListFilter noteData={JSON.parse(note)} noteItem={<SidebarNoteItem noteId={noteId} note={JSON.parse(note)} />}></SidebarNoteListFilter>
          </li>
        )
      })}
    </ul>
  )
}
