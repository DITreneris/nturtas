# LT→EN→ES UI/UX praktikų ataskaita – duplikavimui kituose repo

**Tikslas:** Aprašyti šio projekto (DI Operacinis Centras) LT/EN/ES lokalizacijos ir UI/UX modelį, kad būtų galima atkartoti panašų sprendimą kituose repozitorijuose. Integruojamos kelios kalbos iš karto (LT, EN, ES).

**Data:** 2026-03

---

## 1. Santrauka

Projektas naudoja **hibridinį modelį**: vienas šablonas (root `index.html` lietuviškai), **build-time** generuojami atskiri puslapiai `/lt/`, `/en/` ir `/es/`, o **runtime** JavaScript nustato kalbą ir atnaujina visą dinaminį bei dalį statinio turinio. Kalbos perjungimas – navigacija į atitinkamą path su išsaugotu state (mode, depth, hash). **Daugiakalbis integravimas** – LT, EN ir ES (ispanų) lygiagrečiai; geriausios praktikos apima ES specifiką (teksto išsiplėtimas, pluralizacija, locale kodai).

---

## 2. Kalbų architektūra

### 2.1 Locale nustatymo eilė

Locale nustatomas **vieną kartą** paleidus `generator.js` (eilutė ~45–57):

1. **Path** – jei URL yra `/lt/` arba `/en/`, naudojama ta kalba.
2. **Query** – `?lang=lt` arba `?lang=en`.
3. **localStorage** – raktas `di_ops_center_lang`.
4. **Fallback** – `navigator.language` (jei prasideda „lt“ → lt, kitaip → en).

```javascript
function getLocaleFromPathname() {
  var path = (window.location.pathname || '').toLowerCase();
  if (/\/lt(?:\/|$)/.test(path)) return 'lt';
  if (/\/en(?:\/|$)/.test(path)) return 'en';
  if (/\/es(?:\/|$)/.test(path)) return 'es';
  return '';
}
// resolveLocale(): path → query (?lang=lt|en|es) → localStorage → navigator
```

**Svarbu:** Root puslapis (`/` arba `index.html`) gali būti atidaromas su `?lang=en` arba `?lang=es` – tada JS nustato locale ir `applyStaticLocaleText()` atnaujina visą UI. **Rekomenduojami** įėjimai – `/lt/`, `/en/`, `/es/` (SEO, bookmark’ai, aiškūs URL).

### 2.2 Path-based puslapiai (Phase 2)

| Kelias    | Turinys              | Naudojimas                          |
|-----------|----------------------|-------------------------------------|
| `/`       | Root `index.html` (LT šablonas) | Alternatyvus įėjimas su `?lang=…`   |
| `/lt/`    | Pilnas app, `lang="lt"` | Statinis LT puslapis                |
| `/en/`    | Pilnas app, `lang="en"` | Statinis EN puslapis                |
| `/es/`    | Pilnas app, `lang="es"` | Statinis ES (ispanų) puslapis       |

- **Nėra client-side redirect:** `/lt/`, `/en/` ir `/es/` yra tikri statiniai HTML failai (pilnas app), ne redirect į root.
- **Build:** `npm run build` → `node scripts/build-locale-pages.js` generuoja `lt/index.html`, `en/index.html` ir `es/index.html` iš root `index.html`.

---

## 3. Build skriptas (`scripts/build-locale-pages.js`)

### 3.1 Ką daro

1. **HTML lang** – `<html lang="lt">`, `lang="en"` arba `lang="es"` (BCP 47: `es` pakanka; `es-ES` – jei reikia regiono).
2. **Title ir meta description** – lokaliai pritaikyti (aprašymas LT/EN/ES).
3. **Canonical** – `<link rel="canonical" href="/lt/">`, `/en/` arba `/es/`.
4. **hreflang** – `hreflang="lt"`, `hreflang="en"`, `hreflang="es"`, `hreflang="x-default"` (default = LT).
5. **Asset keliai** – jei reikia (pvz. GitHub Pages), `BASE_PATH` naudojamas; įprastai absoliutus kelias `/style.css`, `/generator.js` ir t. t.
6. **Statinio teksto pakeitimai** – kiekvienam locale (`en`, `es`) atskiras `replace()` blokas arba bendras žodynas: skip link, nav, brand, h1, hero, žingsniai, CTA, režimų tab’ai, depth, output, sesijos, biblioteka, taisyklės, footer, aria-label’ai, toast.

### 3.2 Duplikavimo patarimai

- **Vienas šaltinis:** Root `index.html` laikykite **vienintele** HTML šablonu (pvz. visada lietuviškai).
- **Replace sąrašas:** Visus statinius tekstus kiekvienam locale (EN, ES) įtraukite į build skripto atitinkamus blokus (`locale === 'en'`, `locale === 'es'`) arba naudokite bendrą žodyną pagal locale.
- **Identiškas DOM:** LT, EN ir ES failuose DOM struktūra (id, class, `data-*`) turi būti identiška, kad runtime selektoriai veiktų visoms kalboms.
- **GitHub Pages:** Jei naudojate project site, paleiskite build su `BASE_PATH=/your-repo-name`.

---

## 4. Runtime lokalizacija (`generator.js`)

### 4.1 Helper

```javascript
// Viena kalba – objekto variantas (patogu 3+ kalboms)
function uiText(translations) {
  return translations[locale] ?? translations.en ?? translations.lt;
}
// Pvz.: uiText({ lt: 'Kopijuoti', en: 'Copy', es: 'Copiar' })

// Arba pozicinis (atgalinis suderinamumas)
function uiTextLtEnEs(lt, en, es) {
  if (locale === 'lt') return lt;
  if (locale === 'es') return es;
  return en;
}
```

Naudojamas visur, kur tekstas priklauso nuo kalbos (nav, formos, mygtukai, pranešimai). **Daugiakalbiui (LT/EN/ES)** preferuokite žodyną pagal `locale`.

### 4.2 Kur saugomi vertimai

| Vieta                    | Turinys                                      |
|--------------------------|-----------------------------------------------|
| **MODES**                | Režimų pavadinimai ir aprašymai (STRATEGIC/STRATEGINIS ir t. t.) |
| **DEPTH_LEVELS**         | Gylio lygiai (Fast/Greita, Deep/Gilu, Board/Valdybai) + instrukcijos ir formatas |
| **LIBRARY_PROMPTS**      | Šablonų biblioteka – title, desc, prompt (pagal locale: LT / EN / ES masyvai arba vienas objektas su `[locale]`) |
| **RULES**                | Taisyklės – title, items (pagal locale)  |
| **applyStaticLocaleText()** | Vienas blokas su žodynu pagal `locale`: title, skip link, nav, hero, form section titles, **visi** form label’ai ir placeholder’ai, select option’ai, output, sesijos, biblioteka, taisyklės, footer, aria-label’ai. LT, EN, ES – vienoda struktūra. |

### 4.3 Formos ir placeholder’ai

- Root HTML (ir build’into EN) formos gali būti parašytos tik lietuviškai.
- **applyStaticLocaleText()** paleidžiama vieną kartą po DOM ready ir per `setLabel(forId, text)`, `setPlaceholder(id, text)` bei `querySelector` atnaujina:
  - visus form label’us,
  - visus placeholder’us,
  - select option tekstus,
  - field-help tekstus.
- Todėl **EN path** (`/en/`) ir root su `?lang=en` abu rodo pilną EN formą – dėl JS, ne dėl build’into EN HTML formos.

### 4.4 Dinaminis turinys

- **Biblioteka:** `renderLibrary()` naudoja `LIBRARY_PROMPTS`, kuris jau parinktas pagal `locale`.
- **Taisyklės:** `renderRules()` naudoja `RULES[locale]`.
- **Sesijos:** Datos formatuojamos `toLocaleString(locale === 'lt' ? 'lt-LT' : locale === 'es' ? 'es-ES' : 'en-GB')`.
- **Output:** Sugeneruoto teksto šablonai ir etiketės (pvz. „Prioritetai“, „Veiksmai“) – per `uiText(...)` arba atitinkamus objektus.

---

## 5. Kalbos perjungiklis (UI/UX)

### 5.1 Vieta

- **Nav bar**, dešinėje: mygtukai **LT**, **EN**, **ES** (pvz. `#langLtBtn`, `#langEnBtn`, `#langEsBtn`).
- **aria-label:** lokaliai („Kalbos pasirinkimas“ / „Language selection“ / „Selección de idioma“); kiekvienas mygtukas – „Perjungti į lietuvių“ / „Switch to English“ / „Cambiar a español“.
- Aktyvi kalba pažymima klasė `is-active` (vizualiai paryškinta).

### 5.2 Elgsena paspaudus

- Išsaugoma: `localStorage.setItem(LANG_KEY, nextLang)` (`lt` | `en` | `es`).
- Query: pridedami/atnaujinami `mode`, `depth` (iš dabartinio state).
- Hash: išsaugomas (pvz. `#operationsCenter`).
- **Jei esame ant path:** `/lt/`, `/en/` arba `/es/`:
  - Navigacija į atitinkamą `/lt/`, `/en/` arba `/es/` su `?mode=...&depth=...` ir tuo pačiu hash.
- **Jei root:** Navigacija į `./?lang=lt`, `./?lang=en` arba `./?lang=es` su tais pačiais params ir hash.

Taip vartotojas nepraranda režimo, gylio ir scroll pozicijos (hash).

---

## 6. SEO ir a11y

### 6.1 SEO

- **Canonical** – kiekvienas locale puslapis turi savo canonical (`/lt/`, `/en/`, `/es/`).
- **hreflang** – visuose puslapiuose: `<link rel="alternate" hreflang="lt" href="...">`, `hreflang="en"`, `hreflang="es"`, `hreflang="x-default"` (čia → LT). BCP 47: `es` pakanka; `es-ES` naudoti tik jei skiriate regionus.
- **lang** – `<html lang="lt">`, `lang="en"` arba `lang="es">` atitinka turinį.

### 6.2 Prieinamumas (a11y)

- **aria-label** visur lokalizuoti (per build EN arba per `applyStaticLocaleText()`).
- Skip link: „Pereiti prie turinio“ / „Skip to content“.
- Tab’ai ir depth – `role="tablist"`, `role="tab"`, `aria-selected`, `aria-controls`, `role="radiogroup"`, `aria-checked`.
- Pranešimai: toast su `aria-live="polite"`, `aria-atomic="true"`.

---

## 7. UI/UX principai (Golden Standard)

Iš projekto README ir struktūros:

- **Vienas CTA** – vienas pagrindinis veiksmas vizualiai dominuoja (svoris, subtilus glow).
- **Hierarchija** – aiškūs sluoksniai: background → card → input (tonų skirtumas ~2–5%).
- **Kontrastas** – input, placeholder, pagalbiniai tekstai lengvai skaitomi.
- **Depth sistema** – 2–3 nuoseklūs elevation lygiai, be atsitiktinių shadow reikšmių.
- **Brand** – violetinė palaikoma tiek light, tiek dark režime.
- **Sesijos** – aiškus header, empty state su pozityvia žinute.
- **Focus** – būtina `:focus-visible`, klaviatūros navigacija.

Šie principai **nepriklauso** nuo kalbos, bet užtikrina nuoseklų LT/EN patirtį.

---

## 8. Failų ir skriptų santrauka

| Failas / aplankas      | Paskirtis |
|------------------------|-----------|
| `index.html` (root)    | Vienintelis HTML šablonas (LT). Naudojamas kaip šaltinis build’ui. |
| `lt/index.html`        | Generuojamas; pilnas app, `lang="lt"`, canonical/hreflang. |
| `en/index.html`        | Generuojamas; pilnas app, `lang="en"`, statiniai EN tekstai. |
| `es/index.html`        | Generuojamas; pilnas app, `lang="es"`, statiniai ES tekstai. |
| `scripts/build-locale-pages.js` | Generuoja `lt/`, `en/` ir `es/` iš root `index.html`. |
| Runtime (pvz. `generator.js` ar React) | Locale resolve (path → query → localStorage → navigator), žodynai pagal locale, `uiText`/locale žodynas, `applyStaticLocaleText()` arba SOT per locale, kalbos perjungiklis (LT/EN/ES). |
| `style.css`            | Bendri stiliai; nekinta pagal kalbą. |

---

## 9. Duplikavimo checklist kitame repo

- [ ] **Šablonas:** Vienas root `index.html` (pvz. LT) su aiškia DOM struktūra ir id/class.
- [ ] **Build:** Skriptas (panašus į `build-locale-pages.js`), kuris:
  - keičia `lang`, title, meta description, canonical, hreflang kiekvienam locale (lt, en, es);
  - kiekvienam ne-LT locale pakeičia statinius tekstus (nav, hero, footer, aria-label’ai);
  - išlaiko identišką DOM visoms kalboms.
- [ ] **Locale resolve:** JS logika: path → query → localStorage → navigator; palaikomi `lt`, `en`, `es`; vienas raktas (pvz. `appId_lang`).
- [ ] **uiText / locale žodynas:** Helper arba žodynas `{ lt, en, es }` – visur naudoti vietoj hardcoded kalbos.
- [ ] **applyStaticLocaleText():** Vienas blokas su žodynais pagal `locale`, atnaujina label’us, placeholder’ius, section titles, buttons, aria-label’ius.
- [ ] **Dinaminis turinys:** MODES, DEPTH_LEVELS, LIBRARY_PROMPTS, RULES – duomenys pagal `locale` (objektas su raktais lt/en/es arba atskiri failai).
- [ ] **Kalbos perjungiklis:** Mygtukai LT | EN | ES; paspaudus – localStorage + navigacija į `/lt/`, `/en/` arba `/es/` (arba `?lang=`) su išsaugotu state (params + hash).
- [ ] **Testai:** Struktūriniai: `lt/index.html` → `lang="lt"`, `en/index.html` → `lang="en"`, `es/index.html` → `lang="es"`; E2E – perjungimas tarp kalbų išlaiko mode/depth.
- [ ] **CI:** Prieš deploy paleisti `npm run build`, kad būtų sugeneruoti `lt/`, `en/`, `es/` failai.

---

## 10. Žinomos subtilybės

1. **Build EN replace:** Jei naudojate regex `replace()`, saugokitės specialių simbolių (pvz. `'` EN tekstuose – escape). Šiame projekte EN depth mygtukuose buvo rašyta `<//button>` vietoj `</button>` – reikia tikrinti, kad pakeitimai nelūžtų HTML.
2. **Formos EN:** Statiniame `en/index.html` formos label’ai ir placeholder’ai gali likti lietuviški – juos vis tiek perrašo `applyStaticLocaleText()`. Jei norite „clean“ EN HTML be JS (pvz. crawler’iams), reikėtų tą patį turinį įtraukti į build script’o replace sąrašą arba generuoti formą iš šablono.
3. **x-default:** Čia nurodyta LT. Jei pagrindinė rinkinė bus EN arba ES, pakeiskite `hreflang="x-default"` į atitinkamą URL.
4. **ES teksto ilgis:** Ispanų kalba dažnai 20–30 % ilgesnė už anglų – žr. skyrių 11.

---

## 11. ES (ispanų) ir daugiakalbės integracijos geriausios praktikos

Šis skyrius papildo ataskaitą geriausiomis praktikomis, siekiant **iš karto integruoti kelias kalbas** (LT, EN, ES) ir užtikrinti kokybišką ispanų (ES) lokalizaciją. Šaltiniai: React i18n gidos, UI lokalizacijos gidos, GitHub/i18n praktikos.

### 11.1 Kodų ir locale konvencijos

- **Kalbos kodai:** Naudoti BCP 47: `lt`, `en`, `es`. Regionas neprivalomas (`es` pakanka); jei skiriate ispanų regionus – `es-ES`, `es-MX` ir t. t.
- **navigator.language fallback:** Jei `navigator.language.startsWith('es')` → `es`; `lt` → `lt`; kitaip dažniausiai `en`.
- **Datos ir skaičiai:** `toLocaleString('es-ES')`, `Intl.DateTimeFormat('es-ES')` – tinkami ispanų (Ispanija) formatai; kiti regionai – `es-MX`, `es-AR` ir t. t. pagal produktą.

### 11.2 ES specifika: teksto išsiplėtimas

- Ispanų vertimai dažnai **20–30 % ilgesni** už anglų. UI, sukurtas tik pagal EN ilgį, gali lūžti (overflow, sulūžę mygtukai, per ilgi tab’ai).
- **Rekomendacijos:**
  - Lanksčios išdėstymo plotis (pvz. `min-width` / `max-width`, ne fiksuoti px ilgiai kritiems elementams).
  - Mygtukuose ir tab’uose leisti wrapping arba sutrumpintus variantus mobiliam; tooltip’ai pilnam tekstui.
  - **Pseudo-localization:** Prieš paleidimą testuoti su „pseudo-ES“ (pvz. pridėti ~25 % simbolių), kad pamatytumėte overflow.
  - Modaluose ir pop-up’uose numatyti kelių eilučių tekstą.

### 11.3 ES gramatika ir vertimai

- **Giminė:** Daiktavardžiai ir sutapatinami būdvardžiai/veiksmažodžiai (pvz. *el libro* / *la mesa*). UI tekste kontekstas turi būti aiškus vertėjui.
- **Žodžių tvarka:** Pvz. būdvardis po daiktavardžio (*casa roja*). Literalūs vertimai gali keisti prasmę – rekomenduojama **kontekstinė vertimo brief’as**: ekrano nuotraukos, terminų žodynas, tonas (formalus / draugiškas).
- **Pluralizacija:** Ispanų turi vienaskaitą ir daugiskaitą; jei naudojate ICU arba žodynus, būtina `one` / `other` (arba atitikmenys) teisingai užpildyti (pvz. „Tienes {{count}} artículo“ / „Tienes {{count}} artículos“).

### 11.4 Techninė struktūra: kelios kalbos iš karto

- **Vienas šaltinis tiesos:** Visi UI tekstai (copy, modes, fieldMeta, rules, libraryPrompts) – iš konfigūracijos (SOT) arba JSON žodynų, **jokio hardcoded** kalbos kode.
- **Struktūra pagal locale:** Arba atskiri failai (`sot.lt.json`, `sot.en.json`, `sot.es.json`), arba vienas failas su raktais `copyByLocale: { lt, en, es }`, `modesByLocale: { lt, en, es }` ir t. t. Build arba runtime pasirenka bloką pagal `locale`.
- **Fallback grandinė:** Trūkstanti frazė: pirmiausia `locale`, tada `en`, tada `lt` (arba kita numatytoji). Pvz. `translations[locale] ?? translations.en ?? translations.lt`.
- **Interpoliacija:** Vietoj string concatenation naudoti kintamuosius (pvz. `"welcome": "Hola, {{name}}"`), kad vardai ir skaičiai būtų teisingose vietose visomis kalbomis.

### 11.5 Lazy loading ir našumas

- Jei vertimai dideli: krauti tik aktyvios kalbos failą (pvz. `loadSot(locale)` → `sot.en.json` arba atitinkamas namespace). Perjungus kalbą – pakrauti naują žodyną ir atnaujinti UI.
- React ekosistemoje populiarūs: **react-i18next**, **react-intl (FormatJS)**; SOT-driven projekte gali pakakti savo `loadSot(locale)` + context su `locale` ir žodynais.

### 11.6 RTL pastaba

- **Ispanų (es) yra LTR** (left-to-right). RTL (pvz. arabų, hebrajų) reikėtų atskiro layout’o; ES integracijai RTL keisti nereikia.

### 11.7 ES integravimo checklist

- [ ] Įvesti `es` į locale resolve (path `/es/`, query `?lang=es`, localStorage, navigator).
- [ ] Build skriptas generuoja `es/index.html` su `lang="es"`, canonical ir hreflang.
- [ ] Visi copy, modes, fieldMeta, rules, libraryPrompts turi ES versijas (žodynai arba atskiri SOT failai).
- [ ] Kalbos perjungiklyje mygtukas **ES**; aria-label’ai ir toasts ir kt. – ir ispaniškai.
- [ ] Datos/skaičiai formatuojami su `es-ES` (arba pasirinktu regionu).
- [ ] UI išdėstymas patikrintas su ilgesniais ES tekstais (arba pseudo-localization); overflow išvengtas.
- [ ] Fallback: trūkstanti ES frazė rodo EN arba LT.

**Nuorodos (best practices):** React i18n gidos (react-i18next, FormatJS), UI lokalizacijos gidos (teksto išsiplėtimas, LTR/RTL), JSON vertimų struktūra (flat/nested, fallback chain), BCP 47 locale kodai, hreflang multi-region.

---

Jei norite, galima iš šios ataskaitos išskirti trumpą „Quick start“ sekciją tik build + locale resolve + perjungiklio logikai (be detalių UI principų).
