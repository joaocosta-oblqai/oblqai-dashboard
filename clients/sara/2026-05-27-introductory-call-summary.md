# Sara — Introductory Meeting Summary

**Date:** 2026-05-27
**Practice:** Aesthetic clinic, Portugal. Owner: Sara. Exact clinic name and location TBC.
**Vertical (our packaging):** Healthcare Clinics → Practice Command
**Tier pitched in call:** Tier 1 (Claude Cowork Setup). Cowork-first house rule applies; Tier 2 (Hugo / Hermes-style autopilot) not pitched and not pre-promised.
**Meeting type:** Introductory — **NOT a formal discovery.** First conversation to introduce OBLQAI and get a first sense of how the clinic operates. A real discovery (workflow mapping + detailed scoping) only happens if both sides decide to move forward after the written proposal.
**Language of call:** Portuguese
**Source completeness:** Internal recap only — no transcript. This file is reconstructed from Joao's notes and the post-call summary file `client-implementations/Sara/clinic_automation_summary.txt`. Anything that requires verbatim accuracy needs to wait for the next conversation or a recording.

---

## Prospect snapshot

- **Business:** aesthetic clinic, Portugal. Owner-operator model — Sara runs the operation and is the main customer of any AI layer we put in.
- **Treatments referenced:** laser packages (e.g., 4-session bundles). Broader portfolio assumed but not detailed in this conversation.
- **Booking / CRM:** probably **BUK or book.pt** — to be confirmed. Handles bookings and standard patient communication in a deterministic, rule-based way (the usual confirmations and reminders that ship with this kind of platform).
- **Existing automation:** **basic / deterministic** — the kind of standard appointment-management and patient-comms automations bundled with the booking platform. **Exact perimeter not detailed in this conversation** — that mapping is a discovery deliverable.
- **Paper notes:** a meaningful share of patient information still lives on paper. Creates both a risk (information loss) and an opportunity (structured digitalisation, foundation for AI suggestions).
- **AI usage today:** not discussed in detail. Assume none in the workflow.
- **Patient communication channels:** WhatsApp likely (typical for PT aesthetic clinics), plus SMS and email. Patient preference per-channel not captured.
- **Digital maturity:** standard for a Portuguese aesthetic clinic — booking platform + paper + ad-hoc messaging. Nothing AI in the workflow.
- **Brand voice / written tone-of-voice asset:** none known to OBLQAI yet. Would need to be derived from existing patient comms during a build.

## What Sara wants

- **Further-automate patient journey messaging.** Go beyond the standard confirmations/reminders the booking platform already sends. She wants personalised, context-aware communication tied to each patient's actual history — pré-tratamento, pós-tratamento, follow-ups, e seguintes-passos.
- **AI-driven suggestions that learn from patient patterns.** She does not just want more messages — she wants **smarter** ones. The system should analyse each patient's history AND patterns across the patient base, and propose the next-best action per patient (follow-up, maintenance, reactivation, cross-sell).
- **End paper-based package tracking.** Replace the manual count of pacotes (e.g., 4 sessões de laser) with a digital record that both clinic and patient can see and confirm.
- **A short daily briefing** before consultations — who is coming in, where they are in their journey, what to discuss.
- **Later / parked** (mentioned but explicitly not the focus for now): paper-note digitalisation (three approaches discussed), no-show / cancellation recovery, marketing & growth (social media, website, Google Ads).

## What I walked her through

1. **OBLQAI intro** — integration + configuration company for European SMBs, productized AI ops platform (not bespoke software). Practice Command package framing for healthcare clinics, lightly — since this was introductory, not formal positioning.
2. **The candidate priorities** as they surfaced organically from her descriptions:
   - Priority 1 — further-automated patient journey messaging.
   - Priority 2 — AI-driven next-best-action suggestions from patient patterns.
   - Priority 3 — digital treatment-package tracking.
   - Priority 4 — pre-consultation owner briefing.
3. **The principle that mattered most:** assentar no que já existe. Existing booking-platform automations are not to be touched; we add a context-aware intelligence layer on top.

## What we confirmed

- Sara is open to a pilot and is expecting a written proposal by **Fri 2026-05-29**.
- The two priorities that most clearly aligned: journey messaging (P1) + AI-driven suggestions (P2). P3 and P4 were both endorsed as sensible, slightly lower urgency.
- Existing booking-platform automation is in place and basic — not to be replaced.
- Paper notes are still part of the workflow; she's open to digitalising but no choice on approach was made.

## Verification flags (next conversation)

- **Booking platform:** BUK or book.pt or other? Confirm; this drives MCP choice and the integration scope of Phase 1.
- **Exact perimeter of current automation:** what messages go out automatically today, on what trigger, in what channel. Critical for not stepping on what works.
- **Clinic name, exact location, number of practitioners, team size.**
- **Patient communication consent posture** — what does she capture today for marketing/comms consent? RGPD posture for AI-touched messages may need adjustment.
- **Pacote catalogue** — names, session counts, recommended intervals. Foundation for Priority 3.
- **DPO / data-protection contact** — internal, external, or none yet.

## Open questions / gaps

- **Paper-note digitalisation approach** — three options discussed (live AI in-consultation, scan/photo post-consultation, capture at the moment of patient-facing document creation). Final choice deferred to a real discovery if we move forward.
- **Patient channel preference at scale** — what mix of WhatsApp / SMS / email does her actual patient base prefer, not the industry default.
- **Geographic scope** — single clinic vs multi-location.
- **Decision unit** — does Sara sign alone or is there a co-decider (partner, family, accountant)?
- **Budget / timeline** — not discussed.
- **Existing brand assets** — visual identity, tone-of-voice guides, any existing template patient comms.

## Diagnostic read

- **Textbook Practice Command fit.** Aesthetic clinic + owner-operator + paper-to-digital opportunity + appetite for personalised comms + healthcare data sensitivity. No off-blueprint contortions needed; the canonical Practice Command capability library and pricing apply.
- **The pilot is conservative on purpose.** Starting with P1 (journey messaging) and P4 (briefing) is the right wedge — both deliver visible owner-side and patient-side value within weeks without needing the data foundation that P2 and P3 build. P2 + P3 follow once the loop is producing data.
- **Priority 2 (AI suggestions) is the actual differentiator.** Standard booking-platform comms can do "reminder at T-24h." They cannot do *"this patient is 4 months out from a finished pacote, has X profile, fire the reactivation message that converts at 38%."* That is where Cowork earns its place, and it is what Sara explicitly asked for ("não quero só mais mensagens, quero mensagens mais inteligentes").
- **The paper notes are bigger than they sound.** As long as patient history lives on paper, the AI suggestion layer (P2) is shooting blind. The proposal needs to keep the paper-to-digital question visible even though Sara parked it — likely as part of the Phase 1 discovery deliverable rather than scope-creeping the build.
- **Same architecture as Renato.** The self-improving-loop framing (Sensor → Policy → Tool → Quality Gate → Learning + Company Brain + Ephemeral Software + Human Interface, per `Context/self-improving-loop-architecture.md`) maps cleanly here. Brain = Patients / Visits / Treatments / Packages / Messages / Suggestions tables in Airtable. Sara = Human Interface at the edge. Loop closes weekly through Cowork reviewing what shipped and what worked. The proposal Section 5 lands the same diagram, clinic-flavoured.
- **The framing of "we don't replace, we add" landed well.** This is the move to keep across all client-facing materials — it removes the "you're going to break what works" objection before it can form.
- **No Hugo / autopilot mention.** Right call. Healthcare clinics aren't excluded from Tier 2 by rule (only law firms are), but Cowork-first house rule applies and the proposal should not pre-commit to a Phase 2 shape until the loop is producing data.

## Action items

| # | Action | Owner | When |
|---|---|---|---|
| 1 | **Send written pilot proposal** — what we'd build and in what priority order. Markdown working draft first, then PT translation + (likely) .docx for delivery. No pricing in this version. | Joao (OBLQAI) | Fri 2026-05-29 |
| 2 | Sara reviews the proposal internally and consolidates questions or change requests. | Sara + clinic team | Following week |
| 3 | Sign off jointly on the scope to build (Phase 1 inclusions / exclusions). | Joint | After review |
| 4 | Communicate detailed implementation next steps (kick-off, accesses, calendar). | Joao (OBLQAI) | On sign-off |
| 5 | **Gmail follow-up sent** — thanks for time + opportunity, next-steps table, contact via email or WhatsApp. PT, no pricing. | Joao | Done 2026-05-27 |
| 6 | If Sara sends any ideas / references / examples between now and Friday, fold them into the proposal before delivery. | Joao | Continuous |
| 7 | **Standardise on the Renato two-file framework** going forward — meeting notes + proposal markdown in `client-implementations/<client>/`, .docx/.pptx only after markdown is final and translated. Codified in `Context/client-doc-framework.md`. | Claude | Done 2026-05-27 |

## Risks / things to watch

- **RGPD and dados de saúde.** Patient data is special-category. Any AI-touched messaging needs explicit consent; Ollama / Qwen3 32B local for clinical content where data residency in PT matters; standard DPA / AVV in the engagement contract.
- **Aceitação do paciente.** Some patients will not want AI-touched comms. Need clean opt-in and a clear opt-out path; channel preferences captured per patient; escalation to human-drafted message on patient request.
- **Aceitação da equipa.** Risk that the team sees this as more work. Start by alleviating existing work (briefing prep, package counting) before adding new asks. The equipa is part of the design of P1 + P3, not just a recipient.
- **Booking platform openness.** BUK and book.pt have variable API surfaces. Confirm read/write capabilities in the first formal discovery — until then, any specific integration is provisional.
- **Drift do conteúdo IA.** Personalised messaging can drift in tone over time. Required mitigations from day one: brand-voice file + human review of sensitive messages + monthly sampling of automated messages.
- **Two-tier framing trap.** Practice Command is Cowork-first by house rule. If the pilot succeeds, the autopilot upgrade conversation is open — but the proposal must not pre-promise it.

---

*Generated from Joao's recap and the `clinic_automation_summary.txt` post-call file. Supersede this file rather than editing in place if a fuller record of the conversation surfaces.*
