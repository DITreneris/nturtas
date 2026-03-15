import { describe, it, expect } from 'vitest'
import { defaultSot } from './defaultSot'

describe('defaultSot', () => {
  it('has brand with productName and edition', () => {
    expect(defaultSot.brand?.productName).toBe('DI Operacinė Sistema NT Brokeriui')
    expect(defaultSot.brand?.edition).toBe('Spin-off Nr. 7')
  })

  it('has copy with hero strings', () => {
    expect(defaultSot.copy?.heroTitle).toContain('NT Brokeriui')
    expect(defaultSot.copy?.heroCtaPrimary).toBe('Generuoti promptą')
  })

  it('has modes in order OBJEKTAS, SKELBIMAS, KOMUNIKACIJA, DERYBOS, ANALIZE', () => {
    const keys = Object.keys(defaultSot.modes ?? {})
    expect(keys).toEqual(['OBJEKTAS', 'SKELBIMAS', 'KOMUNIKACIJA', 'DERYBOS', 'ANALIZE'])
  })

  it('each mode has id, label, desc, formId, icon, fields', () => {
    const modes = defaultSot.modes ?? {}
    for (const m of Object.values(modes)) {
      expect(m).toHaveProperty('id')
      expect(m).toHaveProperty('label')
      expect(m).toHaveProperty('desc')
      expect(m).toHaveProperty('formId')
      expect(m).toHaveProperty('icon')
      expect(Array.isArray(m.fields)).toBe(true)
    }
  })

  it('has theme light and dark with CSS variables', () => {
    expect(defaultSot.theme?.light).toBeDefined()
    expect(defaultSot.theme?.dark).toBeDefined()
    expect(defaultSot.theme?.light['--primary']).toBeDefined()
    expect(defaultSot.theme?.dark['--surface-0']).toBeDefined()
  })
})
