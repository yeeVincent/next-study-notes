'use client'
import { useSearchParams } from 'next/navigation';

export default function SidebarNoteListFilter({noteData, noteItem}: {noteData: {title: string}, noteItem: JSX.Element}) {

  const searchParams = useSearchParams()
  const searchText = searchParams.get('q')
  const searchIsTrue = (!searchText || (searchText && noteData.title.toLowerCase().includes(searchText.toLowerCase())))

  return <>
   {searchIsTrue ? noteItem : <></>}
  </>
}
