'use client'

import { useEffect, useState } from 'react'
import i18next from 'i18next'
import { UseTranslationOptions, initReactI18next, useTranslation as useTranslationOrg } from 'react-i18next'
// @ts-expect-error 第三方包没有类型
import { useCookies } from 'react-cookie'
import resourcesToBackend from 'i18next-resources-to-backend'
import LanguageDetector from 'i18next-browser-languagedetector'
import { locales, defaultLocale } from '@/config'
export const cookieName = 'i18next'

const runsOnServerSide = typeof window === 'undefined'

i18next
  .use(initReactI18next)
  .use(LanguageDetector)
  .use(resourcesToBackend((language: any, namespace: any) => import(`./locales/${language}/${namespace}.json`)))
  .init({
    supportedLngs: locales,
    fallbackLng: defaultLocale,
    lng: defaultLocale,
    fallbackNS: 'basic',
    defaultNS: 'basic',
    ns: 'basic',
    detection: {
      order: ['path', 'htmlTag', 'cookie', 'navigator'],
    },
    preload: runsOnServerSide ? locales : []
  })

export function useTranslation(lng: string, ns?: any, options?: UseTranslationOptions<undefined> | undefined) {
  const [cookies, setCookie] = useCookies([cookieName])
  const ret = useTranslationOrg(ns, options)
  const { i18n } = ret
  // if (runsOnServerSide && lng && i18n.resolvedLanguage !== lng) {
    // i18n.changeLanguage(lng)
  // } else {
    const [activeLng, setActiveLng] = useState(i18n.resolvedLanguage)
    useEffect(() => {
      if (activeLng === i18n.resolvedLanguage) return
      setActiveLng(i18n.resolvedLanguage)
    }, [activeLng, i18n.resolvedLanguage])
    useEffect(() => {
      if (!lng || i18n.resolvedLanguage === lng) return
      i18n.changeLanguage(lng)
    }, [lng, i18n])
    useEffect(() => {
      if (cookies.i18next === lng) return
      setCookie(cookieName, lng, { path: '/' })
    }, [lng, cookies.i18next])
  // }
  return ret
}
