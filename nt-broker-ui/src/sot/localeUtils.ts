import type { Locale } from './types'

export const LOCALE_STORAGE_KEY = 'nt_broker_lang'

function getLocaleFromQuery(): Locale | '' {
  if (typeof window === 'undefined') return ''
  const params = new URLSearchParams(window.location.search)
  const lang = params.get('lang')?.toLowerCase()
  if (lang === 'lt' || lang === 'en' || lang === 'es') return lang
  return ''
}

function getLocaleFromStorage(): Locale | '' {
  if (typeof window === 'undefined') return ''
  try {
    const stored = localStorage.getItem(LOCALE_STORAGE_KEY)?.toLowerCase()
    if (stored === 'lt' || stored === 'en' || stored === 'es') return stored
  } catch {
    // ignore
  }
  return ''
}

function getLocaleFromNavigator(): Locale {
  if (typeof navigator === 'undefined') return 'lt'
  const lang = navigator.language?.toLowerCase() ?? ''
  if (lang.startsWith('lt')) return 'lt'
  if (lang.startsWith('es')) return 'es'
  return 'en'
}

/**
 * Resolve initial locale: query ?lang= → localStorage → navigator.language → fallback 'lt'.
 */
export function getInitialLocale(): Locale {
  const fromQuery = getLocaleFromQuery()
  if (fromQuery) return fromQuery
  const fromStorage = getLocaleFromStorage()
  if (fromStorage) return fromStorage
  return getLocaleFromNavigator()
}

export function persistLocale(locale: Locale): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(LOCALE_STORAGE_KEY, locale)
  } catch {
    // ignore
  }
  const url = new URL(window.location.href)
  url.searchParams.set('lang', locale)
  window.history.replaceState({}, '', url.toString())
}
