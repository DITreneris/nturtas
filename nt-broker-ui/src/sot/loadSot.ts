import type { Sot, Locale } from './types'
import { defaultSot } from './defaultSot'

const BASE_URL = import.meta.env.BASE_URL ?? '/'

const LOAD_ERROR_STRINGS: Record<Locale, { notFound: string; generic: string }> = {
  lt: {
    notFound: defaultSot.copy?.loadError404 ?? 'Config nerastas (404). Naudojamas numatytasis nustatymas.',
    generic: defaultSot.copy?.loadErrorGeneric ?? 'Nepavyko užkrauti konfigūracijos. Naudojamas numatytasis nustatymas.',
  },
  en: {
    notFound: 'Config not found (404). Using default.',
    generic: 'Failed to load configuration. Using default.',
  },
  es: {
    notFound: 'Config no encontrado (404). Se usa el predeterminado.',
    generic: 'Error al cargar la configuración. Se usa el predeterminado.',
  },
}

function getSotUrl(locale: Locale): string {
  return `${BASE_URL}config/sot.${locale}.json`
}

function getLoadErrorMessages(locale: Locale) {
  return LOAD_ERROR_STRINGS[locale] ?? LOAD_ERROR_STRINGS.lt
}

function isValidSot(data: unknown): data is Sot {
  if (!data || typeof data !== 'object') return false
  const d = data as Record<string, unknown>
  if (!d.modes || typeof d.modes !== 'object') return false
  if (!d.theme || typeof d.theme !== 'object') return false
  const theme = d.theme as Record<string, unknown>
  if (!theme.light || typeof theme.light !== 'object') return false
  if (!theme.dark || typeof theme.dark !== 'object') return false
  if (!d.copy || typeof d.copy !== 'object') return false
  return true
}

export async function loadSot(locale: Locale): Promise<Sot> {
  const errors = getLoadErrorMessages(locale)
  const url = getSotUrl(locale)
  try {
    const res = await fetch(url, { cache: 'no-store' })
    if (!res.ok) {
      throw new Error(res.status === 404 ? errors.notFound : `Klaida ${res.status} – naudojamas numatytasis nustatymas.`)
    }
    const data = await res.json()
    if (!isValidSot(data)) {
      if (typeof console !== 'undefined' && console.warn) {
        console.warn('[SOT] Konfigūracijoje trūksta modes, theme arba copy. Naudojamas numatytasis nustatymas.')
      }
      return defaultSot
    }
    return data as Sot
  } catch (e) {
    if (e instanceof Error && (e.message.startsWith('Config nerastas') || e.message.startsWith('Config not found') || e.message.startsWith('Config no encontrado') || e.message.startsWith('Klaida ') || e.message.startsWith('Nepavyko') || e.message.startsWith('Failed to load') || e.message.startsWith('Error al cargar'))) throw e
    throw new Error(errors.generic)
  }
}
