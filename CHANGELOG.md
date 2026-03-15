# Changelog

Formatas pagal [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), versijavimas – [Semantic Versioning](https://semver.org/).

## [Nereleisuota]

### Prideta
- **i18n (daugiakalbis UI):** Kalbos tipas `Locale = 'lt' | 'en' | 'es'`; locale nustatymas pagal `?lang=` → localStorage (`nt_broker_lang`) → `navigator.language` → fallback `lt`. Atskiri SOT failai `config/sot.lt.json`, `config/sot.en.json`, `config/sot.es.json`; `loadSot(locale)` krauna atitinkamą failą. Kalbos perjungiklis (LT | EN | ES) header'yje; `document.documentElement.lang` ir `document.title` atnaujinami pagal locale. Pilnas EN ir ES turinys (copy, modes, fieldMeta, libraryPrompts, rules) – `config/sot.en.json`, `config/sot.es.json`. Klaidos loadSot pagal locale – `LOAD_ERROR_STRINGS` lt/en/es.
- **SOT copy išplėtimas (Fazė 1):** Visi UI tekstai iš SOT: `copyErrorLabel`, `copyRetryLabel`, `copySuccess`, `copyFailed`, `btnCopy`, `rulesAriaLabel`, `themeToggleLabelLight`/`Dark`, `promptAnatomyLinkText`/`promptAnatomyAriaLabel`, `inputBlockLabel`, `footerDebugLabel`, `modalTemplatesTitle`, `btnUse`, `btnClose`, `selectPlaceholder`, `loadError404`, `loadErrorGeneric`. `fieldMeta` – laukas `options?: string[]` (select opcijoms, pvz. tonas).
- **localeUtils.ts:** `getInitialLocale()`, `persistLocale(locale)` (localStorage + URL query), `LOCALE_STORAGE_KEY`.
- **copy-sot.cjs:** Kopijuoja `config/sot.json` → `public/config/sot.lt.json`; jei yra – `config/sot.en.json`, `config/sot.es.json` → `public/config/`.
- **docs/I18N_READINESS_ASSESSMENT.md:** Skyrius 8 „Įgyvendinimas (2026-03)“ – Fazė 1 ir Fazė 2 aprašas; K1–K6 pažymėti kaip patenkinami.
- **SOT (config/sot.json):** `fieldMeta` – laukų etiketės ir tipai (text/textarea/select) formoms; `modesOrder` – garantuota režimų eilė; `libraryPromptId` režimams (skelbimas, komunikacija, derybos, analizė).
- **nt-broker-ui:** `FieldMetaItem` ir `modesOrder` / `fieldMeta` tipai (sot/types.ts); defaultSot su fieldMeta ir modesOrder.
- **SotContext:** `retryLoad()` – SOT pakrovimo pakartojimas po klaidos.
- **loadSot:** validacija po JSON (modes, theme.light/dark, copy); netinkamas atsakas – fallback į defaultSot ir console.warn.
- **ModeForm** (components/ModeForm.tsx) – dinaminė forma pagal `currentMode.fields` ir `fieldMeta`; text/textarea/select (tonas: premium, neutralus, draugiškas).
- **Generavimas:** mygtukas „Generuoti promptą“ – bazinis šablonas pagal `libraryPromptId` + blokas „INPUT (užpildyta)“ iš formos; išvesties blokas su mygtuku „Kopijuoti“ ir feedback „Nukopijuota“.
- **LibraryPromptsModal** (components/LibraryPromptsModal.tsx) – šablonų sąrašas, Kopijuoti/Naudoti, role="dialog", Escape/overlay uždarymas.
- **Rules blokas** App – SOT `rules` sąrašas su CheckCircle ikonomis.
- **E2E:** testai naudoja `data-testid` (mode-*, cta-generate, cta-templates); naujas testas „templates CTA opens library modal“.
- **docs/UX_COPY_AUDIT.md** – micro UI, UX, vartotojo kelionės ir copy auditas; trinties mažinimo pastabos (tik atspalviai/gradientai).
- **docs/INDEX.md** – nuoroda į UX_COPY_AUDIT.md.
- **Premium vizualinio dizaino iteracijos (P1–P3):**
  - **SOT tema:** semantinės spalvos `--success`, `--error`, `--error-bg`; elevation `--shadow-sm`, `--shadow-md`, `--shadow-lg` (light/dark) – config/sot.json, defaultSot.
  - **style.css:** mygtukų klasės `.btn-primary`, `.btn-secondary`, `.btn-ghost`, `.btn-nav`, `.btn-output-copy` su hover ir transition; `:focus-visible` (outline 2px var(--primary)) button, a, input, textarea, select; loading `.spinner` + `@keyframes spin`.
  - **SOT copy:** `activeModeLabel` (LT/EN/ES); SOT root `showDebugInFooter`; tipai SotCopy.activeModeLabel, Sot.showDebugInFooter.
  - **App loading:** spinner + loadingLabel, `aria-live="polite"`, `role="status"`.
  - **Copy feedback (App):** state `{ message, type: 'success'|'error' }`; success – žalia spalva + Check ikona; error – raudona; `aria-live="polite"`.
  - **LibraryPromptsModal:** copy feedback state (copyFeedbackItemId, copyFeedbackType), 2 s inline „Nukopijuota“/copyFailed; copy prop `copySuccess`, `copyFailed`.
  - **Tipografika:** Inter (Google Fonts) – index.html link, :root ir App fontFamily.
- **Tradicinis footer ir Prompt Anatomy / kontaktai:** Semantinis `<footer>` main pabaigoje su border-top, nuoroda į https://www.promptanatomy.app/, kontaktai (mailto: info@promptanatomy.app), pasteikė (Spin-off Nr. 7); tema toggle ir debug (sąlyginai) – footeryje. SOT copy: `contactEmail`, `footerContactLabel`, `footerCredit` (LT/EN/ES) – config/sot.json, sot.en.json, sot.es.json; types (SotCopy) ir defaultSot atnaujinti. E2E testas „footer has Prompt Anatomy link and contact email“. docs/PREMIUM_UX_UI_DEEP_DIVE.md ir planas atnaujinti.

### Pakeista
- **App:** režimų sąrašas pagal `modesOrder` (fallback į Object.keys); klaidos bloke mygtukas „Bandyti dar kartą“ (retryLoad); režimų mygtukai ir CTA su `data-testid` (mode-{id}, cta-generate, cta-templates); integruota ModeForm, generavimo handleris, išvesties blokas, LibraryPromptsModal. **i18n:** visi tekstai (klaida, retry, copy feedback, btnCopy, rules aria-label, tema, prompt anatomy, footer, inputBlockLabel) – iš `sot.copy`; kalbos perjungiklis (LT | EN | ES) header'yje; `useEffect` nustato `document.documentElement.lang` ir `document.title` pagal locale.
- **SotContext:** teikia `locale` ir `setLocale`; `load(locale)` – SOT kraunamas pagal locale; pradinis locale iš `getInitialLocale()`.
- **loadSot:** priima `locale: Locale`; krauna `config/sot.${locale}.json`; klaidos iš `LOAD_ERROR_STRINGS[locale]`.
- **LibraryPromptsModal:** optional prop `copy` (modalTemplatesTitle, btnCopy, btnUse, btnClose); visi modalų tekstai iš SOT.
- **ModeForm:** select opcijos iš `fieldMeta[fieldId].options`; pašalintas hardcoded `TONAS_OPTIONS`; optional `selectPlaceholder` prop; palaikomas bet kuris select laukas.
- **SOT tema (config/sot.json, nt-broker-ui/public/config/sot.json):**
  - Light: švelnesni atspalviai (primary #1E4A8C, text-light #5C6370, border #DDE2E8); **gradientai** – `--surface-0` ir `--surface-1` kaip vertikalūs šviesūs gradientai.
  - Dark: švelnesnis mėlynumas (primary #4E7AEE), tekstas #F2F4F7, text-light #8B92A0; **gradientai** – `--surface-0` ir `--surface-1` kaip tamsūs gradientai.
  - **colors** ir **cta** atspalviai suderinti su nauja palete (deepBlue, navy, steelGrey, primary/secondary CTA).
- **nt-broker-ui/src/style.css:** fallback spalvos ir gradientai prieš SOT pakrovimą suderinti su SOT (tamsus/šviesus režimas pagal `prefers-color-scheme`), kad nebūtų ryškaus šuolio nuo Vite default #242424.
- **nt-broker-ui/src/style.css (body layout):** `place-items: center` pakeista į `flex-direction: column` ir `align-items: stretch`, kad puslapis prasidėtų nuo viršaus – pirmame ekrane matomas hero (header), po juo sticky nav, tada main; sticky nav neuzdengia pagrindinio bloko iš pradžių.
- **Premium vizualinio dizaino iteracijos (P1–P3):**
  - **App:** visi pagrindiniai mygtukai su className (btn-primary, btn-secondary, btn-ghost, btn-nav, btn-output-copy); klaidos blokas – fonas `var(--error-bg)`, tekstas/border `var(--error)`; nav/output/aktyvus tab – boxShadow iš SOT (--shadow-sm, --shadow-md); footer debug rodomas tik kai `sot.showDebugInFooter !== false`; „Aktyvus režimas“ iš `copy.activeModeLabel`; badge – `background: var(--accent-gold)`; fontFamily `'Inter', system-ui`.
  - **LibraryPromptsModal:** mygtukai su btn-primary, btn-secondary, btn-ghost; overlay `transition: opacity 0.2s ease`; content boxShadow `var(--shadow-lg)`.
  - **defaultSot:** theme papildytas --success, --error, --error-bg, --shadow-sm/md/lg; copy.activeModeLabel; showDebugInFooter: true.
  - **config/sot.en.json, config/sot.es.json:** activeModeLabel (EN/ES), showDebugInFooter: true.

---

## [1.0.0] – 2026-03-08 (arba atitinkama release data)

### Prideta
- NT broker operacinė sistema (nt-broker-ui) – React + Vite.
- SOT konfigūracija (config/sot.json): brand, copy, modes, theme, libraryPrompts, rules.
- Režimai: Objektas, Skelbimas, Komunikacija, Derybos, Analizė.
- Tema light/dark per SOT; copy ir spalvos valdomi iš SOT.
