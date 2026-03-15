import React, { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import type { FieldMetaItem, FieldGroup } from '../sot/types'

function humanizeFieldId(fieldId: string): string {
  return fieldId
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (s) => s.toUpperCase())
    .replace(/_/g, ' ')
    .trim()
}

interface ModeFormProps {
  fields: string[]
  fieldGroups?: FieldGroup[]
  fieldMeta?: Record<string, FieldMetaItem>
  values: Record<string, string>
  onChange: (fieldId: string, value: string) => void
  formId?: string
  selectPlaceholder?: string
  accentColor?: string
  fieldProgressLabel?: string
}

function FieldInput({
  fieldId,
  meta,
  value,
  onChange,
  selectPlaceholder,
  isRecommended,
}: {
  fieldId: string
  meta?: FieldMetaItem
  value: string
  onChange: (fieldId: string, value: string) => void
  selectPlaceholder?: string
  isRecommended?: boolean
}) {
  const label = meta?.label ?? humanizeFieldId(fieldId)
  const type = meta?.type ?? 'text'
  const placeholder = meta?.placeholder ?? ''

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

  const commonProps = {
    id: `field-${fieldId}`,
    'aria-label': label,
    value: value ?? '',
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      onChange(fieldId, e.target.value),
  }

  return (
    <div className={isRecommended ? 'field-recommended' : undefined} style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
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
}

function FieldGroupSection({
  group,
  groupIndex,
  fieldMeta,
  values,
  onChange,
  selectPlaceholder,
  accentColor,
}: {
  group: FieldGroup
  groupIndex: number
  fieldMeta?: Record<string, FieldMetaItem>
  values: Record<string, string>
  onChange: (fieldId: string, value: string) => void
  selectPlaceholder?: string
  accentColor?: string
}) {
  const [collapsed, setCollapsed] = useState(group.defaultCollapsed ?? false)
  const isFirstGroup = groupIndex === 0
  const borderLeftColor = isFirstGroup && accentColor ? accentColor : 'var(--border)'

  return (
    <div
      className="field-group"
      style={{ borderLeft: `3px solid ${borderLeftColor}` }}
    >
      {group.collapsible ? (
        <button
          type="button"
          className="field-group-header"
          onClick={() => setCollapsed((c) => !c)}
          aria-expanded={!collapsed}
        >
          {collapsed ? <ChevronDown size={16} aria-hidden /> : <ChevronUp size={16} aria-hidden />}
          {group.label}
        </button>
      ) : (
        <div className="field-group-header" style={{ cursor: 'default' }}>
          {group.label}
        </div>
      )}
      {!collapsed && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {group.fields.map((fieldId) => (
            <FieldInput
              key={fieldId}
              fieldId={fieldId}
              meta={fieldMeta?.[fieldId]}
              value={values[fieldId] ?? ''}
              onChange={onChange}
              selectPlaceholder={selectPlaceholder}
              isRecommended={fieldMeta?.[fieldId]?.recommended}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export function ModeForm({
  fields,
  fieldGroups,
  fieldMeta,
  values,
  onChange,
  formId,
  selectPlaceholder,
  accentColor,
  fieldProgressLabel,
}: ModeFormProps) {
  const allFields = fieldGroups
    ? fieldGroups.flatMap((g) => g.fields)
    : fields

  const filledCount = allFields.filter((f) => (values[f] ?? '').trim().length > 0).length
  const totalCount = allFields.length

  const progressText = fieldProgressLabel
    ? fieldProgressLabel.replace('{{filled}}', String(filledCount)).replace('{{total}}', String(totalCount))
    : `${filledCount}/${totalCount}`

  return (
    <form
      id={formId}
      onSubmit={(e) => e.preventDefault()}
      style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}
    >
      <div className="progress-bar" aria-live="polite">
        {progressText}
      </div>

      {fieldGroups && fieldGroups.length > 0 ? (
        fieldGroups.map((group, i) => (
          <FieldGroupSection
            key={group.label}
            group={group}
            groupIndex={i}
            fieldMeta={fieldMeta}
            values={values}
            onChange={onChange}
            selectPlaceholder={selectPlaceholder}
            accentColor={accentColor}
          />
        ))
      ) : (
        fields.map((fieldId) => (
          <FieldInput
            key={fieldId}
            fieldId={fieldId}
            meta={fieldMeta?.[fieldId]}
            value={values[fieldId] ?? ''}
            onChange={onChange}
            selectPlaceholder={selectPlaceholder}
            isRecommended={fieldMeta?.[fieldId]?.recommended}
          />
        ))
      )}
    </form>
  )
}
