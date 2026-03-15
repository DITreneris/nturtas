import React, { useEffect, useRef, useState } from 'react'
import { ChevronDown, ChevronUp, Sparkles, MessageSquare, Handshake, BarChart3 } from 'lucide-react'
import { defaultSot } from '../sot/defaultSot'

type IconComponent = React.ComponentType<{ className?: string; size?: number }>
const ICON_MAP: Record<string, IconComponent> = {
  sparkles: Sparkles,
  'message-square': MessageSquare,
  handshake: Handshake,
  'bar-chart-3': BarChart3,
}

interface TemplateItem {
  id: string
  title: string
  desc: string
  icon: string
  prompt: string
}

interface TemplatesInlineCopy {
  templatesSectionTitle?: string
  templatesExpandLabel?: string
  templatesCollapseLabel?: string
  btnCopy?: string
  btnUse?: string
  copySuccess?: string
  copyFailed?: string
  templatesSourcePrefix?: string
  promptAnatomyUrl?: string
  promptAnatomyLinkText?: string
  promptAnatomyAriaLabel?: string
}

interface TemplatesInlineProps {
  items: TemplateItem[]
  getModeIdForPromptId?: (promptId: string) => string | undefined
  onSelectMode?: (modeId: string) => void
  onUseTemplate?: (payload: { promptId: string; modeId?: string }) => void
  expandSignal?: number
  copy?: TemplatesInlineCopy
}

export function TemplatesInline({
  items,
  getModeIdForPromptId,
  onSelectMode,
  onUseTemplate,
  expandSignal,
  copy: copyProp,
}: TemplatesInlineProps) {
  const copy = copyProp ?? {}
  const dc = defaultSot.copy
  const sectionTitle = copy.templatesSectionTitle ?? dc?.templatesSectionTitle ?? 'Šablonų biblioteka'
  const expandLabel = copy.templatesExpandLabel ?? dc?.templatesExpandLabel ?? 'Rodyti pilną šabloną'
  const collapseLabel = copy.templatesCollapseLabel ?? dc?.templatesCollapseLabel ?? 'Sutraukti'
  const btnCopyText = copy.btnCopy ?? dc?.btnCopy ?? ''
  const btnUseText = copy.btnUse ?? dc?.btnUse ?? ''
  const copySuccessText = copy.copySuccess ?? dc?.copySuccess ?? ''
  const copyFailedText = copy.copyFailed ?? dc?.copyFailed ?? ''

  const [expanded, setExpanded] = useState(false)
  const [expandedPrompts, setExpandedPrompts] = useState<Set<string>>(new Set())
  const [copyFeedbackId, setCopyFeedbackId] = useState<string | null>(null)
  const [copyFeedbackType, setCopyFeedbackType] = useState<'success' | 'error' | null>(null)
  const feedbackTimer = useRef<ReturnType<typeof setTimeout>>(undefined)

  if (!items || items.length === 0) return null

  useEffect(() => {
    if (typeof expandSignal === 'number' && expandSignal > 0) {
      setExpanded(true)
    }
  }, [expandSignal])

  const PREVIEW_LIMIT = 400

  const handleCopy = async (text: string, itemId: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopyFeedbackId(itemId)
      setCopyFeedbackType('success')
    } catch {
      setCopyFeedbackId(itemId)
      setCopyFeedbackType('error')
    }
    clearTimeout(feedbackTimer.current)
    feedbackTimer.current = setTimeout(() => {
      setCopyFeedbackId(null)
      setCopyFeedbackType(null)
    }, 2000)
  }

  const handleUse = (promptId: string) => {
    const modeId = getModeIdForPromptId?.(promptId)
    onUseTemplate?.({ promptId, modeId })
    if (modeId && onSelectMode) onSelectMode(modeId)
  }

  const togglePromptExpand = (id: string) => {
    setExpandedPrompts((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  return (
    <section style={{ marginTop: '1.5rem' }}>
      <button
        type="button"
        className="btn-ghost"
        onClick={() => setExpanded((e) => !e)}
        aria-expanded={expanded}
        aria-controls="templates-inline-list"
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
        {expanded ? <ChevronUp size={18} aria-hidden /> : <ChevronDown size={18} aria-hidden />}
        {sectionTitle} ({items.length})
      </button>

      {expanded && (
        <ul
          id="templates-inline-list"
          style={{
            listStyle: 'none',
            padding: 0,
            margin: '0.75rem 0 0',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
          }}
        >
          {items.map((item) => {
            const Icon = ICON_MAP[item.icon] ?? Sparkles
            const modeId = getModeIdForPromptId?.(item.id)
            const isPromptExpanded = expandedPrompts.has(item.id)
            const needsTruncation = item.prompt.length > PREVIEW_LIMIT
            const displayPrompt = isPromptExpanded || !needsTruncation
              ? item.prompt
              : item.prompt.slice(0, PREVIEW_LIMIT) + '…'

            return (
              <li
                key={item.id}
                style={{
                  padding: '1rem',
                  border: '1px solid var(--border)',
                  borderRadius: '0.5rem',
                  background: 'var(--surface-0)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                  <Icon size={18} aria-hidden />
                  <strong>{item.title}</strong>
                </div>
                <p style={{ margin: '0.25rem 0 0.5rem', fontSize: '0.8125rem', color: 'var(--text-light)' }}>
                  {item.desc}
                </p>
                <pre
                  style={{
                    margin: '0.5rem 0',
                    padding: '0.5rem',
                    background: 'var(--surface-1)',
                    borderRadius: '0.375rem',
                    fontSize: '0.75rem',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                    maxHeight: isPromptExpanded ? 'none' : '8rem',
                    overflowY: isPromptExpanded ? 'visible' : 'auto',
                  }}
                >
                  {displayPrompt}
                </pre>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
                  <button
                    type="button"
                    className="btn-primary"
                    onClick={() => handleCopy(item.prompt, item.id)}
                    style={{ padding: '0.375rem 0.75rem', fontSize: '0.8125rem', cursor: 'pointer', borderRadius: '0.375rem' }}
                  >
                    {btnCopyText}
                  </button>
                  {modeId && onSelectMode && (
                    <button
                      type="button"
                      className="btn-secondary"
                      onClick={() => handleUse(item.id)}
                      style={{ padding: '0.375rem 0.75rem', fontSize: '0.8125rem', cursor: 'pointer', borderRadius: '0.375rem' }}
                    >
                      {btnUseText}
                    </button>
                  )}
                  {needsTruncation && (
                    <button
                      type="button"
                      className="btn-ghost"
                      onClick={() => togglePromptExpand(item.id)}
                      style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', cursor: 'pointer' }}
                    >
                      {isPromptExpanded ? collapseLabel : expandLabel}
                    </button>
                  )}
                  {copyFeedbackId === item.id && copyFeedbackType && (
                    <span
                      role="status"
                      aria-live="polite"
                      aria-atomic="true"
                      style={{ fontSize: '0.8125rem', color: copyFeedbackType === 'success' ? 'var(--success)' : 'var(--error)' }}
                    >
                      {copyFeedbackType === 'success' ? copySuccessText : copyFailedText}
                    </span>
                  )}
                </div>
              </li>
            )
          })}
        </ul>
      )}
      {copy.templatesSourcePrefix && copy.promptAnatomyUrl && (copy.promptAnatomyLinkText ?? dc?.promptAnatomyLinkText) && (
        <p style={{ marginTop: '0.75rem', fontSize: '0.8125rem', color: 'var(--text-light)' }}>
          {copy.templatesSourcePrefix ?? dc?.templatesSourcePrefix ?? ''}
          <a
            href={copy.promptAnatomyUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={copy.promptAnatomyAriaLabel ?? dc?.promptAnatomyAriaLabel ?? ''}
            style={{ color: 'var(--primary-light, var(--text))', textDecoration: 'underline' }}
          >
            {copy.promptAnatomyLinkText ?? dc?.promptAnatomyLinkText ?? ''}
          </a>
          .
        </p>
      )}
    </section>
  )
}
