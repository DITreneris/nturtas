# Premium UX/UI Score Engine (NT Broker)

Data: 2026-03-15  
Produktas: `nt-broker-ui`  
Tikslas: procentus kelti pagal irodymus, o ne subjektyvu ispudi.

---

## 1. Vertinimo modelis

Bendras premium balas skaiciuojamas tik is pamatuojamu signalu:

`PremiumScore = UX(25) + Microcopy(15) + VisualSystem(15) + InteractionPolish(10) + A11y(10) + SOTDiscipline(15) + Reliability(10)`

Maksimalus balas: `100`.

### Svoriai

| Kategorija | Svoris | Ka matuoja |
|---|---:|---|
| UX funnel | 25 | kelione nuo app_open iki copy |
| Microcopy | 15 | copy nuoseklumas ir SOT padengimas |
| Visual system | 15 | tokenai, spalvu nuoseklumas, style guide atitiktis |
| Interaction polish | 10 | hover, focus-visible, transitions, feedback |
| A11y | 10 | semantika, aria-live, klaviaturos fokusas |
| SOT discipline | 15 | ar UI tekstai ir tema valdomi is SOT |
| Reliability | 10 | testai, build, quality check vartai |

---

## 2. Irodymu saltiniai (evidence map)

Kiekviena kategorija turi privaloma irodymo saltini:

- UX funnel:
  - `ntbroker:ux` eventai is `nt-broker-ui/src/App.tsx`
  - e2e scenarijai is `tests/e2e/nt-broker-ui.spec.js`
- Microcopy:
  - `config/sot.json` + locale failai
  - SOT key usage check scriptas
- Visual system:
  - `nt-broker-ui/src/style.css`
  - tokenu naudojimo check scriptas
- Interaction polish:
  - CSS klases (`btn-*`, `:focus-visible`, transitions)
  - unit/e2e smoke patikros
- A11y:
  - role/aria atributai komponentuose
  - testai ir rankinis smoke
- SOT discipline:
  - hardcoded copy check
  - nenaudojamu copy key check
- Reliability:
  - `npm test`, `npm run test:e2e`, `npm run quality:premium`, build statusai

Jei kategorijai nera irodymo, tos kategorijos balas = `0`.

---

## 3. KPI slenksciai (pries/po)

KPI naudojami tik su faktiniais event duomenimis (ne rankiniais skaiciavimais).

### Funnel KPI

- `TTFC p75 <= 120s`
- `generate_to_copy_rate >= 0.65`
- `template_assist_rate >= 0.25`
- `session_restore_rate >= 0.10`

### Kokybes KPI

- `sot_copy_coverage >= 0.90`
- `tokenized_color_coverage >= 0.92`
- `accessibility_gate_pass = true`
- `ci_quality_gates_pass = true`

### Pries/po snapshot taisykle

Kiekviena iteracija turi tureti:

1. Baseline snapshot (`T0`) pries pakeitimus.
2. Post-change snapshot (`T1`) po pakeitimu.
3. Delta su skaiciumi ir saltiniu.

Pavyzdine lentele:

| KPI | T0 | T1 | Delta | Saltinis |
|---|---:|---:|---:|---|
| TTFC p75 | 142s | 109s | -33s | ux event export |
| generate_to_copy_rate | 0.54 | 0.68 | +0.14 | ux event export |
| sot_copy_coverage | 0.84 | 0.93 | +0.09 | quality script |
| tokenized_color_coverage | 0.88 | 0.94 | +0.06 | quality script |

### Event failo formatas KPI tikrinimui

`tests/ux-kpi-thresholds.test.js` priima:

- JSON masyva:
  - `[{"eventName":"generate_clicked","ts":...}, ...]`
- arba JSONL:
  - viena JSON eilute = vienas event.

Minimaliai naudingi laukai:

- `eventName` (privalomas)
- `ttfcMs` (tik `output_copied_first` eventui)

### Komandos

- Struktura + kokybes vartai:
  - `npm run quality:premium`
- Kokybe + KPI slenksciai su realiais eventais:
  - `npm run quality:premium:events`
  - pagal nutylejima skaito `./test-results/ux-events.json`
- Dabartinis premium balas (skaicius):
  - `npm run score:premium` – dabartinis balas be live KPI (maks. 75 jei nera UX_EVENTS_FILE)
  - `npm run score:premium:full` – pilnas balas su `test-results/ux-events.json` (iki 100)

---

## 4. Definition of Done (procentu kelimui)

Procentas gali buti padidintas tik jei:

1. Yra `T0` ir `T1` duomenys.
2. Bent 1 funnel KPI pagerintas be regress kritiniuose KPI.
3. Praeiti visi vartai:
   - `npm test`
   - `npm run test:e2e` (kai keistas kritinis flow)
   - `npm run quality:premium`
   - `cd nt-broker-ui && npm run build`
4. `CHANGELOG.md` nurodyta:
   - kas matuota,
   - kiek pasikeite,
   - kuo patvirtinta (test/gate).

---

## 5. Iteracijos tvarka

### Sprintas A (1-2 dienos)

- Score engine dokumentas ir KPI slenksciai.
- Low hanging fruits:
  - `firstStepHint` aktyvavimas UI,
  - `footerTagline` naudojimas footeryje,
  - CTA semantikos suvienodinimas.
- `quality:premium` scripto MVP.

### Sprintas B (1-2 dienos)

- KPI pries/po snapshot ritualas.
- CI/release vartu integracija.
- Changelog disciplina (tik su irodymu).

---

## 6. Failai, kurie sudaro premium score engine

- `nt-broker-ui/src/App.tsx`
- `nt-broker-ui/src/style.css`
- `config/sot.json`
- `config/sot.en.json`
- `config/sot.es.json`
- `nt-broker-ui/src/sot/defaultSot.ts`
- `tests/premium-quality.test.js`
- `CHANGELOG.md`

---

## 7. Dabartines rizikos (likutis)

- WhatsApp CTA spalva samoningai skiriasi nuo coral action sistemos (external veiksmas).
- KPI slenksciai turi buti verifikuojami su realiu event export, ne vien lokaliu smoke.
- Jei nebus nuolat paleidziamas `quality:premium`, balai vel taps subjektyvus.

---

## 8. Galutinis principas

Premium procentas = tik irodoma kokybe.

- Nera irodymo -> nera procento.
- Yra irodymas + gate'ai -> procentas kyla.
# Gilus UI/UX auditas ir P1-P3 vykdymo būsena

Data: 2026-03-15  
Produktas: `nt-broker-ui`  
Tikslas: mažinti trintį ir sukurti vieną aiškų kelią nuo režimo pasirinkimo iki kopijavimo.

---

## 1. Dabartinė pozicija

Stiprybės:
- SOT valdomi režimai, copy ir tema.
- Aiški 5 režimų architektūra su skirtingais use-case.
- Veikiantis generavimo srautas, sesijos, i18n, a11y bazė.

Pagrindinė rizika:
- Per daug lygiaverčių veiksmų vienu metu mažino aiškumą naujam vartotojui.

---

## 2. KISS / MARRY / KILL

### KISS
- SOT-driven konfigūracija.
- Režimų struktūra ir formų grupavimas.
- Redaguojamas output ir sesijos.

### MARRY
- Vienas pagrindinis CTA kiekvienoje fazėje.
- Viena kanoninė šablonų patirtis.
- Sesijų „Atkurti“ srautas.
- Funnel KPI matavimas.

### KILL
- Dubliuotas output kopijavimo veiksmas.
- Dubliuotas templates kelias (inline + modal).

---

## 3. P1-P3 įgyvendinimo būsena

## P1 - Conversion ir aiškumo bazė (įgyvendinta)

- Output paliktas su vienu aiškiu primary copy veiksmu.
- Modalinis templates kelias pašalintas iš aktyvaus srauto.
- Hero/form antriniai CTA veda į inline templates (scroll + expand).
- Režimuose pridėtas „recommended start“ signalas.
- Sesijose pridėtas `Atkurti` veiksmas (prompt atstatomas į output).

## P2 - Srauto supaprastinimas (įgyvendinta)

- `TemplatesInline` paliktas kaip vienintelė aktyvi templates patirtis.
- Įvestas helper kontekstas prie režimo: „Kada naudoti“.
- Sumažintas triukšmas: taisyklės numatytai sutrauktos, community rodomas po pirmo generavimo.
- Subalansuotas CTA svoris (antriniai CTA vizualiai silpnesni).

## P3 - Matavimo disciplina (įgyvendinta)

- Pridėtas lengvas UX event sluoksnis (`ntbroker:ux` + optional `dataLayer` push):
  - `app_loaded`
  - `mode_selected`
  - `templates_opened_from_cta`
  - `template_used`
  - `generate_clicked`
  - `output_copied_first` (su `ttfcMs`)
  - `output_copied`
  - `session_saved`
  - `session_copied`
  - `session_restored`

---

## 4. KPI, kuriuos sekame

- `TTFC` (time to first copy).
- `Generate-to-copy conversion`.
- `Template assist rate`.
- `Session reuse rate`.

Tikslas: mažiau sprendimų vienam rezultatui, didesnis pirmo rezultato greitis.

---

## 5. Pakeisti failai (P1-P3)

- `nt-broker-ui/src/App.tsx`
- `nt-broker-ui/src/components/TemplatesInline.tsx`
- `nt-broker-ui/src/style.css`
- `nt-broker-ui/src/sot/types.ts`
- `nt-broker-ui/src/sot/defaultSot.ts`
- `config/sot.json`
- `tests/e2e/nt-broker-ui.spec.js`
- `nt-broker-ui/src/App.test.tsx`

Pašalinta:
- `nt-broker-ui/src/components/LibraryPromptsModal.tsx`

---

## 6. Galutinis verdiktas

Sistema perėjo nuo „feature-rich“ prie aiškesnės „single-path“ UX logikos:
- mažiau dubliavimo,
- aiškesnis pirmas žingsnis,
- stipresnis conversion fokusas,
- įjungtas matavimo sluoksnis tolimesnėms iteracijoms.
# Gilus UI/UX ir vartotojo kelionės auditas (NT Broker SaaS)

Data: 2026-03-15  
Apimtis: `nt-broker-ui` realus srautas nuo atėjimo iki rezultato kopijavimo/sesijų, trintys, neaiškumai, stabdžiai, OK/FAIL vertinimas, KISS-MARRY-KILL prioritetizacija.

---

## 1) Executive išvada

Produktas jau turi tvirtą bazę: aiškus vertės pasiūlymas, režimų architektūra iš SOT, veikiantis generavimo srautas, sesijos, i18n ir solidūs a11y pagrindai.  
Didžiausios trintys šiuo metu nėra techninės - jos yra suvokimo ir sprendimo trintys: per daug vienodo svorio veiksmų, nepakankamai aiški „ką daryti dabar“ hierarchija, ir keli pasikartojantys veiksmai, kurie silpnina premium SaaS aiškumą.

Trumpai:
- **Kas labai OK:** SOT-driven architektūra, režimai, formų grupavimas, output redagavimas/kopijavimas, sesijų saugojimas.
- **Kas stabdo:** dvigubi CTA ir dvigubas kopijavimas, šablonų dubliavimas (inline + modal), ne visada aiški „kitas žingsnis“ logika po generavimo.
- **Kas kritiška augimui:** onboarding aiškumas pirmam vartotojui ir conversion focus (vienas pagrindinis kelias, mažiau triukšmo).

---

## 2) Vartotojo kelionės auditas

### Kelionė A: Pirmas vizitas (cold user)

1. Vartotojas patenka į hero, mato vertės pasiūlymą ir 2 CTA.  
2. Pereina į režimų tabs, pasirenka režimą.  
3. Užpildo formą (dalinai arba minimaliai).  
4. Spaudžia generuoti, gauna promptą, kopijuoja.

**Kur stringa:**
- Hero turi daug signalų vienu metu (2 CTA + žingsniai + badges + top bar controls), todėl pirmas sprendimas ne visada akivaizdus.
- Režimų juostoje visi režimai vizualiai vienodai svarbūs; naujokui trūksta „rekomenduojamo starto“.
- Formoje nėra aiškios ribos tarp „būtina“ ir „geriau turėti“, nors yra recommended indicator.

**Impact:** padidėja „micro-hesitation“ prieš pirmą generavimą.

### Kelionė B: Greitas kasdienis naudojimas (returning broker)

1. Vartotojas grįžta, iškart pasirenka režimą.  
2. Užpildo 2-4 laukus, generuoja, kopijuoja į ChatGPT/Claude.  
3. Jei reikia, išsaugo sesiją.

**Kur stringa:**
- Yra du kopijavimo taškai output bloke (header copy + didelis output CTA) - funkcionaliai teisinga, bet sukuria nereikalingą pasirinkimą.
- Sesijų sąraše veiksmai yra geri, bet nėra „greito atstatymo į aktyvų output“ (pvz., „Atidaryti“/„Atkurti“).

**Impact:** maži, bet pasikartojantys laiko nuostoliai power user scenarijuje.

### Kelionė C: Šablonų pasirinkimas prieš pildymą

1. Vartotojas nori pradėti nuo šablono.  
2. Mato inline templates sekciją ir gali atsidaryti modalą su tais pačiais šablonais.

**Kur stringa:**
- Inline + modal dubliuoja tą pačią funkciją skirtingais formatais.
- Modal rodo trumpesnį prompt preview, inline turi expand/collapse - tai dvi skirtingos patirtys tam pačiam objektui.

**Impact:** informacinis triukšmas ir neaiški „kuri vieta yra pagrindinė“.

---

## 3) Trintys, neaiškumai, stabdžiai

### P1 (didelis poveikis)

1. **Dvigubas pagrindinis veiksmas output fazėje**  
   Output dalyje vartotojas turi 2 copy veiksmus, kurie daro beveik tą patį.  
   Reikia vieno aiškaus primary veiksmo, kitas - helper lygio.

2. **Šablonų informacijos dubliavimas**  
   Inline templates ir modal templates konkuruoja tarpusavyje.  
   Premium SaaS jausmui reikia vieno kanoninio šablonų UX.

3. **Pirmo žingsnio aiškumas naujam vartotojui**  
   Yra onboarding steps tekstas, bet trūksta aiškaus „start here“ signalo prie režimų/formos.

### P2 (vidutinis poveikis)

4. **Per daug vienodo vizualinio svorio CTA**  
   Hero ir formoje pagrindiniai/antriniai veiksmai kartais atrodo beveik lygūs.  
   Tai mažina sprendimo greitį.

5. **Sesijų workflow neužbaigtas iki galo**  
   Yra save/copy/delete, bet trūksta tiesioginio „restore to output“ kelio.

6. **Per daug informacijos viename long-scroll puslapyje**  
   Naujam vartotojui viename ekrane: hero, tabs, form, rules, output, templates, ai links, sessions, community, footer.

### P3 (mažesnis poveikis)

7. **Mikrocopy nuoseklumas tarp blokų**  
   Kai kurie signalai kartojasi („kopijuoti“, „naudoti“, „šablonai“) per kelis blokus su nežymiai skirtinga semantika.

8. **Režimų skirtumų pažinimas**  
   Režimų desc yra, bet trūksta aiškios „kada rinktis šį režimą“ mini pagalbos.

---

## 4) OK / FAIL matrica

## OK (stiprybės)

- **SOT kaip tiesos šaltinis:** copy, modes, theme, fieldMeta valdomi centralizuotai.
- **Režimų architektūra:** 5 režimai su aiškia paskirtimi ir field groups.
- **Formos UX:** progresas (`filled/total`), collapsible grupės, recommended laukai.
- **Output UX bazė:** redaguojamas rezultatas, char count, copy feedback.
- **Sesijos:** localStorage persist, limitas, copy/delete, bulk delete.
- **A11y pagrindai:** skip link, aria-live statusai, modal focus trap, escape.
- **i18n kryptis:** LT/EN/ES ir locale switch top bar.

## FAIL / rizikos zonos

- **Dvigubas copy CTA output bloke** (pagrindinės funkcijos išskaidymas).
- **Dubliuota šablonų patirtis** (inline + modal su skirtingu detalumo lygiu).
- **Nėra aiškaus „recommended start mode“ naujokui**.
- **Per ilga vieno puslapio informacinė masė** prieš pirmą „aha“ momentą.
- **Sesijoms trūksta atstatymo į aktyvų output veiksmų**.

---

## 5) KISS-MARRY-KILL (produkto sprendimai)

### KISS (palikti ir akcentuoti)

- SOT-driven konfigūracija (brand/copy/theme/modes viename šaltinyje).
- Režimų struktūra su aiškiais use-case (Objektas, Skelbimas, Komunikacija, Derybos, Analizė).
- Redaguojamas output + greitas kopijavimas.
- Sesijų persist mechanika.
- Skip link + modal a11y disciplina.

### MARRY (investuoti ir plėtoti)

- Vieninga onboarding logika: „Start here“ + recommended mode + 1 aiškus next step.
- Viena kanoninė šablonų patirtis (rinktis inline arba modal, ne abi lygiagrečiai).
- Sesijų brandinimas: „Atkurti į output“, paieška/filtras, timestamp semantika.
- Conversion-oriented hierarchy: vienas pagrindinis CTA kiekvienoje fazėje.

### KILL (atsisakyti / supaprastinti)

- Dubliuoti copy veiksmai output bloke.
- Dubliuota templates sistema (inline ir modal vienu metu).
- Pertekliniai vienodo svorio CTA viršutiniuose etapuose.

---

## 6) Rekomenduojamas veiksmų planas (30-60-90)

### Per 30 min (greitos pergalės)

- Output bloke palikti vieną primary copy CTA, kitą sumažinti iki secondary/ikonos.
- Pridėti „Recommended start“ žymą prie vieno režimo (pvz., `Skelbimas`).
- Hero antrinį CTA vizualiai susilpninti, kad pirmas veiksmas būtų akivaizdus.

### Per 60 min (struktūriniai pataisymai)

- Pasirinkti vieną templates UX kryptį:
  - arba inline kaip pagrindinę,
  - arba modal kaip vienintelę ir pašalinti inline.
- Sesijose pridėti „Atkurti“ veiksmą, kuris įkelia sesijos prompt į output.

### Per 90+ min (poliravimas premium SaaS lygiui)

- Įvesti „kada naudoti režimą“ helper tekstus.
- Sumažinti long-scroll triukšmą: sekundinius blokus rodyti kontekstualiai.
- Įdiegti produktinę funnel metriką (time-to-first-copy, mode adoption, template usage).

---

## 7) KPI, pagal kuriuos matuoti, ar UX gerėja

- **TTFC (Time to First Copy):** laikas nuo pirmo atidarymo iki pirmo copy.
- **Form completion ratio:** kiek laukų užpildo iki pirmo generavimo.
- **Generate-to-copy conversion:** kiek generavimų baigiasi copy.
- **Template assist rate:** kiek sesijų startuoja nuo šablono.
- **Session reuse rate:** kiek kartų naudojamos išsaugotos sesijos.

Tikslas: mažinti sprendimų skaičių vienam rezultatui ir didinti pirmo rezultato greitį.

---

## 8) Galutinis verdiktas

Tai jau stipri, praktiška sistema brokerio darbui, bet premium SaaS lygiui trūksta ne funkcijų kiekio, o aiškesnės prioritetų hierarchijos vartotojo galvoje.

Jei reikia vienos esmės:
- **Mažiau dubliavimo, daugiau vieno aiškaus kelio.**

Kai vartotojas kiekviename etape mato vieną akivaizdų „kitas žingsnis“, produktas pradeda jaustis ne „feature-rich“, o „premium ir lengvas naudoti“.
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
