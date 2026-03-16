# Kodo bazės analizės ataskaita

**Data:** 2026-03-16  
**Tikslas:** Neatitikimai, klaidos, bug'ai, UI/UX trikdžiai – ruošiam ataskaita.

---

## 1. Santrauka

| Kategorija | Būsena | Pastaba |
|------------|--------|---------|
| **Kokybės vartai (npm test)** | ✅ PASS | linear-gradient pakeistas į solid (2026-03-16 tvarkymas) |
| **SOT nuoseklumas** | ✅ Gerai | copy, režimai, tema iš SOT; defaultSot.theme sutampa su config/sot.json |
| **Unit / build** | ✅ | nt-broker-ui unit testai ir build veikia |
| **E2E** | ✅ | Scenarijai naudoja data-testid ir LT copy – stabilūs |
| **UI/UX smulkmenos** | ✅ Sutvarkyta | Kalbų aria-label dabar iš SOT; TemplatesInline turi building-2 ikoną |

---

## 2. Kritinė problema – kokybės vartas nepraeinamas — **IŠSPRĘSTA (2026-03-16)**

### 2.1 linear-gradient style.css

**Atlikta:** `.step1-nav::after` `background` pakeistas iš `linear-gradient(to right, transparent, var(--surface-1))` į `var(--surface-1)`. Solid paviršius atitinka STYLE_GUIDE; `npm run quality:premium` praeina.

---

## 3. Bug'ai ir neatitikimai

### 3.1 TemplatesInline – trūksta „building-2“ ikonos — **IŠSPRĘSTA (2026-03-16)**

**Atlikta:** Į `TemplatesInline.tsx` įtrauktas `Building2` iš lucide-react ir į ICON_MAP pridėta `'building-2': Building2`. „Objekto analizės šablonas“ dabar rodomas su pastato ikona.

---

### 3.2 Kalbos perjungiklio aria-label ne iš SOT — **IŠSPRĘSTA (2026-03-16)**

**Atlikta:** Į SOT copy (config/sot.json, sot.en.json, sot.es.json) ir defaultSot pridėti `languageGroupAriaLabel`, `localeLabelLt`, `localeLabelEn`, `localeLabelEs`. App.tsx kalbų grupė ir mygtukų aria-label naudoja šiuos copy su dc fallback.

---

### 3.3 loadSot – nėra validacijos libraryPrompts / libraryPromptId — **IŠSPRĘSTA (2026-03-16)**

**Atlikta:** Pridėta `validateLibraryPrompts(sot)` – po `isValidSot` tikrinama, ar režimų `libraryPromptId` atitinka `libraryPrompts[].id`. Jei nurodomas neegzistuojantis id – `console.warn`. Config vis tiek grąžinamas (soft validacija).

---

## 4. UI/UX pastabos (ne bug'ai)

- **Hero ir STEP 1:** Žr. `docs/UX_HIERARCHY_FOCUS_PLAN.md` – per daug lygių viename ekrane; rekomenduojama 1 ekranas = 1 veiksmas, vienas pagrindinis CTA.
- **Touch targets:** Mygtukai (kalbos, tema, režimai) – įsitikinti, kad min ~44px aukštis (a11y); dabartiniai padding'ai atitinka.
- **Session copy feedback:** Naudoja `'success' | 'error'` stringą – copy tekstas imamas iš SOT (`copySuccess` / `copyFailed`), gerai.
- **defaultSot tema:** Sutampa su `config/sot.json` theme – fallback vizualiai atitinka SOT.

---

## 5. Kas jau gerai (patvirtinta 2026-03-16)

- **SOT copy:** Naudojami `whenToUseLabel`, `modeNavAriaLabel`; dauguma copy iš SOT su dc fallback.
- **OBJEKTAS režimas:** Turi `libraryPromptId: "objekto_analize"` ir atitinkamą šabloną `libraryPrompts`.
- **copy-sot:** Jei `config/sot.json` nerandamas – `process.exit(1)`.
- **loadingLabel:** Yra SOT copy ir defaultSot.
- **Tonas (select):** Opcijos valdomos iš SOT `fieldMeta.tonas.options`; ModeForm naudoja `meta?.options`.
- **Docs hygiene:** Praeina; INDEX.md kontraktas laikomas.
- **E2E:** Naudoja `data-testid` ir tekstinius selektorius – pakankamai stabilūs prieš SOT copy pakeitimus.

---

## 6. Rekomenduojami žingsniai (prioritetas)

| # | Veiksmas | Tipas | Būsena |
|---|----------|--------|--------|
| 1 | Pašalinti `linear-gradient` `.step1-nav::after` | Kokybės vartas | **Atlikta** |
| 2 | Pridėti `building-2` į TemplatesInline ICON_MAP | Bug | **Atlikta** |
| 3 | Kalbos grupės ir mygtukų aria-label iš SOT (i18n) | Tobulinimas | **Atlikta** |
| 4 | loadSot – validacija libraryPrompts / libraryPromptId | Patikimumas | **Atlikta** |

---

## 7. Testų vykdymo rezultatas

- **2026-03-16 (po tvarkymo):** `npm run test:docs` – ✅ PASS; `npm run quality:premium` – ✅ PASS (linear-gradient pašalintas). Rekomenduojama paleisti pilną `npm test` (test:ui, test:e2e).

Ataskaitą parengė pagal AGENTS.md ir `docs/INDEX.md` (SOT, aktyvi dokumentacija).
