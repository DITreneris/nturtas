# UX hierarchija ir fokusas – planas

**Problema:** Ekranas atrodo kaip vidinis įrankis, o ne produktas. Vartotojas per pirmas 3 sek. nesupranta ką čia daryti ir kodėl tai verta naudoti. UI tvarko elementais, o ne sprendžia UX srautą.

**Tikslas:** 1 ekranas = 1 veiksmas. Aiški skaitymo trajektorija: Headline → CTA → Workflow → Tool. Puslapis turi atrodyti kaip „AI įrankis brokeriui“, ne „prompt generatorius“.

---

## 1. Pagrindinė UX klaida – per daug lygių

Dabar vartotojas mato 6 skirtingus UX lygius viename ekrane:

1. Hero blokas  
2. 4 žingsnių instrukcija (onboardingSteps)  
3. 2 CTA  
4. Modulis „NT brokerio centras“  
5. 4 tabai (Objektas / Skelbimas / Komunikacija / Derybos / Analizė)  
6. Forma  

**SaaS taisyklė:** 1 ekranas = 1 veiksmas. Čia veiksmas – „Sukurk NT skelbimą“.

---

## 2. Hero blokas – per daug informacijos

Hero dabar daro 4 dalykus: pristato produktą, aiškina workflow, duoda CTA, rodo instrukciją.

**Turi likti tik:**
- 1 value proposition  
- 1 CTA  
- 1 trumpas paaiškinimas  

**Pavyzdys:**

- **Headline:** NT brokerio AI asistentas  
- **Subtitle:** Per 60 sekundžių sukuria: skelbimą, atsakymą klientui, derybų strategiją  
- **CTA:** [ Sukurti skelbimą ]  

Instrukcija (workflow) – **po** CTA, ne hero viduje.

**Vieta:** [nt-broker-ui/src/App.tsx](nt-broker-ui/src/App.tsx) – hero-card; [config/sot.json](config/sot.json) – heroTitle, heroSubtitle, onboardingSteps, heroCtaPrimary, heroCtaSecondary.

---

## 3. Blogas informacijos srautas

Dabartinis: Hero → NT brokerio centras → Tabai → Forma. Painu.

**Teisingas SaaS srautas:**
1. Hero  
2. Pasirink veiksmą (režimas)  
3. Užpildyk laukus  
4. Gauk rezultatą  

---

## 4. Tabai per anksti

Tabai (Objektas, Skelbimas, Komunikacija, Derybos, Analizė) UX prasme per aukštai – vartotojas dar nieko nepadarė.

**Teisinga logika:**
- **STEP 1** – Pasirink veiksmą (Skelbimas / Atsakymas / Derybos)  
- **STEP 2** – Užpildyk laukus  
- **STEP 3** – Generuok  

Tabai turi būti aiškiai pažymėti kaip „1. Pasirink režimą“, o ne atskiras modulis „NT brokerio centras“ + tabai.

---

## 5. CTA klaida

Dabar: „Sukurti skelbimą“ + „Šablonų biblioteka“ – du vienodo svorio CTA.

**Pirmam ekrane – vienas CTA:** Sukurti skelbimą. Biblioteka – secondary (nuoroda arba mažesnis mygtukas).

**Vieta:** App.tsx header-cta; SOT heroCtaPrimary, heroCtaSecondary.

---

## 6. Vizualinė hierarchija

Reikalinga aiški skaitymo trajektorija:
1. Headline  
2. CTA  
3. Workflow (žingsniai)  
4. Tool (forma / output)  

Dabar viskas atrodo vienodai svarbu. Reikia tipografikos ritmo, whitespace, vieno dominuojančio CTA.

---

## 7. Tikslinė modulinė struktūra

```
--------------------------------
NT brokerio AI asistentas

Per 60 sek. sukurk skelbimą
[ Sukurti skelbimą ]
--------------------------------

1. Pasirink režimą
[ Skelbimas ] [ Atsakymas ] [ Derybos ]

--------------------------------

2. Įvesk informaciją
[ form fields ]

--------------------------------

3. Sugeneruok
[ Generuoti AI prompt ]
--------------------------------
```

Hero (headline + vienas CTA) → STEP 1 (režimai) → STEP 2 (forma) → STEP 3 (generavimo mygtukas / output).

---

## 8. UI polish problemos

- Per daug pill formos elementų – užteršia UI  
- Per daug gradientų – atrodo kaip landing, ne įrankis  
- Trūksta whitespace  
- Blokai per suspausti  
- Tipografija neturi ritmo  

**Vieta:** [nt-broker-ui/src/style.css](nt-broker-ui/src/style.css), SOT theme.

---

## 9. Greiti fixai (5 dalykai) – low hanging fruits

| # | Veiksmas | Vieta |
|---|----------|--------|
| 1 | Hero palik tik: headline + vienas CTA (secondary perkelti žemiau arba kaip link) | App.tsx hero-card; SOT copy |
| 2 | Workflow (onboardingSteps arba žingsniai) perkelk **po** CTA, ne virš jo | App.tsx hero sekcija |
| 3 | Tabus formaliai pažymėk kaip STEP 1 („1. Pasirink režimą“) – ops-center ir nav susieti į vieną bloką | App.tsx, SOT |
| 4 | Pirmam ekrane palik **vieną** pagrindinį CTA; Šablonų biblioteka – secondary (outline arba tekstinė nuoroda) | App.tsx header-cta |
| 5 | Padidink whitespace ~40% (padding, margin tarp sekcijų) | style.css, hero-card, form-card, ops-center |

---

## 10. Stratėginė klaida

Puslapis atrodo kaip **prompt generatorius**. Turi atrodyti kaip **AI įrankis brokeriui**. Skirtumas – vertės pasiūlymas, žodžiai ir vizualinė hierarchija turi atspindėti brokerio darbą (skelbimas, atsakymai, derybos), o ne „sugeneruok promptą“.

---

## Įgyvendinimo eilė

1. **Greiti fixai (9. skyrius)** – 5 punktai, mažos App.tsx + CSS + SOT pakeitimai.  
2. **Hero supaprastinimas** – 2 skyrius (vienas CTA, instrukcija po CTA).  
3. **Srauto perstruktūrizavimas** – 3, 4, 7 (STEP 1 / 2 / 3, tabai kaip „Pasirink režimą“).  
4. **Vizualinė hierarchija ir polish** – 6, 8 (whitespace, tipografika, gradientų mažinimas).

**Layout / navigacija / mobilumas** atskirai įgyvendinti pagal [.cursor/plans/ui_ux_realus_tobulinimo_planas.md](../.cursor/plans/ui_ux_realus_tobulinimo_planas.md) (sticky top bar, mobile top bar, temos mygtukas ikona, design tokenai, touch targets, scroll hint, padding).

---

## Susiję failai

- [nt-broker-ui/src/App.tsx](../nt-broker-ui/src/App.tsx) – hero, ops-center, nav, form, CTA  
- [nt-broker-ui/src/style.css](../nt-broker-ui/src/style.css) – spacing, hierarchy  
- [config/sot.json](../config/sot.json) – heroTitle, heroSubtitle, onboardingSteps, heroCtaPrimary, heroCtaSecondary, operationCenterLabel  
