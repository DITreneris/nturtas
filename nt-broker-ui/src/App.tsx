import React, { useState, useEffect, useMemo } from 'react'
import {
  Building2,
  Sparkles,
  MessageSquare,
  Handshake,
  BarChart3,
  Rocket,
  CheckCircle,
  Check,
} from 'lucide-react'
import { SotProvider, useSot } from './sot/SotContext'
import { ModeForm } from './components/ModeForm'
import { LibraryPromptsModal } from './components/LibraryPromptsModal'

type IconComponent = React.ComponentType<{ className?: string; size?: number }>
const ICON_MAP: Record<string, IconComponent> = {
  'building-2': Building2,
  sparkles: Sparkles,
  'message-square': MessageSquare,
  handshake: Handshake,
  'bar-chart-3': BarChart3,
}

const LOCALES: Array<{ code: 'lt' | 'en' | 'es'; label: string }> = [
  { code: 'lt', label: 'LT' },
  { code: 'en', label: 'EN' },
  { code: 'es', label: 'ES' },
]

function AppContent() {
  const { sot, loading, error, retryLoad, locale, setLocale } = useSot()
  const [activeMode, setActiveMode] = useState<string>('skelbimas')
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [formValues, setFormValues] = useState<Record<string, string>>({})
  const [generatedPrompt, setGeneratedPrompt] = useState<string | null>(null)
  const [copyFeedback, setCopyFeedback] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const [libraryModalOpen, setLibraryModalOpen] = useState(false)

  const modesList = useMemo(() => {
    if (!sot?.modes) return []
    const order = sot.modesOrder?.length ? sot.modesOrder : Object.keys(sot.modes)
    return order
      .map((key) => sot.modes![key])
      .filter(Boolean)
      .map((m) => {
        const Icon = ICON_MAP[m.icon] ?? Sparkles
        if (import.meta.env.DEV && !ICON_MAP[m.icon]) {
          console.warn(`[SOT] Nežinoma režimo ikona: "${m.icon}". Naudojama numatytoji.`)
        }
        return { ...m, Icon }
      })
  }, [sot?.modes, sot?.modesOrder])

  const defaultModeId = useMemo(() => {
    const skelbimas = modesList.find((m) => m.id === 'skelbimas')
    return skelbimas?.id ?? modesList[0]?.id ?? 'skelbimas'
  }, [modesList])

  useEffect(() => {
    if (defaultModeId && !modesList.find((m) => m.id === activeMode)) {
      setActiveMode(defaultModeId)
    }
  }, [defaultModeId, modesList, activeMode])

  useEffect(() => {
    if (!sot?.theme) return
    const vars = sot.theme[theme]
    if (!vars) return
    const root = document.documentElement
    Object.entries(vars).forEach(([key, value]) => {
      root.style.setProperty(key, value)
    })
  }, [sot?.theme, theme])

  useEffect(() => {
    document.documentElement.lang = locale
    if (sot?.copy?.heroTitle) {
      document.title = sot.copy.heroTitle
    }
  }, [locale, sot?.copy?.heroTitle])

  if (loading) {
    const loadingLabel = sot?.copy?.loadingLabel ?? 'Kraunama...'
    return (
      <div
        style={{ padding: '2rem', textAlign: 'center' }}
        role="status"
        aria-live="polite"
        aria-label={loadingLabel}
      >
        <div className="spinner" style={{ margin: '0 auto 1rem', width: 32, height: 32 }} aria-hidden />
        <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-light)' }}>{loadingLabel}</p>
      </div>
    )
  }

  const copy = sot?.copy ?? {}
  const currentMode = modesList.find((m) => m.id === activeMode)

  const handleGenerate = () => {
    const prompts = sot?.libraryPrompts ?? []
    const promptId = currentMode?.libraryPromptId
    const template = promptId
      ? prompts.find((p) => p.id === promptId)
      : prompts[0]
    const basePrompt = template?.prompt ?? ''
    if (!basePrompt && prompts.length === 0) {
      setGeneratedPrompt(null)
      setCopyFeedback(null)
      return
    }
    const fields = currentMode?.fields ?? []
    const inputLines = fields
      .map((f) => {
        const v = formValues[f]?.trim()
        return v ? `${f}: ${v}` : null
      })
      .filter(Boolean) as string[]
    const inputBlockLabel = copy.inputBlockLabel ?? 'INPUT (užpildyta)'
    const inputBlock =
      inputLines.length > 0
        ? `\n\n${inputBlockLabel}:\n${inputLines.join('\n')}`
        : ''
    setGeneratedPrompt(basePrompt + inputBlock)
    setCopyFeedback(null)
  }

  const getModeIdForPromptId = (promptId: string) =>
    modesList.find((m) => m.libraryPromptId === promptId)?.id

  const handleCopyOutput = async () => {
    if (!generatedPrompt) return
    try {
      await navigator.clipboard.writeText(generatedPrompt)
      setCopyFeedback({ message: copy.copySuccess ?? 'Nukopijuota', type: 'success' })
      setTimeout(() => setCopyFeedback(null), 2000)
    } catch {
      setCopyFeedback({ message: copy.copyFailed ?? 'Kopijuoti nepavyko', type: 'error' })
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--surface-0)',
        color: 'var(--text)',
        fontFamily: "'Inter', system-ui, sans-serif",
      }}
    >
      {error && (
        <div
          role="alert"
          style={{
            padding: '0.75rem 1rem',
            textAlign: 'center',
            background: 'var(--error-bg, var(--error))',
            color: 'var(--error)',
            border: '1px solid var(--error)',
            fontSize: '0.875rem',
          }}
        >
          {copy.copyErrorLabel ?? 'Klaida:'} {error}
          <button
            type="button"
            className="btn-ghost"
            onClick={() => retryLoad()}
            style={{
              marginLeft: '0.75rem',
              padding: '0.25rem 0.75rem',
              cursor: 'pointer',
              fontWeight: 600,
            }}
          >
            {copy.copyRetryLabel ?? 'Bandyti dar kartą'}
          </button>
        </div>
      )}
      <header
        style={{
          background: 'var(--surface-1)',
          borderBottom: '1px solid var(--border)',
          padding: '1.5rem 1rem',
        }}
      >
        <div style={{ maxWidth: '72rem', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem', alignSelf: 'flex-end' }} role="group" aria-label="Language selection">
            {LOCALES.map(({ code, label }) => (
              <button
                key={code}
                type="button"
                className={locale === code ? 'btn-primary' : 'btn-ghost'}
                onClick={() => setLocale(code)}
                aria-label={code === 'lt' ? 'Lietuvių' : code === 'en' ? 'English' : 'Español'}
                aria-pressed={locale === code}
                style={{
                  padding: '0.25rem 0.5rem',
                  fontSize: '0.75rem',
                  fontWeight: locale === code ? 700 : 500,
                  borderRadius: '0.375rem',
                  cursor: 'pointer',
                }}
              >
                {label}
              </button>
            ))}
          </div>
          <div style={{ textAlign: 'center', width: '100%' }}>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'var(--accent-gold)',
              color: 'var(--text, #1A1E24)',
              padding: '0.25rem 0.75rem',
              borderRadius: '9999px',
              fontSize: '0.75rem',
              fontWeight: 700,
              marginBottom: '1rem',
            }}
          >
            <Rocket size={14} />
            {copy.badge ?? 'DI Operacinė Sistema'}
          </span>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 800, marginBottom: '0.5rem' }}>
            {copy.heroTitle ?? 'DI Operacinė Sistema NT Brokeriui'}
          </h1>
          <p style={{ color: 'var(--text-light)', fontSize: '1.125rem', maxWidth: '42rem', margin: '0 auto' }}>
            {copy.heroSubtitle ?? 'Generuok profesionalius NT promptus, skelbimus ir klientų komunikaciją per 30–60 sek.'}
          </p>
          </div>
        </div>
      </header>

      <nav
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 30,
          background: 'var(--surface-1)',
          boxShadow: 'var(--shadow-sm, 0 1px 3px var(--border))',
          borderBottom: '1px solid var(--border)',
        }}
      >
        <div style={{ maxWidth: '72rem', margin: '0 auto', overflowX: 'auto' }}>
          <div
            style={{
              display: 'flex',
              padding: '0.5rem',
              gap: '0.5rem',
              minWidth: 'max-content',
            }}
          >
            {modesList.map((mode) => {
              const isActive = activeMode === mode.id
              const Icon = mode.Icon
              return (
                <button
                  key={mode.id}
                  type="button"
                  className={isActive ? 'btn-primary' : 'btn-nav'}
                  data-testid={`mode-${mode.id}`}
                  onClick={() => setActiveMode(mode.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '0.75rem',
                    fontWeight: 700,
                    fontSize: '0.875rem',
                    cursor: 'pointer',
                    boxShadow: isActive ? 'var(--shadow-sm, 0 4px 6px -1px rgba(0,0,0,0.1))' : 'none',
                  }}
                >
                  <Icon size={16} />
                  {mode.label}
                </button>
              )
            })}
          </div>
        </div>
      </nav>

      <main style={{ maxWidth: '72rem', margin: '0 auto', padding: '1rem' }}>
        <div style={{ marginTop: '1rem' }}>
          <p style={{ color: 'var(--text-light)', fontSize: '0.875rem' }}>
            {copy.activeModeLabel ?? 'Aktyvus režimas:'} <strong>{currentMode?.label ?? activeMode}</strong>
            {currentMode?.desc ? ` – ${currentMode.desc}` : ''}
          </p>
          <p style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}>
            {copy.heroCtaMeta ?? 'Sutaupyk iki 5 val. per savaitę. Sukurta brokeriams.'}
          </p>
        </div>

        {currentMode && currentMode.fields.length > 0 && (
          <ModeForm
            formId={currentMode.formId}
            fields={currentMode.fields}
            fieldMeta={sot?.fieldMeta}
            values={formValues}
            onChange={(fieldId, value) =>
              setFormValues((prev) => ({ ...prev, [fieldId]: value }))
            }
            selectPlaceholder={copy.selectPlaceholder}
          />
        )}

        {sot?.rules && sot.rules.length > 0 && (
          <ul
            style={{
              marginTop: '1.5rem',
              paddingLeft: '1.25rem',
              color: 'var(--text-light)',
              fontSize: '0.875rem',
              listStyle: 'none',
            }}
            aria-label={copy.rulesAriaLabel ?? 'Taisyklės'}
          >
            {sot.rules.map((rule, i) => (
              <li
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  marginBottom: '0.375rem',
                }}
              >
                <CheckCircle size={16} style={{ flexShrink: 0 }} aria-hidden />
                {rule.text}
              </li>
            ))}
          </ul>
        )}
        <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <button
            type="button"
            className="btn-primary"
            data-testid="cta-generate"
            onClick={handleGenerate}
            style={{
              padding: '0.75rem 1.5rem',
              borderRadius: '0.75rem',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            {copy.heroCtaPrimary ?? 'Generuoti promptą'}
          </button>
          <button
            type="button"
            className="btn-secondary"
            data-testid="cta-templates"
            onClick={() => setLibraryModalOpen(true)}
            style={{
              padding: '0.75rem 1.5rem',
              borderRadius: '0.75rem',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            {copy.heroCtaSecondary ?? 'Peržiūrėti šablonus'}
          </button>
        </div>

        {generatedPrompt !== null && (
          <div
            style={{
              marginTop: '1.5rem',
              padding: '1rem',
              background: 'var(--output-bg, var(--primary))',
              color: '#fff',
              borderRadius: '0.75rem',
              fontSize: '0.875rem',
              boxShadow: 'var(--shadow-md, none)',
            }}
          >
            <pre
              style={{
                margin: 0,
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                maxHeight: '20rem',
                overflowY: 'auto',
              }}
            >
              {generatedPrompt}
            </pre>
            <div style={{ marginTop: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <button
                type="button"
                className="btn-output-copy"
                onClick={handleCopyOutput}
                style={{
                  padding: '0.5rem 1rem',
                  background: 'rgba(255,255,255,0.2)',
                  color: '#fff',
                  border: '1px solid rgba(255,255,255,0.5)',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  fontWeight: 600,
                }}
              >
                {copy.btnCopy ?? 'Kopijuoti'}
              </button>
              {copyFeedback && (
                <span
                  role="status"
                  aria-live="polite"
                  aria-atomic="true"
                  style={{
                    fontSize: '0.8125rem',
                    opacity: 0.95,
                    color: copyFeedback.type === 'success' ? 'var(--success)' : 'var(--error)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                  }}
                >
                  {copyFeedback.type === 'success' && <Check size={14} aria-hidden />}
                  {copyFeedback.message}
                </span>
              )}
            </div>
          </div>
        )}

        <LibraryPromptsModal
          open={libraryModalOpen}
          onClose={() => setLibraryModalOpen(false)}
          items={sot?.libraryPrompts ?? []}
          getModeIdForPromptId={getModeIdForPromptId}
          onSelectMode={(modeId) => {
            setActiveMode(modeId)
            setLibraryModalOpen(false)
          }}
          copy={{
            modalTemplatesTitle: copy.modalTemplatesTitle,
            btnCopy: copy.btnCopy,
            btnUse: copy.btnUse,
            btnClose: copy.btnClose,
            copySuccess: copy.copySuccess,
            copyFailed: copy.copyFailed,
          }}
        />

        <footer
          style={{
            marginTop: '2rem',
            paddingTop: '1.5rem',
            borderTop: '1px solid var(--border)',
            color: 'var(--text-light)',
            fontSize: '0.875rem',
          }}
        >
          {sot?.showDebugInFooter !== false && (
            <p style={{ margin: 0, marginBottom: '0.75rem', fontSize: '0.75rem' }}>
              {(copy.footerDebugLabel ?? 'Tema: {{theme}}. SOT pakrautas – režimai, copy ir spalvos valdomi iš config/sot.json.').replace('{{theme}}', theme)}
            </p>
          )}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem 1.25rem', alignItems: 'center' }}>
            {copy.promptAnatomyUrl && (
              <a
                href={copy.promptAnatomyUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: 'var(--primary)', textDecoration: 'underline' }}
                aria-label={copy.promptAnatomyAriaLabel ?? 'Promptų anatomija – atidaroma naujame lange'}
              >
                {copy.promptAnatomyLinkText ?? 'Promptų anatomija →'}
              </a>
            )}
            {copy.contactEmail && (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                {copy.footerContactLabel && <span>{copy.footerContactLabel}</span>}
                <a
                  href={`mailto:${copy.contactEmail}`}
                  style={{ color: 'var(--primary)', textDecoration: 'underline' }}
                  aria-label={copy.footerContactLabel ? `${copy.footerContactLabel} ${copy.contactEmail}` : copy.contactEmail}
                >
                  {copy.contactEmail}
                </a>
              </span>
            )}
            {(copy.footerCredit ?? sot?.brand?.edition) && (
              <span style={{ opacity: 0.9 }}>
                {copy.footerCredit ?? sot?.brand?.edition}
              </span>
            )}
          </div>
          <button
            type="button"
            className="btn-ghost"
            onClick={() => setTheme((t) => (t === 'light' ? 'dark' : 'light'))}
            aria-label={theme === 'light' ? (copy.themeToggleLabelLight ?? 'Perjungti į tamsų režimą') : (copy.themeToggleLabelDark ?? 'Perjungti į šviesų režimą')}
            style={{
              marginTop: '0.75rem',
              padding: '0.5rem 1rem',
              fontSize: '0.875rem',
              cursor: 'pointer',
            }}
          >
            {theme === 'light' ? (copy.themeToggleLabelLight ?? 'Perjungti į tamsų režimą') : (copy.themeToggleLabelDark ?? 'Perjungti į šviesų režimą')}
          </button>
        </footer>
      </main>
    </div>
  )
}

export default function App() {
  return (
    <SotProvider>
      <AppContent />
    </SotProvider>
  )
}
