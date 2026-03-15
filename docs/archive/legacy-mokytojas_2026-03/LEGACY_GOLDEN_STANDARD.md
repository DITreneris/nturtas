# Legacy Golden Standard - DI Pamoku Kurejas (mokytojas)

**Tikslas:** fiksuoti stabilu atskaitos taska po pirmo sekmingo CI + Deploy i `DITreneris/mokytojas`.

**Statusas:** Legacy  
**Data:** 2026-03-05  
**Branch:** `main`  
**Commit:** `8f4ec82`  
**Repo:** `https://github.com/DITreneris/mokytojas`

## Release signalas (fiksuotas)

- CI: `CI #1` - green.
- Deploy: `Deploy to GitHub Pages #1` - green.
- Kokybes vartai praeiti: `npm run test:mixed`.

## Fiksuotas scope (nekeiciamas be naujo standarto)

- Runtime failai: `index.html`, `privatumas.html`, `style.css`, `generator.js`, `copy.js`, `config/sot.json`.
- Kokybes failai: `tests/structure.test.js`, `tests/e2e/smoke.spec.js`, `tests/e2e/core-flow.spec.js`, `tests/docs-hygiene.test.js`, `playwright.config.js`.
- CI/Deploy failai: `.github/workflows/ci.yml`, `.github/workflows/deploy.yml`.
- Dokumentacijos vartai: `README.md`, `docs/INDEX.md`, `AGENTS.md`.

## Minimali taisykle nuo sios busenos

- Si busena laikoma legacy baze.
- Jei daromi pakeitimai po sio tasko, jie turi kurti nauja baseline (naujas commit + nauja data siame archyve).
- Archyviniai failai neatnaujinami, nebent explicit atveriama nauja revizija.
