# Sara's Clinic — Practice Command Pilot Proposal (Working Draft)

**Prepared for:** Sara — aesthetic clinic, Portugal (clinic name TBC)
**Prepared by:** OBLQAI (Joao Costa)
**Date:** 2026-05-27
**Status:** Internal working draft, English. To be refined after Joao's review and any new context Sara shares this week, then translated to European Portuguese for client delivery (.docx).
**Type:** Tier 1 — Claude Cowork Setup, Practice Command package. Anchored on patient journey messaging (Priority 1) + AI-driven next-best-action suggestions (Priority 2).
**Future-state:** Practice Command Managed Service from Day 31 onwards. Tier 2 (Hugo / Hermes-style autopilot) is **not pre-promised** — it would be a Phase 2 conversation once the loop is producing real data, per the Cowork-first house rule.

> **READ ME FIRST.** This is a pilot proposal, not a fixed scope. Several Phase-1 deliverables depend on context Sara has not yet supplied — flagged inline as **[TBC com Sara]**. Pricing is intentionally omitted from this draft; Joao to confirm once scope is locked. **Do not send to Sara without Joao's review and the pt-PT translation pass.**

---

## 1. Executive summary

Sara's clinic is in a familiar position for an aesthetic practice: a working booking platform doing the basics of scheduling and standard patient comms, a competent but deterministic layer of automated messages that ship with that platform, a meaningful share of patient knowledge still on paper, and no systematic way to recommend a next action per patient. Existing automations work and **do not need touching**. The opportunity is to wrap them with a layer of context-aware intelligence — a layer that reads each patient's full history, drafts personalised communication at the right moment, surfaces a next-best-action suggestion at each consultation, and learns weekly from what worked.

OBLQAI proposes a **Practice Command** pilot, anchored on the two priorities that emerged most clearly from the 2026-05-27 introductory conversation:

1. **Further-automated patient journey messaging** — go beyond the standard confirmations/reminders the booking platform already sends, with personalised, context-aware communication tied to each patient's actual history.
2. **AI-driven next-best-action suggestions** — Claude analyses each patient's history and the patterns across the clinic's patient base, and surfaces concrete next-step recommendations (follow-up, maintenance, reactivation, cross-sell) into the owner's daily briefing and into the patient-facing messaging.

Two further priorities follow once the first two are stable: **digital treatment-package tracking** (replacing the paper count) and a **pre-consultation owner briefing** (short, daily, AI-compiled). All four sit on top of a single architecture — described in Section 5 — built to compound. The clinic does not end Phase 1 with "a chatbot bolted onto a booking platform." It ends Phase 1 with the first layer of a **self-improving, AI-native operating system** for its patient business: a closed loop of sensors, decisions, tools, quality gates, and weekly learning, with Claude as the policy engine and Sara as the human DRI at the edge.

---

## 2. Where the clinic is today

Drawn from the 2026-05-27 introductory conversation and the post-call summary in `clinic_automation_summary.txt`. Multiple items still need verification in a proper discovery.

| Area | Current state |
|---|---|
| Practice | Aesthetic clinic, Portugal. Sara is owner-operator. Treatments referenced include laser packages (broader portfolio assumed). |
| Booking platform | Probably **BUK or book.pt** — **[TBC com Sara]**. Handles bookings + standard patient communication (confirmations, reminders) deterministically. |
| Existing automation | Basic, rule-based — out-of-the-box reminders/confirmations from the booking platform. Exact perimeter **[TBC com Sara]** — discovery deliverable. |
| Patient notes | A meaningful share still on paper. Risk (information loss) + opportunity (structured digitalisation). |
| AI usage (clinic) | Not discussed. Assume none in the workflow. |
| Patient comms channels | WhatsApp likely, plus SMS / email. Per-patient channel preference **[TBC com Sara]**. |
| Brand voice | No written tone-of-voice asset known. To be derived from existing patient comms during Phase 2 (Build & Configure). |
| GDPR posture | Standard PT clinic — formal DPA / consent posture for AI-touched messaging **[TBC com Sara]**. |
| Team size & roles | **[TBC com Sara]** — affects DRI assignment for in-room actions (Priority 3). |

**Read:** Functional booking platform, paper for the rest, no AI layer. We are not unwinding anything — we are adding a context-aware intelligence layer on top of what already works.

---

## 3. What the clinic wants to achieve

1. **More personalised patient communication** — beyond "consulta amanhã às 15h00" — that reflects each patient's actual history, pacote status, queixas, and journey moment.
2. **Stop forgetting patients.** Systematic recall, reactivation and next-step suggestion that does not depend on Sara's memory.
3. **End paper-based package tracking.** Replace the manual count with a digital record both clinic and patient can see and confirm.
4. **Start every consultation with full context.** A short morning briefing of the day's patients with all relevant history surfaced.
5. **Do all of the above without hiring an ops or marketing person** — leverage AI as the operating layer.

What is *not* yet decided, and what should land in the discovery (Phase 1):

- Paper-note digitalisation approach (three options on the table — live AI in-consultation, scan/photo post-consultation, capture at the moment of patient-facing document creation).
- Patient communication consent posture for AI-touched messages.
- Catalogue of pacotes that should be tracked digitally in Priority 3.
- Geographic scope (single clinic vs multi-location).

---

## 4. Proposed approach — Tier 1 (Claude Cowork Setup)

OBLQAI's Tier 1 engagement deploys **Claude Cowork** as Sara's command console. Claude connects, via MCP servers, to every tool the clinic uses and executes work on her command — drafting messages, analysing patient histories, compiling briefings, tracking packages, surfacing next-best actions. The owner stays in the loop; Claude does the work that would otherwise eat hours of attention each week.

Phase 1 bundles four workstreams into a single build, in priority order, plus the CRM + connector infrastructure underneath.

### 4.1 Further-automated patient journey messaging (Priority 1)

A camada de comunicação inteligente that sits **on top of** the booking platform's existing deterministic messages — not replacing them. Adds personalised, context-aware messages at moments-chave da jornada do paciente, reading the patient's full history and adapting tone, content and next-step recommendation per case.

- **Triggers:** nova marcação, consulta concluída, X dias pós-tratamento, X dias antes do fim de um pacote, paciente sem visita há Y meses.
- **Drafting:** Claude reads the patient context from the CRM (treatments, notes, package status, complaints, preferences) and drafts the message in the clinic's voice (preserved through a versioned brand-voice file we derive once and maintain).
- **Quality gate:** sensitive messages (post-treatment with prior complaint, reactivation after long inactivity, anything clinically relevant) queue for Sara's approval before sending. Routine messages can be sent directly.
- **Channel:** WhatsApp / SMS / email per patient preference recorded in the CRM.
- **Log & learn:** every message is logged with the context that generated it and the response received — feeding the loop in Section 5.

### 4.2 AI-driven next-best-action suggestions (Priority 2)

A motor que analisa cada paciente individualmente e os padrões na base de pacientes como um todo, and produces a structured suggestion per patient. This is the differentiator that pulls the clinic beyond what any booking-platform automation can do.

- **Inputs:** complete individual history + aggregated patterns across the patient base (typical treatment spacing, reactivation conversion by message type, package-completion vs abandonment signals).
- **Output per patient:** ação recomendada + justificação curta apoiada em dados + nível de confiança.
- **Surfaces:** in the daily owner briefing (Priority 4), inside the journey messaging (Priority 1) where appropriate, and on a weekly review dashboard for Sara.
- **Feedback loop:** Sara's accept / reject / modify decisions enter the learning loop and refine future suggestions.
- **Compliance:** for sensitive clinical content, inference runs locally via **Ollama / Qwen3 32B** in PT (data residency) — the Claude API handles the rest.

### 4.3 Digital treatment-package tracking (Priority 3)

Substituição do controlo em papel dos pacotes (e.g., 4 sessões de laser) por um sistema digital simples. Each session registered in the moment, patient receives confirmation, both sides always know how many sessions remain.

- **Setup:** each patient with an active pacote is created in the system (pacote type, total sessions, sessions done, dates, recommended intervals, validity).
- **Session-complete action:** the equipa marks complete with a single action — in-CRM button, mobile app, or WhatsApp message to Claude. Multiple paths so adoption is frictionless.
- **Patient confirmation:** auto-message — "Sessão 3 de 4 concluída. Próxima sessão recomendada entre X e Y. Falta 1 sessão para concluir o pacote."
- **Proactive recordatórios:** at X sessions remaining, at 1 session remaining (with marcação offer), and at pacote end (with next-step suggestion fed from Priority 2).
- **Weekly report:** pacotes ativos / próximos a concluir / em risco de abandono / expirados.

### 4.4 Pre-consultation owner briefing (Priority 4)

Briefing curto delivered to Sara daily before the day starts (or the evening before — configurable). For each patient of the day: motivo da consulta, historial relevante, estado dos pacotes, queixas anteriores, sugestão de próxima ação no fim da consulta (from Priority 2).

- **Disparador:** scheduled task at a fixed time.
- **Compilação:** Claude reads the day's agenda from the booking platform and compiles a per-patient card with everything relevant from the Brain (Section 5.1).
- **Entrega:** email / WhatsApp pessoal / Cowork app — Sara's choice.
- **Conversa de seguimento:** Sara can ask Claude for more detail on any patient ("conta-me mais sobre a Maria Silva," "que tratamentos faz sentido propor à Joana hoje").

### 4.5 CRM (headless Airtable) + channel connectors

The two infrastructure pieces beneath everything in 4.1–4.4. Configured Day 1 — they are the foundation, not an add-on.

**CRM — headless Airtable.** Airtable is the clinic's patient-data backbone with **no user-facing UI of its own** — the clinic interacts with Claude (Cowork), not with Airtable. Tables: **Patients**, **Visits**, **Treatments**, **Packages**, **Messages**, **Suggestions**, **Brand voice**. Status fields, owner fields, tags — all manipulable in conversation ("Claude, find every patient whose laser pacote ended >3 months ago and who hasn't responded to the last reactivation message"). This is OBLQAI's standard pattern for Cowork engagements — no one on Sara's team needs to learn an Airtable UI.

**Channel connectors.**
- WhatsApp Business API — outbound via Claude, inbound via an n8n bridge (per `Context/automation-policy.md`, the only sanctioned use of n8n alongside no-MCP tools).
- Email — Gmail or the clinic's mail provider, MCP-based.
- SMS — provider TBC with Sara (likely a PT-local SMS gateway).
- Booking platform — MCP **[TBC com Sara]** once BUK vs book.pt is confirmed; this determines the integration timeline for Day 4–10.

---

## 5. The architecture Phase 1 leaves the clinic with

By the end of Phase 1, the clinic does not own "a smarter messaging app." It owns the first layer of a **self-improving, AI-native operating system** for its patient business — a system where tooling, decision-making, and learning are wired together into recursive loops that get better the more the business is used. We are not setting up automations; we are wiring the clinic as a closed-loop system, with **Claude as the policy engine, MCP servers as the actuators, the Airtable + interaction log as the Company Brain**, and **Sara (plus selected team members) as the edge interface to reality**.

### 5.1 The three persistent layers

**The Company Brain (data layer).** Single source of truth for every interaction the clinic produces — every booking event, every consultation note (digitalised), every message in/out, every package status change, every consent and preference, every suggestion accepted or rejected. The Brain is permanent. Everything else is replaceable.

**The Ephemeral Software Layer.** The message-drafting prompts, the suggestion rules, the briefing template, the package-tracking automations, the Cowork scheduled tasks, the Airtable views — all of it is **disposable and regenerable**. As Claude (and later Hermes, if and when) get more capable, or as the clinic's logic changes, these components are rewritten and redeployed. The Brain persists; the software around it evolves. This is what makes "no ops/marketing hire" work: when the clinic needs a new message cadence or a new triage rule, we regenerate the layer.

**The Human Interface Layer (the edge).** Sara is the **Directly Responsible Individual (DRI)** for the system. Selected team members are DRIs for in-room actions (marking sessions complete, capturing in-consultation notes). The system pushes humans into the loop only where reality demands it: clinical decisions, sensitive patient cases, anything where the cost of a wrong automated response is higher than the value of speed.

### 5.2 The closed loop

Phase 1 wires every part of the patient business — bookings, consultations, messages, package status, briefings — into the same five-step recursive loop:

```
                       ┌───────────────────────┐
                       │    OUTSIDE WORLD      │
                       │  pacientes, agenda,   │
                       │  WhatsApp, email      │
                       └──────────┬────────────┘
                                  │
                                  ▼
                       ┌───────────────────────┐
                       │    SENSOR LAYER       │
                       │  eventos da agenda,   │
                       │  inbox, respostas,    │
                       │  notas de consulta    │
                       └──────────┬────────────┘
                                  │
                                  ▼
                       ┌───────────────────────┐
                       │  POLICY / DECISION    │
                       │   Claude (Cowork)     │
                       │   redige · sugere     │
                       │   classifica · escala │
                       └──────────┬────────────┘
                                  │
                                  ▼
                       ┌───────────────────────┐
                       │     TOOL LAYER        │
                       │  MCP servers:         │
                       │  booking, WhatsApp,   │
                       │  email, Airtable      │
                       └──────────┬────────────┘
                                  │
                                  ▼
                       ┌───────────────────────┐
                       │    QUALITY GATE       │
                       │  Sara aprova          │
                       │  voz da clínica       │
                       │  sanidade clínica     │
                       └──────────┬────────────┘
                                  │
                                  ▼
                       ┌───────────────────────┐
                       │  LEARNING MECHANISM   │
                       │  revisão semanal,     │
                       │  patches deployed     │
                       └──────────┬────────────┘
                                  │
                                  └──► feeds back into Policy
```

**1 — Sensor Layer.** Picks up signal from every place the clinic touches reality: every event in the agenda, every message in/out, every package status change, every consultation note (once digitalised), every patient response, every queixa registered, every appointment outcome.

**2 — Policy / Decision Layer.** Claude orchestrates. For every sensor event, Claude decides: respond automatically, draft for Sara's approval, escalate directly to Sara, route to a specific team member, log silently, or trigger a follow-up sequence. This is the "automated clinic manager" layer — Claude does the work a clinic manager would do if the clinic had hired one.

**3 — Tool Layer.** Claude executes through MCP servers — Airtable for the CRM, WhatsApp / SMS / email for messaging, the booking platform for agenda reads/writes, Ollama for sensitive clinical inference. The tools are deterministic; the intelligence sits in the Policy layer above them.

**4 — Quality Gate.** Phase 1 keeps Sara as the primary quality gate — sensitive messages and clinical-adjacent decisions pass through her approval. Layered on top are automatic checks: brand-voice consistency, recommendation sanity (e.g., flagging if the system suggests an intensive treatment for a patient with a very recent queixa), classifier drift, stale-task detection. As trust accrues, gates that prove reliable can be promoted to autonomous on a per-category basis; high-stakes gates stay human-DRI indefinitely.

**5 — Learning Mechanism.** Every week — and on every flagged anomaly — Cowork runs a learning pass: message-review (which got good responses, which got ignored, which generated complaints), suggestion-review (which Sara accepted, modified, or rejected, with what justification), briefing-review (which patients on the briefing led to relevant in-consultation actions, which were noise), operational telemetry (which scheduled tasks are stale, which automations are failing silently). The output is **patches** — updated message templates, refined suggestion rules, new triage tags, modified briefing structure, Airtable view changes. Patches go through the Quality Gate (Sara or an automatic check, depending on risk) and are deployed back into the Ephemeral Software Layer. The loop closes; the system gets better.

### 5.3 What this looks like in production

A concrete Day-30 scenario at Sara's clinic:

1. **Sensor event.** Maria Silva arrives for her 3rd of 4 laser sessions. The equipa marks "session complete" in Cowork. The session, parameters used, and a one-line note are logged to the Brain. The package status updates; the patient automatically receives a confirmation message with sessions remaining.
2. **Audit catch.** The weekly Cowork learning pass notices that six of the previous week's twenty-three "session complete" events did not generate the expected follow-up package-status message to the patient — all six were sessions where the equipa used the WhatsApp-to-Claude shortcut rather than the in-CRM button, and the WhatsApp parser dropped a field.
3. **Root cause & patch.** The learning pass diagnoses the gap (the WhatsApp parser was not extracting the "next session window" field reliably), drafts an updated parser prompt, drafts a one-line equipa note about the alternative shortcut, and queues the patch.
4. **Quality Gate.** Sara approves the patch in Cowork (one click) and forwards the equipa note in the team's WhatsApp group.
5. **Resolution.** By the following week, every "session complete" event generates the follow-up message regardless of which channel was used to log it. The system is measurably more reliable than it was the week before — and Sara did not write a line of code or a line of copy herself.

### 5.4 Why this matters for what comes after Phase 1

Phase 1 leaves all five components in place — but with **Sara as the Quality Gate and Sara (via Cowork) as the executor of the Learning patches.** A potential Phase 2 — *not committed today* — would be the same architecture, with **autonomous quality gates** (LLM-as-judge, sanity tests, brand-voice filters) and **autonomous patching** (Claude writes and deploys the patch, escalating only the high-risk ones). The architecture does not change between phases; the question Phase 2 answers is *"how much of the loop runs without Sara in it."*

This is also why we will not need to rebuild anything to move the clinic from Phase 1 to a possible Phase 2. The Brain, the tool layer, and the loop topology are identical. We are not shipping a Cowork product and later replacing it with a different product — we are shipping an operating layer and progressively widening its autonomy if and when the clinic is ready.

---

## 6. What's parked for after Phase 1

Topics raised in the introductory conversation that we deliberately keep out of Phase 1 scope, to be revisited once the loop is producing data:

- **Paper note digitalisation** — three approaches on the table (live AI in-consultation, scan/photo post-consultation, capture at the moment of patient-facing document creation). Approach selection is a Phase 1 *discovery* deliverable; the *build* itself is Phase 1.5 or Phase 2 depending on the choice.
- **No-show and cancellation recovery** — calendar-gap monitoring + automated outreach to waitlisted or follow-up-due patients. Adds clear revenue but depends on a clean booking-platform read/write loop, which Phase 1 establishes.
- **Marketing and growth** — social media, website, Google Ads, GMB activity. Distinct workstream — natural conversation only after the operational loop is proven. Whether this becomes a Hugo conversation or stays inside Cowork is a Phase 2 design call.
- **Local presence (GMB / reviews)** — standard Practice Command capability, deferred to Phase 1.5 unless Sara flags it as urgent.

---

## 7. Delivery model — OBLQAI's 4-phase process

OBLQAI delivers Tier 1 engagements in four phases over roughly 30 days, then transitions into Managed Service.

| Phase | Window | What happens |
|---|---|---|
| **1. Discovery & Design** | Days 1–3 | Confirm booking platform + canal preferences. Workshop with Sara to map exact existing automations. Choose paper-note approach. Draft the Implementation Blueprint. |
| **2. Build & Configure** | Days 4–10 | Stand up MCPs, build the Airtable schema, configure Cowork scheduled tasks, build the journey-messaging + briefing prompts, derive the brand-voice file from existing comms, set up the suggestion engine in test mode. |
| **3. Testing & Launch** | Days 11–14 | End-to-end testing, equipa training, soft launch with Priority 1 + Priority 4 in production first. |
| **4. Optimization** | Days 15–30, then ongoing | Tune on real conversation/suggestion data. Roll out Priority 2 (suggestions) and Priority 3 (package tracking) in sequence. Formal handover into Managed Service. |

After Day 30 the clinic moves into OBLQAI's **Managed Service** — ongoing maintenance, monitoring, quarterly capability review, monthly performance check-in, 99.5% uptime on deployed workflows, 2-hour critical-incident response.

---

## 8. Service commitments

For both Phase 1 and the Managed Service that follows:

- **99.5% uptime** on deployed workflows and MCP servers
- **2-hour response** to critical incidents (systems down, data loss risk)
- **Next-business-day response** on non-critical issues
- **Monthly performance review** while in Managed Service
- **Quarterly capability review** — what to add, retire, tune

---

## 9. What we need from the clinic

**For the proposal review (this week, 2026-05-27 → 2026-05-29):**
1. Confirmation of the **booking platform** (BUK or book.pt or other).
2. Any additions, corrections or changes to the priority list, based on what surfaces after the introductory conversation.

**For the Discovery & Design phase (Days 1–3):**
3. Read/write **access to the booking platform** (or a stand-in account).
4. List of **pacotes currently sold** — name, número de sessões, intervalo recomendado, validade típica.
5. **Sample of patient communication** the clinic already sends — to derive the brand voice.
6. **Decision on paper-note approach** for the pilot (or agreement to defer the build and keep paper for now).
7. Confirmation of the **equipa members** who'll be DRIs for in-room actions.
8. **DPO / data-protection contact** (or confirmation that the clinic uses a standard PT DPA shape).
9. **Existing brand assets** — logo, color guide, photography library if available.

---

## 10. Commercial framework (placeholder — to be confirmed with Joao)

OBLQAI Practice Command engagements are priced as **one-time implementation + monthly managed operations**. The implementation covers workflow setup, integrations, deployment, testing and onboarding. The monthly fee covers secure hosting, monitoring, maintenance, workflow updates, messaging infrastructure, integration stability and compliance supervision.

> **Specific numbers withheld pending Joao's pricing-model confirmation for this engagement.** Practice Command canonical pricing exists for PT / DE / CH (see `Context/pricing.md`). Joao to confirm whether this engagement matches the canonical shape or carries adjustments before any number is put in writing.

---

## 11. Why OBLQAI

- We are an **integration and configuration company**, not a custom software house. Phase 1 is delivered by configuring proven components (Claude Cowork, MCP servers, Airtable, the Claude API, Ollama for local inference) into a working operating layer — not by writing software from scratch.
- We deliver in **30 days**, not 6 months, because we don't build the things we configure.
- We bring a **productized methodology** (the 4-phase process + Practice Command capability library) so the engagement is predictable in shape, even when the underlying business is a fresh start on AI.
- The clinic would be among the **first Practice Command engagements** built on the full self-improving-loop architecture — the same operating model OBLQAI itself runs on. We are not selling a stack of integrations; we are installing the loop that keeps the integrations sharp.

---

## Internal notes for Joao (not for the client version)

- **Healthcare Clinics vertical**, Practice Command canonical pricing applies if the engagement stays on the standard shape (PT €8k setup / €950 monthly; DE 1.5x; CH 2x in CHF — per `Context/pricing.md`). Per `feedback_consulting_is_a_plugin.md`, advisory layers are bundled as plugins, not separate human-recurring work.
- **No pricing in writing yet**, per your call. Section 10 carries the placeholder; the number lands only after you sign off and the pt-PT translation pass runs.
- **Section 5** uses the canonical self-improving-loop framing from `Context/self-improving-loop-architecture.md` — identical topology to the Renato draft, adapted to the clinic context. ASCII diagram in PT inside the code fence.
- **Phase 2 carefully phrased.** Healthcare clinics aren't excluded from Tier 2 by rule (only law firms are), but Cowork-first house rule applies. Positioned as "if and when," not "Day 1 commitment." Do not let later edits pre-promise autopilot.
- **Booking platform unconfirmed.** BUK vs book.pt assumption needs verification in the next call. Affects which MCP we ship and how the integration timeline looks.
- **Paper notes deferred** but not silenced — Section 6 keeps it visible without scope-creeping Phase 1. Don't let it disappear in subsequent revisions: AI suggestions (Priority 2) are weak as long as patient history is on paper.
- **Brand voice asset doesn't exist.** Plan is to derive it from existing patient comms during Phase 2 (Days 4–10). Confirm Sara is OK with that or wants to write a brief beforehand.
- **Two superseded .docx artifacts** already in the Sara folder from the earlier framework attempt:
  - `Sara-Proposta-Piloto-2026-05-27-PT.docx` — the heavy single-file proposal I built before you asked for the Renato framework. **This DRAFT.md supersedes it.** Keep or delete is your call.
  - `Sara-Discovery-Meeting-Minutes-2026-05-27-{EN,PT}.docx` — the meeting-minutes pair. **Superseded by `2026-05-27-introductory-call-summary.md`.** Same call.
- **Translation timing:** keep this in English until your review + pricing decision. Then translate to **pt-PT (NOT pt-BR)**. Per `feedback_translator_implementer_serial.md`, translation runs serial, not parallel to writing.
- **Framework adoption:** the move to this markdown-first format codifies in `Context/client-doc-framework.md`. Going forward every new client engagement gets the Renato two-file pair from day one.

---

*Draft generated 2026-05-27. Will be revised after Joao's review and any new context Sara shares this week. Do not send before Joao's review, pricing decision, and pt-PT translation pass.*
