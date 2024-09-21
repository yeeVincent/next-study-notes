"use client"

import { use } from "react"

export default  function Home() {
// const [data, setData] = useState<string>('');

const getData  = async () => {
  await new Promise<void>((resolve) => setTimeout(resolve, 1000))
  // 为什么getData中不能使用setData更新dom？而是必须return data
  return {
    data: '这是第一层pages'
  }
}

  // const {data} = await getData()
  const {data} = use(getData()) 
  return (
    <div>hello, {data}</div>
  );
}
