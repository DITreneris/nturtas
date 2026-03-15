# Micro UI, UX, vartotojo kelionės ir copy auditas (NT Broker)

**Data:** 2026-03-08  
**Apimtis:** micro UI/UX, vartotojo kelionė, copy auditas, trinties mažinimas.  
**Ribojimas:** tik atspalvių ir gradientų pakeitimai – kodo, logikos ir turinio nekeičiame.

---

## 1. Micro UI auditas

| Elementas | Būsena | Pastaba |
|-----------|--------|---------|
| **Header** | Vienas blokas, badge + h1 + subtitle | Aiški hierarchija; badge naudoja `--primary-light` fone. |
| **Navigacija (režimai)** | Sticky, horizontal scroll, mygtukai | Aktyvus režimas – primary spalva, neaktyvus – text-light; vizualiai atskirta. |
| **CTA mygtukai** | Pirminis (primary) + antrinis (outline) | Spalvos iš SOT (var(--primary)); hover nėra stilizuotas per theme. |
| **Tema (light/dark)** | Toggle apačioje | Veikia per SOT theme; perjungimo mygtukas vizualiai neakcentuotas. |
| **Klaidos blokas** | role="alert", viršuje | Naudoja --primary-light; aiškus. |
| **Nuoroda (Prompt anatomija)** | Po info tekstu | Pabraukta, primary spalva. |

**Trintis (vizualinė):** Spalvų paletė vienoda (mėlyna/aukso); galima suminkštinti kontrastą ir pridėti švelnius gradientus, kad UI atrodytų mažiau „plokščiai“ ir mažiau įtemptai.

---

## 2. UX auditas

- **Kelias į pirmą veiksmą:** Atėjimas → hero → režimo pasirinkimas → CTA „Generuoti promptą“. Kelias trumpas; trūksta formos (laukų), todėl vartotojas negali iš karto generuoti – tai žinoma trūkstama logika (ne vizualinė trintis).
- **Režimų pasirinkimas:** 5 mygtukai vienoje eilėje; mobiliai overflow-x: auto. Aišku, bet daug mygtukų – vizualiai galima atskirti aktyvų/neaktyvius švelnesniu atspalviu.
- **Informacijos sluoksnis:** „Aktyvus režimas: X – aprašas“ + heroCtaMeta – naudinga, bet užima vietą; vizualiai galima atskirti antrinę info švelnesne spalva (jau naudojama --text-light).
- **Temos perjungimas:** Apačioje, mažu mygtuku – funkcionalu, bet ne prioritetas; palikti kaip yra (nekeičiame logikos).

**Trinties mažinimas (tik spalvomis):** Švelnesni gradientai ir atspalviai sumažina vizualinį „šaltumą“ ir skatina skaityti/veikti.

---

## 3. Vartotojo kelionės auditas

1. **Atvykimas:** Puslapis su hero (pavadinimas, pozicionavimas, badge).
2. **Orientacija:** Subtitle paaiškina vertę (30–60 sek.); CTA meta „Sutaupyk iki 5 val.“.
3. **Pasirinkimas:** Režimų nav – Objektas, Skelbimas, Komunikacija, Derybos, Analizė. Default – Skelbimas.
4. **Veiksmas:** Du CTA – „Generuoti promptą“, „Peržiūrėti šablonus“ (be handlerių – žr. CODEBASE_ANALYSIS).
5. **Išėjimas / papildoma info:** Nuoroda į Prompt anatomiją; tema toggle.

**Trintis:** Kelionė logiška; copy aiškus. Vizualinė trintis – per „techniška“ arba per kontrastinga paletė; gradientai ir švelnesni atspalviai gali padaryti kelionę malonesnę.

---

## 4. Copy auditas

| Šaltinis | Turinys | Vertinimas |
|----------|---------|------------|
| **SOT copy** | heroTitle, heroSubtitle, heroCtaPrimary, heroCtaSecondary, heroCtaMeta, badge, promptAnatomyUrl | Viskas iš SOT; lietuvių kalba; aiškus CTA ir vertės pasiūlymas. |
| **App.tsx** | Fallback tekstai (heroTitle, badge, …) | Naudojami tik jei SOT nepakrautas; atitinka SOT. |
| **Hardkoduota** | „Tema: {theme}. SOT pakrautas…“, „Klaida: {error}“, „Aktyvus režimas:“, aria-label tema | Dev/info ir a11y; priimtina. „Aktyvus režimas“ galima būtų iš SOT (nepakeista – tik auditas). |

**Copy nuoseklumas:** Geras; vienas tiesos šaltinis (SOT). Turinio nekeičiame.

---

## 5. Trinties mažinimas (tik spalvos ir gradientai)

- **Spalvos (SOT theme):** Švelninti kontrastą – šiek tiek minkštesni primary, surface ir border atspalviai.
- **Gradientai:** Pridėti SOT theme kintamuosius gradientams (pvz. pagrindinio fono, header) – vienas blokas gali naudoti gradientą vietoj plokščios spalvos.
- **style.css (fallback):** Prieš SOT pakrovimą rodomas Vite default (#242424); suderinti fallback su SOT šviesiu/tamsiu tonu, kad nebūtų ryškaus „šuolio“.

---

## 6. Atlikti pakeitimai (tik atspalviai / gradientai)

- **config/sot.json** ir **nt-broker-ui/public/config/sot.json:**  
  - Theme `light` ir `dark`: švelnesni atspalviai, pridėti gradientų kintamieji (--surface-0, --surface-1 arba --page-bg, --header-bg), kur reikia – naudoti linear-gradient.
  - Galima palengvinti `--primary`, `--primary-hover`, `--border`, `--text-light` atspalvius.
- **nt-broker-ui/src/style.css:**  
  - :root fallback spalvas priderinti prie SOT (neutralūs pilki/mėlyni), kad prieš hidrataciją nebūtų ryškaus skirtumo.

Kodo, logikos ir turinio (copy) pakeitimų nėra.

---

**Vėlesnis žingsnis (2026-03):** Premium UX/UI iteracijos (hover, focus-visible, success/error spalvos, elevation, loading, badge accent-gold, Inter) įgyvendintos pagal [docs/PREMIUM_UX_UI_DEEP_DIVE.md](PREMIUM_UX_UI_DEEP_DIVE.md); detalės – [CHANGELOG.md](../CHANGELOG.md).
