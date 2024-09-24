
# next学习日记-day1

# next路由和文件系统
hello大家好，我是萝卜。之前一直想在公司项目里用next，但几乎没用过next， 而且工期又紧张，想着不保险几次都放弃了，着实可惜， 所以这次我打算认真系统的学习一下next，并且将我学习next的笔记记录输出出来，这样即提升了我的理解，也能给大家分享一些宝贵的学习经验，也欢迎大家在学习过程中，边学边输出，写自己的文章博客， 或者到评论留言。

## 课程资源
我比较喜欢看文档类的课程，因为相比于视频课程，节奏我可以更好的把控，另外我觉得看文字比听老师说效率高很多， 但光看官方文档我又觉得枯燥，而且不知从何下手，所以我找到了yayu的掘金小册，讲的比较细致的，例子也还算简单好上手

## 学习方法
yayu的小册内容总共80多节，我计划是每天看几节（根据内容多少），具体学习方法是先把整节快速过一遍看完，然后把重要的内容跟着敲一边，继续看下一节，最后把学习的内容总结成笔记，在写笔记的时候看一下内容大纲，并自己回忆思考，还可以添加一些自己思考。

## 今日笔记
话不多说，来写一份day1的笔记吧

### 快速启动next项目
使用next.js的cli的创建命令， 快速启动next项目，可以根据脚手架的提示自由选择项目配置， 这里yayu为了简单选的是js，而我选的ts，所以后面我会自己去加一些多ts的配置和代码，另外npm装包比较慢，我比较喜欢用pnpm， 所以包管理工具我是用pnpm，当然yarn和bun也很不错，看个人喜欢
```bash
  npx create-next-app@latest
  yarn create next-app
  pnpm create next-app
  bunx create-next-app
```

### next项目目录结构
next从v13.4之后模板就是默认app目录了，因为app目录的功能性相比page目录更加强大。这是下载下来的项目目录结构：
```js
project/
└── app
    ├── layout.js
    ├── ...
    └── page.js 

```

#### 路由系统
next的app目录下的文件夹结构直接决定路由结构，比如有个文件夹结构是app/article/page.js，那么访问article页面就是url后面加/article， page就是react中的index，只是next换了个约定名称。


#### 文件系统
next中每个app下的路由文件夹下有如下若干文件，名称都是约定好的：
layout： 布局组件
template： 模板组件
error： 错误组件
not found： 404页面
loading： 加载组件
page： 页面功能组件

这些页面都是用来做什么的呢？ 拿刚刚article路由举例，用户访问/article路由，如果路由输错了，那就显示404页面，加载有bug， 失败了就显示错误组件，这两个很好理解，

路由输入没问题，则先加载layout组件，再进入template组件，最后进入page组件，如果page有异步阻塞了，则会替换显示为loading组件，等待加载完成后再显示page。

具体来说，它们功能的区别：
拿一个文章列表页面举例，
layout是公共布局，比如侧边栏，顶部栏，怎么切换子页面都不变的就放到这里面。
template也是布局，比如页面的标题，它的组件样式可以给子组件复用，但子组件的切换了， 它的内容和状态，包括useEffect也是需要重新加载的。
page是存放具体的内容和功能，比如文章详情。

#### error和404细节

##### error
先说一下error，看看文件层级
```tsx
    <Layout>
      <Template>
        <ErrorBoundary fallback={<Error/>}>
          <Suspense>
            <ErrorBoundary fallback={<NotFound/>}>
              <Page />
            </ErrorBoundary> 
          </Suspense>   
        </ErrorBoundary>   
      </Template>   
    </Layout>  
```

Error这个页面是被layout和template包裹的，如果layout和template页面有错误， 就只能被上一层ErrorBoundary捕获了，如果到达顶层，就很尴尬，所以next提供了global-error来捕获全局错误，写到app目录下即可

##### 404
404页面默认在app目录下写一个即可， 如果想在子路由中加入其他自定义的404组件，需要手动调用NotFound， 不调用默认还是会显示app目录下的404页面

```tsx
import { notFound } from 'next/navigation'

export default function Page() {
  notFound()
  return <></>
}
```

### 疑问
为什么getData中不能使用setData更新dom？而是必须return data

```tsx
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

```
