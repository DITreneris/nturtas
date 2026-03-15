# Gilus UI/UX ir premium SaaS jausmo auditas (NT Broker)

**Data:** 2026-03-15  
**Apimtis:** Vartotojo kelionė, OK/fail būsenos, mikro kopija, spalvos, gradientai, šešėliai, trintis, rekomendacijos siekiant „premium SaaS“ jausmo.

---

## 1. Vartotojo kelionė (User Journey)

### 1.1 Dabartinė srauto mapa

| Etapas | Kas vyksta | Trintis / pastaba |
|--------|------------|-------------------|
| **1. Atvykimas** | Vartotojas atidaro app → mato hero (badge + h1 + subtitle). Kalbos perjungiklis (LT/EN/ES) viršuje dešinėje. | Hero aiškus; kalbos mygtukai maži (0.75rem), vizualiai ne prioritetas. |
| **2. Orientacija** | Subtitle: „Generuok profesionalius NT promptus… per 30–60 sek.“; po header nėra aiškaus „kas toliau“. | Vertės pasiūlymas matomas; trūksta vieno aiškaus „pirmo žingsnio“ (pvz. „Pasirink režimą žemiau“). |
| **3. Režimo pasirinkimas** | Sticky nav su 5 režimais (Objektas, Skelbimas, Komunikacija, Derybos, Analizė). Default – Skelbimas. | Aktyvus režimas vizualiai atskirtas (primary + šešėlis). Horizontalus scroll mobiliai – OK. |
| **4. Kontekst** | Tekstas: „Aktyvus režimas: **Skelbimas** – NT skelbimo kūrimas“ + heroCtaMeta. | „Aktyvus režimas:“ – hardkoduota lietuviškai (ne iš SOT). Antrinė info – text-light, gerai. |
| **5. Forma** | ModeForm su laukais iš `fieldMeta` (label + input/textarea/select). | Laukai be validacijos; nėra „required“, error message. Placeholder’ai iš SOT – gerai. |
| **6. Taisyklės** | Sąrašas su CheckCircle + rule.text. | Vizualiai šalutinis (text-light); a11y – rulesAriaLabel. |
| **7. Veiksmas** | Du CTA: „Generuoti promptą“, „Peržiūrėti šablonus“. Generuoti → output blokas; Šablonai → modalis. | Generavimas momentinis (nėra loading spinner); output atsiranda iš karto. |
| **8. Rezultatas** | Output blokas (pre + „Kopijuoti“ + copyFeedback tekstas). | Success/fail atsispindi tik tekstu („Nukopijuota“ / „Kopijuoti nepavyko“) – be semantinės spalvos ar ikonos. |
| **9. Išėjimas / papildoma** | Footer (semantinis `<footer>`): nuoroda „Promptų anatomija“ → promptanatomy.app, kontaktai mailto: info@promptanatomy.app, pasteikė (Spin-off Nr. 7), tema toggle; debug – tik kai `showDebugInFooter`. | Golden standard: vienas footer su nuoroda, kontaktais, pasteikė. |

### 1.2 Trinties taškai (kelionėje)

- **Pirmas veiksmas:** Kelias iki „Generuoti promptą“ trumpas, bet formoje daug laukų – vartotojas gali nesuprasti, ar būtina viską užpildyti (nėra inline hint ar progreso).
- **Kopijavimas:** Po sėkmingo kopijavimo – tik tekstas „Nukopijuota“ 2 s; nėra vizualios atgalinės nuorodos (ikona, spalva).
- **Klaidos:** SOT load klaida – aiškus alert blokas + „Bandyti dar kartą“. Formos klaidos (pvz. netinkamas formatas) – nėra (validacijos nėra).
- **Tema:** Toggle puslapio apačioje – sunku rasti; vizualiai neakcentuotas.

---

## 2. OK / Fail būsenos (Success & Error UX)

### 2.1 Kas įgyvendinta

| Būsena | Vieta | Įgyvendinimas | Vertinimas |
|--------|--------|----------------|------------|
| **Loading (SOT)** | App.tsx | `loadingLabel` („Kraunama...“), centruotas tekstas | ⚠️ Minimalu – nėra skeletono, spinnerio ar progreso. |
| **Klaida (SOT load)** | App.tsx | `role="alert"`, `--primary-light` fonas, copyErrorLabel + retry mygtukas | ✅ Gerai – aišku, veikia retry. |
| **Copy sėkmė** | App.tsx | `copySuccess` tekstas, 2 s timeout, tada null | ⚠️ Tik tekstas – nėra žalios spalvos, check ikonos, aria-live. |
| **Copy fail** | App.tsx | `copyFailed` tekstas, lieka kol vartotojas bandys dar kartą | ⚠️ Nėra raudonos/įspėjimo spalvos; screen reader nebūtinai suvoks. |
| **Modal copy** | LibraryPromptsModal | `handleCopy` – catch tiesiog ignore | ❌ Vartotojas nemato, ar kopijavimas pavyko ar ne. |
| **Tuščia output** | App.tsx | `generatedPrompt !== null` – blokas rodomas tik po generavimo | ✅ Tuščios būsenos nėra (nėra ką rodyti). |
| **Tuščias generavimas** | handleGenerate | Jei nėra template – setGeneratedPrompt(null), be pranešimo | ⚠️ Jei libraryPrompts tušti ar režimas be šablono – vartotojas nieko nemato ir nežino kodėl. |

### 2.2 Rekomendacijos (premium jausmui)

- **Loading:** Pridėti skeleton (header + nav + form placeholder) arba spinner su sot.copy.loadingLabel; galima `aria-live="polite"`.
- **Copy sėkmė:** Žalia atspalvis (pvz. `--success` arba fixed `#0d9488`), trumpalaikė check ikona, `aria-live="polite"` + `aria-atomic="true"`.
- **Copy fail:** Raudonas/įspėjimo atspalvis, aiškus tekstas, galimybė „Bandyti dar kartą“.
- **Modal copy:** Toast arba inline feedback po „Kopijuoti“ (success/fail), ne tylėti.
- **Generavimas be šablono:** Jei `basePrompt` tuščias – rodyti trumpą pranešimą (pvz. „Šiam režimui šablonas nepasirinktas“ arba nukreipti į „Peržiūrėti šablonus“).

---

## 3. Mikro kopija (Micro copy)

### 3.1 Iš SOT (gerai)

- Hero: heroTitle, heroSubtitle, badge, heroCtaPrimary, heroCtaSecondary, heroCtaMeta.
- Klaidos: copyErrorLabel, copyRetryLabel.
- Copy: copySuccess, copyFailed, btnCopy.
- Modal: modalTemplatesTitle, btnUse, btnClose.
- Forma: fieldMeta label + placeholder, selectPlaceholder.
- A11y: rulesAriaLabel, promptAnatomyAriaLabel, themeToggleLabelLight/Dark, kalbos mygtukų aria-label.
- Taisyklės: rules[].text.

### 3.2 Hardkoduota / ne iš SOT

| Tekstas | Vieta | Rekomendacija |
|---------|--------|----------------|
| „Aktyvus režimas:“ | App.tsx | Perkelti į SOT (pvz. `activeModeLabel`) dėl i18n ir vienodo šaltinio. |
| „Tema: {{theme}}. SOT pakrautas…“ | footerDebugLabel | Production – slėpti arba sutrumpinti; premium produkte toks tekstas dažnai nerodomas. |
| Fallback'ai („Kraunama...“, „Nukopijuota“ ir t.t.) | App.tsx, Modal | Jau daug kur SOT; likusius į SOT (defaultSot jau turi loadingLabel ir kt.). |

### 3.3 Placeholder’ai ir pagalbiniai tekstai

- fieldMeta placeholder’ai (pvz. „Pvz. butas, namas“, „Miestas, rajonas“) – aiškūs, iš SOT.
- Nėra inline help (pvz. „Kambarių sk. – įveskite sveiką skaičių“) – priimtina, jei ne reikalaujama validacija.
- Select „Pasirinkite“ – iš SOT selectPlaceholder.

**Išvada:** Mikro kopija daugiausia valdoma per SOT; „Aktyvus režimas“ ir footer debug – vieninteliai reikšmingi likučiai.

---

## 4. Spalvos, gradientai, šešėliai (Vizualinis sluoksnis)

### 4.1 SOT tema (config/sot.json, defaultSot)

- **Light:** `--primary` (#1E4A8C), `--primary-hover` (#153A70), `--surface-0` / `--surface-1` – linear-gradient, `--text`, `--text-light`, `--border`, `--output-bg`.
- **Dark:** Panašiai; surface gradientai tamsūs.
- **Nepanaudota:** `--accent-gold`, `--accent-gold-hover` – SOT apibrėžti, bet UI jų nenaudoja (nėra aukso akcentų mygtukuose ar badge).

### 4.2 Kur naudojami gradientai

- **Fonas:** `background: var(--surface-0)` – root ir main wrapper; SOT `--surface-0` yra gradientas, tad fone gradientas veikia.
- **Header:** `var(--surface-1)` – irgi gradientas SOT.
- **Nav:** surface-1 + `boxShadow: 0 1px 3px var(--border)` – švelnus atskyrimas.
- **Režimų mygtukai:** Aktyvus – `var(--primary)`, neaktyvus – `var(--surface-1)`. Aktyvus turi `boxShadow: 0 4px 6px -1px rgba(0,0,0,0.1)`.
- **Output blokas:** `var(--output-bg)` – vientisa spalva (ne gradientas).

**Problema:** `--primary-hover` ir `--accent-gold` niekur nenaudojami – mygtukuose nėra hover stiliaus.

### 4.3 Inline stiliai vs globalus CSS

- **App.tsx ir komponentai:** Beveik viskas – inline `style={{ ... }}`.
- **style.css:** `:root` gradientas, `button:hover`, `button:focus` / `focus-visible` – taikomi tik elementams be inline `style`. React mygtukai turi inline `background`, `border` ir t.t., todėl **globalūs button:hover ir :focus-visible de facto neveikia** ant CTA, režimų, kalbos, modalo mygtukų.

**Išvada:** Hover ir focus būsenos pirminiams ir antriniams mygtukams nėra pritaikytos (nors SOT turi `--primary-hover`).

### 4.4 Šešėliai (depth sistema)

| Elementas | Šešėlis | Pastaba |
|-----------|--------|---------|
| Nav | `0 1px 3px var(--border)` | Švelnus. |
| Aktyvus režimo tab | `0 4px 6px -1px rgba(0,0,0,0.1)` | Fiksuotas rgba; dark režime gali būti per šviesus. |
| Modalis | `0 25px 50px -12px rgba(0,0,0,0.25)` | Stiprus – gerai atskiria nuo fono. |
| Kortelės (modal šablonai) | Nėra | Tik border + surface-0. |
| Output blokas | Nėra | Tik output-bg + border-radius. |
| CTA mygtukai | Nėra | Plokšti. |

**Rekomendacija:** Įvesti nuoseklią elevation sistemą (pvz. `--shadow-sm`, `--shadow-md`, `--shadow-lg`) SOT theme ir naudoti visur, kad būtų vienodas „gylis“ ir premium jausmas.

### 4.5 Spalvų semantika success/error

- Success (copy): nėra `--success` ar žalios spalvos – tik tekstas.
- Error: klaidos blokas naudoja `--primary-light` (mėlynas atspalvis), ne raudonas/įspėjimo – vizualiai ne tipiška „klaida“.

**Rekomendacija:** SOT theme pridėti `--success`, `--error` arba `--warning` ir naudoti copy feedback ir alert bloke.

---

## 5. Tipografika ir atstumai

- **Šešėtas:** `fontFamily: 'system-ui, sans-serif'` (App.tsx), style.css – system-ui, Avenir, Helvetica.
- **Premium trūkumas:** Vienas bendras šešėtas; premium SaaS dažnai turi atpažįstamą fontą (pvz. Inter, DM Sans, arba custom).
- **Atstumai:** Naudojami rem (0.5, 0.75, 1, 1.5, 2) – pakankamai nuoseklu. Max-width 72rem (1152px) – gerai.

---

## 6. Interakcijos (hover, focus, transitions)

### 6.1 Hover

- **Režimų tab:** Nėra (tik active stilius).
- **CTA „Generuoti promptą“ / „Peržiūrėti šablonus“:** Nėra – inline style be `:hover`.
- **Kalbos mygtukai:** Nėra.
- **Output „Kopijuoti“:** Nėra.
- **Modal mygtukai (Kopijuoti, Naudoti, Uždaryti):** Nėra.
- **Nuoroda „Promptų anatomija“:** Globalus `a:hover` style.css – gali veikti, nes `<a>` neturi inline color (App naudoja inline color) – veikia override.

**Išvada:** Hover visur trūksta, nes naudojami tik inline stiliai. SOT `--primary-hover` nenaudojamas.

### 6.2 Focus / focus-visible

- style.css: `button:focus, button:focus-visible { outline: 4px auto -webkit-focus-ring-color }` – bet React mygtukai turi inline stilius, todėl outline gali būti perrašomas arba neaiškiai atrodyti.
- App.tsx / ModeForm / LibraryPromptsModal: **nėra** `:focus-visible` stiliaus (pvz. outline ar box-shadow) – a11y rizika klaviatūros navigacijoje.

**Rekomendacija:** Pridėti focus-visible stilius (outline arba box-shadow su `--primary`) visiems interaktyviems elementams; geriau per CSS klasę arba globalų selektorių, kuris neperrašo inline.

### 6.3 Transitions

- Visur **nėra** transition (spalvų, šešėlio, transform). Perjungimas light/dark, tab pasirinkimas, atidarymas modalo – viskas momentinis.
- **Rekomendacija:** 150–200 ms transition pagrindiniams mygtukams (background-color, border-color), modalo atidarymui (opacity + transform), galbūt theme perjungimui – sklandesnis, premium jausmas.

---

## 7. Premium SaaS – santrauka ir prioritetai

### 7.1 Kas jau atitinka

- SOT kaip vienas šaltinis (copy, theme, modes).
- Aiški hierarchija (hero → nav → content).
- Gradientai fone (surface-0, surface-1).
- Modalo gilus šešėlis.
- A11y pradmenys (aria-label, role="alert", aria-pressed kalboms).

### 7.2 Kritiniai trūkumai (premium jausmui)

1. **Nėra hover** ant jokių mygtukų (primary, secondary, nav, modal) – SOT `--primary-hover` nenaudojamas.
2. **Nėra focus-visible** – klaviatūros naudotojams ir a11y silpnesnė.
3. **Success/error vizualiai neatskirti** – copy feedback be semantinės spalvos/ikonos; klaidos blokas mėlynas, ne įspėjimo.
4. **Nėra transitions** – viskas staigu, mažiau „poliruoto“ jausmo.
5. **Debug tekstas footeryje** – sumažina „produkto“ įvaizdį.
6. **Aukso akcentas (--accent-gold)** neįgyvendintas – prarandama galimybė atpažįstamumui (badge, CTA accent).
7. **Loading** – tik tekstas, be skeletono/spinnerio.
8. **Modal copy** – be jokio feedback vartotojui.

### 7.3 Rekomenduojami žingsniai (prioritetas)

| Prioritetas | Veiksmas |
|-------------|----------|
| **P1** | Pridėti hover būsenas visiems mygtukams (primary: `--primary-hover`, secondary: šviesesnis border/background), per CSS klasę arba style objekte su state. |
| **P1** | Pridėti `:focus-visible` (outline arba box-shadow) visiems interaktyviems elementams. |
| **P1** | Copy success – žalia spalva + check ikona; copy fail – raudona/įspėjimo + aiškus tekstas; modal copy – bent minimalus toast arba inline „Nukopijuota“. |
| **P2** | SOT theme: pridėti `--success`, `--error`; naudoti klaidos bloke `--error` arba `--warning`. |
| **P2** | 150–200 ms transition mygtukams (background, border); modalo atidarymui – opacity/transform. |
| **P2** | Elevation sistema (--shadow-sm, --shadow-md, --shadow-lg) ir nuoseklus naudojimas (kortelės, output, modal). |
| **P3** | Loading – skeleton arba spinner + aria-live. |
| **P3** | „Aktyvus režimas“ į SOT; production build – slėpti arba pakeisti footer debug tekstą. |
| **P3** | Apsvarstyti --accent-gold naudojimą (badge, vienas antrinis CTA arba success state). |
| **P3** | Atskiras šriftas (pvz. Inter arba custom) – brand atpažįstamumui. |

---

## 8. Įgyvendinimo būsena (2026-03)

Rekomendacijos P1–P3 **įgyvendintos** (žr. [CHANGELOG.md](../CHANGELOG.md) – „Premium vizualinio dizaino iteracijos“):

- **P1:** SOT tema `--success`, `--error`; CSS mygtukų klasės (btn-primary, btn-secondary, btn-ghost, btn-nav, btn-output-copy) su hover; `:focus-visible`; copy success/fail vizualiai (Check ikona, spalvos); modal copy feedback (copySuccess/copyFailed).
- **P2:** Klaidos blokas `--error-bg`/`--error`; SOT `--shadow-sm`, `--shadow-md`, `--shadow-lg`; transitions mygtukams ir modalo overlay; elevation naudojimas (nav, output, modal).
- **P3:** Loading spinner + aria-live; `activeModeLabel` iš SOT; `showDebugInFooter` (footer debug paslėpiamas kai false); badge `--accent-gold`; Inter tipografika (Google Fonts).

---

## 9. Susiję dokumentai

- [docs/UX_COPY_AUDIT.md](UX_COPY_AUDIT.md) – micro UI, copy, trinties mažinimas (spalvos/gradientai).
- [docs/CODEBASE_ANALYSIS.md](CODEBASE_ANALYSIS.md) – SOT atitiktis, defaultSot, OBJEKTAS/libraryPromptId.
- [docs/INDEX.md](INDEX.md) – dokumentacijos navigacija.
- [CHANGELOG.md](../CHANGELOG.md) – pakeitimų istorija (premium iteracijos).

Šis auditas buvo naudojamas kaip prioritetų sąrašas; P1–P3 įgyvendinti. Tolesni tobulinimai – pagal naujus auditų punktus arba produktų poreikius.
