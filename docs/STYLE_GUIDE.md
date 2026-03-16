# NT Broker -- Stiliaus gidas

Inspiracija: **Fotocasa.es** (Ispanijos NT portalas) -- koraline/rausva akcento spalva, tamsiai melyna navigacija, svarus baltas fonas, modernūs rounded corners.

## Spalvų paletė

### Primary (pasitikėjimas, profesionalumas)
- **Navy:** `#1B2A4A` -- hero, nav, output fonas
- **Navy hover:** `#152238`
- **Navy light:** `#2A4A7A`

### Accent (veiksmo spalva, CTA)
- **Coral:** `#E83E5E` -- mygtukai, akcentai, badge'ai
- **Coral hover:** `#D13350`

### Paviršiai (JOKIU gradientų!)
- **Surface-0 (fono):** `#F7F8FA` -- puslapio fonas
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
| `--primary` | `#F06580` |
| `--accent-gold` | `#E83E5E` |
| `--surface-0` | `#0F1117` |
| `--surface-1` | `#1A1D27` |
| `--text` | `#F0F2F5` |
| `--text-light` | `#9CA3AF` |
| `--border` | `#2D3340` |
| `--output-bg` | `#152238` |

## Principai

1. **Solidūs paviršiai** -- jokių gradientų surface-0 ir surface-1.
2. **Aukštas kontrastas** -- baltos kortelės ant šviesiai pilko fono.
3. **Coral = veiksmas** -- visi CTA mygtukai koraliniai su baltu tekstu.
4. **Navy = struktūra** -- hero, nav, output fonas tamsiai mėlynas.
5. **Rounded corners** -- kortelės 16px (`--radius-card`), mygtukai 10px (`--radius-button`), mažos kortelės 10px (`--radius-card-sm`), nested 12px (`--radius-nested`), badge'ai 9999px.
6. **Baltas tekstas ant tamsaus fono** -- hero, output, nav.

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
