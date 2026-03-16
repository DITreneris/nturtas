# Roadmap (NT Broker – UI/UX iteracijos)

Čia – trumpa eilė (detalės lokaliai pagal poreikį).

## Įgyvendinta

- **Footer ir Prompt Anatomy:** semantinis `<footer>`, nuoroda į https://www.promptanatomy.app/, kontaktai, pasteikė; SOT `contactEmail`, `footerContactLabel`, `footerCredit` (LT/EN/ES).
- **Stabilumas:** defaultSot pilnai sinchronizuotas su SOT (theme, libraryPrompts, rules, colors, cta); copy-sot `exit(1)` be šaltinio.
- **Srauto aiškumas:** firstStepHint; generavimo be šablono pranešimas + CTA „Šablonai"; tema perkelta į header.
- **Mobilumas ir a11y:** Skip link; modalo focus trap + return focus; setTimeout cleanup.
- **Poliravimas:** sutraukiamos taisyklės; hardkoduoti fallback'ai pakeisti defaultSot nuorodomis.

## Tolesnė eilė

| Fazė | Turinys |
|------|--------|
| **Forma ir rezultatas** | Validacija 1–2 laukams; pasirinktinai „Generuoti dar kartą" / „Redaguoti". |
| **Poliravimas** | Skeleton loading; touch target patikra; papildomas aukso akcentas. |

Prioritetas: Forma/rezultatas → Poliravimas.
