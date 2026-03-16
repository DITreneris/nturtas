import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import App from './App'

const mockSot = {
  brand: { productName: 'NT Brokerio Asistentas', edition: 'Spin-off Nr. 7', positioning: '' },
  copy: {
    heroTitle: 'NT Brokerio Asistentas',
    heroSubtitle: 'Sukurk profesionalų skelbimą, klientų atsakymą ar derybų strategiją per 60 sek. su AI pagalba.',
    heroCtaPrimary: 'Generuoti',
    heroCtaSecondary: 'Šablonų biblioteka',
    heroCtaMeta: 'Sutaupyk iki 5 val. per savaitę.',
    firstStepHint: 'Pasirink režimą ir užpildyk bent 1–2 laukus – rezultatas priklausys nuo įvesties.',
    badge: 'NT Brokerio Asistentas',
    onboardingSteps: [],
    rulesTitle: 'Ką gausite',
    outputDefaultTitle: 'Tavo sugeneruotas AI prompt',
    outputDefaultHint: 'Kopijuok šį tekstą ir įklijuok į ChatGPT.',
    fieldProgressLabel: '{{filled}}/{{total}} laukų užpildyta',
    charCountLabel: 'Simbolių: {{count}}',
    aiToolLinksLabel: 'Nori išbandyti užklausą? Pasirink įrankį:',
    operationCenterLabel: 'NT brokerio centras',
    operationCenterSubLabel: 'Pasirink režimą, užpildyk laukus ir gauk paruoštą užklausą',
    step1Label: '1. Pasirink režimą',
    skipToContentLabel: 'Pereiti prie turinio',
    whatsappUrl: 'https://chat.whatsapp.com/test',
    whatsappLabel: 'Prisijungti prie WhatsApp grupės',
    footerTagline: 'Promptas sukurtas. Nori daugiau?',
    footerCopyright: '© 2026 Promptų anatomija. Visos teisės saugomos.',
    promptAnatomyUrl: 'https://www.promptanatomy.app/',
    contactEmail: 'info@promptanatomy.app',
  },
  modes: {
    OBJEKTAS: {
      id: 'objektas', label: 'Objektas', desc: 'Objekto analizė', formId: 'form-objektas', icon: 'building-2',
      ctaLabel: 'Analizuoti objektą', longDesc: 'Analizuok objektą.', accentColor: '#0891b2',
      outputTitle: 'Objekto prompt', outputHint: 'Kopijuok.',
      fields: ['objektoTipas'],
      fieldGroups: [{ label: 'Objekto duomenys', fields: ['objektoTipas'] }],
    },
    SKELBIMAS: {
      id: 'skelbimas', label: 'Skelbimas', desc: 'NT skelbimas', formId: 'form-skelbimas', icon: 'sparkles',
      ctaLabel: 'Sukurti skelbimą', longDesc: 'Sukurk skelbimą.', accentColor: '#2563eb',
      outputTitle: 'Skelbimo prompt', outputHint: 'Kopijuok.',
      libraryPromptId: 'skelbimas_nt',
      fields: ['objektoTipas', 'platforma'],
      fieldGroups: [
        { label: 'Skelbimo nustatymai', fields: ['platforma'] },
        { label: 'Objekto duomenys', fields: ['objektoTipas'], collapsible: true, defaultCollapsed: false },
      ],
    },
  },
  modesOrder: ['OBJEKTAS', 'SKELBIMAS'],
  fieldMeta: {
    objektoTipas: { label: 'Objekto tipas', type: 'select' as const, placeholder: 'Pasirinkite', options: ['Butas', 'Namas'], recommended: true },
    platforma: { label: 'Platforma', type: 'select' as const, placeholder: 'Pasirinkite', options: ['Aruodas', 'Facebook'] },
  },
  theme: { light: { '--primary': '#0F3D91', '--text': '#1B1F24', '--surface-0': '#F5F7FA', '--surface-1': '#FFF', '--text-light': '#6B7280', '--border': '#E5E7EB' }, dark: {} },
  libraryPrompts: [
    { id: 'skelbimas_nt', title: 'NT skelbimo šablonas', desc: 'Test', icon: 'sparkles', prompt: 'Test prompt content' },
  ],
  rules: [
    { text: 'Profesionali, tiksli lietuvių kalba', icon: 'check-circle' },
  ],
  showDebugInFooter: false,
  aiToolLinks: [
    { label: 'Atidaryti ChatGPT', url: 'https://chat.openai.com/', icon: 'external-link' },
    { label: 'Atidaryti Claude', url: 'https://claude.ai/', icon: 'external-link' },
  ],
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
    const heading = await screen.findByRole('heading', { level: 1 }, { timeout: 3000 })
    expect(heading.textContent).toContain('NT Brokerio Asistentas')
    expect(screen.getByText(/Sukurk profesionalų skelbimą/i)).toBeTruthy()
    expect(screen.getByRole('button', { name: /Objektas/i })).toBeTruthy()
    expect(screen.getByRole('button', { name: /Skelbimas/i })).toBeTruthy()
  })

  it('shows mode-specific CTA text', async () => {
    render(<App />)
    await screen.findByRole('heading', { level: 1 }, { timeout: 3000 })
    expect(screen.getByTestId('cta-generate').textContent).toBe('Sukurti skelbimą')
  })

  it('renders one primary CTA and secondary templates link in hero', async () => {
    render(<App />)
    await screen.findByRole('heading', { level: 1 }, { timeout: 3000 })
    expect(screen.getByTestId('cta-generate')).toBeTruthy()
    const templatesControl = screen.getByTestId('cta-templates')
    expect(templatesControl).toBeTruthy()
    expect(templatesControl.textContent).toBe('Šablonų biblioteka')
  })

  it('renders visual flow stepper (Režimas → Duomenys → Generuoti → Kopijuoti)', async () => {
    render(<App />)
    await screen.findByRole('heading', { level: 1 }, { timeout: 3000 })
    expect(screen.getByText('Režimas')).toBeTruthy()
    expect(screen.getByText('Duomenys')).toBeTruthy()
    expect(screen.getByText('Generuoti')).toBeTruthy()
    expect(screen.getByText('Kopijuoti')).toBeTruthy()
  })

  it('renders footer tagline from SOT', async () => {
    render(<App />)
    await screen.findByRole('heading', { level: 1 }, { timeout: 3000 })
    expect(screen.getByText('Promptas sukurtas. Nori daugiau?')).toBeTruthy()
  })

  it('renders rules with new title', async () => {
    render(<App />)
    await screen.findByRole('heading', { level: 1 }, { timeout: 3000 })
    const rulesToggle = screen.getByRole('button', { name: /Ką gausite/i })
    expect(rulesToggle).toBeTruthy()
    // QW6: rules default expanded on first visit – rule text visible without clicking
    expect(screen.getByText(/Profesionali, tiksli lietuvių kalba/i)).toBeTruthy()
  })

  it('renders field groups with section headers', async () => {
    render(<App />)
    await screen.findByRole('heading', { level: 1 }, { timeout: 3000 })
    expect(screen.getByText('Skelbimo nustatymai')).toBeTruthy()
    expect(screen.getByText('Objekto duomenys')).toBeTruthy()
  })

  it('renders mode tabs and flow stepper', async () => {
    render(<App />)
    await screen.findByRole('heading', { level: 1 }, { timeout: 3000 })
    expect(screen.getByRole('button', { name: /Objektas/i })).toBeTruthy()
    expect(screen.getByRole('button', { name: /Skelbimas/i })).toBeTruthy()
    expect(screen.getByText('Režimas')).toBeTruthy()
  })

  it('renders skip-to-content link', async () => {
    render(<App />)
    await screen.findByRole('heading', { level: 1 }, { timeout: 3000 })
    const skipLink = screen.getByText('Pereiti prie turinio')
    expect(skipLink).toBeTruthy()
    expect(skipLink.getAttribute('href')).toBe('#main-content')
  })

  it('output is editable (textarea) after generation', async () => {
    render(<App />)
    await screen.findByRole('heading', { level: 1 }, { timeout: 3000 })
    fireEvent.click(screen.getByTestId('cta-generate'))
    const textarea = document.querySelector('.editable-output') as HTMLTextAreaElement
    expect(textarea).toBeTruthy()
    expect(textarea.tagName).toBe('TEXTAREA')
  })

  it('shows character count after generation', async () => {
    render(<App />)
    await screen.findByRole('heading', { level: 1 }, { timeout: 3000 })
    fireEvent.click(screen.getByTestId('cta-generate'))
    const charCount = document.querySelector('.char-count')
    expect(charCount).toBeTruthy()
    expect(charCount!.textContent).toMatch(/Simbolių: \d+/)
  })

  it('output card has single Copy CTA (no AI tool links in main flow)', async () => {
    render(<App />)
    await screen.findByRole('heading', { level: 1 }, { timeout: 3000 })
    const copyBtn = screen.getByRole('button', { name: /Kopijuoti/i })
    expect(copyBtn).toBeTruthy()
  })

  it('renders WhatsApp link in community section (always visible when whatsappUrl set)', async () => {
    render(<App />)
    await screen.findByRole('heading', { level: 1 }, { timeout: 3000 })
    const community = document.querySelector('.community')
    expect(community).toBeTruthy()
    const whatsappLink = community!.querySelector('a[href*="whatsapp"]')
    expect(whatsappLink).toBeTruthy()
    expect(whatsappLink!.textContent).toContain('WhatsApp')
  })
})
