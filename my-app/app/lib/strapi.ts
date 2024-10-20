export interface NoteItem { title: string, content: string, updateTime: string }

export async function getAllNotes() {
  try {
    const response = await fetch(`http://127.0.0.1:1337/api/notes`)
    const data = await response.json();

    const res = {};
  
    data.data.forEach(({id, title, content, slug, updatedAt}) => {
      // console.log(title, content, slug, updatedAt, 'title, content, slug, updatedAt')
      res[slug] = JSON.stringify({
        title,
        content,
        updateTime: updatedAt
      })
    })
    return res
  } catch (error) {
    console.log(error, 'error')
  }
}

export async function addNote(data) {
  const response = await fetch(`http://127.0.0.1:1337/api/notes`, {
    method: 'POST',
    headers: {
      Authorization: 'bearer 500a3a7f7b3843bc42c5bc22b166881228af9e274a5adaa7a7b8c0c7f9be84d52538af58abd937f4546bc2cf1806b2f5e5272b4587ae47d334ac4f2de18cfb2cf85627299a3179fbfd4d5b32cd2e28f01f5af25e859b1652b8642e8816becfec939271eeb966de46b5a1b2f40622532ef1c422beba66d28321c7f42ac7eec027',
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      data: JSON.parse(data)
    })
  })
  const res = await response.json();
  return res.data.slug
}

export async function updateNote(uuid, data) {
  const {id} = await getNote(uuid);
  const response = await fetch(`http://127.0.0.1:1337/api/notes/${id}`, {
    method: 'PUT',
    headers: {
      Authorization: 'bearer 500a3a7f7b3843bc42c5bc22b166881228af9e274a5adaa7a7b8c0c7f9be84d52538af58abd937f4546bc2cf1806b2f5e5272b4587ae47d334ac4f2de18cfb2cf85627299a3179fbfd4d5b32cd2e28f01f5af25e859b1652b8642e8816becfec939271eeb966de46b5a1b2f40622532ef1c422beba66d28321c7f42ac7eec027',
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      data: JSON.parse(data)
    })
  })
  const res = await response.json()
}

export async function getNote(uuid) {
  const response = await fetch(`http://127.0.0.1:1337/api/notes?filters[slug][$eq]=${uuid}`)
  const data = await response.json();
  return {
    title: data.data[0].title,
    content: data.data[0].content,
    updateTime: data.data[0].updatedAt,
    id: data.data[0].id
  }
}

export async function delNote(uuid) {
  const {id} = await getNote(uuid);
  const response = await fetch(`http://127.0.0.1:1337/api/notes/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: 'bearer 500a3a7f7b3843bc42c5bc22b166881228af9e274a5adaa7a7b8c0c7f9be84d52538af58abd937f4546bc2cf1806b2f5e5272b4587ae47d334ac4f2de18cfb2cf85627299a3179fbfd4d5b32cd2e28f01f5af25e859b1652b8642e8816becfec939271eeb966de46b5a1b2f40622532ef1c422beba66d28321c7f42ac7eec027',
      "Content-Type": "application/json"
    }
  })
  const res = await response.json()
}
