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
  const Icon = currentMode?.Icon

  return (
    <div>
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

      {/* 1. Top bar */}
      <nav className="top-bar">
        <span className="top-bar-brand">
          <Rocket size={16} /> {copy.heroTitle ?? dc?.heroTitle ?? ''}
        </span>
        <div className="top-bar-actions">
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
      </nav>

      <div style={{ maxWidth: '72rem', margin: '0 auto', padding: '0 1rem' }}>
        {/* 2. Hero card */}
        <header className="hero-card">
          <div className="hero-badges">
            <a href={copy.promptAnatomyUrl} target="_blank" rel="noopener noreferrer" className="badge-brand">
              {copy.promptAnatomyLinkText ?? dc?.promptAnatomyLinkText ?? ''}
            </a>
            <span className="badge-spinoff">{sot?.brand?.edition ?? dc?.badge ?? ''}</span>
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem', color: '#fff' }}>
            {copy.heroTitle ?? dc?.heroTitle ?? ''}
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '1.125rem', maxWidth: '42rem' }}>
            {copy.heroSubtitle ?? dc?.heroSubtitle ?? ''}
          </p>

          {copy.onboardingSteps && copy.onboardingSteps.length > 0 && (
            <ul className="header-steps">
              {copy.onboardingSteps.map((step, i) => (
                <React.Fragment key={step}>
                  {i > 0 && <span className="header-step-chevron">›</span>}
                  <li className="header-step">
                    <span className="header-step-num">{i + 1}</span>
                    {step}
                  </li>
                </React.Fragment>
              ))}
            </ul>
          )}

          <div className="header-cta">
            <button type="button" className="cta-button" data-testid="cta-generate" onClick={handleGenerate}>
              {ctaLabel}
            </button>
            <button type="button" className="cta-button-outline" data-testid="cta-templates" onClick={() => setLibraryModalOpen(true)}>
              {copy.heroCtaSecondary ?? dc?.heroCtaSecondary ?? ''}
            </button>
          </div>
          <p className="header-cta-meta">{copy.heroCtaMeta ?? dc?.heroCtaMeta ?? ''}</p>
        </header>

        {/* 3. Operation center */}
        <div className="ops-center">
          <span className="ops-center-number">1</span>
          <div>
            <div className="ops-center-title">{copy.operationCenterLabel ?? dc?.operationCenterLabel ?? ''}</div>
            <div className="ops-center-subtitle">{copy.operationCenterSubLabel ?? dc?.operationCenterSubLabel ?? ''}</div>
          </div>
        </div>

        {/* 4. Mode tabs */}
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
          <div style={{ overflowX: 'auto' }}>
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
                const ModeIcon = mode.Icon
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
                      <ModeIcon size={16} />
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

        <main id="main-content">
          {/* 5. Form card */}
          <div className="form-card">
            <div className="form-card-header">
              {currentMode && Icon && <Icon size={16} />}
              {currentMode?.label?.toUpperCase()}
            </div>

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
            </div>

            {/* Rules */}
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

            {/* ModeForm */}
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

            {emptyHint && (
              <span
                role="status"
                aria-live="polite"
                style={{
                  display: 'block',
                  marginTop: '0.75rem',
                  fontSize: '0.8125rem',
                  color: 'var(--accent-gold)',
                  fontStyle: 'italic',
                }}
              >
                {emptyHint}
              </span>
            )}
          </div>

          {/* 6. Output card */}
          {generatedPrompt !== null && (
            <div className="output-card">
              <div className="output-header">
                <span className="output-badge">
                  {copy.outputBadgeLabel ?? dc?.outputBadgeLabel ?? 'SUGENERUOTA UŽKLAUSA'}
                </span>
                {currentMode && (
                  <span className="output-mode-badge" style={{ background: currentMode.accentColor }}>
                    {currentMode.label}
                  </span>
                )}
                <button type="button" className="btn-output-copy" onClick={handleCopyOutput} style={{ marginLeft: 'auto' }}>
                  {copy.btnCopy ?? dc?.btnCopy ?? ''}
                </button>
              </div>

              <textarea
                className="editable-output"
                value={generatedPrompt}
                onChange={(e) => setGeneratedPrompt(e.target.value)}
                rows={10}
                aria-label={outputTitle}
              />

              <div className="output-meta">
                <span className="char-count">
                  {(copy.charCountLabel ?? dc?.charCountLabel ?? '{{count}}').replace('{{count}}', String(generatedPrompt.length))}
                </span>
                {outputHint && <span style={{ flex: 1 }}>{outputHint}</span>}
              </div>

              {copyFeedback && (
                <span
                  role="status"
                  aria-live="polite"
                  aria-atomic="true"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                    marginTop: '0.5rem',
                    fontSize: '0.8125rem',
                    color: copyFeedback.type === 'success' ? 'var(--success)' : 'var(--error)',
                  }}
                >
                  {copyFeedback.type === 'success' && <Check size={14} aria-hidden />}
                  {copyFeedback.message}
                </span>
              )}

              <button type="button" className="output-cta" onClick={handleCopyOutput}>
                {copy.outputCopyCtaLabel ?? dc?.outputCopyCtaLabel ?? ''} →
              </button>

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

          {/* 7. Community section */}
          {copy.whatsappUrl && (
            <section className="community">
              <h2>{copy.communityTitle ?? dc?.communityTitle ?? ''}</h2>
              <p className="community-subtitle">{copy.communitySubtitle ?? dc?.communitySubtitle ?? ''}</p>
              <div className="community-ctas">
                <a href={copy.whatsappUrl} target="_blank" rel="noopener noreferrer" className="community-cta-primary">
                  {copy.communityCtaPrimary ?? dc?.communityCtaPrimary ?? ''}
                </a>
                <a href={copy.promptAnatomyUrl} target="_blank" rel="noopener noreferrer" className="community-cta-secondary">
                  {copy.communityCtaSecondary ?? dc?.communityCtaSecondary ?? ''}
                </a>
              </div>
            </section>
          )}

          {/* 8. Footer */}
          <footer className="footer-card">
            <h3 className="footer-brand">{copy.heroTitle ?? dc?.heroTitle ?? ''} ✨</h3>
            <p className="footer-tagline">{copy.heroCtaMeta ?? dc?.heroCtaMeta ?? ''}</p>
            <div className="footer-product-link">
              {copy.footerCredit ?? sot?.brand?.edition ?? ''} El. paštas:{' '}
              <a href={`mailto:${copy.contactEmail ?? dc?.contactEmail ?? ''}`}>{copy.contactEmail ?? dc?.contactEmail ?? ''}</a>
            </div>
            {sot?.footerBadges && sot.footerBadges.length > 0 && (
              <div className="footer-badges">
                {sot.footerBadges.map((badge) => (
                  <span key={badge} className="tag">{badge}</span>
                ))}
              </div>
            )}
            <div className="footer-copyright">
              <p>
                {copy.footerCopyright ?? dc?.footerCopyright ?? ''}
                {copy.privacyUrl && (
                  <> <a href={copy.privacyUrl}>{copy.privacyLabel ?? dc?.privacyLabel ?? ''}</a></>
                )}
              </p>
            </div>
          </footer>
        </main>
      </div>
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
