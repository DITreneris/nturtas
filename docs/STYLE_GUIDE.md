# NT Broker -- Stiliaus gidas

Premium SaaS principas: **1 primary, 1 accent, 1 neutral** – mažiau spalvinių hierarchijų, aiškesnis fokusas.

## Spalvų paletė

### Primary (fonas, struktūra)
- **Navy:** `#0B1F3A` -- hero, output fonas
- **Navy hover:** `#0a1b32`
- **Navy light:** `#1e3a5f`

### Accent (vienintelė veiksmo spalva – CTA)
- **Accent:** `#3B82F6` -- Generuoti, Kopijuoti, akcentai
- **Accent hover:** `#2563eb`

### Neutral (paviršiai)
- **Surface-0 (fono):** `#F3F4F6` -- puslapio fonas
- **Surface-1 (kortelės):** `#FFFFFF` -- kortelių fonas
- **Border:** `#E5E7EB`

### Tekstas
- **Text:** `#1A1E2C`
- **Text-light:** `#6B7280`

### Būsenos
- **Success:** `#0D9488`
- **Error:** `#DC2626`
- **Error bg:** `#FEF2F2`

## Dark mode

| Kintamasis | Reikšmė |
|---|---|
| `--primary` | `#1e3a5f` |
| `--accent-gold` | `#3B82F6` (viena CTA spalva) |
| `--surface-0` | `#0F1117` |
| `--surface-1` | `#1A1D27` |
| `--text` | `#F0F2F5` |
| `--text-light` | `#9CA3AF` |
| `--border` | `#2D3340` |
| `--output-bg` | `#0B1F3A` |

## Principai

1. **Solidūs paviršiai** -- jokių gradientų surface-0 ir surface-1.
2. **Aukštas kontrastas** -- baltos kortelės ant šviesiai pilko fono.
3. **Accent = veiksmas** -- visi CTA mygtukai viena accent spalva (#3B82F6) su baltu tekstu.
4. **Navy = struktūra** -- hero, output fonas tamsiai mėlynas.
5. **Viena CTA spalva** -- tik Generate ir Copy, be papildomų ryškių mygtukų.
6. **Rounded corners** -- kortelės 16px (`--radius-card`), mygtukai 10px (`--radius-button`), mažos kortelės 10px (`--radius-card-sm`), nested 12px (`--radius-nested`), badge'ai 9999px.
7. **Baltas tekstas ant tamsaus fono** -- hero, output.

## Tipografijos skalė

| Tokenas | Reikšmė | Naudojimas |
|---------|---------|------------|
| `--text-hero` | 2rem | Hero antraštė |
| `--text-h1` | 1.5rem | H1 |
| `--text-h2` | 1.25rem | Sekcijų antraštės (h2) |
| `--text-base` | 1rem | Kūnas |
| `--text-lg` | 1.125rem | Hero subtitle, ops center |
| `--text-sm` | 0.875rem | Form header, labels |
| `--text-caption` | 0.8125rem | Meta, output context |
| `--text-xs` | 0.75rem | Badge, char count, maži elementai |

## 8pt tinklelis (spacing)

Visi atstumai (margin, padding) naudoja `--space-*` tokenus; kartotiniai iš 4px (0.25rem):

| Tokenas | Reikšmė |
|---------|---------|
| `--space-1` … `--space-8` | 0.25rem … 2rem |
| `--space-12` | 3rem |
| `--space-14` | 3.5rem |

Nenaudoti fiksuotų `1rem`, `1.5rem` arba `24px` – naudoti tokenus dėl nuoseklumo.
