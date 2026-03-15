import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react'
import { loadSot } from './loadSot'
import { defaultSot } from './defaultSot'
import { getInitialLocale, persistLocale } from './localeUtils'
import type { Sot, Locale } from './types'

interface SotContextValue {
  sot: Sot | null
  loading: boolean
  error: string | null
  retryLoad: () => Promise<void>
  locale: Locale
  setLocale: (locale: Locale) => void
}

const SotContext = createContext<SotContextValue | null>(null)

export function SotProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(getInitialLocale)
  const [sot, setSot] = useState<Sot | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback((l: Locale) => {
    setLoading(true)
    setError(null)
    return loadSot(l)
      .then((data) => {
        setSot(data)
        setError(null)
      })
      .catch((e) => {
        setError(e instanceof Error ? e.message : (defaultSot.copy?.loadErrorGeneric ?? 'Nepavyko užkrauti konfigūracijos.'))
        setSot(defaultSot)
      })
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    load(locale)
  }, [locale, load])

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale)
    persistLocale(newLocale)
  }, [])

  const retryLoad = useCallback(async () => {
    await load(locale)
  }, [load, locale])

  return (
    <SotContext.Provider value={{ sot, loading, error, retryLoad, locale, setLocale }}>
      {children}
    </SotContext.Provider>
  )
}

export function useSot(): SotContextValue {
  const ctx = useContext(SotContext)
  if (!ctx) throw new Error('useSot must be used within SotProvider')
  return ctx
}
