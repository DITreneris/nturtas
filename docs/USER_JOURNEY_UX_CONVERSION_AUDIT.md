# Vartotojo kelionės ir konversijos UX auditas — NT Broker

**Data:** 2026-03-16  
**Rolė:** Senior UX Strategas, SaaS Product Designer, Conversion Optimization ekspertas  
**Produktas:** NT Brokerio Asistentas (DI Operacinė Sistema NT Brokeriui, Spin-off Nr. 7)  
**Etalonas:** Premium SaaS – aiškumas, greitas suvokimas, aukšta konversija  
**Auditorija:** Produkto kūrėjas / founderis – UX, suprantamumas, pirkimo/naudojimo konversija

---

## 1. First Impression Audit (pirmas įspūdis)

### 1.1 Ar aišku, kas tai per produktas?

| Kriterijus | Įvertinimas | Pastaba |
|------------|-------------|---------|
| **Pavadinimas** | ✓ Vidutiniškai | „NT Brokerio Asistentas“ – aišku, kad brokeriams; „Spin-off Nr. 7“ ir „Promptų anatomija“ badge gali painioti (du brandai vienu metu). |
| **Vertės žinutė** | △ Silpna | Hero subtitle ilgas: „Sukurk profesionalų skelbimą, klientų atsakymą ar derybų strategiją per 60 sek. su AI pagalba.“ – vertė aiški, bet kartu su badge’ais ir žingsniais per daug teksto pirmame ekrane. |
| **Kas čia daroma?** | △ Painu | Vartotojas mato: hero, 4 žingsnių instrukciją, du CTA (Generuoti + Šablonų biblioteka), „1. Pasirink režimą“, 5 tabus, formą. Nesupranta, ar pirmiausia spausti „Generuoti“, ar pasirinkti režimą, ar pildyti formą. |
| **Pirmas vizualinis fokusas** | ✓ Gerai | Navy hero, coral CTA – akis eina į titulą ir pagrindinį mygtuką. |

**Išvada:** Produktas atpažįstamas kaip „brokerių įrankis“, bet pirmąją sekundę vertė ir vienas aiškus veiksmas neužkrauna. Keli konkuruojantys elementai (badges, žingsniai, du CTA) didina kognityvinę apkrovą.

### 1.2 Ar aiški vertės žinutė?

- **Teigiama:** Subtitle tiesiogiai kalba apie naudą (60 sek., skelbimas, atsakymas, derybų strategija, AI).
- **Neigiama:** Nėra vieno trumpo „headline + vienas skaičius/benefit“. Pvz. „Sutaupyk iki 5 val. per savaitę“ yra kaip heroCtaMeta – atsiduria po CTA ir gali būti nematomas.
- **Rekomendacija:** Viena dominuojanti vertės eilutė viršuje (pvz. „NT skelbimas ar atsakymas klientui per 60 sek.“), o „Sutaupyk iki 5 val.“ – po CTA arba kaip trust elementas.

### 1.3 Ar vartotojas supranta, ką daryti toliau?

- **Ne visiškai.** Siūlomi du lygiaverčiai veiksmai: „Generuoti“ ir „Šablonų biblioteka“. Naujokas nežino, ar generuoti tuščią promptą, ar pirmiausia pasirinkti režimą, ar atidaryti šablonus.
- **Onboarding žingsniai** (1–4) duoda logiką, bet jie rodomi kartu su CTA – skaitymo seka neaiški (ar skaityti pirmiau, ar spausti).
- **Rekomendacija:** Vienas aiškus „pirmas žingsnis“: pvz. „1. Pasirink režimą (pvz. Skelbimas) → 2. Užpildyk laukus → 3. Spustelk Generuoti.“ Hero turi turėti vieną pagrindinį CTA; „Šablonų biblioteka“ – secondary (link arba mažesnis mygtukas).

---

## 2. User Journey Map (vartotojo kelionė)

### 2.1 Kelionės etapai

| Etapas | Aprašymas | Dabartinė būklė | Rizikos / trintys |
|--------|-----------|-----------------|--------------------|
| **Landing / pirmas ekranas** | Vartotojas atsiduria puslapyje | Hero + badges + 2 CTA + 4 žingsniai + jau matosi „1. Pasirink režimą“ ir tabai | Per daug informacijos; neaišku, kurį CTA spausti pirmą |
| **Produkto supratimas** | „Ką čia galiu daryti?“ | Subtitle ir rules („Ką gausite“) gali padėti; rules sutraukti | Supratimas įmanomas, bet reikia skaityti ir scrollinti; nėra trumpo „3 bullet“ benefits |
| **Pasitikėjimo formavimas** | Ar verta naudoti? | „Sutaupyk iki 5 val.“, „Sukurta brokeriams“, 4 rules (Lietuvių kalba, 30–60 sek., įtraukimas, brokerių darbas); nėra testimonials, skaičių, logotipų | Pasitikėjimas remiasi tik copy; nėra social proof |
| **Sprendimo momentas** | „Bandau dabar“ | CTA „Generuoti“ matomas; antrinis „Šablonų biblioteka“ konkuruoja | Dvigubas pasirinkimas; nėra aiškaus „Start here“ |
| **Pagrindinis veiksmas** | Signup / pirkimas / naudojimas | **Nėra registracijos/pirkimo** – produktas nemokamas, pagrindinis veiksmas = „sugeneruoti promptą ir nukopijuoti“. Konversija = pirmas sėkmingas copy į clipboard + naudojimas ChatGPT/Claude | Kelias iki pirmos „laimėjimo“ priklauso nuo to, ar vartotojas užpildo laukus; tuščias generavimas duoda tik bazinį promptą (naudinga), bet vartotojas gali nesuprasti, kad reikia įklijuoti į ChatGPT |

### 2.2 Vietos, kur vartotojas gali pasimesti

1. **Hero:** Dvigubas CTA – „Generuoti“ vs „Šablonų biblioteka“ – neaišku, kur pradėti.
2. **Po hero:** 5 režimų tabai be aiškios rekomendacijos pirmą kartą – „Rekomenduojama pradžia“ (Skelbimas) yra, bet vizualiai gali būti praryta.
3. **Forma:** Daug laukų (objekto duomenys + režimo specifiniai); vartotojas gali manyti, kad reikia užpildyti viską; „recommended“ laukai ne visada pakankamai paryškinti.
4. **Output:** Po generavimo – „Kopijuok ir įklijuok į ChatGPT“; naujokas gali nesuprasti, kad tai yra *užklausa* ChatGPT, o ne galutinis atsakymas.
5. **Sesijos / šablonai:** Sesijos atsiranda tik po generavimo; šablonų biblioteka žemiau – vartotojas gali jos niekada nepasiekti arba pamiršti.

---

## 3. Navigation Audit (navigacijos auditas)

### 3.1 Meniu struktūra

| Aspektas | Įvertinimas | Pastaba |
|----------|-------------|---------|
| **Top bar** | ✓ Gerai | Brand + kalbos (LT/EN/ES) + tema (šviesi/tamsi) – paprasta, aiški. |
| **Pagrindinė navigacija** | △ Priimtina | Nėra klasikinio meniu; yra režimų tabai (Objektas, Skelbimas, Komunikacija, Derybos, Analizė) – tai ir yra „navigacija“. Vienas puslapis, long scroll. |
| **Žymėjimas** | △ | „1. Pasirink režimą“ + tabai – logiška; bet „NT brokerio centras“ ir „Operation center“ gali skambėti kaip atskiras modulis, o ne tiesiog „žingsnis 1“. |

### 3.2 Informacijos logika

- **Pliusas:** Turinys eina iš viršaus į apačią: Hero → Pasirink režimą → Forma + Output → Šablonai → Community → Footer. Logiška.
- **Minusas:** Nėra „Back“ arba „Step 2 / Step 3“ vizualinio žymėjimo (tik „1. Pasirink režimą“); forma ir output atrodo kaip vienas blokas, ne „2. Užpildyk“ ir „3. Generuok“.

### 3.3 Ar vartotojas žino, kur spausti?

- **Hero:** Taip – coral „Generuoti“ traukia; bet antrinis CTA atima dėmesį.
- **Režimai:** Taip – tabai aiškūs; „Rekomenduojama pradžia“ padeda.
- **Forma:** Generuoti mygtukas matomas; „Šablonų biblioteka“ pakartotas – gali būti naudinga, bet daro du CTA vėl.
- **Output:** „KOPIJUOTI UŽKLAUSĄ“ aiškus; nuorodos į ChatGPT/Claude/Gemini – gerai.

### 3.4 Ar navigacija per sudėtinga?

- **Sudėtingumo lygis:** Vidutinis. Nėra daugiapuslapių meniu; bet viename ekrane daug sekcijų (hero, step1, forma, output, šablonai, community, footer). Mobile horizontalus scroll režimų – priimtina.
- **Rizika:** Naujokas nemato aiškaus „2“ ir „3“ žingsnio; gali manyti, kad reikia tik pasirinkti režimą ir spausti Generuoti, neįvedus duomenų (tuomet gaus bazinį promptą – naudinga, bet ne „pilnas“ rezultatas).

---

## 4. Value Communication (vertės komunikavimas)

### 4.1 Pagrindinė žinutė

- **Dabartinė:** „Sukurk profesionalų skelbimą, klientų atsakymą ar derybų strategiją per 60 sek. su AI pagalba.“
- **Stiprybė:** Konkretus laikas (60 sek.), konkretūs outputai (skelbimas, atsakymas, derybų strategija), AI.
- **Silpnybė:** Viena ilga sakinys; nėra vieno skaičiaus ar emocinio hook (pvz. „Sutaupyk 5 valandas per savaitę“ viršuje).

### 4.2 Produkto nauda

- **Rules blokas** („Ką gausite“): 4 punktai – kalba, greitis, įtraukimas, brokerių darbas. Gerai, bet sutrauktas – dalis vartotojų neatidarys.
- **heroCtaMeta:** „Sutaupyk iki 5 val. per savaitę. Sukurta brokeriams.“ – nauda ir auditorija; gali būti vizualiai silpnas (mažas tekstas po CTA).
- **Trūksta:** Skaičių (keli brokeriai naudoja, kiek skelbimų sugeneruota), atsiliepimų, „kas tai sprendžia“ viena sakinyje.

### 4.3 Ar vartotojas supranta problemą, kuri sprendžiama?

- **Taip, iš dalies.** Brokerio kontekstas aiškus (skelbimai, atsakymai, derybos). Problema – „daug laiko, reikia greitai ir profesionaliai“ – implikuota, ne išreikšta.
- **Rekomendacija:** Trumpas „problema“ prieš arba po subtitle: pvz. „Rašyti skelbimus ir atsakymus ranka užtrunka valandų. Čia – per minutę.“

---

## 5. Conversion Path Audit (konversijos kelio auditas)

### 5.1 CTA aiškumas

| CTA | Vieta | Aiškumas | Pastaba |
|-----|--------|-----------|---------|
| „Generuoti“ / „Sukurti skelbimą“ ir kt. | Hero, Forma | ✓ Gerai | Tekstas priklauso nuo režimo; aišku, kad tai pagrindinis veiksmas. |
| „Šablonų biblioteka“ | Hero, Forma | △ | Secondary, bet vizualiai galingas – atima dėmesį nuo „Generuoti“. |
| „KOPIJUOTI UŽKLAUSĄ“ | Output | ✓ Labai gerai | Aišku, matoma, vienas veiksmas. |
| „Prisijungti prie WhatsApp grupės“ | Community | ✓ | Aiškus secondary konversijos (community). |
| „Promptų anatomija →“ | Badge, footer | △ | Informacinis; gali nukreipti iš produkto. |

### 5.2 CTA matomumas

- **Hero CTA:** Coral, didelis – matomas. ✓
- **Form CTA:** Tas pats coral – gerai. ✓
- **Output CTA:** Pilnas plotis, coral – labai matomas. ✓
- **Antriniai CTA:** Outline / tekstinė nuoroda – tinkamai silpnesni.

### 5.3 Kiek žingsnių iki veiksmo?

- **Minimalus kelias:** Atidaryti puslapį → pasirinkti režimą (arba palikti default Skelbimas) → spausti „Generuoti“ → nukopijuoti. **3–4 klikai.** Gerai.
- **Pilnas kelias:** + užpildyti bent 1–2 laukus (lokacija, kaina) → Generuoti → Kopijuoti → eiti į ChatGPT. **5–7 veiksmai.** Priimtina.
- **Problema:** Jei vartotojas pradeda nuo „Šablonų biblioteka“, kelias ilgesnis ir ne tiesioginis į „pirmą laimėjimą“.

### 5.4 Konversijos trintis

1. **Dvigubas CTA hero** – vartotojas gali pasirinkti „Šablonų biblioteka“ ir atidėti generavimą.
2. **Daug formos laukų** – gali atrodyti, kad „reikia visko“; empty state hint „Pridėk bent lokaciją ir kainą“ padeda, bet vėlai (po bandymo generuoti).
3. **Output nepaaiškintas** – naujokas gali nesuprasti, kad tai *promptas* ChatGPT, o ne galutinis tekstas; reikia vieno sakinio po output: „Įklijuok į ChatGPT ir gausi paruoštą tekstą.“
4. **Nėra progreso indikatoriaus** – „1. Pasirink režimą“ yra; „2. Užpildyk“ ir „3. Generuok“ nėra pažymėti, todėl atrodo vienas didelis blokas.

---

## 6. Trust Signals (pasitikėjimo signalai)

### 6.1 Social proof

- **Dabartinė būklė:** Nėra atsiliepimų, vartotojų skaičiaus, atvejų.
- **Rekomendacija:** Net vienas testimonial arba „X brokerių jau naudoja“ (jei teisinga) stipriai padidintų pasitikėjimą.

### 6.2 Vartotojų skaičius / klientų logotipai

- **Dabartinė:** Nėra.
- **Rekomendacija:** Jei yra partneriai ar pilotai – logotipai arba „Naudoja: [X]“. Jei ne – nepridėti netikrų skaičių.

### 6.3 Testimonials

- **Dabartinė:** Nėra.
- **Rekomendacija:** 1–2 trumpi citatai brokerių (vardas, pareigos arba „NT brokeris“) po hero arba prieš footer.

### 6.4 Saugumo signalai

- **Dabartinė:** Nėra mokėjimų; produktas nemokamas. Footer – kontaktai (info@promptanatomy.app), copyright, nuoroda į Promptų anatomiją. Privatumo nuoroda (privacyUrl) tuščia SOT.
- **Rekomendacija:** Jei renkami duomenys – Privacy policy nuoroda; jei ne – gali likti minimaliai. Kontaktai jau yra – gerai.

### 6.5 Kiti pasitikėjimo elementai

- **„Sukurta brokeriams“**, **„Spin-off Nr. 7“** – rodo kilmę ir specializaciją. ✓
- **Rules („Ką gausite“)** – profesionalumas, kalba, greitis – teigiamai veikia. ✓
- **WhatsApp bendruomenė** – social proof ir palaikymas. ✓

---

## 7. Cognitive Load (kognityvinė apkrova)

### 7.1 Ar per daug teksto?

- **Hero:** Taip. Badges (2) + title + subtitle + CTA + meta + secondary CTA + 4 žingsniai – vienu metu per daug.
- **Forma:** Laukų daug, bet sugrupuoti (Objekto duomenys, Skelbimo nustatymai ir t. t.); collapsible blokai – gerai. Label’ai trumpi.
- **Output:** Minimalus tekstas; hint aiškus. ✓
- **Rekomendacija:** Hero sumažinti iki: headline + vienas subtitle + vienas CTA + viena meta eilutė; žingsnius perkelti žemiau arba sutraukti.

### 7.2 Ar informacija perkrauta?

- **Pirmas ekranas:** Taip – 6+ skirtingi blokai (badges, title, subtitle, CTA, meta, secondary, žingsniai, jau matosi step1 + tabai).
- **Scroll:** Forma + output + šablonai + community + footer – informacijos pakankamai, bet logiška; perkrauta pirmiausia viršus.

### 7.3 Ar vartotojas turi galvoti per daug?

- **Pasirinkimai:** 5 režimų – priimtina; yra rekomenduojama pradžia.
- **Forma:** „Ką įvesti?“ – firstStepHint ir emptyGenerateHint padeda; bet recommended laukai galėtų būti vizualiai paryškinti (pvz. žvaigždutė arba „Rekomenduojama“).
- **Output:** „Ką daryti su šiuo tekstu?“ – outputHint kalba apie ChatGPT; galima dar labiau pabrėžti vienu sakiniu virš textarea.

---

## 8. Micro UX Problems (mikro UX problemos) — 20+ punktų

| # | Problema | Vieta / pavyzdys | Poveikis |
|---|----------|-------------------|----------|
| 1 | Dvigubas CTA hero – du vienodo svorio veiksmai | Hero: „Generuoti“ + „Šablonų biblioteka“ | Sklaido dėmesį; neaišku, kur pradėti |
| 2 | Hero per daug elementų vienu metu | Badges, title, subtitle, CTA, meta, secondary, 4 žingsniai | Didelė kognityvinė apkrova pirmą sekundę |
| 3 | Onboarding žingsniai virš CTA arba lygiai | header-steps rodomi kartu su CTA | Skaitymo seka neaiški (skaityti ar spausti?) |
| 4 | „Rekomenduojama pradžia“ vizualiai ne visada matoma | mode-recommended-pill ant tabo | Naujokas gali pasirinkti bet kurį režimą be gido |
| 5 | Nėra aiškaus „2. Užpildyk laukus“ ir „3. Generuok“ | Tik „1. Pasirink režimą“ pažymėtas | Vartotojas nemato žingsnių progreso |
| 6 | Per daug formos laukų vienu metu | 10+ laukų kai kuriuose režimuose | Atrodo „reikia visko“; gali atbaidyti |
| 7 | Recommended laukai ne visur vizualiai paryškinti | fieldMeta.recommended – tik logika | Nesupranta, kurį minimumą užpildyti |
| 8 | Empty state hint tik po bandymo generuoti | emptyGenerateHint po kliko | Prieš tai vartotojas nežino, kad gali generuoti su minimumu |
| 9 | Output paaiškinimas gali būti stipresnis | outputHint – „įklijuok į ChatGPT“ | Naujokas gali manyti, kad tai galutinis tekstas |
| 10 | Nėra progreso / step indikatoriaus (Step 2/3) | Forma ir output be žingsnio numerio | Kelionė atrodo ne struktūrizuota |
| 11 | „Šablonų biblioteka“ CTA pakartotas hero ir formoje | Dvigubas secondary CTA | Dar kartą atima dėmesį nuo pagrindinio veiksmo |
| 12 | Rules („Ką gausite“) sutraukti – dalis neatidaro | rulesExpanded default false | Vertė nepasirodo visiems |
| 13 | Du brandai viršuje (NT Broker + Promptų anatomija) | badge-brand + badge-spinoff | Gali klaidinti: „kur aš esu?“ |
| 14 | Footer ir community daug nuorodų | Promptų anatomija, WhatsApp, kontaktai | Gerai, bet footer gali atrodyti per užimtas |
| 15 | Nėra „pirmo laimėjimo“ aiškino po copy | Po „Nukopijuota“ – „Nori daugiau?“ + link | Galima pridėti „Įklijuok į ChatGPT ir gauk atsakymą“ |
| 16 | Session list rodomas tik po generavimo | Sesijos sekcija conditional | Vartotojas gali nesužinoti apie išsaugojimą |
| 17 | No-template alert rodomas tik kai nėra šablono | Edge case – gerai; bet copy gali būti griežtesnis | Maža problema |
| 18 | Kalbų perjungimas (LT/EN/ES) be persist | Locale iš SOT – gali būti ok | Jei nepersist – grįžus gali būti LT |
| 19 | Tema (light/dark) be persist | Theme state lokalus | Tas pats – grįžus gali nustatyti iš naujo |
| 20 | Form card header – tik „REŽIMAS“ uppercase | Be trumpo „Ką čia darysi“ | Galima pridėti vieną eilutę konteksto |
| 21 | Ai tool links (ChatGPT, Claude, Gemini) – trys nuorodos | Output zonoje | Gerai, bet gali perkrauti; gal „Atidaryti ChatGPT“ vienas primary |
| 22 | Char count output – tik skaičius | charCountLabel | Pakanka; galima pridėti „simbolių“ vienetą aiškiau |
| 23 | Field progress „X/Y laukų“ – mažu šriftu | fieldProgressLabel | Gerai; gal būtų matomesnis virš formos |
| 24 | Community sekcija labai žemiau | Po šablonų | Dalies vartotojų nepasieks |
| 25 | Nėra sticky „Generuoti“ mobile | Form CTA scroll’ina kartu | Mobile gal būtų patogiau fiksuotas CTA žemiau |

---

## 9. Conversion Optimization Plan (patobulinimų planas)

### 9.1 Quick Wins (1 diena)

| ID | Veiksmas | Tikslas |
|----|----------|---------|
| QW1 | Hero: palikti **vieną** pagrindinį CTA (Generuoti); „Šablonų biblioteka“ – secondary (tekstinė nuoroda arba mažesnis outline mygtukas žemiau) | Sumažinti pasirinkimo stresą; aiškus pirmas žingsnis |
| QW2 | Onboarding žingsnius (1–4) perkelti **po** CTA ir meta eilutės; arba sutraukti į „Kaip naudoti“ | Skaitymo seka: Headline → CTA → Tada instrukcija |
| QW3 | Pridėti vieną sakinį virš output textarea, kai yra promptas: „Įklijuok į ChatGPT arba Claude – gausi paruoštą tekstą.“ (SOT copy) | Aiškinti output naudą ir kitą žingsnį |
| QW4 | Empty hint parodyti ir **prieš** pirmą generavimą: pvz. po režimų „Pridėk bent lokaciją ir kainą – rezultatas bus tikslesnis“ (jau firstStepHint panašus – suvienodinti) | Mažinti tuščio generavimo nustebimą |
| QW5 | „Rekomenduojama pradžia“ pill padaryti vizualiai ryškesnį (contrast, ikonėlė arba „Start čia“) | Nukreipti pirmą naudojimą į Skelbimą |
| QW6 | Rules („Ką gausite“) – default expanded pirmą sesiją (localStorage arba pirmas visit); arba 1–2 rules iškeliamos į hero | Vertė matoma iš karto |
| QW7 | Footer: Privacy nuoroda – jei URL tuščias, nerodyti arba „Privatumas (ruošiama)“ | Teisinis / pasitikėjimas |

### 9.2 Medium Improvements (1 savaitė)

| ID | Veiksmas | Tikslas |
|----|----------|---------|
| MW1 | Vizualiai pažymėti **Step 2** (Užpildyk laukus) ir **Step 3** (Generuok / Rezultatas) – pvz. ant form card „2. Įvesk informaciją“, ant output „3. Rezultatas ir kopijavimas“ | Aiški žingsnių kelionė; mažesnė kognityvinė apkrova |
| MW2 | Hero supaprastinimas: viena stipri vertės eilutė (pvz. „Skelbimas ar atsakymas klientui per 60 sek.“) + „Sutaupyk iki 5 val. per savaitę“ kaip subline arba po CTA | Greitesnis suvokimas vertės |
| MW3 | Formoje recommended laukus pažymėti (pvz. „Rekomenduojama“ label arba žvaigždutė); tooltip arba hint: „Bent šie laukai – tikslesnis rezultatas“ | Mažinti „ką vesti“ stresą |
| MW4 | Pridėti 1 testimonial bloką (citata + vardas/pareigos) – po hero arba prieš community | Social proof; pasitikėjimas |
| MW5 | Persist locale ir theme (localStorage); atkurti per SotProvider / state | Geresnė grįžtančio vartotojo patirtis |
| MW6 | Mobile: sticky CTA „Generuoti“ arba „Kopijuoti“ (kai yra output) – fixed bottom bar | Lengvesnis pasiekiamumas ant telefono |
| MW7 | „Pirmas laimėjimas“ po sėkmingo copy: trumpas toast arba eilutė „Įklijuok į ChatGPT ir gauk atsakymą per kelias sekundes“ | Patvirtinimas ir kitas žingsnis |

### 9.3 Strategic Changes (1 mėnuo)

| ID | Veiksmas | Tikslas |
|----|----------|---------|
| ST1 | **Vartotojo kelionės peržiūra:** A/B testas – hero su vienu CTA vs dabartinis (du CTA); matuoti „time to first generate“ ir „first copy“ | Duomenimis pagrįstas konversijos kelias |
| ST2 | **Trust blokas:** Skiltyje „Kodėl naudoti“ – 3–4 bullet (greitis, kalba, brokeriams, be registracijos); gal 1 skaičius („X+ brokerių“ jei teisinga) | Vertės ir pasitikėjimo stiprinimas |
| ST3 | **Onboarding flow (optional):** Pirmą apsilankymą – trumpas overlay arba modalas: „1. Pasirink Skelbimas → 2. Įvesk lokaciją ir kainą → 3. Generuok → 4. Kopijuok į ChatGPT“; Skip mygtukas | Aiški pirmą kartą kelionė |
| ST4 | **Analytics / UX events:** Jau yra ntbroker:ux (app_loaded, generate_clicked, output_copied_first…) – naudoti funnel analizei (landing → mode_select → generate → copy) | Identifikuoti kur nutrūksta konversija |
| ST5 | **Content hierarchy:** Tipografijos ir spacing – vienas dominuojantis headline, vienas CTA; design tokens (jau dalinai) – suvienodinti visą puslapį | Premium SaaS jausmas; mažesnė apkrova |
| ST6 | **Sesijos / šablonų matomumas:** Pirmą generavimą – trumpas hint „Galite išsaugoti sesiją ir vėliau atkurti“; šablonų nuoroda virš formos („Nerandi laukų? Pasižiūrėk šablonus“) | Didesnis naudojimas sesijų ir šablonų |
| ST7 | **Landing vs Tool:** Apsvarstyti atskirą minimalų „landing“ view (tik hero + vienas CTA + benefits) su „Pradėti“ → scroll į tool; arba palikti vieną puslapį, bet hero labai supaprastintas | Konversijos ir suvokimo balansas |

---

## 10. Santrauka ir prioritetai

### Stiprybės

- Produktas **aiškiai apibrėžtas** (NT brokeriams, AI, 60 sek.).
- **Pagrindinis CTA** (Generuoti, Kopijuoti) **matomas** ir suprantamas.
- **Navigacija** paprasta (vienas puslapis, režimų tabai); **top bar** švarus.
- **Vertė** išreikšta (rules, meta, subtitle); **pasitikėjimas** – copy ir kilmė (Promptų anatomija).
- **Kelias iki pirmos „laimėjimo“** trumpas (pasirinkti režimą → generuoti → kopijuoti).

### Kritinės silpnosios vietos

1. **Pirmas įspūdis:** Per daug informacijos hero; dvigubas CTA.
2. **Kelionės aiškumas:** Nėra vizualaus Step 2 / Step 3; neaišku, ar pirmiausia vesti duomenis, ar spausti Generuoti.
3. **Output nauda:** Ne visiems aišku, kad tai promptas ChatGPT, o ne galutinis tekstas.
4. **Pasitikėjimas:** Nėra social proof (testimonials, skaičiai).

### Rekomenduojama eilė

1. **Quick Wins** – CTA vienas hero, žingsniai po CTA, output paaiškinimas, rekomenduojamos pradžios paryškinimas.
2. **Medium** – Step 2/3 žymėjimas, hero supaprastinimas, recommended laukų vizualas, 1 testimonial, persist locale/theme.
3. **Strategic** – Trust blokas, onboarding overlay (optional), funnel analytics, ilgalaikis A/B ir content hierarchy.

---

*Dokumentas parengtas pagal nt-broker-ui, config/sot.json ir docs (PREMIUM_SAAS_UI_UX_AUDIT, UX_HIERARCHY_FOCUS_PLAN). SOT ir AGENTS.md laikomi.*
