
import { match } from '@formatjs/intl-localematcher'
import Negotiator from 'negotiator'
import { locales, defaultLocale } from './app/config'
import { NextResponse } from 'next/server';

function getLocale(request: { headers: { get: (arg0: string) => unknown; }; }) { 
  const headers = { 'accept-language': request.headers.get('accept-language') as string || '' };
  // 这里不能直接传入 request，有更简单的写法欢迎评论留言
  const languages = new Negotiator({ headers }).languages();

  return match(languages, locales, defaultLocale)
 }

 const publicFile = /\.(.*)$/
 const excludeFile = ['logo.svg']
 
export function middleware(request: { nextUrl: any; headers: { get: (arg0: string) => unknown; }; } ) {
console.log(`output->进入了middleware`)

  if(!request)return
  const { pathname } = request.nextUrl
  // 判断请求路径中是否已存在语言，已存在语言则跳过
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )
 
  if (pathnameHasLocale) return

    // 如果是 public 文件，不重定向
    if (publicFile.test(pathname) && excludeFile.indexOf(pathname.substr(1)) == -1) return
 
  // 获取匹配的 locale
  const locale = getLocale(request)
  console.log("🚀 ~ middleware ~ locale:", locale)
  
  request.nextUrl.pathname = `/${locale}${pathname}`

   // 默认语言不重定向
   if (locale == defaultLocale) {
    return NextResponse.rewrite(request.nextUrl)
  }
  // 重定向，如 /products 重定向到 /en-US/products
  return Response.redirect(request.nextUrl)
}
 
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}

// export { auth as middleware } from "auth"
