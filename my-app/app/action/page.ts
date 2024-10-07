'use server'

import { redirect } from 'next/navigation'
import { addNote, updateNote, delNote } from '@/lib/redis';
import { revalidatePath } from 'next/cache';
import { z } from "zod";

const schema = z.object({
  title: z.string(),
  content: z.string().min(1, '请填写内容').max(100, '字数最多 100')
});

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

export async function saveNote(prevState: any, formData: { get: (arg0: string) => any; }) {
  const noteId = formData.get('noteId');

  const data = {
    title: formData.get('title'),
    content: formData.get('body'),
    updateTime: new Date()
  };

  console.log(data, 'data');

  // 校验数据
  const validated = schema.safeParse(data);
  if (!validated.success) {
    return {
      errors: validated.error.issues,
    };
  }

  // 为了让效果更明显
  await sleep(2000);

  const serializedData = JSON.stringify(data);

  if (noteId) {
    await updateNote(noteId, serializedData);
    revalidatePath('/', 'layout');
  } else {
    await addNote(serializedData);
    revalidatePath('/', 'layout');
  }

  return { message: `Add Success!` };
}

export async function deleteNote(prevState, formData) {
  const noteId = formData.get('noteId');
  await delNote(noteId);
  revalidatePath('/', 'layout');
  redirect('/');
}
