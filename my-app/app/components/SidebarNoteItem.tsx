
import SidebarNoteItemContent from 'components/SidebarNoteItemContent';
import SidebarNoteHeader from './SidebarNoteHeader';
import { NoteItem } from '@/lib/redis';

export default function SidebarNoteItem({ noteId, note}: { noteId: string, note: NoteItem }) {

  const { title, content = '', updateTime } = note;
  return (
    <SidebarNoteItemContent
      id={noteId}
      title={note.title}
      expandedChildren={
        <p className="sidebar-note-excerpt">
          {content.substring(0, 20) || <i>(No content)</i>}
        </p>
      }>
     <SidebarNoteHeader updateTime={updateTime} title={title}></SidebarNoteHeader>
    </SidebarNoteItemContent>
  );
}
