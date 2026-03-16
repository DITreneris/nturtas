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

- [README.md](../README.md) – pradžios taškas.
- [INDEX.md](INDEX.md) – kanoninis dokumentacijos indeksas.
- [AGENTS.md](../AGENTS.md) – vaidmenimis pagrįstos darbo ir kokybės taisyklės (SOT atitiktis).
- [CHANGELOG.md](../CHANGELOG.md) – pakeitimų istorija (Keep a Changelog, SemVer).
- [docs/roadmap.md](roadmap.md) – UI/UX iteracijų roadmap (įgyvendinta + tolesnė eilė).
- [docs/DEPLOY_NTURTAS.md](DEPLOY_NTURTAS.md) – deploy į nturtas (GitHub Pages).
- [docs/STYLE_GUIDE.md](STYLE_GUIDE.md) – spalvų paletė ir stiliaus gidas.

## Kodo navigacija

- [config/sot.json](../config/sot.json) – SOT konfigūracija.
- **nt-broker-ui:** [README](../nt-broker-ui/README.md), [App.tsx](../nt-broker-ui/src/App.tsx), [sot/](../nt-broker-ui/src/sot/) (SotContext, loadSot, types, defaultSot).
- **Testai:** [e2e](../tests/e2e/nt-broker-ui.spec.js); unit: `cd nt-broker-ui && npm run test`.

## Archyvas

- [archive/pre-github-cleanup_2026-03/](archive/pre-github-cleanup_2026-03/)
- [archive/legacy-mokytojas_2026-03/](archive/legacy-mokytojas_2026-03/)
- [archive/legacy-di-promptu-biblioteka_2026-02/](archive/legacy-di-promptu-biblioteka_2026-02/)
- [archive/legacy-vaizdo-generatorius_2026-02/](archive/legacy-vaizdo-generatorius_2026-02/)
- [archive/LT_EN_UI_UX_REPORT.md](archive/LT_EN_UI_UX_REPORT.md) – kito projekto ataskaita.

Dokumentai `docs/` kataloge, neįvardinti čia (pvz. CODEBASE_ANALYSIS, ataskaitos, auditu dokumentai), laikomi archyvu – naudoti tik istorinei nuorodai.
