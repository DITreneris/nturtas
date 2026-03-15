# Changelog

Formatas pagal [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), versijavimas – [Semantic Versioning](https://semver.org/).

## [2.1.0] – 2026-03-15

### Pridėta
- **Hero card dizainas:** gradient fonas, 2 badge'ai (Promptų anatomija + Spin-off), onboarding žingsniai hero viduje, CTA mygtukai hero viduje.
- **Operacijų centras:** numeruota ikona, pavadinimas, subtitras -- kortelės stilius kaip mokytojas.
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

## [Nereleisuota]

### Pataisyta
- **defaultSot.ts -- pilnas fallback:** pridėti `libraryPrompts` (4 šablonai), `rules` (4 taisyklės), `colors` ir `cta` sekcijos iš `config/sot.json`; jei SOT nepasikrauna, vartotojas mato pilną UI, ne tuščias sekcijas.
- **Hardkoduoti LT fallback'ai pašalinti:** ~25 vietos `App.tsx` ir 6 vietos `LibraryPromptsModal.tsx` -- visi `?? 'Kopijuoti'` tipo fallback'ai pakeisti `defaultSot.copy` nuorodomis; EN/ES vartotojai nebematys lietuviškų tekstų jei konfigūracija nepasikraus.
- **Modal focus trap (WCAG 2.1 AA):** `LibraryPromptsModal` -- Tab/Shift+Tab ciklas tarp focusable elementų; auto-focus atidarius; fokuso grąžinimas į trigger elementą uždarant.
- **setTimeout cleanup:** `App.tsx` ir `LibraryPromptsModal.tsx` -- `useRef` + `clearTimeout` vietoj nevaldomų `setTimeout`; pašalinta state update ant unmounted komponento rizika.
- **loadSot.ts error handling:** sukurta `SotLoadError` klasė su `instanceof` tikrinimu vietoj trapio string prefix matching; non-404 klaidos pranešimas naudoja locale-aware `errors.generic` vietoj hardkoduoto LT.
- **main.tsx:** `document.getElementById('app')!` pakeistas null check su aiškiu error.
- **isValidSot stiprinimas:** pridėti `modesOrder` (Array.isArray) ir `fieldMeta` (typeof object) tikrinimai.
- **localeUtils.ts SSR guard:** `persistLocale` apgaubtas `typeof window === 'undefined'` guard analogiškai kitoms funkcijoms.
- **loadSot.test.ts:** atnaujintas testas 500 klaidos scenarijui (tikrina `errors.generic`, ne hardkoduotą `Klaida 500`).

### Pašalinta
- **Dead CSS:** `.logo`, `.logo.vanilla`, `.card`, `.read-the-docs` (Vite template likučiai); `text-align: center` iš `#app`; `.read-the-docs` iš light mode media query.
- **Dead failas:** `typescript.svg` (Vite template, neimportuotas).
- **Dead tipai:** `SotCopy.recommendedFieldsHint` ir `SotCopy.modeFieldsGroupLabel` (nenaudojami).
- **Nereikalingas `typeof console` check:** `loadSot.ts` supaprastintas iki tiesioginio `console.warn(...)`.

### Pakeista
- **Array keys:** `App.tsx` onboardingSteps ir rules sąrašuose `key={i}` pakeisti į content-derived keys (`key={step}`, `key={rule.text}`).
- **Dokumentacija sinchronizuota su kodu:**
  - `docs/roadmap.md` -- 5 įgyvendinti items perkelti į „Įgyvendinta"; likę: forma/rezultatas, poliravimas.
  - `README.md` -- roadmap sekcija sinchronizuota su roadmap.md.
  - `docs/INDEX.md` -- SOT build path atnaujintas (locale-based failai); pridėtas `localeUtils.ts`; `LT_EN_UI_UX_REPORT.md` klasifikuotas kaip archyvas.
  - `CHANGELOG.md` -- sujungti dubliuoti `### Pakeista`; `[Nereleisuota]` išleista kaip `[2.0.0]`.
- **`nt-broker-ui/package.json`:** versija `0.0.0` → `2.0.0`.
- **`LT_EN_UI_UX_REPORT.md`:** perkeltas iš root į `docs/archive/` (kito projekto dokumentas).

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
