# Premium SaaS UI/UX auditas — NT Broker

**Data:** 2026-03-16  
**Apimtis:** Gilus dizaino sistemos, tipografijos, spalvų, šešėlių, komponentų ir mikro UI auditas.  
**Etalonai:** Stripe, Linear, Notion, Vercel, Apple lygio produktas.  
**Technologijos:** React, Vite, CSS variables (be Tailwind), Inter.

---

## 1. UI Architecture Audit

### 1.1 Komponentų sistema

| Aspektas | Būsena | Problema / rekomendacija |
|----------|--------|---------------------------|
| **Struktūra** | Vienas didelis `App.tsx` (~560 eilučių), `ModeForm`, `TemplatesInline` | Logika ir UI sumaišyta; trūksta atskirų UI komponentų (Button, Card, Badge). |
| **Design tokens** | `:root` ir `.dark` CSS kintamieji, SOT theme per JS | Tokenai geri; dalis reikšmių dubliuojama inline (px/rem). |
| **Komponentų atskyrimas** | Hero, TopBar, FormCard, OutputCard, Community, Footer — viskas JSX su klasėmis | Nėra `Button`, `Card`, `Badge` abstrakcijų; sunku palaikyti nuoseklumą. |
| **Props / state** | Didelis lokalus state (activeMode, formValues, sessions…) | Priimtina; rekomenduotina išskirti custom hook (useSessions, useForm). |

**Išvada:** Architektūra labiau „vienas puslapis su sekcijomis“ nei „komponentų biblioteka“. Premium lygiui reikia mažų, perpanaudojamų komponentų (Button variants, Card, Input wrapper).

### 1.2 Layout struktūra

| Elementas | Įgyvendinimas | Pastaba |
|-----------|----------------|---------|
| **Max width** | `--content-max-width: 72rem` (1152px), `app-content-wrap` | Gerai; atitinka standartinį SaaS content width. |
| **Grid** | `main-content-layout`: `grid-template-columns: 1fr 1fr`, breakpoint 768px → 1 col | Dviejų stulpelių (forma | output) logika teisinga; grid gap `var(--space-8)` nuoseklus. |
| **Top bar** | Sticky, `max-width: var(--content-max-width)`, centruotas | Teisingai; bet top bar ir content wrap turi skirtingą horizontalų padding kontekstą (abi naudoja `var(--space-4)`). |
| **Step1 nav** | Sticky po top bar su `top: var(--top-bar-height)` | Gerai; horizontalus scroll su `::after` fade. |

**Problema:** Nėra aiškaus „container → section → block“ hierarchijos pavadinimų; dalis sekcijų neturi semantinio wrapperio (pvz. `<section aria-labelledby>`).

### 1.3 Grid sistema

- Naudojamas **vienas pagrindinis grid** (form | output); kitur — flexbox.
- Nėra 12/8 stulpelių grid sistemos (kaip Bootstrap/Tailwind); priimtina vieno produkto kontekste.
- **Rekomendacija:** Įvesti 8pt grid (visi padding/margin kartotiniai iš 4px/0.25rem) ir dokumentuoti; dabar daug kur jau `--space-*`, bet kai kur inline `1rem`, `1.5rem` be tokeno.

### 1.4 Spacing logika

| Tokenas | Reikšmė | Naudojimas |
|---------|---------|------------|
| `--space-1` … `--space-8` | 0.25rem … 2rem | field-group, top-bar, step1-nav, form-card |
| Inline | `1rem`, `1.5rem`, `0.5rem`, `24px`, `48px` | Hero padding `48px 56px`, margin `2.25rem`, marginTop `1rem` |

**Nenuoseklumai:** Hero naudoja px (`48px 56px`), kitur rem; `margin-bottom: 2.25rem` ne iš tokenų; form-card `padding: var(--space-8)` vs hero fiksuoti skaičiai. Rekomenduotina: visi atstumai iš `--space-*` arba aiškios taisyklės (pvz. sekcijos tarpas = `--space-8`).

### 1.5 Dizaino sistemos nuoseklumas

- **Pliusai:** SOT valdo copy ir theme; CSS klasės (`btn-primary`, `field-group`, `output-card`) suteikia bendrą stilių.
- **Minusai:** Didelė dalis stilių inline (`style={{ ... }}`) App.tsx ir komponentuose — sunku keisti vienu metu ir užtikrinti vienodą hover/focus. Border radius skiriasi: button `8px`, hero `24px`, cards `16px`, badge `9999px`, input `0.5rem` — galima suvienodinti pagal „elemento dydį“ (small 6px, medium 10px, large 16px, pill 9999px).

---

## 2. Typography Audit

### 2.1 Šrifto pasirinkimas

- **Naudojama:** Inter (Google Fonts), svoriai 400, 500, 600, 700, 800. `style.css`: `font-family: 'Inter', system-ui, Avenir…`
- **Vertinimas:** Inter — saugus, profesionalus pasirinkimas; premium produktai dažnai naudoja arba Inter, arba labiau atpažįstamą (Geist, Soehne, Custom). NT Broker — tinkamas; galima vėliau apsvarstyti display šriftą tik hero/footer.

### 2.2 Hierarchija

| Lygis | Dabartinis | Problema |
|-------|------------|----------|
| **Hero title** | `2rem`, `font-weight: 800` | Aišku; h1 globaliai `3.2em` — per didelis, jei naudojamas kitur. |
| **Hero subtitle** | `1.125rem`, `--on-primary-muted` | Gerai. |
| **Section titles** | Įvairūs: `form-card-header` 0.875rem uppercase, `ops-center-title` 1.125rem, h2 community 1.375rem | Nėra vienodos skale (H1/H2/H3); font-size daugiau „pagal bloką“ nei pagal semantiką. |
| **Body** | `1rem`, line-height 1.5 (root) | Gerai. |
| **Small / meta** | 0.8125rem, 0.75rem (inline) | Dažnai inline; rekomenduotina tokenai `--text-xs`, `--text-sm` visur. |

**Rekomendacija:** Įvesti tipografijos skalę (--text-hero, --text-h1, --text-h2, --text-body, --text-caption) ir naudoti semantinius tagus (h1, h2, h3) su klasėmis, ne tik font-size.

### 2.3 Line height ir letter spacing

- **Root:** `line-height: 1.5` — geras body.
- **Hero title:** `line-height: 1.1` — tankiau, priimtina trumpiems antrašėms.
- **Letter spacing:** Tik `form-card-header` ir badge — `letter-spacing: 0.05em`; kitur nenurodyta. Uppercase / label stiliuose 0.04–0.06em pagerintų skaitomumą.

### 2.4 Skaitymo ergonomika

- Kontrastas: tekstas ant `--surface-1` ir `--text` atitinka WCAG; ant `--output-bg` baltas tekstas su muted variantais — gerai.
- Ilgi blokai (taisyklės, šablonų aprašai): font-size 0.875rem, line-height ne visur nurodytas — rekomenduotina `line-height: 1.6` ilgesniam tekstui.
- **Output textarea:** monospace, 0.8125rem — tinkama techniniam turiniui.

---

## 3. Color System Audit

### 3.1 Pagrindinės spalvos

| Rolė | Light | Dark | Naudojimas |
|------|--------|------|------------|
| **Primary** | #1B2A4A | #F06580 (dark — rožinė) | Nav, hero, output bg, CTA kontekste |
| **Accent (CTA)** | #E83E5E (coral) | #E83E5E | Hero CTA, output copy button, primary action |
| **Surface-0** | #F7F8FA | #0F1117 | Page background |
| **Surface-1** | #FFFFFF | #1A1D27 | Cards, top bar |
| **Text** | #1A1E2C | #F0F2F5 | Pagrindinis tekstas |
| **Text-light** | #6B7280 | #9CA3AF | Antrinis tekstas |

**Pastaba:** Dark režime `--primary` rožinė — naudojama kaip „akcentas“; navy lieka output-bg. Logika priimtina, bet pavadinimas „primary“ gali klaidinti (light = navy, dark = pink).

### 3.2 Gradientai

- **STYLE_GUIDE:** „JOKIU gradientų“ surface-0 ir surface-1. CSS `:root` naudoja solid spalvas — atitinka.
- SOT theme (config) gali turėti gradientus; jei JS perrašo CSS variables — reikia užtikrinti, kad production naudoja solid, jei tai dokumentuota.

### 3.3 Kontrastas ir spalvų hierarchija

- Pagrindinis tekstas ant baltų/pilkų fonų — pakankamas.
- **Success / error:** `--success`, `--error` apibrėžti ir naudojami copy feedback — gerai. Klaidos blokas naudoja `--error-bg`, `--error` — teisingai.
- **CTA hierarchija:** Coral (accent-gold) = pagrindinis veiksmas; navy = antrinis (community secondary). WhatsApp atskirai žalia — semantiškai atskiras „external“ CTA — priimtina.

### 3.4 CTA spalvos

- Hero ir output: coral (`--accent-gold`) + baltas tekstas; hover `--accent-gold-hover`.
- Secondary: outline su primary (navy) arba on-primary-muted ant hero.
- Community primary: žalia (WhatsApp); secondary: navy outline. Nuoseklu.

**Micro problema:** Kai kur mygtukuose inline `background`/`color` be klasės — reikia užtikrinti, kad visi CTA naudoja tas pačias CSS klases (btn-primary, cta-button), kad hover/focus būtų vienodi.

---

## 4. Shadow / Depth System

### 4.1 Šešėlių sistema

| Tokenas | Reikšmė | Naudojimas |
|---------|---------|------------|
| `--shadow-sm` | 0 1px 2px rgba(0,0,0,0.05) | top-bar |
| `--shadow-md` | 0 4px 6px -1px…, 0 2px 4px -2px… | output-card |
| `--shadow-lg` | 0 25px 50px -12px… | Apibrėžta, bet retai naudojama (pvz. modalų nebėra) |

**Problema:** Tik 2–3 vietos naudoja šešėlius; form-card, field-group, community, footer — tik border, be shadow. Rezultatas — plokščiau, mažiau „kortelių gylio“.

### 4.2 Elementų gylis

- **Top bar:** sm šešėlis + border — atskiria nuo turinio.
- **Output card:** shadow-md — gerai.
- **Form card, ops-center, community, session items:** be shadow — vizualiai vienodo „lygio“. Premium produktuose dažnai pagrindinės kortelės turi švelnų shadow (sm arba md).

### 4.3 Kortelių „floating“ ir premium jausmas

- Rekomenduotina: pagrindinėms kortelėms (form-card, output-card, community) vienodas `--shadow-sm` arba `--shadow-md`; hover (jei interaktyvus) — pereiti į shadow-md. Taip pasiekti lengvo „floating“ efekto be per didelio dramatiškumo.

---

## 5. Component Consistency

### 5.1 Buttons

| Tipas | Klasė / stilius | Nuoseklumas |
|------|------------------|-------------|
| Primary | `btn-primary`, `cta-button`, `output-cta` | Skirtingi padding/border-radius: cta 12px, output-cta 12px, btn-primary global 8px. Reikia suvienodinti radius (pvz. 10px visiems). |
| Secondary | `btn-secondary`, `cta-button-outline`, `form-cta-outline` | Outline logika panaši; border 2px vs 1px — suvienodinti. |
| Ghost | `btn-ghost` | Naudojamas nav, rules toggle, templates expand — gerai. |
| Nav tabs | Inline + `btn-primary` / `btn-nav` | Režimų mygtukai turi savo layout (column, gap) — atskiras „tab“ variantas būtų aiškesnis. |

**Problema:** Globalus `button { border-radius: 8px }`, o `cta-button` ir `output-cta` turi `12px` — override. Rekomenduotina viena taisyklė: small 6px, medium 10px, large 12px.

### 5.2 Cards

- **form-card:** border 1px, radius 16px, padding space-8.
- **output-card:** border-radius 16px, shadow-md, kitas fonas (output-bg).
- **field-group:** radius 0.75rem (12px), border-left 3px accent.
- **TemplatesInline items:** border, radius 0.5rem (8px), padding 1rem.
- **Session items:** border, radius 0.5rem, padding 0.75rem.

**Nenuoseklumas:** 16px vs 12px vs 8px radius be aiškios hierarchijos. Rekomenduotina: „section“ card 16px, „inline“ item 10px, „chip“ 8px.

### 5.3 Icons

- Lucide (Building2, Sparkles, MessageSquare, Handshake, BarChart3, Sun, Moon, Check, ChevronDown/Up, ExternalLink, Save, Trash2).
- Dydžiai: 14, 16, 18 — daugiausia inline. Rekomenduotina: small 14, medium 16, large 20 ir naudoti vienodai (pvz. visi nav icon 16, CTA icon 18).

### 5.4 Badges

- **badge-brand, badge-spinoff:** pill (9999px), 0.6875rem, uppercase, letter-spacing.
- **output-badge, output-mode-badge:** panašūs; vieni su border, kiti su kitokiu fonu.
- **mode-recommended-pill:** mažesnis (0.625rem). Nuoseklu pagal paskirtį.

### 5.5 Avatars

- Nenaudojami (nėra user profile). N/A.

### 5.6 CTA elementai

- Hero: vienas pagrindinis `cta-button` (coral) + antrinis tekstinis linkas — gerai.
- Form: du mygtukai (primary + outline) — gerai.
- Output: vienas didelis „KOPIJUOTI UŽKLAUSĄ“ — gerai.
- Community: du (WhatsApp + Promptų anatomija). Nuoseklu.

---

## 6. Visual Hierarchy

### 6.1 Kur vartotojo akis eina pirmiausia

- **Pirmas:** Hero (didelis navy blokas, baltas tekstas, coral CTA) — stiprus pirmas įspūdis.
- **Antras:** Režimų juosta (step1) — aktyvus tab paryškintas.
- **Trečias:** Forma kairėje arba output dešinėje — priklauso nuo užduoties. Dviejų stulpelių layout logiškas.

**Rizika:** Hero turi daug elementų (badges, title, subtitle, CTA, meta, secondary link, onboarding steps) — vienu metu daug konkuruojančių signalų. Premium lygyje dažnai mažiau teksto, vienas aiškus CTA.

### 6.2 Ar aiški navigacija

- Top bar: brand + kalbos + tema — aišku.
- Step1 nav: režimų tabai su horizontal scroll — aišku; „Rekomenduojama pradžia“ pill padeda.
- Nėra sidebar arba multi-page — vienas long scroll. Priimtina vieno produkto kontekste.

### 6.3 Ar CTA matomas

- Hero CTA (Generuoti) — coral, didelis, viršuje — matomas.
- Form CTA — toks pat coral — gerai.
- Output „KOPIJUOTI UŽKLAUSĄ“ — coral, pilnas plotis — labai matomas. Gerai.

---

## 7. Micro UI Polish — 20+ pataisymų

| # | Pataisymas | Vieta | Poveikis |
|---|------------|--------|----------|
| 1 | **Padding:** Hero padding pereiti iš `48px 56px` į tokenus `var(--space-12)` / `var(--space-14)` arba 48px 40px mobile jau yra; desktop suvienodinti su 56px horizontal. | style.css .hero-card | Nuoseklumas su design tokens. |
| 2 | **Border radius:** Visiems pagrindiniams mygtukams nustatyti vieną radius (pvz. 10px); pašalinti 8px global button, palikti 10px primary/secondary. | style.css button, .cta-button, .btn-primary | Vienodas „premium“ jausmas. |
| 3 | **Field group radius:** Suvienodinti su form-card (16px) arba palikti 12px bet dokumentuoti kaip „nested card“. | .field-group | Vizualinė hierarchija. |
| 4 | **Hero border-radius:** 24px mobile sumažinti iki 16px (jau yra 640px media) — gerai; desktop 24px palikti. | style.css | — |
| 5 | **Hover:** Užtikrinti, kad visi btn-primary, btn-secondary, btn-ghost, cta-button turi :hover per klasę (ne tik inline). | style.css .btn-* | Interakcijos atsakas. |
| 6 | **Focus-visible:** Vienodas outline arba box-shadow (2px solid var(--primary), offset 2px) visiems mygtukams ir nuorodoms. | style.css :focus-visible | A11y ir klaviatūra. |
| 7 | **Transition:** Mygtukams pridėti transition 0.2s ease background-color, border-color, color. | .btn-*, .cta-button | Sklandus hover/focus. |
| 8 | **Loading spinner:** Dydį ir margin naudoti iš tokenų (--space-4); spinner border spalva var(--primary). | App.tsx loading block | Nuoseklumas. |
| 9 | **Error block:** Border-radius 8px arba 10px; padding tokenais. | App.tsx error role="alert" | Švarus išvaizda. |
| 10 | **Icon alignment:** Režimų tab ikonos ir tekstas — flex align center; užtikrinti vienodą gap (0.5rem). | App.tsx step1-nav-tabs | Vertikali lygiavimas. |
| 11 | **Output badge vs mode badge:** Abu pill; vienodas padding (0.375rem 0.75rem) ir font-size (0.6875rem). | .output-badge, .output-mode-badge | Badge nuoseklumas. |
| 12 | **Char count:** Dešinėje lygiuoti (margin-left: auto jau yra); font-size --text-xs. | .char-count | Tipografija. |
| 13 | **Form card header:** Ikona + tekstas — gap 0.5rem; ikonos dydis 16px. | App.tsx form-card-header | Icon-text alignment. |
| 14 | **Rules toggle:** Hover spalva (pvz. color: var(--primary)); transition 0.15s. | App.tsx rules button | Subtle feedback. |
| 15 | **Session item buttons:** Vienodas min-height 44px mobile (jau yra); desktop padding suvienodinti (pvz. 0.375rem 0.75rem). | App.tsx session-item button | Touch + vizualinis. |
| 16 | **Community card:** Pridėti --shadow-sm, kad atitiktų kitas korteles. | .community | Depth sistema. |
| 17 | **Footer card:** Tą patį shadow-sm arba border-only palikti, bet padding suvienodinti su community (2rem). | .footer-card | Nuoseklumas. |
| 18 | **Templates inline list item:** Border-radius 10px (vietoj 0.5rem), kad atitiktų „card small“. | TemplatesInline.tsx li style | Suvienodintas radius. |
| 19 | **Copy feedback:** Success — check ikona + var(--success); error — var(--error); aria-live="polite" jau yra. | App.tsx copyFeedback block | Vizualinė ir a11y. |
| 20 | **Contrast:** „Rekomenduojama pradžia“ pill — užtikrinti, kad ant primary fono tekstas skaitomas (dabar accent spalva ant navy — gerai). | .mode-recommended-pill | Kontrastas. |
| 21 | **Step number (header-steps):** 24px apskritimas; font 0.75rem, 800 — užtikrinti centravimą flex. | .header-step-num | Centravimas. |
| 22 | **Editable output textarea:** Focus ring 2px var(--on-primary-muted); transition border-color 0.2s. | .editable-output:focus | Focus polish. |
| 23 | **Top bar theme btn:** Hover background var(--surface-0); border-radius 6px. | .top-bar-theme-btn | Hover atsakas. |
| 24 | **Locale buttons:** Aktyvus — btn-primary; neaktyvus — btn-ghost; vienodas padding (0.5rem 0.75rem). | App.tsx LOCALES map | Nuoseklumas. |
| 25 | **No-template alert:** Border-radius 10px; padding var(--space-4). | App.tsx noTemplateMessage block | Tokenai. |

---

## 8. Premium SaaS Upgrade Plan

### Quick Wins (1 diena)

- **QW1.** Įvesti vienodą border-radius taisyklę: mygtukai 10px, mažos kortelės 10px, didelės 16px; dokumentuoti style guide.
- **QW2.** Pridėti transition (0.2s ease) visiems .btn-*, .cta-button, .output-cta, .community-cta-*.
- **QW3.** Užtikrinti :focus-visible vienodą (outline 2px solid var(--primary), outline-offset 2px) visiems interaktyviems elementams.
- **QW4.** Hero padding pakeisti į rem/tokenus (pvz. padding: var(--space-12) var(--space-14)); mobile palikti 24px 20px.
- **QW5.** Community ir footer cards: pridėti box-shadow: var(--shadow-sm) nuoseklumui su output-card.
- **QW6.** Copy success/error bloke naudoti --success / --error spalvas ir Check ikoną (jau dalinai yra) — peržiūrėti visus atvejus.
- **QW7.** Form card header ir ops-center: ikonų dydis 16px, gap 0.5rem — peržiūrėti visur.

### Medium Wins (1 savaitė)

- **MW1.** Išskirti Button komponentą (variant: primary | secondary | ghost | nav) su klasėmis ir tokenais; pakeisti App ir TemplatesInline naudojimus.
- **MW2.** Įvesti Card wrapper (optionally shadow, radius, padding) ir naudoti form-card, output-card, community, footer, session item.
- **MW3.** Tipografijos skalė: --text-hero (2rem), --text-h1 (1.5rem), --text-h2 (1.25rem), --text-body (1rem), --text-caption (0.8125rem); pakeisti hardcoded font-size į tokenus.
- **MW4.** 8pt grid dokumentacija ir audit: visi margin/padding iš --space-* arba aiškiai išimtinai (pvz. hero).
- **MW5.** Šešėlių naudojimas: form-card, ops-center, TemplatesInline item — pridėti --shadow-sm; output-card palikti --shadow-md.
- **MW6.** Session list ir TemplatesInline: išskirti list item į mažą komponentą su vienodu padding, radius, border.
- **MW7.** Loading state: skeleton placeholder (header + nav + form outline) arba didesnis spinner su sot.copy.loadingLabel; aria-live.

### Major Upgrades (1 mėnuo)

- **MU1.** Design system dokumentas (Storybook arba statinis HTML): visi Button, Card, Badge, Input variantai ir būsenos (default, hover, focus, disabled, error).
- **MU2.** Refaktorius: App.tsx suskaidyti į smulkesnius komponentus (HeroSection, Step1Block, FormSection, OutputSection, SessionsSection, CommunitySection, FooterSection) su aiškia props struktūra.
- **MU3.** Custom hooks: useSessions, useFormValues, useCopyFeedback — sumažinti App.tsx state logiką.
- **MU4.** A11y pilnas auditas: klaviatūros navigacija, focus order, ARIA labels peržiūra, contrast check (WCAG AA).
- **MU5.** Animacijos: page/section enter (opacity + translateY 4px, 0.3s ease); micro-interactions (mygtuko paspaudimas scale(0.98) jau yra — išplėsti ten, kur trūksta).
- **MU6.** Dark mode pilna peržiūra: visos spalvos ir šešėliai dark theme; optional prefers-color-scheme pradžiai.
- **MU7.** Responsive: 640px ir 768px breakpoint'ai peržiūrėti; galimi tarpiniai (tablet) ir didesni ekranai (max-width + centravimas).

---

## Santrauka

- **Stiprybės:** SOT-driven tema ir copy, aiški CTA hierarchija, Inter tipografika, pagrindinė spalvų ir tokenų sistema, sticky nav ir two-column layout.
- **Silpnosios:** Per daug inline stilių, nenuoseklus border-radius ir šešėlių naudojimas, trūksta mažų UI komponentų ir tipografijos skalės, dalis mikro detalių (hover, focus, transition) ne visur.
- **Prioritetas pagal ROI:** Pirmiausia Quick Wins (radius, transition, focus-visible, shadow-sm kortelėms) — mažas laiko sąnaudas, didelis vizualinio ir jausmo pagerinimas; tada Medium — Button/Card abstrakcijos ir tipografija; Major — pilnas refaktorius ir design system.

---

*Dokumentas atnaujintas pagal nt-broker-ui src ir style.css būseną 2026-03-16. SOT ir AGENTS.md taisyklės laikomos.*
