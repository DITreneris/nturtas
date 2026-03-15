# Kodo bazės analizė (NT Broker – SOT)

**Data:** 2026-03-15  
**Tikslas:** Gilus peržiūrimas prieš deploy – neatitikimai, klaidos, tobulinimai.

---

## 1. Santrauka

- **SOT principas** laikomas: copy, režimai, tema skaitomi iš `config/sot.json`; UI naudoja SotProvider/useSot.
- **Kritinės rizikos:** defaultSot tema skiriasi nuo SOT; OBJEKTAS režimas neturi `libraryPromptId` – naudojamas `prompts[0]`; copy-sot esant trūkstam šaltiniui neišmeta klaidos.
- **Rekomenduojama prieš deploy:** sutapatinti defaultSot temą su SOT, pridėti `copy.loadingLabel` į SOT, copy-sot – fail jei šaltinis nerastas, peržiūrėti base URL deploy kontekstui.

---

## 2. Kritinės problemos ir rizikos

### 2.1 defaultSot tema skiriasi nuo config/sot.json

**Vieta:** `nt-broker-ui/src/sot/defaultSot.ts`

Kai SOT nepakraunamas (404, tinklo klaida arba validacijos klaida), naudojamas `defaultSot`. Jo `theme.light` ir `theme.dark` reikšmės **skiriasi** nuo `config/sot.json` (pvz. `--primary`, `--surface-0` – vienas naudoja plokščias spalvas, kitas gradientus). Rezultatas: vartotojas gali pamatyti **skirtingą išvaizdą** priklausomai nuo to, ar SOT užsikrovė, ar buvo naudojamas fallback.

**Rekomendacija:** Sutapatinti `defaultSot.theme` su `config/sot.json` theme (nukopijuoti tas pačias CSS kintamųjų reikšmes), kad fallback vizualiai atitiktų normalų SOT režimą.

---

### 2.2 OBJEKTAS režimas be libraryPromptId

**Vieta:** `config/sot.json` – režimas OBJEKTAS neturi `libraryPromptId`.  
**Vieta:** `nt-broker-ui/src/App.tsx` – `handleGenerate`:

```ts
const template = promptId
  ? prompts.find((p) => p.id === promptId)
  : prompts[0]
```

Kai režimas OBJEKTAS, naudojamas `prompts[0]` – t.y. pirmas įrašas iš `libraryPrompts`. Jei SOT bus pakeistas (eilės tvarka ar pridedami šablonai), OBJEKTAS gali „gauti“ netinkamą šabloną. Be to, `defaultSot` turi `libraryPrompts: []` – tada `prompts[0]` būtų `undefined` ir `basePrompt` būtų `''`.

**Rekomendacija:**  
- Arba SOT apibrėžti OBJEKTAS režimui atitinkamą `libraryPromptId` (ir atitinkamą promptą `libraryPrompts` masyve),  
- Arba kode aiškiai apdoroti atvejį, kai režimas neturi `libraryPromptId`: pvz. rodyti pranešimą „Pasirinkite režimą su šablonu“ arba naudoti tik tam režimui skirtą default tekstą, o ne `prompts[0]`.

---

### 2.3 copy-sot: trūkstamas šaltinis – exit 0

**Vieta:** `nt-broker-ui/scripts/copy-sot.cjs`

Jei `config/sot.json` neegzistuoja, skriptas tik spausdina įspėjimą ir daro `process.exit(0)`. Buildas toliau eina, bet `public/config/sot.json` nebus atnaujintas (arba nebus sukurtas). CI to nepagauna; gali būti naudojama senoji arba neturima konfigūracija.

**Rekomendacija:** Jei `config/sot.json` nerandamas, daryti `process.exit(1)`, kad CI ir lokalus buildas „lūžtų“ ir būtų aišku, kad SOT šaltinis privalomas.

---

### 2.4 config/sot.json neturi copy.loadingLabel

**Vieta:** `config/sot.json` – `copy` objekte nėra `loadingLabel`.  
**Vieta:** `nt-broker-ui/src/App.tsx` – naudojama `sot?.copy?.loadingLabel ?? 'Kraunama...'`.

Dabar loading tekstas visada fallback’as iš kodo. Kad visi UI tekstai būtų valdomi per SOT, `loadingLabel` turėtų būti SOT dalis.

**Rekomendacija:** Pridėti į `config/sot.json`: `"loadingLabel": "Kraunama..."` (ir atitinkamai į `nt-broker-ui/public/config/sot.json` po copy-sot).

---

## 3. Neatitikimai ir smulkūs trūkumai

### 3.1 Hardkoduoti UI tekstai (ne iš SOT)

Šie tekstai nėra valdomi per SOT; jei reikia vienodos vietos visiems copy – juos perkelti į SOT arba palikti kaip sąmoningą sprendimą (pvz. dev tekstai).

| Tekstas | Vieta |
|--------|--------|
| „Kopijuoti“, „Nukopijuota“, „Kopijuoti nepavyko“ | App.tsx |
| „Bandyti dar kartą“, „Klaida:“ | App.tsx (klaidos blokas) |
| „Šablonai“, „Kopijuoti“, „Naudoti“, „Uždaryti“ | LibraryPromptsModal.tsx |
| „Pasirinkite“ (select placeholder) | ModeForm.tsx |
| „Tema: … SOT pakrautas …“ | App.tsx (footer) |
| „Perjungti į tamsų/šviesų režimą“ | App.tsx (theme mygtukas) |
| „Taisyklės“ (aria-label) | App.tsx |
| „Promptų anatomija →“ | App.tsx (nuorodos tekstas) |

**Rekomendacija:** Norint pilno SOT valdymo – į SOT įvesti `copy` laukus (pvz. `copyErrorLabel`, `copyRetryLabel`, `modalTitleTemplates`, `btnCopy`, `btnUse`, `btnClose`, `selectPlaceholder`, `themeToggleLabel`, `rulesAriaLabel`, `promptAnatomyLinkText`) ir naudoti juos komponentuose. Kitu atveju – dokumentuoti, kad tai sąmoningi fallback’ai.

---

### 3.2 Tonas (select) – opcijos hardkoduotos

**Vieta:** `nt-broker-ui/src/components/ModeForm.tsx` – `TONAS_OPTIONS = ['premium', 'neutralus', 'draugiškas']`.

Jei reikia keisti tono reikšmes per SOT (pvz. kita kalba ar kiti variantai), dabar reikėtų keisti kodą.

**Rekomendacija:** Jei SOT turi valdyti ir select opcijas – į `fieldMeta.tonas` (arba atskirą SOT struktūrą) įvesti `options: string[]` ir naudoti jas ModeForm.

---

### 3.3 Taisyklės: ikona visada CheckCircle

SOT `rules` turi lauką `icon` (pvz. `"check-circle"`), bet App.tsx visada naudoja `<CheckCircle>`. Jei ateityje bus skirtingos ikonos per režimą – reikėtų map’inti `rule.icon` į komponentą.

Dabartiniu mastu – ne klaida, tik galima tobulinti, jei reikės.

---

### 3.4 loadSot validacija – libraryPrompts ir libraryPromptId

`isValidSot` tikrina tik `modes`, `theme`, `copy`. Neticinama, ar `libraryPrompts` yra masyvas, ar režimų `libraryPromptId` atitinka `libraryPrompts` id. Sugedus ar per klaidą pakeitus SOT, gali būti „orphan“ id arba tuščias sąrašas.

**Rekomendacija:** Optionally – validacijoje tikrinti, kad `libraryPrompts` yra array, o režimai su `libraryPromptId` nurodo egzistuojantį id (arba bent jau loginti įspėjimą).

---

## 4. Infrastruktūra ir deploy

### 4.1 Vite base URL

**Vieta:** `nt-broker-ui/vite.config.ts` – `base: '/07_NT_brokeris/nt-broker-ui/'`.

Tai tinka konkretaus repo kelio kontekstui (pvz. GitHub Pages po `/07_NT_brokeris/nt-broker-ui/`). Jei deploy’insite į kitą path (pvz. root `/` ar kitas subpath), reikia naudoti `base` pagal aplinką (pvz. `process.env.BASE_URL` arba build-time env).

**Rekomendacija:** Prieš deploy nustatyti tikrąjį base path; jei reikia – naudoti env kintamąjį ir dokumentuoti deploy scenarijus.

---

### 4.2 E2E base URL

**Vieta:** `package.json` – `test:e2e` naudoja `BASE_URL=http://127.0.0.1:4173/07_NT_brokeris/nt-broker-ui/`; `playwright.config.js` – tas pats baseURL.

E2E ir preview turi atitikti tą patį path. Jei keisite Vite `base`, reikia atnaujinti ir E2E BASE_URL.

---

### 4.3 index.html title ir favicon

**Vieta:** `nt-broker-ui/index.html` – `title` ir `link rel="icon"` hardkoduoti („DI Operacinė Sistema NT Brokeriui“, `/vite.svg`). SOT valdo produktą, bet HTML meta – ne.

**Rekomendacija:** Jei reikia dinamiškumo – title gali būti keičiamas per `document.title` po SOT pakrovimo; favicon gali likti statinis arba būti keičiamas per SOT (pvz. `brand.faviconUrl`).

---

## 5. Kokybė ir testai

- **Docs hygiene:** Veikia; draudžiami patternai ir INDEX.md kontraktas tikrinami.
- **nt-broker-ui:** Unit (Vitest) + build (tsc + vite) – rekomenduojama `npm test` prieš commit.
- **E2E:** `npm run test:e2e` reikalauja preview serverio; CI juos paleidžia. E2E naudoja `data-testid` ir tekstinius selektorius – jei keisite SOT copy, verta turėti stabilius data-testid, kad testai nelūžtų nuo teksto pakeitimų.
- **CI:** Lint + root test (docs, nt-broker-ui copy-sot, build, unit) + E2E – pakanka prieš deploy, jei copy-sot bus griežtas (exit 1 be šaltinio).

---

## 6. Rekomenduojami žingsniai prieš deploy

1. **Privaloma:**  
   - Sutapatinti `defaultSot.theme` su `config/sot.json` theme.  
   - Į SOT pridėti `copy.loadingLabel`.  
   - copy-sot: jei `config/sot.json` nerandamas – `process.exit(1)`.

2. **Rekomenduojama:**  
   - OBJEKTAS: arba pridėti `libraryPromptId` + atitinkamą promptą, arba kode aiškiai apdoroti atvejį be šablono (ne naudoti `prompts[0]` be tikrinimo).  
   - Patikrinti Vite `base` ir E2E BASE_URL atitikimą su tikru deploy keliu.

3. **Optionally:**  
   - Perkelti likusius hardkoduotus UI tekstus į SOT (loading, klaidos, mygtukai, modalai).  
   - Tonas select opcijas valdyti iš SOT.  
   - loadSot – papildoma validacija `libraryPrompts` ir `libraryPromptId` atitikimo.

---

## 7. Dokumentacijos atnaujinimas

- Šis dokumentas (`docs/CODEBASE_ANALYSIS.md`) atnaujintas 2026-03-15; ankstesnė analizė (2026-03-08) buvo iš dalies peržengta (pvz. CTA handler’iai jau prijungti, formos ir generavimas įdiegti).
- `docs/INDEX.md` jau nurodo šią analizę „Kodo navigacija“ skiltyje – atitinka.
