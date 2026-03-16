# Changelog

Formatas pagal [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), versijavimas – [Semantic Versioning](https://semver.org/).

## [2.1.0] – 2026-03-15

### Pridėta
- **Hero card dizainas:** gradient fonas, 2 badge'ai (Promptų anatomija + Spin-off), onboarding žingsniai hero viduje, CTA mygtukai hero viduje.
- **Operacijų centras:** numeruota ikona, pavadinimas, subtitras -- kortelės stilius.
- **Formos kortelė:** sekcijos header su ikona ir režimo pavadinimu, card container.
- **Output kortelė:** badge header (SUGENERUOTA UŽKLAUSA + mode badge + copy btn), didelis KOPIJUOTI CTA mygtukas.
- **Community CTA sekcija:** kortelė su antrašte, subtitru, WhatsApp + Promptų anatomija mygtukai.
- **Footer kortelė:** brand, tagline, kontaktai, feature badges, copyright.
- **SOT nauji laukai:** `communityTitle`, `communitySubtitle`, `communityCtaPrimary`, `communityCtaSecondary`, `privacyLabel`, `privacyUrl`, `outputBadgeLabel`, `outputCopyCtaLabel`, `footerBadges`.
- **CSS:** `.hero-card`, `.ops-center`, `.form-card`, `.output-card`, `.community`, `.footer-card`, `.tag`, responsive, dark mode.
- **Top bar:** navigacija su brand ir kalbos/temos mygtukais.

### Pakeista
- **App.tsx:** pilnas layout pertvarka -- hero, ops center, form card, output card, community, footer kortelės struktūra.
- **E2E testai:** atnaujinti selektoriai (WhatsApp ir PA link perkelti iš footer į community).
- **Unit testai:** atnaujintas WhatsApp link testas (footer → community).

## [2.2.0] – 2026-03-15

### Pakeista
- **Spalvų paletė (Fotocasa-inspired):** visa spalvų schema pakeista -- primary navy `#1B2A4A`, accent coral `#E83E5E` (vietoj auksinės), CTA mygtukai koraliniai su baltu tekstu, solidūs paviršiai (jokių gradientų).
- **SOT theme/colors/cta:** `config/sot.json`, `sot.en.json`, `sot.es.json`, `defaultSot.ts` -- naujos spalvos visomis kalbomis.
- **CSS fallback'ai:** visi senų spalvų fallback'ai (`#1E4A8C`, `#D4AF37`, `#B8962E`, gradientai) pakeisti naujais solidžiais; `.cta-button` ir `.output-cta` teksto spalva `#FFFFFF`.
- **Hero/Community bg:** gradientai pakeisti solidžiais navy/white spalvomis.
- **Dark mode:** naujos dark spalvos -- primary `#F06580` (coral light), surfaces `#0F1117`/`#1A1D27`, solidūs (ne gradientai).

### Pridėta
- **Stiliaus gidas:** `docs/STYLE_GUIDE.md` -- Fotocasa-inspired spalvų paletė, principai (solidūs paviršiai, aukštas kontrastas, rounded corners).
- **docs/INDEX.md:** pridėtas style guide nuoroda.

## [2.3.0] – 2026-03-15

### Pridėta
- **CTA į promptanatomy.app (low-hanging, subtiliai):**
  - Footer: spusteliama nuoroda „Promptų anatomija“ (prie credit eilutės ir po copyright).
  - Po sėkmingo kopijavimo: eilutė „Nori daugiau?“ + nuoroda į promptanatomy.app (rodoma ~2 s kartu su „Nukopijuota“).
  - Output bloke: „Sužinok daugiau apie promptus:“ + nuoroda po mygtuko KOPIJUOTI.
  - AI įrankių bloke: papildoma nuoroda „Mokykis promptų anatomijos →“.
  - Šablonų sekcijos (TemplatesInline) pabaigoje: „Šablonai iš [Promptų anatomija].“
- **SOT nauji copy laukai (LT/EN/ES):** `copySuccessCtaPrefix`, `outputLearnMorePrefix`, `aiToolLinksPromptAnatomyLabel`, `templatesSourcePrefix`.
- **Docs:** `docs/STYLE_GUIDE.md` įtrauktas į repozitoriją (docs hygiene – INDEX.md nuoroda validi).
- **CI:** `tests/premium-quality.test.js`, `tests/ux-kpi-thresholds.test.js`, `tests/premium-score-report.js`, `config/premium-score.json` įtraukti į repo, kad `npm run quality:premium` veiktų GitHub Actions.

### Pakeista
- **E2E:** footer testas tikrina Prompt Anatomy nuorodą footeryje; atskiras testas – community nuoroda po generate.

## [Nereleisuota]

### Pakeista
- **UI/UX realus tobulinimo planas (pagal .cursor/plans/ui_ux_realus_tobulinimo_planas.md):**
  - **Sticky navigacija:** top bar `position: sticky; top: 0` su `--top-bar-height`; režimų juosta (step1-nav) sticky po ja su `top: var(--top-bar-height)`; režimų tabai perkelti į CSS klasės `.step1-nav-inner`, `.step1-nav-tabs`.
  - **Mobile top bar ir tema:** temos mygtukas rodo tik Sun/Moon ikoną (lucide-react), pilnas tekstas tik `aria-label`/`title`; mobile (≤640px) – mažesnis top bar padding, `.top-bar-brand` 0.875rem, mygtukams min-height/min-width 44px (touch target).
  - **Dizaino tokenai:** `:root` ir `.dark` su pilnais tokenais iš defaultSot (primary, surface, text, accent, `--on-primary*`, `--community-cta-bg/hover`); hero, output, badge, CTA, editable-output – spalvos per `var(--*)`; pašalintas `@media (prefers-color-scheme: light)` override; `.btn-output-copy:hover` ir likę hardcoded rgba pakeisti į tokenus.
  - **Spacing/typography:** `--space-1` … `--space-8`, `--text-xs/sm/base/lg`; top bar, step1-nav, form-card, ops-center, field-group, onboarding-steps, step1-block naudoja tokenus; locale mygtukų inline padding/fontSize pašalinti (liko fontWeight).
  - **Mobile touch ir scroll:** CTA, output-cta, form-cta-row, session-item mygtukai mobile min-height 44px; step1-nav `-webkit-overflow-scrolling: touch` ir dešinėje fade (::after); sesijų sąrašas su `.session-list`, `.session-item`, session mygtukai touch-friendly.
  - **Lygiuotė:** content wrapper pakeistas į klasę `.app-content-wrap` su `--content-max-width`, `padding: 0 var(--space-4)`; top bar naudoja tą patį `--content-max-width`; mobile top bar horizontal padding sutapatintas su content (var(--space-4)).
- **UX roadmap P1-P3 įgyvendinimas (conversion-first):**
  - `App.tsx`: pašalintas modalinis templates kelias; hero/form antriniai CTA veda į inline templates (scroll + expand).
  - Output paliktas su vienu aiškiu primary copy veiksmu.
  - Režimų juostoje pridėtas `recommended start` signalas ir `Kada naudoti` helper tekstas.
  - Sesijose pridėtas `Atkurti` veiksmas (`restore to output`).
  - Taisyklės numatytai sutrauktos; community sekcija rodoma po pirmo generavimo.
- **Instrumentacija (P3):** įdiegtas UX event sluoksnis (`ntbroker:ux` + optional `dataLayer`) su `ttfc` ir pagrindiniais funnel eventais (`app_loaded`, `mode_selected`, `template_used`, `generate_clicked`, `output_copied_first`, `output_copied`, `session_saved`, `session_restored`, `session_copied`).
- **Testai:** atnaujinti `unit` ir `e2e` scenarijai inline templates ir post-generate flow.
- **Dokumentacija:** `docs/PREMIUM_UX_UI_DEEP_DIVE.md` perrašytas į kanoninį `score engine` formatą su svoriais, KPI slenksčiais, `T0/T1` snapshot taisykle ir `Definition of Done` procentų kėlimui.
- **Low hanging fruits (realiai įjungta):**
  - `App.tsx`: rodomas `copy.firstStepHint` prieš formą.
  - `App.tsx`: footer tagline dabar skaitoma iš `copy.footerTagline` (fallback tik jei nėra rakto).
  - `App.tsx` + `style.css`: antriniai CTA vizualiai susilpninti ir aiškiau atskirti nuo primary; community CTA pažymėti external ikona.
- **Release quality vartai:** root `package.json` test pipeline papildytas `quality:premium` (SOT copy coverage, tokenų disciplina, required UX event'ai, hardcoded copy rizikų check) ir optional KPI slenksčių vartais per `UX_EVENTS_FILE`.
- **AI įrankių mygtukai (ChatGPT, Claude, Gemini):** perkelti į output-card, tiesiai po Kopijuoti mygtuko – atitinka FIRST_RUN_USER_JOURNEY_AUDIT §7 (output zonoje po pagrindiniu kopijavimo CTA).
- **CEO layout parity:** Two-column layout (forma kairėje, output dešinėje) desktop; output-card rodoma visada (empty state kol nėra generavimo); AI įrankių mygtukai matomi output zonoje iš karto; community (WhatsApp) sekcija rodoma visada, ne tik po generavimo.
- **UX hierarchija ir fokusas (docs/UX_HIERARCHY_FOCUS_PLAN.md):** Hero supaprastintas – vienas pagrindinis CTA, workflow (onboardingSteps) perkeltas po CTA ir heroCtaMeta; „Šablonų biblioteka“ kaip secondary (hero-cta-secondary, tekstinė nuoroda); STEP 1 blokas – ops-center ir režimų tabai suvienoti, antraštė iš SOT `step1Label` („1. Pasirink režimą“); padidintas whitespace ~40% (hero, ops-center, form-card, main-content-layout); SOT naujas copy `step1Label` (LT/EN/ES).
- **Tvarkymas 2026-03-16 (docs/ATASKAITA_2026-03-16.md):**
  - **Kokybės vartas:** `style.css` – `.step1-nav::after` `linear-gradient` pakeistas į solid `var(--surface-1)` (STYLE_GUIDE, `npm run quality:premium` praeina).
  - **TemplatesInline:** pridėta ikona `building-2` (Building2) – „Objekto analizės šablonas“ rodomas su pastato ikona.
  - **Kalbų perjungiklis (i18n/a11y):** kalbų grupės ir mygtukų `aria-label` skaitomi iš SOT – nauji copy laukai `languageGroupAriaLabel`, `localeLabelLt`, `localeLabelEn`, `localeLabelEs` (config/sot.json, sot.en.json, sot.es.json, defaultSot, types, App.tsx).
  - **loadSot:** pridėta `validateLibraryPrompts(sot)` – po pakrovimo tikrinama, ar režimų `libraryPromptId` atitinka `libraryPrompts[].id`; neatitikimo atveju `console.warn` (soft validacija).
- **Premium SaaS UI/UX audito įgyvendinimas (docs/PREMIUM_SAAS_UI_UX_AUDIT.md, 6 dalių planas):**
  - **1 dalis (CSS):** Design tokenai `--space-12`, `--space-14`, `--radius-button`, `--radius-card`, `--radius-card-sm`, `--radius-nested`; vienoda border-radius taisyklė (mygtukai 10px, kortelės 16px, nested 12px); transition 0.2s visiems `.btn-*`, `.cta-button`, `.output-cta`, `.community-cta-*`; vienodas `:focus-visible`; hero padding per tokenus; `.community`, `.footer-card` su `box-shadow: var(--shadow-sm)`; `.editable-output:focus` ring, `.top-bar-theme-btn` hover; `.char-count` per `--text-xs`.
  - **2 dalis (App.tsx mikro):** Loading blokas su tokenais ir `.loading-spinner`; error blokas su `border-radius`, tokenais; locale mygtukai per `Button`, padding tokenais; rules toggle su `.rules-toggle-btn`; session mygtukai per `Button` ir `.session-item-btn`/`.session-item-btn-delete`; copy feedback ir no-template alert su tokenais.
  - **3 dalis:** `.templates-inline-item` (radius 10px, shadow-sm); output/mode badge palaikymas.
  - **4 dalis (Button):** Naujas `components/Button.tsx` su variantais `primary | secondary | ghost | nav`; naudojamas locale, retry, rules toggle, session mygtukai, sessions Save/Delete All, no-template CTA, TemplatesInline expand/Copy/Use.
  - **5 dalis (tipografija ir 8pt grid):** Tokenai `--text-hero`, `--text-h1`, `--text-h2`, `--text-caption`; hero, h1, form-card-header, community, skip-to-content, operation-center-label, editable-output per tokenus; `docs/STYLE_GUIDE.md` papildytas tipografijos skale ir 8pt tinklelio aprašu.
  - **6 dalis (Card, šešėliai, loading):** `form-card`, `ops-center`, `templates-inline-item` su `box-shadow: var(--shadow-sm)`; naujas `components/Card.tsx` (variantai `form | output | community | footer`, `as`: div/section/footer); form, output, community, footer naudoja `<Card variant="…">`; `.session-item` su vienodu padding, radius, shadow; loading bloke spinner 40px (`.loading-block .loading-spinner`).
- **UX konversijos audito įgyvendinimas (docs/USER_JOURNEY_UX_CONVERSION_AUDIT.md, planas QW1–QW7, MW1–MW7):**
  - **Fazė 1 (Quick Wins):** Hero – vienas primary CTA, „Šablonų biblioteka“ secondary (link stilius, `data-testid="cta-templates"`); onboarding žingsniai po CTA/meta su optional antrašte `onboardingStepsTitle` („Kaip naudoti“); virš output – aiškus `outputUseHint` („Įklijuok į ChatGPT arba Claude – gausi paruoštą tekstą.“); empty hint virš formos kai dar nėra generavimo (`emptyGenerateHint`); „Rekomenduojama pradžia“ pill ryškesnė (accent fonas, WCAG); Rules („Ką gausite“) pirmą sesiją default expanded, po sutraukimo – `localStorage` `nt_broker_rules_seen`; footer – kai `privacyUrl` tuščias, rodomas `privacyComingSoonLabel`.
  - **Fazė 2 (Medium):** Step 2/3 žymėjimas – form card „2“ + `step2Label`, output card „3“ + `step3Label`; formoje recommended laukams – `fieldRecommendedSuffix` („ (Rekomenduojama)“) per ModeForm; testimonial blokas (rodomas jei `testimonialQuote` neuštuščiąs); tema persist – `nt_broker_theme` (light|dark) localStorage; mobile (≤768px) sticky CTA bar apačioje (Generuoti / Kopijuoti); po pirmo sėkmingo copy – `copySuccessNextHint` (vieną kartą).
  - **SOT:** nauji copy raktai `outputUseHint`, `onboardingStepsTitle`, `step2Label`, `step3Label`, `fieldRecommendedSuffix`, `testimonialQuote`/`testimonialAuthor`/`testimonialRole`, `copySuccessNextHint`, `privacyComingSoonLabel` (config/sot.json, types, defaultSot). App.test.tsx – rules testas atnaujintas (default expanded pirmą kartą).

### Pridėta
- **UI/UX tobulinimo planas:** `.cursor/plans/ui_ux_realus_tobulinimo_planas.md` – Nepriimtina kriterijai, sticky nav, mobile top bar/tema, design tokenai, spacing scale, touch targets, scroll hint, dokumentų nuorodos; `docs/PREMIUM_UX_UI_DEEP_DIVE.md` – skyrius „Implementation status (layout / navigation / mobile)“; `docs/UX_HIERARCHY_FOCUS_PLAN.md` ir `docs/INDEX.md` – nuorodos į planą.
- **CSS:** `--content-max-width: 72rem`, `.app-content-wrap`; `.top-bar-theme-btn`; `.step1-nav-inner`, `.step1-nav-tabs`; `.session-list`, `.session-item`.
- `config/premium-score.json`: premium vertinimo svoriai, KPI threshold'ai, privalomi UX event'ai ir leidžiamų copy išimčių sąrašas.
- `tests/premium-quality.test.js`: automatinis premium quality gate scriptas.
- `tests/ux-kpi-thresholds.test.js`: KPI slenksčių tikrinimas pagal event export (`JSON` arba `JSONL`).
- `package.json` scriptai:
  - `quality:premium`
  - `quality:premium:events`
- `SotCopy` raktai: `sessionRestoreLabel`, `recommendedStartLabel` (`types`, `defaultSot`, `config/sot.json`).
- **2026-03-16:** SOT copy kalbų a11y/i18n – `languageGroupAriaLabel`, `localeLabelLt`, `localeLabelEn`, `localeLabelEs` (config/sot.json, sot.en.json, sot.es.json, defaultSot, types).
- **Premium SaaS UI/UX (6 dalių planas):** `nt-broker-ui/src/components/Button.tsx` (variantai primary/secondary/ghost/nav); `nt-broker-ui/src/components/Card.tsx` (variantai form/output/community/footer, `as` div|section|footer); CSS klasės `.rules-toggle-btn`, `.loading-spinner`, `.loading-block .loading-spinner`, `.session-item`, `.session-item-btn`, `.session-item-btn-delete`, `.templates-inline-item`, `.error-block`, `.copy-feedback-block`, `.no-template-alert`; tipografijos tokenai `--text-hero`, `--text-h1`, `--text-h2`, `--text-caption`; 8pt grid ir tipografijos skalė `docs/STYLE_GUIDE.md`.

### Pašalinta
- `nt-broker-ui/src/components/LibraryPromptsModal.tsx` (nebenaudojamas aktyviame UX sraute).

---

## [2.0.0] – 2026-03-15

### Prideta
- **Pilnas UX upgrade (P1+P2+P3) iš seserinių produktų analizės:**
  - **AI įrankių nuorodos:** Naujas `aiToolLinks` masyvas SOT root (ChatGPT, Claude, Gemini); po output generavimo rodomi mygtukai su nuorodomis; SOT copy `aiToolLinksLabel`.
  - **Redaguojamas output:** `<pre>` pakeistas į `<textarea>` su klase `.editable-output`; vartotojas gali redaguoti sugeneruotą prompt prieš kopijavimą.
  - **Simbolių skaitliukas:** Po output, šalia Copy mygtuko, rodomas simbolių skaičius; SOT copy `charCountLabel` su `{{count}}` placeholder.
  - **Operacinis centras:** Nauja sekcija tarp header ir nav – „NT brokerio centras" su sub-etikete; SOT copy `operationCenterLabel`, `operationCenterSubLabel`.
  - **Skip-to-content (a11y):** Pirmas elementas App viduje – nerodoma vizualiai, matoma su Tab focus; SOT copy `skipToContentLabel`; `id="main-content"` ant main elemento.
  - **Footer praturtinimas:** `footerTagline` (bold viršutinė eilutė), WhatsApp nuoroda (`whatsappUrl`, `whatsappLabel`), `footerCopyright` apatinė eilutė; naujos CSS klasės `.footer-tagline`, `.footer-links`, `.footer-copyright`.
  - **Laukų konvertavimas į select:** 12 text laukų (objektoTipas, kambariai, būklė, platforma, strategija, ilgis, klientoTipas, situacija, ctaTipas, derybuTikslas, auditorija, turinioTipas) konvertuoti į select su SOT options.
  - **Nauji laukai:** `statybosMetai`, `aukštas`, `šildymas`, `įrengimas` – visi select su options; įtraukti į visų režimų „Objekto duomenys" fieldGroups.
  - **types.ts:** `AiToolLink` interface; `SotCopy` papildyta 9 naujais laukais; `Sot.aiToolLinks`.
  - **defaultSot.ts:** Sinchronizuota su sot.json – nauji fieldMeta, fieldGroups, aiToolLinks, copy raktai.
  - **i18n:** Visi nauji laukai, options ir copy raktai lokalizuoti EN (`sot.en.json`) ir ES (`sot.es.json`).
  - **style.css:** Naujos klasės: `.skip-to-content`, `.operation-center-label`, `.editable-output`, `.char-count`, `.ai-tool-links`, `.btn-ai-tool`, `.footer-tagline`, `.footer-links`, `.footer-copyright`.
  - **index.html:** Title atnaujintas į „NT Brokerio Asistentas".
  - **Testai:** 6 nauji unit testai App.test.tsx (AI links, editable output, char count, operation center, skip-to-content, WhatsApp footer); 4 nauji defaultSot testai (nauji laukai, aiToolLinks, copy raktai, select konversijos); 6 nauji E2E testai.

### Pakeista
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
- **Plotas ir kaina – scrollable select (LT, EN, ES):** `fieldMeta.plotas` ir `fieldMeta.kaina` – `type: "select"` su fiksuotais intervalais (plotas: iki 50/75/100/150/200 m², 200+ m²; kaina: iki 50k/75k/100k/150k/200k €, 200k+ €). Option tekstai lokalizuoti – config/sot.json (LT), sot.en.json (EN), sot.es.json (ES); defaultSot fallback su LT options.
- **firstStepHint:** SOT copy `firstStepHint` (LT/EN/ES) – viena eilutė virš formos, pvz. „Pasirink režimą ir užpildyk bent 1–2 laukus“; tipas SotCopy.firstStepHint; rodoma App virš formos (italic, text-light).
- **Sutraukiamos taisyklės:** Rules blokas – mygtukas „Taisyklės (N)“ su ChevronDown/ChevronUp, `aria-expanded`; sąrašas rodomas tik atidarius (numatyta – sutraukta). Sumažina vizualų triukšmą (roadmap Poliravimas).

- **Tema į header:** Tema (šviesus/tamsus) toggle perkeltas iš footeriaus į header – šalia kalbos perjungiklio (LT | EN | ES); footer liko be temos mygtuko (roadmap Srauto aiškumas).
- **Deploy į nturtas (GitHub Pages) pavyko.** CI pataisymai: horizontalus overflow mobilėj – `html`, `body`, `#app` ir root App konteineris su `overflow-x: hidden` / `width: 100%`; E2E naudoja `?lang=lt`, kad CI matytų lietuvišką copy; GitHub Pages actions – `actions/upload-pages-artifact@v3`, `actions/deploy-pages@v4` (versijos su `v` prefix).
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
