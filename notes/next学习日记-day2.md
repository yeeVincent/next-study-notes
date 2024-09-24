
# next学习日记-day2

# next路由详解
今天和大家来详细分享一下next路由系统，包括动态路由，路由组，平行路由以及拦截路由，我会结合我的理解尽可能简单描述它们的作用。

## 动态路由（Dynamic Routes）
首先我们知道，next路由是根据app下的文件夹路径决定的，比如访问`/article`页面，就是访问`app/article/page.js`这个文件。那如果我们想访问`/article/1`，`/article/2`...`/article`路由后面的id会变化该怎么办呢？

### \[folderName]
next给的解决方案是加一层文件夹，文件夹名称用[]包裹，里给面的名字会作为参数传递page页面， 所以如果我们要添加动态路由， 文件夹路径可以这么写 `app/article/[id]/page.js`，

这是page组件
```tsx
// app/article/[id]/page.js
export default function Page({ params }) {
  return <div>My Article: {params.id}</div>
}
```

当我们访问 `/article/1`，param的值为`{ id: '1' }`
当我们访问 `/article/2`，param的值为`{ id: '2' }`
然后我们拿到不同的id，这样就可以请求不同的数据了。

### \[...folderName]
还可以在文件夹的括号中加省略号，`app/article/[...id]/page.js`, 这样表示会捕获后面所有的路由，例子:
```tsx
// app/shop/[...id]/page.js
export default function Page({ params }) {
  return <div>My Shop: {JSON.stringify(params)}</div>
}
```
输入url：`/article/1`, params 的值为 `{ id: ['1'] }`
输入url：`/article/1/a`, params 的值为 `{ id: ['1','a'] }`
输入url：`/article/1/a/b`, params 的值为 `{ id: ['1','a','b'] }`

### \[\[...folderName]]
这个和[...folderName]那个类似，区别在于，`[[...folderName]]`不带参数的路由也会被匹配， 就比如 /article，后面没有加id，也会被匹配到，
```tsx
// app/shop/[[...id]]/page.js
export default function Page({ params }) {
  return <div>My Shop: {JSON.stringify(params)}</div>
}
```
输入url：`/article`, param的值为`{}`
输入url：`/article/1`, params 的值为 `{ id: ['1'] }`
输入url：`/article/1/a`, params 的值为 `{ id: ['1','a'] }`

## 路由组（Route Groups）
在 app目录下，文件夹名称通常会被映射到 URL 中，但你可以将文件夹标记为路由组，阻止文件夹名称被映射到 URL 中。

### 按逻辑分组
比如我的文件夹是这样的`app/(mobile)/article/page.js`，访问文章时依然是`/article`，mobile文件夹因为被（）包裹会被忽略。

这样的意义在于，例如我还有一个pc端的页面，我可以再创建一个`app/(pc)/article/page.js`，当然实际开发中肯定还要加入区分pc和移动端的代码， 但这样就把pc端和移动端代码区分开了， 更加清晰直观。

### 创建不同的布局
还是拿刚刚移动端的例子，如果我们在`app/(mobile)/article`这一层没有layout， 那么next会向上找到`app/layout.js`使用， 如果`app/(mobile)/article/layout.js`存在，则会被优先使用， 这样就可以复用公共的布局了。

### 创建多个根布局
如果我们在`app/(mobile)`和`app/(pc)`都创建`layout.js`,相当于创建了两个根布局， 因为是根布局， 所以要有<html>和<body>标签， 这样做也可以区分不同的业务组件， 但有几点要注意：
1. 注意不要解析为相同的 URL 路径。举个例子，因为路由组不影响 URL 路径，所以 (mobile)/article/page.js和 (pc)/article/page.js都会解析为 /article，这会导致报错。

2. 跨根布局导航会导致页面完全重新加载，就比如使用 app/(mobile)/layout.js根布局的 /article 跳转到使用 app/(pc)/layout.js根布局的 /blog 会导致页面重新加载（full page load）。
3. 创建多个根布局的时候，因为删除了顶层的 app/layout.js文件，访问 /会报错，所以app/page.js需要定义在其中一个路由组中。

4. 还有多根布局使用 `app/not-found.js`会出现问题,具体参考 yayu的[《Next.js v14 如何为多个根布局自定义不同的 404 页面？竟然还有些麻烦！欢迎探讨》](https://juejin.cn/post/7351321244125265930)

## 平行路由（Parallel Routes）

### 条件渲染
平行路由可以使你在同一个布局中同时或者有条件的渲染一个或者多个页面， 类似于Vue的插槽功能

<img src="https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/23506139d1874086bc21c20fcd1cd644~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1600\&h=952\&s=465044\&e=png\&b=1a1a1a" width="600" height="300"/>

平行路由的使用方式是将文件夹以 @作为开头进行命名，比如在上图中就定义了两个插`@team` 和 `@analytics` 。

插槽会作为props传给共享的父布局，上图中的`@team`和`@analytics`会与父组件的children并行渲染

```tsx
// app/layout.js
export default function Layout({ children, team, analytics }) {
  return (
    <>
      {children}
      {team}
      {analytics}
    </>
  )
}
```

可以看出来， children其实也是一个隐式的插槽， `/app/page.js`相当于 `app/@children/page.js`。

看到这越来越觉得next路由文件的约定很有vue的内味了~只是它把模板从代码中抽出来，做到了文件夹的层面，简洁直观提高了阅读性， 而这些约定也会导致有更高的上手成本。

这里yayu还有一个独立路由处理的概念，也就是`@team`和`@analytics`有自己的`loading.js`和`error.js`，我觉得你把它当作一个正常的“页面”来看就好了, 不用记得太复杂

### 子导航 
`@team`和`@analytics`下面也可以添加子页面，平行路由跟路由组一样，不会影响 URL，所以 `/@analytics/page-views/page.js `对应的地址是 `/page-views`，`/@analytics/visitors/page.js` 对应的地址是 `/visitors`

那看到这里，有的同学应该会有这些疑问：
Q1: 平行路由和路由组有什么区别呢？
A1: 平行路由相当于是单页面嵌套许多子模块，路由组是多个页面，如果是类似dashboard面板页，有许多子模块展示，选平行路由，如果是pc和移动端，多个页面之间关联较少选路由组。

Q2: 为什么要用平行路由， 我自己拆组件不行吗？
A2: 当然可以，只是next提供了这种约定，在某些情况下可能更加方便

### default.js
使用平行路由会有一个特殊情况要处理，比如文件夹是这样的`app/@analytics/visitors/page.js`,`app/@team/visitors/page.js`，也就是说`@team`和`@analytics`都是一个路由`/visitors`下的子模块，这个时候访问`/visitors`的时候，需要`@analytics`和`@team`下面都有`page.js`文件，否则会404

注意： 如果跳转到`/visitors`，使用的是`next/link`组件，并且是同一父路由下，可能不会报错404，因为URL不匹配，Next.js 会继续保持该插槽之前的状态，而不渲染 404 错误

那为了避免这种意外情况， 如果我们没有在`@team`下写`page.js`，那我们可以添加一个`app/@team/default.js`， 这样可以防止出现404的情况


## 拦截路由（Intercepting Routes）
拦截路由允许你在当前路由拦截其他路由地址并在当前路由中展示内容。

这个功能可能看名字会有些误解，我最先想到的应用场景是用在鉴权，比如在游客的文章列表页面，点击某篇文章，则会跳转到登录页面，但实际上next给出的例子的大概意思是：我浏览文章列表， 点击其中一个文章详情，出来一个详情弹窗，可以预览，这同时会修改url参数，如果用户刷新页面，或者分享给别人打开， 则都进入详情页

### 实现方式
实现拦截路由需要在命名文件夹的时候以 (..) 开头，其中：
* (.) 表示匹配同一层级
* (..) 表示匹配上一层级
* (..)(..) 表示匹配上上层级。
* (...) 表示匹配根目录

注意： 匹配的是路由层级， 而不是文件夹路径层级，比如路由组和平行路由是不会计算层级的， 看下图

<img src="https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/731ab39e379e40ffadd2119cdc843e1d~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1600&h=930&s=465834&e=png&b=161616" width="500" height="300"/>

如果要匹配`/photo路由`， `feed`下应该使用`(..)photo`，因为两者只差了一个层级，所以使用 (..)。
