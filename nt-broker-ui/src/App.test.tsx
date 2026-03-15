import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import App from './App'

const mockSot = {
  brand: { productName: 'DI Operacinė Sistema NT Brokeriui', edition: 'Spin-off Nr. 7', positioning: '' },
  copy: {
    heroTitle: 'DI Operacinė Sistema NT Brokeriui',
    heroSubtitle: 'Generuok profesionalius NT promptus, skelbimus ir klientų komunikaciją per 30–60 sek.',
    heroCtaPrimary: 'Generuoti promptą',
    heroCtaSecondary: 'Peržiūrėti šablonus',
    heroCtaMeta: 'Sutaupyk iki 5 val. per savaitę.',
    badge: 'DI Operacinė Sistema',
  },
  modes: {
    OBJEKTAS: { id: 'objektas', label: 'Objektas', desc: 'Objekto analizė', formId: 'form-objektas', icon: 'building-2', fields: [] },
    SKELBIMAS: { id: 'skelbimas', label: 'Skelbimas', desc: 'NT skelbimas', formId: 'form-skelbimas', icon: 'sparkles', fields: [] },
  },
  theme: { light: { '--primary': '#0F3D91', '--text': '#1B1F24', '--surface-0': '#F5F7FA', '--surface-1': '#FFF', '--text-light': '#6B7280', '--border': '#E5E7EB' }, dark: {} },
  libraryPrompts: [],
  rules: [],
}

describe('App', () => {
  const originalFetch = globalThis.fetch

  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: () => Promise.resolve(mockSot) }))
  })

  afterEach(() => {
    vi.stubGlobal('fetch', originalFetch)
    vi.restoreAllMocks()
  })

  it('renders SOT copy and mode tabs when config is loaded', async () => {
    render(<App />)
    await screen.findByText(/DI Operacinė Sistema NT Brokeriui/i, {}, { timeout: 3000 })
    expect(screen.getByText(/Generuok profesionalius NT promptus/i)).toBeTruthy()
    expect(screen.getByRole('button', { name: /Objektas/i })).toBeTruthy()
    expect(screen.getByRole('button', { name: /Skelbimas/i })).toBeTruthy()
    expect(screen.getByRole('button', { name: /Generuoti promptą/i })).toBeTruthy()
  })
})
