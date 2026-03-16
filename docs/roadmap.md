# Roadmap (NT Broker – UI/UX iteracijos)

Čia – trumpa eilė (detalės lokaliai pagal poreikį).

## Įgyvendinta

- **Footer ir Prompt Anatomy:** semantinis `<footer>`, nuoroda į https://www.promptanatomy.app/, kontaktai, pasteikė; SOT `contactEmail`, `footerContactLabel`, `footerCredit` (LT/EN/ES).
- **Stabilumas:** defaultSot pilnai sinchronizuotas su SOT (theme, libraryPrompts, rules, colors, cta); copy-sot `exit(1)` be šaltinio.
- **Srauto aiškumas:** firstStepHint; generavimo be šablono pranešimas + CTA „Šablonai"; tema perkelta į header.
- **Mobilumas ir a11y:** Skip link; modalo focus trap + return focus; setTimeout cleanup.
- **Poliravimas:** sutraukiamos taisyklės; hardkoduoti fallback'ai pakeisti defaultSot nuorodomis.

## Įgyvendinta (IA/UX refactor 2026-03)

- **Informacijos architektūra:** Pašalintas instrukcijų blokas („Kaip naudoti“); vizualus flow stepper: Režimas → Duomenys → Generuoti → Kopijuoti (4 ikonos).
- **Forma:** Tik 5 pagrindiniai laukai (tipas, lokacija, kaina, plotas, privalumai); likusieji – „Papildomi nustatymai“ (collapse, default sutraukta).
- **Rezultatas:** Pristatymas kaip preview kortelė (antraštė + turinys + vienas CTA Kopijuoti); pašalinti AI tool links iš pagrindinio output.
- **Spalvos:** 1 primary (#0B1F3A), 1 accent (#3B82F6), 1 neutral (#F3F4F6); viena CTA spalva.
- **Hero:** Vienas fokusas – „Sukurk NT skelbimą per 30 sek.“; vienas pagrindinis CTA (Generuoti).

## Tolesnė eilė

| Fazė | Turinys |
|------|--------|
| **Forma ir rezultatas** | Validacija 1–2 laukams; pasirinktinai „Generuoti dar kartą" / „Redaguoti". |
| **Poliravimas** | Skeleton loading; touch target patikra. |

Prioritetas: Poliravimas.
