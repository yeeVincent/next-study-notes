import React, { Suspense } from 'react'
import Link from 'next/link'

import SidebarSearchField from '@/components/SidebarSearchField';
import SidebarNoteList from '@/components/SidebarNoteList';
import EditButton from './EditButton';
import NoteListSkeleton from './NoteListSkeleton';
import SidebarImport from './SidebarImport';
// import { useTranslation } from '@/i18n';
export default async function Sidebar({ lng }: { lng : string }) {
  // const notes = await getAllNotes()
  // console.log(notes,'notes')
  // const { t } = await useTranslation(lng)
  console.log(lng,'lng')
  return (
    <>
      <section className="col sidebar">
        <Link href={'/'} className="link--unstyled">
          <section className="sidebar-header">
            <img
              className="logo"
              src="/logo.svg"
              width="22px"
              height="20px"
              alt=""
              role="presentation"
            />
            <strong>React Notes</strong>
          </section>
        </Link>
        <section className="sidebar-menu" role="menubar">
            <SidebarSearchField lng={lng}/>
            <EditButton noteId={null}>+</EditButton>
        </section>
        <nav>
        <Suspense fallback={<NoteListSkeleton />}>
          <SidebarNoteList></SidebarNoteList>
          </Suspense>
        </nav>
        <SidebarImport />
      </section>
    </>
  )
}
