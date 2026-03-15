# Agentų taisyklės (NT Broker – SOT)

Tikslas: vienareiksmis darbo modelis atitinkantis **SOT** (`config/sot.json`) – „DI Operacinė Sistema NT Brokeriui“ (Spin-off Nr. 7).

## SOT kaip tiesos šaltinis

- **Produktas:** NT broker operacinė sistema – profesionalūs NT promptai, skelbimai ir klientų komunikacija per 30–60 sek.
- **Konfigūracija:** `config/sot.json` (root) ir `nt-broker-ui/public/config/sot.json` (build) – brand, copy, režimai (modes), tema, libraryPrompts, taisyklės (rules).
- **UI:** `nt-broker-ui` (React + Vite) – visi tekstai, režimai ir stiliai skaitomi iš SOT; nehardkoduoti copy/modes, kurie turi būti iš SOT.
- Aktyvi dokumentacija ir kodo navigacija: **`docs/INDEX.md`**.

## Rolės ir atsakomybės

- **Orchestrator** – valdo prioritetą, suformuoja užduoties aprašą ir priima galutinį rezultatą. Užtikrina, kad pakeitimai atitiktų SOT.
- **Content** – atsako už copy, promptų semantiką ir brokerio konteksto aiškumą; pakeitimai į copy/prompts/rules – per SOT (`config/sot.json`), ne kode.
- **UI/UX** – atsako už vartotojo srautą, režimų (Objektas, Skelbimas, Komunikacija, Derybos, Analizė) hierarchiją, mobile ir a11y; naudoja SOT modes/copy/theme.
- **QA** – vykdo kokybės vartus ir pateikia release rekomendaciją.

## Stage-gate darbo seka

1. **Intake (Orchestrator)**  
   Sukuria trumpą užduoties aprašą: tikslas, apribojimai, priėmimo kriterijai, liečiami failai. Jei keičiamas turinys/režimai – nurodo SOT.
2. **Implement (Content + UI/UX)**  
   Įgyvendina pakeitimus. Copy, režimai, taisyklės – per `config/sot.json`; UI logika – nt-broker-ui. Pateikia dokumentų delta sąrašą.
3. **Verify (QA)**  
   Paleidžia testų vartus pagal pakeitimo tipą.
4. **Release readiness (Orchestrator + QA)**  
   Užduotis uždaroma tik jei praeina kodas, SOT nuoseklumas ir testų vartai.

## Kokybės vartai

- **Visada privaloma:** `npm test` (root ir/arba `nt-broker-ui`, jei taikoma).
- **Jei keistas UX / flow / interakcijos:** `npm run test:smoke` ir `npm run test:a11y` (jei konfigūruota).
- **Jei keistas kritinis srautas (formos, generavimas, sesijos, kopijavimas):** `npm run test:e2e` (jei konfigūruota).
- **CI yra tiesos šaltinis:** lokalus minimumas negali prieštarauti CI vartams.
- **nt-broker-ui build:** prieš release – `cd nt-broker-ui && npm run build` sėkmingas.

## Aktyvi dokumentacija

- Kanoninis aktyvių dokumentų sąrašas – **`docs/INDEX.md`**.
- Jei failas nėra pažymėtas aktyvus `docs/INDEX.md`, jis laikomas archyvu.
- Archyvo failai neatnaujinami, nebent jie aiškiai grąžinti į aktyvią zoną.
- SOT aprašas ir naudojimas – per `config/sot.json` ir `nt-broker-ui` (SotProvider, useSot); papildomai – aktyvūs dokumentai iš INDEX.md.
