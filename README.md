# DI Operacinė Sistema NT Brokeriui (Spin-off Nr. 7)

Profesionalūs NT promptai, skelbimai ir klientų komunikacija per 30–60 sek. Konfigūracija ir turinys valdomi iš **SOT** – `config/sot.json` (žr. `docs/INDEX.md`).

**Aktyvi aplikacija:** `nt-broker-ui` (React + Vite). Legacy root aplikacija (DI Pamokų Kūrėjas) – [archive/legacy-pamoku-kurejas_2026-03/](archive/legacy-pamoku-kurejas_2026-03/).

## Greita pradžia

```bash
cd nt-broker-ui && npm run copy-sot && npm run dev
```

Arba po build: `cd nt-broker-ui && npm run build && npm run preview`.

## Deploy į nturtas (GitHub Pages)

Repozitorija paruošta deploy į [DITreneris/nturtas](https://github.com/DITreneris/nturtas):

- **Vite base:** `/nturtas/` – Production URL: `https://ditreneris.github.io/nturtas/`
- **Deploy:** push į `main` paleidžia `.github/workflows/deploy.yml` – build nt-broker-ui, deploy `nt-broker-ui/dist` į GitHub Pages. Repo Settings → Pages → Source: **GitHub Actions**.
- **Būtina:** repo root turi turėti `config/sot.json`, `config/sot.en.json`, `config/sot.es.json` (copy-sot juos kopijuoja į nt-broker-ui build).

Pirmą kartą: nukopijuokite šią kodo bazę į nturtas, įjunkite Pages iš Actions, push į `main`.

## Dokumentacija ir kodo navigacija

`README.md` yra vienintelis įėjimo taškas. Visa tolesnė navigacija į dokumentaciją ir pagrindinius kodo failus vyksta per:

- [`docs/INDEX.md`](docs/INDEX.md)

## Vieno įėjimo taško politika

- Aktyvi dokumentacija laikoma tik per `README.md` ir `docs/INDEX.md`.
- Aktyvus dokumentų minimumas: `README.md`, `docs/INDEX.md`, `AGENTS.md`.
- Visi kiti dokumentai laikomi archyvu, jei jie nėra pažymėti kaip aktyvūs `docs/INDEX.md`.

## Roadmap

Tolesnė UI/UX iteracijų eilė – [docs/roadmap.md](docs/roadmap.md). Detalės – `.cursor/plans/footer_ir_ux_iteration_plan.md` (lokalus planas, ne repo).

1. **Stabilumas** – defaultSot ≈ SOT; OBJEKTAS be šablono – aiškus pranešimas; copy-sot `exit(1)` be šaltinio.
2. **Srauto aiškumas** – firstStepHint, generavimo be šablono pranešimas + CTA „Šablonai“, tema į header.
3. **Forma ir rezultatas** – lengva validacija 1–2 laukams; pasirinktinai „Generuoti dar kartą“ / „Redaguoti“.
4. **Mobilumas ir a11y** – Skip link, modalo focus trap, touch target patikra.
5. **Poliravimas** – skeleton loading, sutraukiamos taisyklės, papildomas aukso akcentas.

## Lean principai

- **Vienas tiesos šaltinis (SOT):** copy, režimai, tema, taisyklės – iš `config/sot.json`; UI nehardkina turinio.
- **Minimali dokumentacija:** įėjimas per `README.md` → `docs/INDEX.md`; aktyvūs dokumentai išvardinti vienoje vietoje; archyvas – viskas, kas ne INDEX.
- **Stage-gate:** Intake (Orchestrator) → Implement (Content + UI/UX) → Verify (QA) → Release readiness; žr. `AGENTS.md`.
- **Kokybės vartai:** `npm test`, reikiamai `test:e2e` ir build prieš release; CI – tiesos šaltinis.
- **Aiškumas prieš sudėtingumą:** vienas režimas – vienas tikslas; vienas pagrindinis CTA; hierarchija ir depth sistema (šešėliai, kontrastas) iš SOT.
