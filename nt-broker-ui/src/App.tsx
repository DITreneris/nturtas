import React, { useState, useEffect, useMemo, useRef } from 'react'
import {
  Building2,
  Sparkles,
  MessageSquare,
  Handshake,
  BarChart3,
  Rocket,
  CheckCircle,
  Check,
  ChevronDown,
  ChevronUp,
  ExternalLink,
} from 'lucide-react'
import { SotProvider, useSot } from './sot/SotContext'
import { defaultSot } from './sot/defaultSot'
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

const dc = defaultSot.copy

function AppContent() {
  const { sot, loading, error, retryLoad, locale, setLocale } = useSot()
  const [activeMode, setActiveMode] = useState<string>('skelbimas')
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [formValues, setFormValues] = useState<Record<string, string>>({})
  const [generatedPrompt, setGeneratedPrompt] = useState<string | null>(null)
  const [copyFeedback, setCopyFeedback] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const [libraryModalOpen, setLibraryModalOpen] = useState(false)
  const [rulesExpanded, setRulesExpanded] = useState(true)
  const [emptyHint, setEmptyHint] = useState<string | null>(null)
  const emptyHintTimer = useRef<ReturnType<typeof setTimeout>>(undefined)
  const copyFeedbackTimer = useRef<ReturnType<typeof setTimeout>>(undefined)

  useEffect(() => {
    return () => {
      clearTimeout(emptyHintTimer.current)
      clearTimeout(copyFeedbackTimer.current)
    }
  }, [])

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
    const loadingLabel = sot?.copy?.loadingLabel ?? dc?.loadingLabel ?? ''
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
    const allFields = currentMode?.fieldGroups
      ? currentMode.fieldGroups.flatMap((g) => g.fields)
      : currentMode?.fields ?? []
    const inputLines = allFields
      .map((f) => {
        const v = formValues[f]?.trim()
        return v ? `${f}: ${v}` : null
      })
      .filter(Boolean) as string[]

    if (inputLines.length === 0 && copy.emptyGenerateHint) {
      setEmptyHint(copy.emptyGenerateHint)
      clearTimeout(emptyHintTimer.current)
      emptyHintTimer.current = setTimeout(() => setEmptyHint(null), 4000)
    }

    const inputBlockLabel = copy.inputBlockLabel ?? dc?.inputBlockLabel ?? ''
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
      setCopyFeedback({ message: copy.copySuccess ?? dc?.copySuccess ?? '', type: 'success' })
      clearTimeout(copyFeedbackTimer.current)
      copyFeedbackTimer.current = setTimeout(() => setCopyFeedback(null), 2000)
    } catch {
      setCopyFeedback({ message: copy.copyFailed ?? dc?.copyFailed ?? '', type: 'error' })
    }
  }

  const outputTitle = currentMode?.outputTitle ?? copy.outputDefaultTitle ?? ''
  const outputHint = currentMode?.outputHint ?? copy.outputDefaultHint ?? ''
  const ctaLabel = currentMode?.ctaLabel ?? copy.heroCtaPrimary ?? dc?.heroCtaPrimary ?? ''

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100%',
        maxWidth: '100%',
        overflowX: 'hidden',
        boxSizing: 'border-box',
        background: 'var(--surface-0)',
        color: 'var(--text)',
        fontFamily: "'Inter', system-ui, sans-serif",
      }}
    >
      <a href="#main-content" className="skip-to-content">
        {copy.skipToContentLabel ?? dc?.skipToContentLabel ?? ''}
      </a>
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
          {copy.copyErrorLabel ?? dc?.copyErrorLabel ?? ''} {error}
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
            {copy.copyRetryLabel ?? dc?.copyRetryLabel ?? ''}
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
          <div style={{ display: 'flex', gap: '0.5rem', alignSelf: 'flex-end', alignItems: 'center', flexWrap: 'wrap' }}>
            <div role="group" aria-label="Language selection" style={{ display: 'flex', gap: '0.5rem' }}>
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
            <button
              type="button"
              className="btn-ghost"
              onClick={() => setTheme((t) => (t === 'light' ? 'dark' : 'light'))}
              aria-label={theme === 'light' ? (copy.themeToggleLabelLight ?? dc?.themeToggleLabelLight ?? '') : (copy.themeToggleLabelDark ?? dc?.themeToggleLabelDark ?? '')}
              style={{
                padding: '0.25rem 0.5rem',
                fontSize: '0.75rem',
                cursor: 'pointer',
                borderRadius: '0.375rem',
              }}
            >
              {theme === 'light' ? (copy.themeToggleLabelLight ?? dc?.themeToggleLabelLight ?? '') : (copy.themeToggleLabelDark ?? dc?.themeToggleLabelDark ?? '')}
            </button>
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
            {copy.badge ?? dc?.badge ?? ''}
          </span>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 800, marginBottom: '0.5rem' }}>
            {copy.heroTitle ?? dc?.heroTitle ?? ''}
          </h1>
          <p style={{ color: 'var(--text-light)', fontSize: '1.125rem', maxWidth: '42rem', margin: '0 auto' }}>
            {copy.heroSubtitle ?? dc?.heroSubtitle ?? ''}
          </p>
          </div>
        </div>
      </header>

      <div className="operation-center-label">
        <strong>{copy.operationCenterLabel ?? dc?.operationCenterLabel ?? ''}</strong>
        <span>{copy.operationCenterSubLabel ?? dc?.operationCenterSubLabel ?? ''}</span>
      </div>

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
              const bgColor = isActive && mode.accentColor ? mode.accentColor : undefined
              return (
                <button
                  key={mode.id}
                  type="button"
                  className={isActive ? 'btn-primary' : 'btn-nav'}
                  data-testid={`mode-${mode.id}`}
                  onClick={() => setActiveMode(mode.id)}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.125rem',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '0.75rem',
                    fontWeight: 700,
                    fontSize: '0.875rem',
                    cursor: 'pointer',
                    boxShadow: isActive ? 'var(--shadow-sm, 0 4px 6px -1px rgba(0,0,0,0.1))' : 'none',
                    ...(bgColor ? { background: bgColor } : {}),
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Icon size={16} />
                    {mode.label}
                  </span>
                  <span style={{ fontSize: '0.625rem', fontWeight: 400, opacity: 0.8 }}>
                    {mode.desc}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      </nav>

      <main id="main-content" style={{ maxWidth: '72rem', margin: '0 auto', padding: '1rem' }}>
        {/* Onboarding steps */}
        {copy.onboardingSteps && copy.onboardingSteps.length > 0 && (
          <div className="onboarding-steps" style={{ marginTop: '1rem' }}>
            {copy.onboardingSteps.map((step, i) => (
              <div key={step} className="onboarding-step">
                <span className="step-number">{i + 1}</span>
                <span>{step}</span>
              </div>
            ))}
          </div>
        )}

        {/* Mode context */}
        <div style={{ marginTop: '1rem' }}>
          <p style={{ color: 'var(--text-light)', fontSize: '0.875rem' }}>
            {copy.activeModeLabel ?? dc?.activeModeLabel ?? ''}{' '}
            <strong style={{ color: currentMode?.accentColor }}>{currentMode?.label ?? activeMode}</strong>
          </p>
          {currentMode?.longDesc && (
            <p style={{ marginTop: '0.5rem', fontSize: '0.875rem', lineHeight: 1.6 }}>
              {currentMode.longDesc}
            </p>
          )}
          <p style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: 'var(--text-light)' }}>
            {copy.heroCtaMeta ?? dc?.heroCtaMeta ?? ''}
          </p>
        </div>

        {/* Rules -- "Ką gausite" */}
        {sot?.rules && sot.rules.length > 0 && (
          <div style={{ marginTop: '1.5rem' }}>
            <button
              type="button"
              className="btn-ghost"
              onClick={() => setRulesExpanded((e) => !e)}
              aria-expanded={rulesExpanded}
              aria-controls="rules-list"
              id="rules-toggle"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.375rem 0.5rem',
                fontSize: '0.875rem',
                color: 'var(--text-light)',
                cursor: 'pointer',
                fontWeight: 600,
                border: 'none',
                background: 'transparent',
              }}
            >
              {rulesExpanded ? <ChevronUp size={18} aria-hidden /> : <ChevronDown size={18} aria-hidden />}
              {copy.rulesTitle ?? copy.rulesAriaLabel ?? dc?.rulesTitle ?? ''} ({sot.rules.length})
            </button>
            {rulesExpanded && (
              <ul
                id="rules-list"
                role="region"
                aria-labelledby="rules-toggle"
                style={{
                  marginTop: '0.5rem',
                  paddingLeft: '1.25rem',
                  color: 'var(--text-light)',
                  fontSize: '0.875rem',
                  listStyle: 'none',
                }}
              >
                {sot.rules.map((rule) => (
                  <li
                    key={rule.text}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      marginBottom: '0.375rem',
                    }}
                  >
                    <CheckCircle size={16} style={{ flexShrink: 0, color: 'var(--success)' }} aria-hidden />
                    {rule.text}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* Form */}
        {currentMode && (currentMode.fieldGroups?.length || currentMode.fields.length > 0) && (
          <ModeForm
            formId={currentMode.formId}
            fields={currentMode.fields}
            fieldGroups={currentMode.fieldGroups}
            fieldMeta={sot?.fieldMeta}
            values={formValues}
            onChange={(fieldId, value) =>
              setFormValues((prev) => ({ ...prev, [fieldId]: value }))
            }
            selectPlaceholder={copy.selectPlaceholder}
            accentColor={currentMode.accentColor}
            fieldProgressLabel={copy.fieldProgressLabel}
          />
        )}

        {/* CTA buttons */}
        <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
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
              ...(currentMode?.accentColor ? { background: currentMode.accentColor } : {}),
            }}
          >
            {ctaLabel}
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
            {copy.heroCtaSecondary ?? dc?.heroCtaSecondary ?? ''}
          </button>
          {emptyHint && (
            <span
              role="status"
              aria-live="polite"
              style={{
                fontSize: '0.8125rem',
                color: 'var(--accent-gold)',
                fontStyle: 'italic',
              }}
            >
              {emptyHint}
            </span>
          )}
        </div>

        {/* Output */}
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
            {outputTitle && (
              <h3 style={{ margin: '0 0 0.25rem', fontSize: '1rem', fontWeight: 700 }}>
                {outputTitle}
              </h3>
            )}
            {outputHint && (
              <p className="output-context">
                {outputHint}
              </p>
            )}
            <textarea
              className="editable-output"
              value={generatedPrompt}
              onChange={(e) => setGeneratedPrompt(e.target.value)}
              rows={10}
              aria-label={outputTitle}
            />
            <div style={{ marginTop: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
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
                {copy.btnCopy ?? dc?.btnCopy ?? ''}
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
              <span className="char-count" aria-live="polite">
                {(copy.charCountLabel ?? dc?.charCountLabel ?? '{{count}}').replace('{{count}}', String(generatedPrompt.length))}
              </span>
            </div>
            {sot?.aiToolLinks && sot.aiToolLinks.length > 0 && (
              <div className="ai-tool-links">
                <span>{copy.aiToolLinksLabel ?? dc?.aiToolLinksLabel ?? ''}</span>
                {sot.aiToolLinks.map((link) => (
                  <a key={link.url} href={link.url} target="_blank" rel="noopener noreferrer" className="btn-ai-tool">
                    <ExternalLink size={14} aria-hidden />
                    {link.label}
                  </a>
                ))}
              </div>
            )}
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
              {(copy.footerDebugLabel ?? dc?.footerDebugLabel ?? '').replace('{{theme}}', theme)}
            </p>
          )}
          {copy.footerTagline && (
            <p className="footer-tagline">{copy.footerTagline}</p>
          )}
          <div className="footer-links">
            {copy.whatsappUrl && (
              <a
                href={copy.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: 'var(--primary)', textDecoration: 'underline' }}
              >
                {copy.whatsappLabel ?? dc?.whatsappLabel ?? ''}
              </a>
            )}
            {copy.promptAnatomyUrl && (
              <a
                href={copy.promptAnatomyUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: 'var(--primary)', textDecoration: 'underline' }}
                aria-label={copy.promptAnatomyAriaLabel ?? dc?.promptAnatomyAriaLabel ?? ''}
              >
                {copy.promptAnatomyLinkText ?? dc?.promptAnatomyLinkText ?? ''}
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
          {copy.footerCopyright && (
            <p className="footer-copyright">{copy.footerCopyright}</p>
          )}
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
