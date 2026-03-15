# Roadmap (NT Broker – UI/UX iteracijos)

Kanoninis planas – [`.cursor/plans/footer_ir_ux_iteration_plan.md`](../.cursor/plans/footer_ir_ux_iteration_plan.md). Čia – trumpa eilė.

## Įgyvendinta

- **Footer ir Prompt Anatomy:** semantinis `<footer>`, nuoroda į https://www.promptanatomy.app/, kontaktai (mailto: info@promptanatomy.app), pasteikė, tema; SOT `contactEmail`, `footerContactLabel`, `footerCredit` (LT/EN/ES).

## Tolesnė eilė

| Fazė | Turinys |
|------|--------|
| **Stabilumas** | defaultSot ≈ SOT (theme); OBJEKTAS be šablono – pranešimas; copy-sot `exit(1)` be šaltinio. |
| **Srauto aiškumas** | firstStepHint; generavimo be šablono pranešimas + CTA „Šablonai“; tema į header. |
| **Forma ir rezultatas** | Validacija 1–2 laukams; pasirinktinai „Generuoti dar kartą“ / „Redaguoti“. |
| **Mobilumas ir a11y** | Skip link; modalo focus trap + return focus; touch target patikra. |
| **Poliravimas** | Skeleton loading; sutraukiamos taisyklės; papildomas aukso akcentas. |

Prioritetas: Stabilumas → Srauto aiškumas → Forma/rezultatas; Mobilumas ir Poliravimas – pagal poreikį.
