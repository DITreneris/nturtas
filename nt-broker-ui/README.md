# NT Broker UI (React + SOT)

React aplikacija „DI Operacinė Sistema NT Brokeriui“. Konfigūracija ir turinys valdomi iš **config/sot.json** (SOT).

## Lokalus paleidimas

```bash
npm install
npm run dev
```

Atidarykite naršyklėje adresą, kurį rodo Vite (su `base: '/nturtas/'` – dev pvz. `http://localhost:5173/nturtas/`).

## Build

```bash
npm run build
```

Rezultatas – `dist/`. SOT failas kopijuojamas iš `public/config/sot.json`.

## GitHub Pages

- **base path** – `vite.config.ts`: `base: '/nturtas/'` (deploy į [nturtas](https://github.com/DITreneris/nturtas) → `https://ditreneris.github.io/nturtas/`).
- SOT kraunamas per `fetch(\`${import.meta.env.BASE_URL}config/sot.${locale}.json\`)` – veikia ir dev, ir production.
- Deploy: `.github/workflows/deploy.yml` buildina nt-broker-ui ir deployina `dist/` į GitHub Pages (repo Settings → Pages → GitHub Actions).

## SOT naudojimas

- **SotProvider** – pakrauna SOT app root lygmenyje (fetch su fallback).
- **useSot()** – grąžina `{ sot, loading, error }`. Režimai, copy, theme skaitomi iš `sot`.
