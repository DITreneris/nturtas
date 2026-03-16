# Dokumentacijos indeksas

Vienintelis dokumentacijos navigacijos mazgas po `README.md`.

## SOT (vienintelis tiesos šaltinis)

- **Produktas:** DI Operacinė Sistema NT Brokeriui (Spin-off Nr. 7).
- **Konfigūracija:** [config/sot.json](../config/sot.json) – brand, copy, režimai (modes), spalvos/theme, libraryPrompts, rules. UI ir turinys valdomi iš šio failo; nt-broker-ui jį naudoja per SotProvider / useSot.
- **Aktyvi aplikacija:** [nt-broker-ui](../nt-broker-ui/) – React + Vite; build naudoja locale-based SOT failus (`sot.lt.json`, `sot.en.json`, `sot.es.json`) iš `nt-broker-ui/public/config/`.

## Kanoninė taisyklė

- Aktyvus/archyvas statusas nustatomas tik šiame faile.
- Jei dokumentas nepaminėtas prie aktyvių, jis laikomas archyviniu.
- Archyvo failai neatnaujinami, nebent dokumentas grąžinamas į aktyvią zoną.

## Aktyvūs dokumentai (lean)

- [README.md](../README.md) - vienintelis pradžios taškas.
- [INDEX.md](INDEX.md) - kanoninis dokumentacijos indeksas.
- [AGENTS.md](../AGENTS.md) - vaidmenimis pagrįstos darbo ir kokybės taisyklės (SOT atitiktis).
- [CHANGELOG.md](../CHANGELOG.md) - pakeitimų istorija (Keep a Changelog, SemVer).
- [docs/roadmap.md](roadmap.md) - UI/UX iteracijų roadmap (įgyvendinta + tolesnė eilė).
- [docs/DEPLOY_NTURTAS.md](DEPLOY_NTURTAS.md) - deploy į nturtas (GitHub Pages), cold fresh repo checklist.
- [docs/STYLE_GUIDE.md](STYLE_GUIDE.md) - spalvų paletė ir stiliaus gidas (Fotocasa-inspired).

## Kodo navigacija per indeksą

- [config/sot.json](../config/sot.json) - SOT konfigūracija (brand, copy, modes, theme, libraryPrompts, rules).
- **nt-broker-ui (aktyvus UI):**
  - [nt-broker-ui/README.md](../nt-broker-ui/README.md)
  - [nt-broker-ui/src/App.tsx](../nt-broker-ui/src/App.tsx)
  - [nt-broker-ui/src/sot/](../nt-broker-ui/src/sot/) - SotContext, loadSot, localeUtils, types, defaultSot.
  - `nt-broker-ui/public/config/sot.{lt,en,es}.json` - SOT locale kopijos (generuojamos per `copy-sot`).
- **Testai:**
  - [tests/e2e/nt-broker-ui.spec.js](../tests/e2e/nt-broker-ui.spec.js) – nt-broker-ui E2E.
  - nt-broker-ui unit: `cd nt-broker-ui && npm run test`.
- **Analizė:** [docs/CODEBASE_ANALYSIS.md](CODEBASE_ANALYSIS.md) – kodo bazės analizė, bugai, tobulinimai.
- **Ataskaita 2026-03-16:** [docs/ATASKAITA_2026-03-16.md](ATASKAITA_2026-03-16.md) – šios dienos analizė: neatitikimai, kokybės vartas (linear-gradient), bug'ai (TemplatesInline ikona), UI/UX.
- **i18n paruoštumas:** [docs/I18N_READINESS_ASSESSMENT.md](I18N_READINESS_ASSESSMENT.md) – ar UI paruoštas kitomis kalbomis, kriterijai, rekomendacijos.
- **UX/Copy auditas:** [docs/UX_COPY_AUDIT.md](UX_COPY_AUDIT.md) – micro UI, UX, vartotojo kelionė, copy auditas, trinties mažinimas (tik atspalviai/gradientai).
- **Premium UX/UI gilus auditas:** [docs/PREMIUM_UX_UI_DEEP_DIVE.md](PREMIUM_UX_UI_DEEP_DIVE.md) – naujas gilus auditas: vartotojo kelionės, trintys, stabdžiai, OK/FAIL matrica ir KISS-MARRY-KILL prioritetizacija.
- **Premium SaaS UI/UX auditas (8 blokų):** [docs/PREMIUM_SAAS_UI_UX_AUDIT.md](PREMIUM_SAAS_UI_UX_AUDIT.md) – UI architektūra, tipografija, spalvos, šešėliai, komponentų nuoseklumas, vizualinė hierarchija, 25+ mikro pataisymai, Quick/Medium/Major planas.
- **UX hierarchija ir fokusas:** [docs/UX_HIERARCHY_FOCUS_PLAN.md](UX_HIERARCHY_FOCUS_PLAN.md) – 1 ekranas = 1 veiksmas, hero supaprastinimas, STEP 1/2/3 srautas, 5 greiti fixai.
- **Vartotojo kelionės ir konversijos UX auditas:** [docs/USER_JOURNEY_UX_CONVERSION_AUDIT.md](USER_JOURNEY_UX_CONVERSION_AUDIT.md) – First Impression, User Journey Map, Navigation, Value Communication, Conversion Path, Trust, Cognitive Load, 25+ mikro problemos, Quick/Medium/Strategic planas.
- **UI/UX realus tobulinimo planas:** [.cursor/plans/ui_ux_realus_tobulinimo_planas.md](../.cursor/plans/ui_ux_realus_tobulinimo_planas.md) – sticky nav, mobile top bar, tema ikona, design tokenai, touch targets, dokumentų nuorodos.

## Archyvas

- [archive/legacy-pamoku-kurejas_2026-03/](../archive/legacy-pamoku-kurejas_2026-03/) – buvusi root aplikacija (archyvas).
- [archive/pre-github-cleanup_2026-03/](archive/pre-github-cleanup_2026-03/)
- [archive/legacy-mokytojas_2026-03/](archive/legacy-mokytojas_2026-03/) – seserinio projekto archyvas.
- [archive/legacy-di-promptu-biblioteka_2026-02/](archive/legacy-di-promptu-biblioteka_2026-02/)
- [archive/legacy-vaizdo-generatorius_2026-02/](archive/legacy-vaizdo-generatorius_2026-02/)
- [docs/archive/LT_EN_UI_UX_REPORT.md](archive/LT_EN_UI_UX_REPORT.md) – kito projekto (DI Operacinis Centras) ataskaita.
