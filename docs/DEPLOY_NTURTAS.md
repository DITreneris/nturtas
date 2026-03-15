# Deploy į nturtas (cold fresh repo)

Repozitorija paruošta deploy į [DITreneris/nturtas](https://github.com/DITreneris/nturtas). Production URL: **https://ditreneris.github.io/nturtas/**.

## Kas paruošta

- **Vite** `nt-broker-ui/vite.config.ts`: `base: '/nturtas/'`
- **Playwright** ir **package.json** `test:e2e`: BASE_URL / wait URL – `http://127.0.0.1:4173/nturtas/`
- **.github/workflows/deploy.yml**: build nt-broker-ui, deploy `nt-broker-ui/dist` į GitHub Pages
- **.github/workflows/ci.yml**: testai su BASE_URL `/nturtas/`

## Žingsniai (pirmas deploy)

1. **Naujas repo nturtas** – jau sukurtas (tuščias) [github.com/DITreneris/nturtas](https://github.com/DITreneris/nturtas).

2. **Nukopijuoti kodo bazę** į nturtas (pvz. iš 07_NT_brokeris):
   - Įsitikinti, kad yra `config/sot.json`, `config/sot.en.json`, `config/sot.es.json` (repo root).
   - Įsitikinti, kad yra `nt-broker-ui/`, `.github/workflows/`, `package.json`, `playwright.config.js`, `tests/`, `docs/` ir kita reikalinga struktūra.

3. **GitHub nturtas → Settings → Pages**
   - Build and deployment: **GitHub Actions**.

4. **Push į `main`**
   - Workflow „Deploy to GitHub Pages“ paleidžia testus, buildina nt-broker-ui ir deployina.
   - Po sėkmės: **https://ditreneris.github.io/nturtas/**.

## Lokalus tikrinimas prieš push

```bash
npm ci
cd nt-broker-ui && npm ci && npm run build
npm run test:e2e
```

Preview su base path: `cd nt-broker-ui && npm run preview` → atidaryti http://localhost:4173/nturtas/
