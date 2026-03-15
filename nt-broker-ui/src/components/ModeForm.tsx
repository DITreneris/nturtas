import React from 'react'
import type { FieldMetaItem } from '../sot/types'

function humanizeFieldId(fieldId: string): string {
  return fieldId
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (s) => s.toUpperCase())
    .replace(/_/g, ' ')
    .trim()
}

interface ModeFormProps {
  fields: string[]
  fieldMeta?: Record<string, FieldMetaItem>
  values: Record<string, string>
  onChange: (fieldId: string, value: string) => void
  formId?: string
  selectPlaceholder?: string
}

export function ModeForm({ fields, fieldMeta, values, onChange, formId, selectPlaceholder }: ModeFormProps) {
  const baseInputStyle: React.CSSProperties = {
    width: '100%',
    maxWidth: '28rem',
    padding: '0.5rem 0.75rem',
    fontSize: '0.875rem',
    border: '1px solid var(--border)',
    borderRadius: '0.5rem',
    background: 'var(--surface-1)',
    color: 'var(--text)',
  }

  return (
    <form
      id={formId}
      onSubmit={(e) => e.preventDefault()}
      style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}
    >
      {fields.map((fieldId) => {
        const meta = fieldMeta?.[fieldId]
        const label = meta?.label ?? humanizeFieldId(fieldId)
        const type = meta?.type ?? 'text'
        const placeholder = meta?.placeholder ?? ''

        const commonProps = {
          id: `field-${fieldId}`,
          'aria-label': label,
          value: values[fieldId] ?? '',
          onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
            onChange(fieldId, e.target.value),
        }

        return (
          <div key={fieldId} style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <label htmlFor={`field-${fieldId}`} style={{ fontSize: '0.875rem', fontWeight: 600 }}>
              {label}
            </label>
            {type === 'textarea' ? (
              <textarea
                {...commonProps}
                rows={3}
                placeholder={placeholder}
                style={{ ...baseInputStyle, minHeight: '4rem', resize: 'vertical' }}
              />
            ) : type === 'select' ? (
              <select
                {...commonProps}
                style={baseInputStyle}
                aria-label={label}
              >
                <option value="">{placeholder || selectPlaceholder || ''}</option>
                {(meta?.options ?? []).map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            ) : (
              <input
                {...commonProps}
                type="text"
                placeholder={placeholder}
                style={baseInputStyle}
              />
            )}
          </div>
        )
      })}
    </form>
  )
}
