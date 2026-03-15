import { describe, it, expect } from 'vitest'
import { defaultSot } from './defaultSot'

describe('defaultSot', () => {
  it('has brand with productName and edition', () => {
    expect(defaultSot.brand?.productName).toBe('NT Brokerio Asistentas')
    expect(defaultSot.brand?.edition).toBe('Spin-off Nr. 7')
  })

  it('has copy with hero strings', () => {
    expect(defaultSot.copy?.heroTitle).toBe('NT Brokerio Asistentas')
    expect(defaultSot.copy?.heroCtaPrimary).toBe('Generuoti')
  })

  it('has new UX copy keys', () => {
    expect(defaultSot.copy?.outputDefaultTitle).toBeDefined()
    expect(defaultSot.copy?.outputDefaultHint).toBeDefined()
    expect(Array.isArray(defaultSot.copy?.onboardingSteps)).toBe(true)
    expect(defaultSot.copy?.onboardingSteps?.length).toBeGreaterThan(0)
    expect(defaultSot.copy?.fieldProgressLabel).toBeDefined()
    expect(defaultSot.copy?.rulesTitle).toBeDefined()
    expect(defaultSot.copy?.emptyGenerateHint).toBeDefined()
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

  it('each mode has new UX fields (ctaLabel, longDesc, outputTitle, outputHint, accentColor, fieldGroups)', () => {
    const modes = defaultSot.modes ?? {}
    for (const m of Object.values(modes)) {
      expect(m.ctaLabel).toBeDefined()
      expect(m.longDesc).toBeDefined()
      expect(m.outputTitle).toBeDefined()
      expect(m.outputHint).toBeDefined()
      expect(m.accentColor).toBeDefined()
      expect(Array.isArray(m.fieldGroups)).toBe(true)
      expect(m.fieldGroups!.length).toBeGreaterThan(0)
    }
  })

  it('has theme light and dark with CSS variables', () => {
    expect(defaultSot.theme?.light).toBeDefined()
    expect(defaultSot.theme?.dark).toBeDefined()
    expect(defaultSot.theme?.light['--primary']).toBeDefined()
    expect(defaultSot.theme?.dark['--surface-0']).toBeDefined()
  })

  it('showDebugInFooter defaults to false', () => {
    expect(defaultSot.showDebugInFooter).toBe(false)
  })

  it('has new property fields: statybosMetai, aukstas, sildymas, irengimas', () => {
    const fm = defaultSot.fieldMeta ?? {}
    expect(fm.statybosMetai).toBeDefined()
    expect(fm.statybosMetai?.type).toBe('select')
    expect(fm.statybosMetai?.options?.length).toBeGreaterThan(0)
    expect(fm.aukstas).toBeDefined()
    expect(fm.aukstas?.type).toBe('select')
    expect(fm.sildymas).toBeDefined()
    expect(fm.sildymas?.type).toBe('select')
    expect(fm.irengimas).toBeDefined()
    expect(fm.irengimas?.type).toBe('select')
  })

  it('has aiToolLinks array with entries', () => {
    expect(Array.isArray(defaultSot.aiToolLinks)).toBe(true)
    expect(defaultSot.aiToolLinks!.length).toBeGreaterThan(0)
    expect(defaultSot.aiToolLinks![0]).toHaveProperty('label')
    expect(defaultSot.aiToolLinks![0]).toHaveProperty('url')
  })

  it('has new copy keys: charCountLabel, aiToolLinksLabel, operationCenterLabel, footerTagline, footerCopyright', () => {
    const c = defaultSot.copy ?? {}
    expect(c.charCountLabel).toBeDefined()
    expect(c.aiToolLinksLabel).toBeDefined()
    expect(c.operationCenterLabel).toBeDefined()
    expect(c.operationCenterSubLabel).toBeDefined()
    expect(c.skipToContentLabel).toBeDefined()
    expect(c.footerTagline).toBeDefined()
    expect(c.footerCopyright).toBeDefined()
    expect(c.whatsappUrl).toBeDefined()
    expect(c.whatsappLabel).toBeDefined()
  })

  it('converted fields are select type with options', () => {
    const fm = defaultSot.fieldMeta ?? {}
    const selectFields = ['objektoTipas', 'kambariai', 'bukle', 'platforma', 'strategija', 'ilgis', 'klientoTipas', 'situacija', 'ctaTipas', 'derybuTikslas', 'auditorija', 'turinioTipas']
    for (const f of selectFields) {
      expect(fm[f]?.type).toBe('select')
      expect(Array.isArray(fm[f]?.options)).toBe(true)
      expect(fm[f]!.options!.length).toBeGreaterThan(0)
    }
  })
})
