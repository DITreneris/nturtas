import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Sparkles, MessageSquare, Handshake, BarChart3 } from 'lucide-react'
import { defaultSot } from '../sot/defaultSot'

type IconComponent = React.ComponentType<{ className?: string; size?: number }>
const ICON_MAP: Record<string, IconComponent> = {
  sparkles: Sparkles,
  'message-square': MessageSquare,
  handshake: Handshake,
  'bar-chart-3': BarChart3,
}

interface LibraryPromptItem {
  id: string
  title: string
  desc: string
  icon: string
  prompt: string
}

interface LibraryPromptsModalCopy {
  modalTemplatesTitle?: string
  btnCopy?: string
  btnUse?: string
  btnClose?: string
  copySuccess?: string
  copyFailed?: string
}

interface LibraryPromptsModalProps {
  open: boolean
  onClose: () => void
  items: LibraryPromptItem[]
  getModeIdForPromptId?: (promptId: string) => string | undefined
  onSelectMode?: (modeId: string) => void
  copy?: LibraryPromptsModalCopy
}

export function LibraryPromptsModal({
  open,
  onClose,
  items,
  getModeIdForPromptId,
  onSelectMode,
  copy: copyProp,
}: LibraryPromptsModalProps) {
  const copy = copyProp ?? {}
  const dc = defaultSot.copy
  const modalTitle = copy.modalTemplatesTitle ?? dc?.modalTemplatesTitle ?? ''
  const btnCopyText = copy.btnCopy ?? dc?.btnCopy ?? ''
  const btnUseText = copy.btnUse ?? dc?.btnUse ?? ''
  const btnCloseText = copy.btnClose ?? dc?.btnClose ?? ''
  const copySuccessText = copy.copySuccess ?? dc?.copySuccess ?? ''
  const copyFailedText = copy.copyFailed ?? dc?.copyFailed ?? ''
  const overlayRef = useRef<HTMLDivElement>(null)
  const dialogRef = useRef<HTMLDivElement>(null)
  const previousFocusRef = useRef<HTMLElement | null>(null)
  const [copyFeedbackItemId, setCopyFeedbackItemId] = useState<string | null>(null)
  const [copyFeedbackType, setCopyFeedbackType] = useState<'success' | 'error' | null>(null)
  const feedbackTimer = useRef<ReturnType<typeof setTimeout>>(undefined)

  const getFocusableElements = useCallback(() => {
    if (!dialogRef.current) return []
    return Array.from(
      dialogRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
    ).filter((el) => !el.hasAttribute('disabled') && el.offsetParent !== null)
  }, [])

  useEffect(() => {
    if (!open) return
    previousFocusRef.current = document.activeElement as HTMLElement | null
    const timer = setTimeout(() => {
      const focusable = getFocusableElements()
      if (focusable.length > 0) focusable[0].focus()
    }, 0)
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { onClose(); return }
      if (e.key !== 'Tab') return
      const focusable = getFocusableElements()
      if (focusable.length === 0) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      clearTimeout(timer)
      previousFocusRef.current?.focus()
    }
  }, [open, onClose, getFocusableElements])

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) onClose()
  }

  useEffect(() => {
    return () => clearTimeout(feedbackTimer.current)
  }, [])

  const handleCopy = async (text: string, itemId: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopyFeedbackItemId(itemId)
      setCopyFeedbackType('success')
    } catch {
      setCopyFeedbackItemId(itemId)
      setCopyFeedbackType('error')
    }
    clearTimeout(feedbackTimer.current)
    feedbackTimer.current = setTimeout(() => {
      setCopyFeedbackItemId(null)
      setCopyFeedbackType(null)
    }, 2000)
  }

  const handleUse = (promptId: string) => {
    const modeId = getModeIdForPromptId?.(promptId)
    if (modeId && onSelectMode) {
      onSelectMode(modeId)
      onClose()
    }
  }

  if (!open) return null

  return (
    <div
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="library-modal-title"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(0,0,0,0.5)',
        padding: '1rem',
        transition: 'opacity 0.2s ease',
      }}
      onClick={handleOverlayClick}
    >
      <div
        ref={dialogRef}
        style={{
          background: 'var(--surface-1)',
          color: 'var(--text)',
          borderRadius: '0.75rem',
          maxWidth: '36rem',
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: '1.5rem',
          boxShadow: 'var(--shadow-lg, 0 25px 50px -12px rgba(0,0,0,0.25))',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="library-modal-title" style={{ marginTop: 0, marginBottom: '1rem', fontSize: '1.25rem' }}>
          {modalTitle}
        </h2>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {items.map((item) => {
            const Icon = ICON_MAP[item.icon] ?? Sparkles
            const modeId = getModeIdForPromptId?.(item.id)
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
                  <Icon size={18} />
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
                    maxHeight: '6rem',
                    overflowY: 'auto',
                  }}
                >
                  {item.prompt.slice(0, 200)}
                  {item.prompt.length > 200 ? '…' : ''}
                </pre>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
                  <button
                    type="button"
                    className="btn-primary"
                    onClick={() => handleCopy(item.prompt, item.id)}
                    style={{
                      padding: '0.375rem 0.75rem',
                      fontSize: '0.8125rem',
                      cursor: 'pointer',
                      borderRadius: '0.375rem',
                    }}
                  >
                    {btnCopyText}
                  </button>
                  {modeId && onSelectMode && (
                    <button
                      type="button"
                      className="btn-secondary"
                      onClick={() => handleUse(item.id)}
                      style={{
                        padding: '0.375rem 0.75rem',
                        fontSize: '0.8125rem',
                        cursor: 'pointer',
                        borderRadius: '0.375rem',
                      }}
                    >
                      {btnUseText}
                    </button>
                  )}
                  {copyFeedbackItemId === item.id && copyFeedbackType && (
                    <span
                      role="status"
                      aria-live="polite"
                      aria-atomic="true"
                      style={{
                        fontSize: '0.8125rem',
                        color: copyFeedbackType === 'success' ? 'var(--success)' : 'var(--error)',
                      }}
                    >
                      {copyFeedbackType === 'success' ? copySuccessText : copyFailedText}
                    </span>
                  )}
                </div>
              </li>
            )
          })}
        </ul>
        <button
          type="button"
          className="btn-ghost"
          onClick={onClose}
          style={{
            marginTop: '1rem',
            padding: '0.5rem 1rem',
            cursor: 'pointer',
            borderRadius: '0.5rem',
            fontSize: '0.875rem',
          }}
        >
          {btnCloseText}
        </button>
      </div>
    </div>
  )
}
