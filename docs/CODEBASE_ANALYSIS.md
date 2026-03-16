# Kodo bazės analizė (NT Broker – SOT)

**Data:** 2026-03-15 (atnaujinta 2026-03-16)  
**Tikslas:** Gilus peržiūrimas prieš deploy – neatitikimai, klaidos, tobulinimai.

**2026-03-16 ataskaita:** Žr. [docs/ATASKAITA_2026-03-16.md](ATASKAITA_2026-03-16.md) – pilnas šios dienos rezultatas (kokybės vartas, bug'ai, UI/UX).

---

## 1. Santrauka

- **SOT principas** laikomas: copy, režimai, tema skaitomi iš `config/sot.json`; UI naudoja SotProvider/useSot.
- **Jau išspręsta (2026-03-15):** copy-sot jau naudoja `process.exit(1)` be šaltinio; `config/sot.json` jau turi `loadingLabel`; OBJEKTAS režimas – pridėtas `libraryPromptId: "objekto_analize"` ir atitinkamas šablonas `libraryPrompts`; pridėti SOT copy laukai `whenToUseLabel`, `modeNavAriaLabel` (i18n); sutrumpintas dubliuotas lucide-react import App.tsx.
- **2026-03-16:** defaultSot.theme sutampa su config/sot.json. **Tvarkymas (2026-03-16):** linear-gradient pašalintas (solid `var(--surface-1)`); TemplatesInline – pridėta `building-2` ikona; kalbų aria-label iš SOT (`languageGroupAriaLabel`, `localeLabelLt/En/Es`); loadSot – pridėta `validateLibraryPrompts()` (įspėjimas, jei režimo libraryPromptId nerandamas).
- **Likusios rekomendacijos:** base URL deploy kontekstui; index.html title/favicon – pagal poreikį iš SOT.

---

## 2. Kritinės problemos ir rizikos

### 2.1 defaultSot tema vs config/sot.json — **SUTAPATINTA (2026-03-16)**

**Vieta:** `nt-broker-ui/src/sot/defaultSot.ts`

Patikrinta 2026-03-16: `defaultSot.theme.light` ir `defaultSot.theme.dark` reikšmės **sutampa** su `config/sot.json` theme (tie patys CSS kintamieji). Fallback vizualiai atitinka SOT režimą.

---

### 2.2 OBJEKTAS režimas be libraryPromptId — **IŠSPRĘSTA (2026-03-15)**

**Buvo:** Režimas OBJEKTAS neturėjo `libraryPromptId`, naudojamas buvo `prompts[0]`.  
**Pataisyta:** Į `config/sot.json` (ir lt/en/es) pridėtas `libraryPromptId: "objekto_analize"` režimui OBJEKTAS ir į `libraryPrompts` pridėtas šablonas `objekto_analize` (objekto vertinimo/analizės promptas). Tas pats atnaujinta `defaultSot.ts`.

---

### 2.3 copy-sot: trūkstamas šaltinis — **IŠSPRĘSTA**

**Vieta:** `nt-broker-ui/scripts/copy-sot.cjs`. Skriptas jau naudoja `process.exit(1)`, jei `config/sot.json` nerandamas.

---

### 2.4 config/sot.json neturi copy.loadingLabel — **JAU YRA**

`config/sot.json` jau turi `"loadingLabel": "Kraunama..."`; EN/ES locale failai – atitinkamus vertimus.

---

## 3. Neatitikimai ir smulkūs trūkumai

### 3.1 Hardkoduoti UI tekstai (ne iš SOT) — iš dalies sutvarkyta

**Atnaujinta (2026-03-15):** Į SOT įvesti ir naudojami `whenToUseLabel`, `modeNavAriaLabel` – forma ir nav aria-label dabar iš SOT (i18n). Dauguma klaidos/copy tekstų jau naudoja `copy.*` su dc fallback.

Likusieji per SOT valdomi arba fallback: copyErrorLabel, copyRetryLabel, btnCopy, btnUse, btnClose, selectPlaceholder, themeToggleLabel*, rulesTitle, promptAnatomyLinkText – visi naudoja `copy.* ?? dc.*`.

| Tekstas | Vieta | Būsena |
|--------|--------|--------|
| „Kada naudoti:“ / „When to use:“ | App.tsx | **SOT:** `whenToUseLabel` |
| „Režimų pasirinkimas“ (nav aria-label) | App.tsx | **SOT:** `modeNavAriaLabel` |
| Kiti (klaidos, mygtukai, taisyklės) | App.tsx, ModeForm, TemplatesInline | Fallback iš defaultSot; SOT copy jau turi atitinkamus laukus |

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

### 3.4 loadSot validacija – libraryPrompts ir libraryPromptId — **PRIDĖTA (2026-03-16)**

Pridėta `validateLibraryPrompts(sot)`: po sėkmingo load tikrinama, ar režimų `libraryPromptId` atitinka `libraryPrompts[].id`. Jei nurodomas neegzistuojantis id – `console.warn`. Config vis tiek grąžinamas (soft validacija).

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

## 7. Low-hanging fruits (greiti pataisymai)

| Pataisymas | Būsena | Pastaba |
|------------|--------|--------|
| Dubliuotas `lucide-react` import App.tsx | **Atlikta** | Sujungtas į vieną importą (Save, Trash2 į bendrą sąrašą). |
| `whenToUseLabel` ir `modeNavAriaLabel` iš SOT | **Atlikta** | Pridėta į config/sot.json, defaultSot, types; App naudoja copy/dc; EN/ES locale atnaujinti. |
| OBJEKTAS `libraryPromptId` + šablonas | **Atlikta** | Pridėtas `objekto_analize` į libraryPrompts ir OBJEKTAS režimas. |
| Tonas select opcijos iš SOT | Atidėta | `fieldMeta.tonas.options` jau SOT; ModeForm naudoja `meta?.options` – jei SOT turi options, veikia. Patikrinti, ar SOT visur turi tonas.options. |
| loadSot: validacija libraryPrompts/id | Atidėta | Optional – loginti įspėjimą arba tikrinti masyvą ir id atitikimą. |

---

## 8. Micro UI/UX pagerinimai

- **Touch targets:** Mygtukai (LT/EN/ES, tema, režimų tabai) – įsitikinti, kad min ~44px aukštis (a11y). Dabartiniai padding’ai (`0.75rem 1.5rem`) pakanka; mobile verta peržiūrėti.
- **Skip to content:** Jau yra; naudojamas `copy.skipToContentLabel` – gerai.
- **Klaidos blokas:** Turi `role="alert"`, retry mygtukas – gerai; galima pridėti `aria-describedby` jei reikia.
- **Output textarea:** `aria-label={outputTitle}` – gerai; placeholder naudoja copy.
- **Session list:** Atkurti/Kopijuoti/Ištrinti – mygtukai turi tekstą iš SOT; aria-label galima pridėti jei tik icon.
- **Vizualinė hierarchija:** Žr. `docs/UX_HIERARCHY_FOCUS_PLAN.md` ir `docs/PREMIUM_UX_UI_DEEP_DIVE.md` – hero supaprastinimas, vienas pagrindinis CTA, STEP 1/2/3 srautas – strateginiai, ne vienkartiniai fixai.

---

## 9. Dokumentacijos atnaujinimas

- Šis dokumentas (`docs/CODEBASE_ANALYSIS.md`) atnaujintas 2026-03-15; įrašyti atlikti pataisymai (OBJEKTAS, whenToUseLabel, modeNavAriaLabel, import, copy-sot/loadingLabel būsenos).
- `docs/INDEX.md` jau nurodo šią analizę „Kodo navigacija“ skiltyje – atitinka.
