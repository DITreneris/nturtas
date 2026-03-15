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
import { Save, Trash2 } from 'lucide-react'
import { SotProvider, useSot } from './sot/SotContext'
import { defaultSot } from './sot/defaultSot'
import { ModeForm } from './components/ModeForm'
import { TemplatesInline } from './components/TemplatesInline'

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
  const [rulesExpanded, setRulesExpanded] = useState(false)
  const [emptyHint, setEmptyHint] = useState<string | null>(null)
  const [noTemplateMessage, setNoTemplateMessage] = useState<string | null>(null)
  const [templatesExpandSignal, setTemplatesExpandSignal] = useState(0)
  const emptyHintTimer = useRef<ReturnType<typeof setTimeout>>(undefined)
  const copyFeedbackTimer = useRef<ReturnType<typeof setTimeout>>(undefined)
  const templatesSectionRef = useRef<HTMLDivElement>(null)
  const appMountedAt = useRef(Date.now())
  const hasSentFirstCopy = useRef(false)
  const templateAssistUsed = useRef(false)

  interface Session {
    id: string
    label: string
    prompt: string
    modeId?: string
    createdAt: number
  }
  const SESSION_KEY = 'nt_broker_sessions'
  const SESSION_MAX = 20
  const [savedSessions, setSavedSessions] = useState<Session[]>(() => {
    try {
      const raw = localStorage.getItem(SESSION_KEY)
      return raw ? JSON.parse(raw) : []
    } catch {
      return []
    }
  })
  const [sessionCopyFeedback, setSessionCopyFeedback] = useState<string | null>(null)
  const sessionFeedbackTimer = useRef<ReturnType<typeof setTimeout>>(undefined)

  const trackUxEvent = (eventName: string, payload: Record<string, unknown> = {}) => {
    const detail = {
      eventName,
      ts: Date.now(),
      locale,
      activeMode,
      ...payload,
    }

    window.dispatchEvent(new CustomEvent('ntbroker:ux', { detail }))
    const dataLayer = (window as unknown as { dataLayer?: unknown[] }).dataLayer
    if (Array.isArray(dataLayer)) {
      dataLayer.push({ event: 'ntbroker_ux', ...detail })
    }
  }

  useEffect(() => {
    return () => {
      clearTimeout(emptyHintTimer.current)
      clearTimeout(copyFeedbackTimer.current)
      clearTimeout(sessionFeedbackTimer.current)
    }
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem(SESSION_KEY, JSON.stringify(savedSessions))
    } catch { /* quota exceeded */ }
  }, [savedSessions])

  useEffect(() => {
    trackUxEvent('app_loaded')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const saveSession = () => {
    if (!generatedPrompt) return
    if (savedSessions.length >= SESSION_MAX) return
    const session: Session = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      label: generatedPrompt.slice(0, 60).replace(/\n/g, ' '),
      prompt: generatedPrompt,
      modeId: activeMode,
      createdAt: Date.now(),
    }
    setSavedSessions((prev) => [session, ...prev])
    trackUxEvent('session_saved', { sessionId: session.id })
  }

  const deleteSession = (id: string) => {
    setSavedSessions((prev) => prev.filter((s) => s.id !== id))
  }

  const deleteAllSessions = () => {
    setSavedSessions([])
  }

  const copySession = async (prompt: string) => {
    try {
      await navigator.clipboard.writeText(prompt)
      setSessionCopyFeedback('success')
      trackUxEvent('session_copied')
    } catch {
      setSessionCopyFeedback('error')
    }
    clearTimeout(sessionFeedbackTimer.current)
    sessionFeedbackTimer.current = setTimeout(() => setSessionCopyFeedback(null), 2000)
  }

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
    root.classList.toggle('dark', theme === 'dark')
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
      setNoTemplateMessage(copy.noTemplateHint ?? dc?.noTemplateHint ?? null)
      trackUxEvent('generate_blocked_no_template')
      return
    }
    setNoTemplateMessage(null)
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
    trackUxEvent('generate_clicked', {
      filledFields: inputLines.length,
      templateAssist: templateAssistUsed.current,
    })
    templateAssistUsed.current = false
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
      if (!hasSentFirstCopy.current) {
        hasSentFirstCopy.current = true
        trackUxEvent('output_copied_first', { ttfcMs: Date.now() - appMountedAt.current })
      } else {
        trackUxEvent('output_copied')
      }
    } catch {
      setCopyFeedback({ message: copy.copyFailed ?? dc?.copyFailed ?? '', type: 'error' })
    }
  }

  const restoreSession = (session: Session) => {
    if (session.modeId) {
      setActiveMode(session.modeId)
    }
    setGeneratedPrompt(session.prompt)
    setCopyFeedback(null)
    trackUxEvent('session_restored', { sessionId: session.id })
  }

  const openTemplatesInline = () => {
    setNoTemplateMessage(null)
    setTemplatesExpandSignal((v) => v + 1)
    templatesSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    trackUxEvent('templates_opened_from_cta')
  }

  const outputTitle = currentMode?.outputTitle ?? copy.outputDefaultTitle ?? ''
  const outputHint = currentMode?.outputHint ?? copy.outputDefaultHint ?? ''
  const ctaLabel = currentMode?.ctaLabel ?? copy.heroCtaPrimary ?? dc?.heroCtaPrimary ?? ''
  const firstStepHint = copy.firstStepHint ?? dc?.firstStepHint ?? ''
  const recommendedStartId = defaultModeId
  const recommendedStartLabel =
    copy.recommendedStartLabel
    ?? (locale === 'lt' ? 'Rekomenduojama pradžia' : locale === 'es' ? 'Inicio recomendado' : 'Recommended start')
  const whenToUseLabel = locale === 'lt' ? 'Kada naudoti:' : locale === 'es' ? 'Cuando usar:' : 'When to use:'
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
          <h1 className="hero-title">
            {copy.heroTitle ?? dc?.heroTitle ?? ''}
          </h1>
          <p className="hero-subtitle">
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
            <button type="button" className="cta-button-outline cta-button-muted" data-testid="cta-templates" onClick={openTemplatesInline}>
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
                    onClick={() => {
                      setActiveMode(mode.id)
                      trackUxEvent('mode_selected', { modeId: mode.id })
                    }}
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
                      {mode.id === recommendedStartId && (
                        <span className="mode-recommended-pill">
                          {recommendedStartLabel}
                        </span>
                      )}
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
              {firstStepHint && (
                <p
                  style={{
                    margin: '0 0 0.5rem',
                    fontSize: '0.8125rem',
                    color: 'var(--text-light)',
                    fontStyle: 'italic',
                  }}
                >
                  {firstStepHint}
                </p>
              )}
              <p style={{ color: 'var(--text-light)', fontSize: '0.875rem' }}>
                {copy.activeModeLabel ?? dc?.activeModeLabel ?? ''}{' '}
                <strong style={{ color: currentMode?.accentColor }}>{currentMode?.label ?? activeMode}</strong>
              </p>
              {currentMode?.longDesc && (
                <p style={{ marginTop: '0.5rem', fontSize: '0.875rem', lineHeight: 1.6 }}>
                  {currentMode.longDesc}
                </p>
              )}
              {currentMode?.desc && (
                <p className="mode-usage-hint">
                  <strong>{whenToUseLabel}</strong> {currentMode.desc}
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

            <div className="form-cta-row">
              <button type="button" className="cta-button" onClick={handleGenerate}>
                {ctaLabel}
              </button>
              <button type="button" className="cta-button-outline cta-button-muted form-cta-outline" onClick={openTemplatesInline}>
                {copy.heroCtaSecondary ?? dc?.heroCtaSecondary ?? ''}
              </button>
            </div>
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
              </div>

              {outputHint && (
                <p style={{ margin: '0 0 0.5rem', fontSize: '0.8125rem', color: 'var(--text-light)', fontStyle: 'italic' }}>
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

              <div className="output-meta">
                <span className="char-count">
                  {(copy.charCountLabel ?? dc?.charCountLabel ?? '{{count}}').replace('{{count}}', String(generatedPrompt.length))}
                </span>
              </div>

              {copyFeedback && (
                <span
                  role="status"
                  aria-live="polite"
                  aria-atomic="true"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    gap: '0.25rem',
                    marginTop: '0.5rem',
                    fontSize: '0.8125rem',
                    color: copyFeedback.type === 'success' ? 'var(--success)' : 'var(--error)',
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    {copyFeedback.type === 'success' && <Check size={14} aria-hidden />}
                    {copyFeedback.message}
                  </span>
                  {copyFeedback.type === 'success' && copy.promptAnatomyUrl && (copy.copySuccessCtaPrefix ?? dc?.copySuccessCtaPrefix) && (
                    <span style={{ color: 'var(--text-light)', fontWeight: 400 }}>
                      {(copy.copySuccessCtaPrefix ?? dc?.copySuccessCtaPrefix ?? '')}{' '}
                      <a
                        href={copy.promptAnatomyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={copy.promptAnatomyAriaLabel ?? dc?.promptAnatomyAriaLabel ?? ''}
                        style={{ color: 'inherit', textDecoration: 'underline' }}
                      >
                        {copy.promptAnatomyLinkText ?? dc?.promptAnatomyLinkText ?? ''}
                      </a>
                    </span>
                  )}
                </span>
              )}

              <button type="button" className="output-cta" onClick={handleCopyOutput}>
                {copy.outputCopyCtaLabel ?? dc?.outputCopyCtaLabel ?? ''} →
              </button>

              {/* AI tool links – output zonoje po pagrindiniu kopijavimo CTA (FIRST_RUN_USER_JOURNEY_AUDIT §7) */}
              {sot?.aiToolLinks && sot.aiToolLinks.length > 0 && (
                <div className="ai-tool-links" style={{ marginTop: '1rem' }}>
                  <span>{copy.aiToolLinksLabel ?? dc?.aiToolLinksLabel ?? ''}</span>
                  {sot.aiToolLinks.map((link) => (
                    <a key={link.url} href={link.url} target="_blank" rel="noopener noreferrer" className="btn-ai-tool">
                      <ExternalLink size={14} aria-hidden />
                      {link.label}
                    </a>
                  ))}
                  {copy.promptAnatomyUrl && (copy.aiToolLinksPromptAnatomyLabel ?? dc?.aiToolLinksPromptAnatomyLabel) && (
                    <a
                      href={copy.promptAnatomyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={copy.promptAnatomyAriaLabel ?? dc?.promptAnatomyAriaLabel ?? ''}
                      style={{ fontSize: '0.8125rem', color: 'var(--text-light)', textDecoration: 'underline', marginTop: '0.5rem', display: 'inline-block' }}
                    >
                      {copy.aiToolLinksPromptAnatomyLabel ?? dc?.aiToolLinksPromptAnatomyLabel ?? ''}
                    </a>
                  )}
                </div>
              )}

              {(copy.outputLearnMorePrefix ?? dc?.outputLearnMorePrefix) && copy.promptAnatomyUrl && (
                <p style={{ margin: '0.75rem 0 0', fontSize: '0.8125rem', color: 'var(--text-light)', fontStyle: 'italic' }}>
                  {copy.outputLearnMorePrefix ?? dc?.outputLearnMorePrefix ?? ''}{' '}
                  <a
                    href={copy.promptAnatomyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={copy.promptAnatomyAriaLabel ?? dc?.promptAnatomyAriaLabel ?? ''}
                    style={{ color: 'var(--primary-light, var(--text))', textDecoration: 'underline' }}
                  >
                    {copy.promptAnatomyLinkText ?? dc?.promptAnatomyLinkText ?? ''}
                  </a>
                </p>
              )}
            </div>
          )}

          {/* No-template alert */}
          {generatedPrompt === null && noTemplateMessage && (
            <div
              role="alert"
              style={{
                marginTop: '1rem',
                padding: '1rem',
                background: 'var(--error-bg, #fef2f2)',
                border: '1px solid var(--error)',
                borderRadius: '0.5rem',
                fontSize: '0.875rem',
                color: 'var(--error)',
              }}
            >
              {noTemplateMessage}
              <button
                type="button"
                className="btn-ghost"
                onClick={openTemplatesInline}
                style={{ marginLeft: '0.75rem', fontWeight: 600, cursor: 'pointer', textDecoration: 'underline' }}
              >
                {copy.noTemplateCtaLabel ?? dc?.noTemplateCtaLabel ?? ''}
              </button>
            </div>
          )}

          {/* Sessions */}
          {generatedPrompt !== null && (
            <section style={{ marginTop: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
                <h3 style={{ margin: 0, fontSize: '1rem' }}>{copy.sessionsTitle ?? dc?.sessionsTitle ?? 'Sesijos'}</h3>
                <button
                  type="button"
                  className="btn-primary"
                  onClick={saveSession}
                  disabled={savedSessions.length >= SESSION_MAX}
                  style={{ padding: '0.375rem 0.75rem', fontSize: '0.8125rem', cursor: 'pointer', borderRadius: '0.375rem', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}
                >
                  <Save size={14} aria-hidden />
                  {copy.sessionsSaveLabel ?? dc?.sessionsSaveLabel ?? 'Išsaugoti'}
                </button>
                {savedSessions.length > 0 && (
                  <button
                    type="button"
                    className="btn-ghost"
                    onClick={deleteAllSessions}
                    style={{ padding: '0.375rem 0.75rem', fontSize: '0.8125rem', cursor: 'pointer', borderRadius: '0.375rem', color: 'var(--error)' }}
                  >
                    {copy.sessionsDeleteAllLabel ?? dc?.sessionsDeleteAllLabel ?? 'Ištrinti sesijas'}
                  </button>
                )}
              </div>
              {savedSessions.length >= SESSION_MAX && (
                <p style={{ fontSize: '0.8125rem', color: 'var(--error)', margin: '0 0 0.5rem' }}>
                  {copy.sessionsFullLabel ?? dc?.sessionsFullLabel ?? ''}
                </p>
              )}
              {savedSessions.length === 0 ? (
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-light)' }}>
                  {copy.sessionsEmptyLabel ?? dc?.sessionsEmptyLabel ?? 'Nėra išsaugotų sesijų.'}
                </p>
              ) : (
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {savedSessions.map((s) => (
                    <li
                      key={s.id}
                      style={{
                        padding: '0.75rem',
                        border: '1px solid var(--border)',
                        borderRadius: '0.5rem',
                        background: 'var(--surface-0)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        flexWrap: 'wrap',
                      }}
                    >
                      <span style={{ flex: 1, fontSize: '0.8125rem', minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {s.label}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-light)', flexShrink: 0 }}>
                        {new Date(s.createdAt).toLocaleString()}
                      </span>
                      <button
                        type="button"
                        className="btn-ghost"
                        onClick={() => restoreSession(s)}
                        style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', cursor: 'pointer', borderRadius: '0.375rem' }}
                      >
                        {copy.sessionRestoreLabel ?? dc?.sessionRestoreLabel ?? 'Atkurti'}
                      </button>
                      <button
                        type="button"
                        className="btn-primary"
                        onClick={() => copySession(s.prompt)}
                        style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', cursor: 'pointer', borderRadius: '0.375rem' }}
                      >
                        {copy.sessionCopyLabel ?? dc?.sessionCopyLabel ?? 'Kopijuoti'}
                      </button>
                      <button
                        type="button"
                        className="btn-ghost"
                        onClick={() => deleteSession(s.id)}
                        style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', cursor: 'pointer', borderRadius: '0.375rem', color: 'var(--error)', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}
                      >
                        <Trash2 size={12} aria-hidden />
                        {copy.sessionDeleteLabel ?? dc?.sessionDeleteLabel ?? 'Ištrinti'}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
              {sessionCopyFeedback && (
                <span role="status" aria-live="polite" style={{ display: 'block', marginTop: '0.375rem', fontSize: '0.8125rem', color: sessionCopyFeedback === 'success' ? 'var(--success)' : 'var(--error)' }}>
                  {sessionCopyFeedback === 'success' ? (copy.copySuccess ?? dc?.copySuccess ?? '') : (copy.copyFailed ?? dc?.copyFailed ?? '')}
                </span>
              )}
            </section>
          )}

          {/* Inline templates (CEO-style) */}
          <div ref={templatesSectionRef}>
            <TemplatesInline
              items={sot?.libraryPrompts ?? []}
              getModeIdForPromptId={getModeIdForPromptId}
              expandSignal={templatesExpandSignal}
              onSelectMode={(modeId) => setActiveMode(modeId)}
              onUseTemplate={({ promptId, modeId }) => {
                templateAssistUsed.current = true
                trackUxEvent('template_used', { promptId, modeId: modeId ?? null })
              }}
              copy={{
                templatesSectionTitle: copy.templatesSectionTitle,
                templatesExpandLabel: copy.templatesExpandLabel,
                templatesCollapseLabel: copy.templatesCollapseLabel,
                btnCopy: copy.btnCopy,
                btnUse: copy.btnUse,
                copySuccess: copy.copySuccess,
                copyFailed: copy.copyFailed,
                templatesSourcePrefix: copy.templatesSourcePrefix ?? dc?.templatesSourcePrefix,
                promptAnatomyUrl: copy.promptAnatomyUrl,
                promptAnatomyLinkText: copy.promptAnatomyLinkText ?? dc?.promptAnatomyLinkText,
                promptAnatomyAriaLabel: copy.promptAnatomyAriaLabel ?? dc?.promptAnatomyAriaLabel,
              }}
            />
          </div>

          {/* 7. Community section */}
          {copy.whatsappUrl && generatedPrompt !== null && (
            <section className="community">
              <h2>{copy.communityTitle ?? dc?.communityTitle ?? ''}</h2>
              <p className="community-subtitle">{copy.communitySubtitle ?? dc?.communitySubtitle ?? ''}</p>
              <div className="community-ctas">
                <a href={copy.whatsappUrl} target="_blank" rel="noopener noreferrer" className="community-cta-primary">
                  <ExternalLink size={14} aria-hidden />
                  {copy.communityCtaPrimary ?? dc?.communityCtaPrimary ?? ''}
                </a>
                <a href={copy.promptAnatomyUrl} target="_blank" rel="noopener noreferrer" className="community-cta-secondary">
                  <ExternalLink size={14} aria-hidden />
                  {copy.communityCtaSecondary ?? dc?.communityCtaSecondary ?? ''}
                </a>
              </div>
            </section>
          )}

          {/* 8. Footer */}
          <footer className="footer-card">
            <h3 className="footer-brand">{copy.heroTitle ?? dc?.heroTitle ?? ''} ✨</h3>
            <p className="footer-tagline">{copy.footerTagline ?? dc?.footerTagline ?? copy.heroCtaMeta ?? dc?.heroCtaMeta ?? ''}</p>
            <div className="footer-product-link">
              {copy.footerCredit ?? sot?.brand?.edition ?? ''} {copy.footerContactLabel ?? dc?.footerContactLabel ?? ''}{' '}
              <a href={`mailto:${copy.contactEmail ?? dc?.contactEmail ?? ''}`}>{copy.contactEmail ?? dc?.contactEmail ?? ''}</a>
              {copy.promptAnatomyUrl && (
                <>
                  {' · '}
                  <a href={copy.promptAnatomyUrl} target="_blank" rel="noopener noreferrer" aria-label={copy.promptAnatomyAriaLabel ?? dc?.promptAnatomyAriaLabel ?? ''}>
                    {copy.promptAnatomyLinkText ?? dc?.promptAnatomyLinkText ?? ''}
                  </a>
                </>
              )}
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
              {copy.promptAnatomyUrl && (
                <p style={{ marginTop: '0.25rem', fontSize: '0.8125rem' }}>
                  <a href={copy.promptAnatomyUrl} target="_blank" rel="noopener noreferrer" aria-label={copy.promptAnatomyAriaLabel ?? dc?.promptAnatomyAriaLabel ?? ''}>
                    {copy.promptAnatomyLinkText ?? dc?.promptAnatomyLinkText ?? ''}
                  </a>
                </p>
              )}
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
