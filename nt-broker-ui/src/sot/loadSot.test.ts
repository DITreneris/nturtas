import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { loadSot } from './loadSot'

describe('loadSot', () => {
  const originalFetch = globalThis.fetch

  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn())
  })

  afterEach(() => {
    vi.stubGlobal('fetch', originalFetch)
    vi.restoreAllMocks()
  })

  it('returns parsed JSON when res.ok', async () => {
    const mockSot = {
      brand: { productName: 'Test' },
      modes: {},
      theme: { light: {}, dark: {} },
      copy: {},
    }
    ;(globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockSot),
    })
    const result = await loadSot('lt')
    expect(result).toEqual(mockSot)
  })

  it('rejects with message when res.status 404', async () => {
    ;(globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: false,
      status: 404,
    })
    await expect(loadSot('lt')).rejects.toThrow(/Config nerastas \(404\)/)
  })

  it('rejects with message when res.status 500', async () => {
    ;(globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: false,
      status: 500,
    })
    await expect(loadSot('lt')).rejects.toThrow(/Klaida 500/)
  })

  it('rejects with generic message on network error', async () => {
    ;(globalThis.fetch as ReturnType<typeof vi.fn>).mockRejectedValueOnce(new Error('Network error'))
    await expect(loadSot('lt')).rejects.toThrow(/Nepavyko užkrauti konfigūracijos/)
  })

  it('returns defaultSot when response is invalid (missing modes/theme/copy)', async () => {
    ;(globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({}),
    })
    const result = await loadSot('lt')
    expect(result).toHaveProperty('modes')
    expect(result).toHaveProperty('theme')
    expect(result).toHaveProperty('copy')
    expect(result.modes).toBeDefined()
    expect(result.theme?.light).toBeDefined()
    expect(result.theme?.dark).toBeDefined()
  })
})
