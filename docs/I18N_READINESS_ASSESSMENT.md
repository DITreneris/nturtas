# Daugiakalbiškumo (i18n) paruoštumo įvertinimas

**Data:** 2026-03-15  
**Tikslas:** Įvertinti, ar kodo bazė jau paruošta UI kitomis kalbomis (EN, ES ir kt.), ar reikia patobulinti patį kodą.

**Nuoroda:** [LT_EN_UI_UX_REPORT.md](../LT_EN_UI_UX_REPORT.md) – kito projekto (DI Operacinis Centras) LT/EN/ES modelis; čia vertinamas **nt-broker-ui** atitikimas panašiems kriterijams.

---

## 1. Vertinimo kriterijai

| # | Kriterijus | Aprašymas |
|---|------------|-----------|
| K1 | **Vienas turinio šaltinis** | Visi vartotojui matomi tekstai valdomi iš konfigūracijos (SOT), ne iš kodo. |
| K2 | **Nėra hardkoduotų UI eilučių** | Mygtukai, pranešimai, aria-label, placeholder’ai – iš SOT arba lokalės žodyno. |
| K3 | **Kalbos / locale mechanizmas** | Yra būdas nustatyti kalbą (path, query, localStorage) ir pasirinkti atitinkamą turinį. |
| K4 | **Struktūra palaiko kelias kalbas** | Konfigūracija gali būti „viena kalba vienam failui“ arba „vienas SOT su locale raktais“. |
| K5 | **HTML meta ir a11y** | `lang`, title, aria-label – keičiami pagal kalbą. |
| K6 | **Formos ir dinaminis turinys** | Label’ai, placeholder’ai, select opcijos – iš turinio šaltinio. |

---

## 2. Dabartinė būsena pagal kriterijus

### K1 – Vienas turinio šaltinis

| Sritis | Šaltinis | Iš SOT? |
|--------|----------|--------|
| Hero (title, subtitle, CTA, badge, meta) | `sot.copy` | ✅ Taip |
| Režimai (label, desc, fields) | `sot.modes`, `sot.modesOrder` | ✅ Taip |
| Formų laukai (label, placeholder) | `sot.fieldMeta` | ✅ Taip |
| Taisyklės | `sot.rules` | ✅ Taip |
| Šablonų biblioteka (title, desc, prompt) | `sot.libraryPrompts` | ✅ Taip |
| Loading tekstas | `sot.copy.loadingLabel` | ✅ Taip (SOT turi lauką) |
| Klaidos, mygtukai, modalai, tema, footer | Kode (App, LibraryPromptsModal, ModeForm) | ❌ Ne |

**Išvada:** Didelė dalis turinio jau iš SOT; likusi dalis – hardkoduota.

---

### K2 – Nėra hardkoduotų UI eilučių

**Hardkoduoti tekstai (vartotojui matomi):**

| Vieta | Tekstas | Paskirtis |
|-------|---------|-----------|
| App.tsx | `Klaida:`, `Bandyti dar kartą` | Klaidos blokas |
| App.tsx | `Nukopijuota`, `Kopijuoti nepavyko` | Kopijavimo atgalinis ryšys |
| App.tsx | `Kopijuoti` | Mygtukas prie išvesties |
| App.tsx | `Taisyklės` | aria-label taisyklėms |
| App.tsx | `Perjungti į tamsų režimą` / `Perjungti į šviesų režimą` | Tema (aria-label ir mygtuko tekstas) |
| App.tsx | `Promptų anatomija →`, `aria-label="Promptų anatomija – atidaroma naujame lange"` | Nuoroda |
| App.tsx | `Tema: … SOT pakrautas …` | Footer (dev/info) |
| App.tsx | `INPUT (užpildyta)` | Generuojamo prompto bloko antraštė |
| LibraryPromptsModal.tsx | `Šablonai`, `Kopijuoti`, `Naudoti`, `Uždaryti` | Modalas |
| ModeForm.tsx | `Pasirinkite` | Select placeholder (jei fieldMeta.placeholder tuščias) |
| ModeForm.tsx | `['premium', 'neutralus', 'draugiškas']` | Tonas – select opcijos |
| loadSot.ts | Pranešimai apie 404/klaidas | Klaidos vartotojui |
| index.html | `<title>`, `lang="lt"` | HTML meta |

**Išvada:** K2 **nepatenkinamas** – daug vietų su fiksuota lietuviška eilute.

---

### K3 – Kalbos / locale mechanizmas

- **Dabar:** Nėra nei `locale`, nei `lang` kintamojo; SOT kraunamas vienas failas (`config/sot.json`).
- **Ko trūksta:** Locale nustatymo eilė (path / query / localStorage / navigator) ir SOT pasirinkimas pagal kalbą (pvz. `sot.en.json` arba SOT su `copy: { lt: {...}, en: {...} }`).

**Išvada:** K3 **nepatenkinamas** – locale logikos nėra.

---

### K4 – Struktūra palaiko kelias kalbas

- **SOT struktūra:** Vienas JSON su vienu copy/modes/fieldMeta/rules/libraryPrompts rinkiniu. Struktūra **gali** būti išplėsta:
  - **Variantas A:** Atskiri failai `sot.lt.json`, `sot.en.json` – load pagal locale.
  - **Variantas B:** SOT su įdėtais locale: `copy: { lt: {...}, en: {...} }`, `modes` per locale ir t. t.
- **Kodas:** Naudoja `sot.copy`, `sot.modes` ir t. t. – jei tie objektai būtų parinkti pagal locale, logika liktų ta pati.

**Išvada:** K4 **dalinai patenkinamas** – duomenų modelis tinkamas, bet nėra locale pasirinkimo implementacijos.

---

### K5 – HTML meta ir a11y

- **Dabar:** `index.html` – fiksuotas `title`, `lang="lt"`. Aria-label’ai daugelyje vietų lietuviškai ir hardkoduoti.
- **Ko reikia i18n:** Dinamiškas `document.title` ir `<html lang>` pagal locale; visi aria-label’ai iš turinio šaltinio.

**Išvada:** K5 **nepatenkinamas** – meta ir daugelis a11y tekstų nepriklauso nuo kalbos šaltinio.

---

### K6 – Formos ir dinaminis turinys

- **Formos label’ai ir placeholder’ai:** Iš `sot.fieldMeta` – ✅.
- **Select opcijos (tonas):** Hardkoduotos `TONAS_OPTIONS` – ❌. SOT neturi `fieldMeta.tonas.options` ar panašaus.

**Išvada:** K6 **dalinai patenkinamas** – formos iš SOT, bet select opcijos (tonas) – ne.

---

## 3. Bendras įvertinimas

| Kriterijus | Rezultatas |
|------------|------------|
| K1 – Vienas turinio šaltinis | ⚠️ Dalinai (didelis turinys iš SOT, likusis – kode) |
| K2 – Nėra hardkoduotų UI eilučių | ❌ Nepatenkinamas |
| K3 – Locale mechanizmas | ❌ Nepatenkinamas |
| K4 – Struktūra kelios kalbos | ⚠️ Dalinai (struktūra ok, implementacijos nėra) |
| K5 – HTML meta ir a11y | ❌ Nepatenkinamas |
| K6 – Formos ir dinaminis turinys | ⚠️ Dalinai (select opcijos hardkoduotos) |

---

## 4. Išvada: ar jau galima daryti kitomis kalbomis UI?

**Atsakymas: dar ne.**  
Kodas **nėra pakankamai paruoštas**, kad UI vienodai ir tvarkingai veiktų kitomis kalbomis. Reikia **patobulinti patį kodą**: išimti likusius tekstus į SOT (arba į vieną lokalės žodyną), įvesti locale mechanizmą ir naudoti jį visur, kur priklauso nuo kalbos.

---

## 5. Ką patobulinti, kad būtų galima daryti kitomis kalbomis

### 5.1 Privaloma (turinyje / SOT)

1. **Išplėsti SOT copy** (pvz. `config/sot.json` → `copy`) ir naudoti kode:
   - `copyErrorLabel` (pvz. „Klaida:“)
   - `copyRetryLabel` („Bandyti dar kartą“)
   - `copySuccess`, `copyFailed` („Nukopijuota“, „Kopijuoti nepavyko“)
   - `btnCopy` („Kopijuoti“)
   - `rulesAriaLabel` („Taisyklės“)
   - `themeToggleLabelLight`, `themeToggleLabelDark` (arba vienas `themeToggleLabel` su placeholder)
   - `promptAnatomyLinkText`, `promptAnatomyAriaLabel`
   - `inputBlockLabel` („INPUT (užpildyta)“ – generuojamo bloko antraštė)
   - Pasirinktinai: `footerDebugLabel` (dabar „Tema: … SOT pakrautas …“)

2. **Modalų tekstai iš SOT** (arba bendras copy):
   - `modalTemplatesTitle` („Šablonai“)
   - `btnCopy`, `btnUse`, `btnClose` („Kopijuoti“, „Naudoti“, „Uždaryti“) – vieną kartą SOT, naudoti ir App, ir LibraryPromptsModal.

3. **ModeForm – select opcijos iš SOT:**
   - Į `fieldMeta.tonas` pridėti `options?: string[]` (pvz. `["premium", "neutralus", "draugiškas"]`) arba atskirą SOT struktūrą; ModeForm skaito opcijas iš ten, ne iš `TONAS_OPTIONS`.

4. **loadSot klaidos:** Klaidos pranešimus vartotojui (404, tinklo klaida) gauti iš SOT arba iš vieno „uiStrings“ objekto pagal locale, kad būtų galima versti.

### 5.2 Būtina (locale architektūra)

5. **Locale nustatymas:**
   - Įvesti `locale` state arba kontekstą (pvz. `lt` | `en` | `es`).
   - Nustatymo eilė: path → `?lang=` → localStorage (pvz. `nt_broker_lang`) → `navigator.language` → fallback `lt`.

6. **SOT pagal kalbą:**
   - **Variantas A:** Atskiri failai `sot.lt.json`, `sot.en.json` – load pagal `locale` (pvz. `config/sot.${locale}.json`).
   - **Variantas B:** Vienas SOT su įdėtais objektais: `copy: { lt: {...}, en: {...} }`, `modes` per locale ir t. t.; load vieną kartą, parinkti slice pagal `locale`.

7. **Kalbos perjungiklis UI:** Mygtukai LT | EN (ir ES jei reikia); paspaudus – atnaujinti locale, išsaugoti, perkrauti SOT arba perjungti turinį.

### 5.3 Rekomenduojama (meta ir a11y)

8. **HTML lang ir title:** Nustatyti `document.title` ir `<html lang="...">` pagal `locale` (pvz. po SOT load arba locale pasikeitimo).

9. **Visi aria-label’ai:** Naudoti tekstus iš SOT/copy, kad būtų verčiami kartu su kalba.

10. **Build / path (jei reikia):** Jei norima path-based locale (pvz. `/en/`, `/lt/`), reikia Vite base ir route arba statinių puslapių generavimo (analogiškai kaip LT_EN_UI_UX_REPORT) – tai jau antros fazės klausimas.

---

## 6. Rekomenduojama eilė darbų

1. **Fazė 1 – „Visi tekstai iš SOT“ (be locale):**  
   Išplėsti `copy` ir kitas SOT dalis (modal titles, mygtukai, klaidos, inputBlockLabel, tonas options); pakeisti App, LibraryPromptsModal, ModeForm ir loadSot, kad naudotų tik SOT. **Rezultatas:** viena kalba, bet nė vieno likusio hardcoded UI teksto.

2. **Fazė 2 – Locale ir kelios kalbos:**  
   Įvesti locale state, SOT pagal kalbą (atskiri failai arba įdėti objekti), kalbos perjungiklį, `document.title` ir `lang`. **Rezultatas:** galima rodyti UI EN/ES ir t. t.

3. **Fazė 3 (neprivaloma):** Path-based puslapiai (`/lt/`, `/en/`), hreflang, canonical – jei reikia SEO ir aiškių URL.

---

## 7. Santrauka

- **Ar galima daryti kitomis kalbomis UI dabar?** – **Taip** (po įgyvendinimo, žr. skyrių 8).
- **Ar reikia patobulinti patį kodą?** – **Atlikta.** Fazė 1 ir Fazė 2 įgyvendintos – visi UI tekstai iš SOT, locale mechanizmas (LT/EN/ES), kalbos perjungiklis, `document.title` ir `lang`.

---

## 8. Įgyvendinimas (2026-03)

Įgyvendintas planas **i18n paruoštumo įgyvendinimas** (Fazė 1 ir Fazė 2):

- **Fazė 1:** SOT copy išplėstas (copyErrorLabel, copyRetryLabel, copySuccess, copyFailed, btnCopy, rulesAriaLabel, themeToggleLabel*, promptAnatomy*, inputBlockLabel, footerDebugLabel, modalTemplatesTitle, btnUse, btnClose, selectPlaceholder, loadError*); fieldMeta.tonas.options; visi komponentai (App, LibraryPromptsModal, ModeForm, loadSot) naudoja tik SOT.
- **Fazė 2:** Įvestas tipas `Locale = 'lt' | 'en' | 'es'`, resolve eilė (query → localStorage → navigator), `loadSot(locale)` su atskirais failais `config/sot.lt.json`, `config/sot.en.json`, `config/sot.es.json`; SotContext teikia `locale` ir `setLocale`; kalbos perjungiklis (LT | EN | ES) header'yje; `document.documentElement.lang` ir `document.title` atnaujinami pagal locale.

Kriterijai K1–K6 dabar **patenkinami**. Path-based puslapiai (Fazė 3) – neprivalomi, jei reikia SEO.
