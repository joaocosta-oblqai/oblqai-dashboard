# Sara's Clinic — Practice Command Pilot Proposal (Working Draft)

**Prepared for:** Sara — aesthetic clinic, Portugal (clinic name TBC)
**Prepared by:** OBLQAI (Joao Costa)
**Date:** 2026-05-27
**Status:** Internal working draft, English. To be refined after Joao's review and any new context Sara shares this week, then translated to European Portuguese for client delivery (.docx).
**Type:** Tier 1 — Practice Command package, expanded scope. Runs on a **Code + Cowork** stack: **Claude Code CLI as a VPS daemon** for real-time / proactive patient-facing flows (sub-minute inbound, cron-precise outbound) + **Claude Cowork** as Sara's owner cockpit (daily briefing, weekly learning, approval queue, ad-hoc ops). **Eight priorities** in a ~45-day Phase 1: patient-ops (P1–P4) + content/social (P5) + Google Ads (P6) + Meta Ads (P7) + net-new website build + Cowork upkeep (P8).
**Future-state:** Practice Command Managed Service from Day 31 onwards. Tier 2 (Hugo / Hermes-style autopilot) is **not pre-promised** — it would be a Phase 2 conversation once the loop is producing real data, per the Cowork-first house rule.

> **READ ME FIRST.** This is a pilot proposal, not a fixed scope. Several Phase-1 deliverables depend on context Sara has not yet supplied — flagged inline as **[TBC com Sara]**. Pricing is intentionally omitted from this draft; Joao to confirm once scope is locked. **Do not send to Sara without Joao's review and the pt-PT translation pass.**

---

## 1. Executive summary

Sara's clinic is in a familiar position for an aesthetic practice: a working booking platform doing the basics of scheduling and standard patient comms, a competent but deterministic layer of automated messages that ship with that platform, a meaningful share of patient knowledge still on paper, and no systematic way to recommend a next action per patient. Existing automations work and **do not need touching**. The opportunity is to wrap them with a layer of context-aware intelligence — a layer that reads each patient's full history, drafts personalised communication at the right moment, surfaces a next-best-action suggestion at each consultation, and learns weekly from what worked.

OBLQAI proposes an expanded **Practice Command** pilot — eight priorities running across patient-ops and acquisition in a single ~45-day Phase 1:

**Patient-ops layer (P1–P4)** — the two priorities that emerged most clearly from the 2026-05-27 introductory conversation plus the two that followed:

1. **Further-automated patient journey messaging** — go beyond the standard confirmations/reminders the booking platform already sends, with personalised, context-aware communication tied to each patient's actual history.
2. **AI-driven next-best-action suggestions** — Claude analyses each patient's history and the patterns across the clinic's patient base, and surfaces concrete next-step recommendations (follow-up, maintenance, reactivation, cross-sell) into the owner's daily briefing and into the patient-facing messaging.
3. **Digital treatment-package tracking** — replace the paper count with a digital record both clinic and patient can see and confirm.
4. **Pre-consultation owner briefing** — short, daily, AI-compiled summary delivered to Sara before each day starts.

**Acquisition layer (P5–P8)** — added at Sara's explicit request after the introductory conversation:

5. **Social media content + auto-post** — Cowork drafts/edits, Code schedules and publishes Instagram + Facebook + GMB posts via Meta Graph + GMB APIs.
6. **Google Ads automated** — Cowork proposes campaigns and approves; Code publishes, monitors and tunes daily. Sara never opens the Ads dashboard.
7. **Meta Ads (Facebook + Instagram) automated** — same skill stack as Google Ads, channel MCP swapped.
8. **Website net-new build + Cowork upkeep** — clinic site built from scratch focused on B2C conversion, then maintained through Cowork (Sara describes change in PT → Cowork drafts → staging preview → approve → live).

All eight sit on top of a single architecture — described in Section 5 — built to compound. The clinic does not end Phase 1 with "a chatbot bolted onto a booking platform." It ends Phase 1 with the first layer of a **self-improving, AI-native operating system** for its entire business — patient experience plus acquisition — a closed loop of sensors, decisions, tools, quality gates, and weekly learning, with Claude as the policy engine and Sara as the human DRI at the edge.

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

## 4. Proposed approach — Tier 1 (Code + Cowork stack on Practice Command)

OBLQAI's Tier 1 engagement deploys **two AI runtimes** against the same central database + MCP set:

- **Claude Code CLI as a VPS daemon** — the always-on engine. Event-driven (webhooks: WhatsApp inbound, booking-platform events, session-complete signals) and cron-precise (T-24h pre-appointment messages, T+6h post-treatment follow-ups, T+Y months reactivation thresholds). Calls the Claude API + MCP set directly. Sub-minute wake time. This is what makes patient-facing communication actually real-time and proactive — not "reactive at the next 15-min cadence."
- **Claude Cowork on Sara's desktop** — the owner cockpit. Daily briefing, weekly learning pass, approval queue for sensitive messages that Code has drafted and flagged, conversational ops ("Claude, find every patient whose laser pacote ended >3 months ago and who hasn't responded"), ad-hoc CRM-via-conversation work.

They are not parallel stacks. They share the central database (Airtable), the MCP set (booking platform, WhatsApp, email, SMS, Ollama), the brand-voice file, and the suggestion engine — single-source. Two clients of one operating system. Decision and full spec in `Context/automation-policy.md` + auto-memory `project_claude_code_realtime_layer.md`.

Phase 1 bundles four workstreams into a single build, in priority order, plus the CRM + connector infrastructure underneath.

### 4.1 Further-automated patient journey messaging (Priority 1)

A camada de comunicação inteligente that sits **on top of** the booking platform's existing deterministic messages — not replacing them. Adds personalised, context-aware messages at moments-chave da jornada do paciente, reading the patient's full history and adapting tone, content and next-step recommendation per case.

- **Runtime:** **Claude Code daemon.** Webhook-driven (booking events, session-complete signals) and cron-precise (T-24h, T+6h, T+Y months). This is the layer that makes timing actually proactive — minute-level, not 15-min-cadence approximation.
- **Triggers:** nova marcação, consulta concluída, X dias pós-tratamento, X dias antes do fim de um pacote, paciente sem visita há Y meses.
- **Drafting:** Code reads the patient context from the CRM (treatments, notes, package status, complaints, preferences) and drafts the message in the clinic's voice (preserved through a versioned brand-voice file we derive once and maintain).
- **Quality gate:** sensitive messages (post-treatment with prior complaint, reactivation after long inactivity, anything clinically relevant) get written by Code as "queued for approval" rows; **Cowork surfaces them to Sara**; Sara approves → Code sends. Routine messages Code sends directly.
- **Channel:** WhatsApp / SMS / email per patient preference recorded in the CRM.
- **Log & learn:** every message is logged with the context that generated it and the response received — feeding the loop in Section 5.

### 4.2 AI-driven next-best-action suggestions (Priority 2)

A motor que analisa cada paciente individualmente e os padrões na base de pacientes como um todo, and produces a structured suggestion per patient. This is the differentiator that pulls the clinic beyond what any booking-platform automation can do.

- **Runtime:** **Claude Code** fires suggestions per event (session completed, pacote ended, queixa reported) for real-time surfacing inside outbound messages. **Cowork** runs the heavier ranking pass for the daily briefing and the weekly dashboard.
- **Inputs:** complete individual history + aggregated patterns across the patient base (typical treatment spacing, reactivation conversion by message type, package-completion vs abandonment signals).
- **Output per patient:** ação recomendada + justificação curta apoiada em dados + nível de confiança.
- **Surfaces:** in the daily owner briefing (Priority 4, Cowork-built), inside the journey messaging (Priority 1, Code-injected when relevant), and on a weekly review dashboard for Sara (Cowork).
- **Feedback loop:** Sara's accept / reject / modify decisions enter the learning loop and refine future suggestions.
- **Compliance:** for sensitive clinical content, inference runs locally via **Ollama / Qwen3 32B** in PT (data residency) — the Claude API handles the rest. Both Code and Cowork respect the same local-inference-required tag on the prompt set.

### 4.3 Digital treatment-package tracking (Priority 3)

The clinic today uses a physical card — patient holds it, equipa stamps it after each visit. Three jobs the card does: (a) gives the patient a tangible record, (b) lets the patient prove "I've been here X times" if there's any dispute, (c) creates a small ritual confirming "this session happened." The digital version preserves all three jobs but inverts the actor: **the patient confirms, not the equipa stamps**.

- **Runtime:** **Claude Code** owns the consultation-complete webhook handler, the form delivery, the receipt back, and the equipa-fallback timer. **Cowork** runs the weekly pacote report and surfaces the fallback queue for the equipa.
- **Setup:** each patient with an active pacote is created in the system (pacote type, total sessions, sessions done, dates, recommended intervals, validity).
- **Patient-driven confirmation flow:**
  1. **Consulta termina.** The booking platform marks the appointment as completed; Code daemon catches the event.
  2. **Form delivered.** Patient receives a short link via their preferred channel (SMS / WhatsApp / email) — *"Confirma a sessão 2 de 4 de hoje?"* — single question, single tick, single submit.
  3. **Patient confirms.** Tick + submit. Equivalent of stamping the card.
  4. **Receipt back.** Patient receives — *"Sessão 2 de 4 confirmada. Próxima recomendada entre X e Y. Faltam 2 sessões para concluir o pacote."* Lives in their channel history.
  5. **CRM auto-updates.** Pacote counter increments; central database logs the confirmation with timestamp + channel. Triggers the next scheduled recordatório.
- **Equipa fallback (not the primary path).** If the patient hasn't confirmed within a configurable window (e.g., 6h or 24h), Cowork surfaces a "por confirmar" queue to the equipa — one tap to mark manually. Designed for elderly patients, those without smartphones, or anyone who simply doesn't engage with the form. Keeps the system honest without forcing the equipa to act every time.
- **Proactive recordatórios:** at X sessions remaining, at 1 session remaining (with marcação offer), and at pacote end (with next-step suggestion fed from Priority 2). All cron-precise.
- **Weekly report:** Cowork-built — pacotes ativos / próximos a concluir / em risco de abandono / expirados / por confirmar há > 24h.

**Why this shape:** mirrors the existing physical-card ritual, gives the patient agency, creates a permanent message history they can refer back to, and reduces equipa cognitive load (they only act on the small fraction who don't self-confirm).

### 4.4 Pre-consultation owner briefing (Priority 4)

Briefing curto delivered to Sara daily before the day starts (or the evening before — configurable). For each patient of the day: motivo da consulta, historial relevante, estado dos pacotes, queixas anteriores, sugestão de próxima ação no fim da consulta (from Priority 2).

- **Runtime:** **Cowork**. This is owner-facing recurring work — Cowork's sweet spot.
- **Disparador:** scheduled task at a fixed time.
- **Compilação:** Cowork reads the day's agenda from the booking platform and compiles a per-patient card with everything relevant from the central database (Section 5.1) and the latest Priority-2 suggestion per patient.
- **Entrega:** email / WhatsApp pessoal / Cowork app — Sara's choice.
- **Conversa de seguimento:** Sara can ask Cowork for more detail on any patient ("conta-me mais sobre a Maria Silva," "que tratamentos faz sentido propor à Joana hoje").

### 4.5 Social media content + auto-post (Priority 5)

A weekly editorial operation for Instagram + Facebook + Google Business Profile. Cowork drafts; Sara approves; Code publishes on schedule.

- **Runtime:** **Code + Cowork.** Cowork researches and drafts (owner-facing, conversational); Code daemon schedules and auto-publishes via Meta Graph API + Google Business Profile API.
- **Cadence:** weekly content calendar drafted Monday for the week ahead. Sara approves in batch.
- **Channels:** Instagram, Facebook, Google Business Profile (posts + Q&A + review responses).
- **Tone:** preserved through the same brand-voice file used in P1.
- **Engagement loop:** likes, comments, DMs, reviews — all logged to the Brain, feeds back into the weekly research pass.

### 4.6 Google Ads automated (Priority 6)

Campaign management for Google Ads — drafting, launch, daily tuning — without Sara ever opening the Ads dashboard.

- **Runtime:** **Code + Cowork.** Cowork proposes campaigns + drafts copy/audiences; Sara approves in conversation; Code publishes via Google Ads API and runs daily tuning (bids, pauses, budget reallocation within budget cap).
- **Approval contract:** new campaigns and spend changes always go through Sara. Daily tuning within an approved campaign is autonomous.
- **Alerts:** spend anomalies, CTR drops, technical failures escalate immediately via Cowork's approval queue.
- **Reporting:** weekly performance digest in Sara's preferred channel — spend, reach, conversions, recommendations.

### 4.7 Meta Ads (Facebook + Instagram) automated (Priority 7)

Same skill stack as P6, channel MCP swapped to Meta Marketing API. Combined weekly reporting across Google + Meta.

- **Runtime:** **Code + Cowork.** Same pattern as P6.
- **Creatives:** drafted in the same brand-voice file as P1 + P5.
- **Cross-channel reporting:** Google Ads + Meta Ads results combined in one weekly digest for Sara.

### 4.8 Website — net-new build + Cowork upkeep (Priority 8)

A net-new B2C-focused clinic website, built during Phase 1, then maintained entirely through Cowork.

- **Runtime:** **Code + Cowork.** Initial build is a one-time Phase 1 deliverable (Days 6–25). Ongoing upkeep is the Renato pattern: Sara describes the change in PT → Cowork drafts → staging preview → approve → live.
- **Build scope:** B2C-focused conversion surface — hero, services/treatments, "book a consultation" CTAs that land in the booking platform, brand application, basic SEO. **[TBC com Sara]** for CMS choice and hosting.
- **Brand dependency:** brand kit (logo, colors, photography, tone) needs to land by Day 5 so the build can run in parallel with the patient-ops layer. If no brand kit exists, we either derive one in the first week or commission it from a partner.
- **No developer in the loop after launch.** Updates flow through Cowork; staging previews protect production.

### 4.9 Infrastructure — CRM, channel connectors, Code daemon hosting

The infrastructure beneath everything in 4.1–4.4. Configured Day 1 — foundation, not add-on.

**CRM — headless Airtable.** Airtable is the clinic's patient-data backbone with **no user-facing UI of its own** — the clinic interacts with Cowork (Sara) and the patient gets Code-drafted messages, but nobody clicks around an Airtable interface. Tables: **Patients**, **Visits**, **Treatments**, **Packages**, **Messages**, **Suggestions**, **Brand voice**, **Approval queue** (the row shape Code writes / Cowork surfaces). Both runtimes read and write the same tables.

**Channel connectors.**
- WhatsApp Business API — **n8n catches the public webhook**, drops the event into Airtable, **Code picks it up** within seconds. Outbound via Code or Cowork directly.
- Email — Gmail or the clinic's mail provider, MCP-based, called by either runtime.
- SMS — provider TBC with Sara (likely a PT-local SMS gateway).
- Booking platform — MCP **[TBC com Sara]** once BUK vs book.pt is confirmed.

**Claude Code daemon hosting.**
- Lives on the clinic's VPS (part of the Compute layer in canonical Practice Command pricing — no separate line item).
- Supervised by `systemd` (or equivalent) — auto-restart on failure, heartbeat to the central database so the weekly learning pass can flag downtime.
- Same MCP set as Cowork. No duplicate configuration.
- Logs land in a dedicated Airtable table (or a structured log file the weekly learning pass consumes) for the loop in Section 5.

---

## 5. The architecture Phase 1 leaves the clinic with

By the end of Phase 1, the clinic does not own "a smarter messaging app." It owns the first layer of a **self-improving, AI-native operating system** for its patient business — a system where tooling, decision-making, and learning are wired together into recursive loops that get better the more the business is used. We are not setting up automations; we are wiring the clinic as a closed-loop system, with **Claude (across two runtimes — Code and Cowork) as the policy engine, MCP servers as the actuators, the Airtable + interaction log as the Central database**, and **Sara (plus selected team members) as the edge interface to reality**.

The two runtimes earn the split: **Claude Code as a VPS daemon** is what makes patient experience actually real-time (sub-minute inbound, cron-precise outbound); **Claude Cowork** is what makes the owner's day work (briefing, approval queue, weekly learning, conversational ops). They share everything — the central database, MCPs, prompts, brand voice — so they're cheap to coordinate.

### 5.1 The three persistent layers

**The central database (data layer).** Single source of truth for every interaction the clinic produces — every booking event, every consultation note (digitalised), every message in/out, every package status change, every consent and preference, every suggestion accepted or rejected. The central database is permanent. Everything else is replaceable.

**The Ephemeral Software Layer.** The message-drafting prompts, the suggestion rules, the briefing template, the package-tracking automations, the Cowork scheduled tasks, the Airtable views — all of it is **disposable and regenerable**. As Claude (and later Hermes, if and when) get more capable, or as the clinic's logic changes, these components are rewritten and redeployed. The central database persists; the software around it evolves. This is what makes "no ops/marketing hire" work: when the clinic needs a new message cadence or a new triage rule, we regenerate the layer.

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

**2 — Policy / Decision Layer.** Two runtimes share this layer. **Claude Code daemon** handles every real-time / event-driven decision: an inbound message arrives, a session completes, a webhook fires — Code wakes within seconds, reads context from the central database, decides (respond automatically · queue for approval · escalate to Sara · route to a team member · log silently · trigger a follow-up sequence), and acts. **Claude Cowork** handles the owner-facing decisions: which patients to surface on the briefing, what the weekly digest should show Sara, what conversational queries Sara asks ad-hoc. This is the "automated clinic manager" layer — split into a real-time engine and an owner cockpit, both calling the same skills.

**3 — Tool Layer.** Both runtimes execute through the same MCP servers — Airtable for the CRM, WhatsApp / SMS / email for messaging, the booking platform for agenda reads/writes, Ollama for sensitive clinical inference. The tools are deterministic; the intelligence sits in the Policy layer above them.

**4 — Quality Gate.** Phase 1 keeps Sara as the primary quality gate — sensitive messages and clinical-adjacent decisions pass through her approval. The mechanism is concrete: when Code drafts something sensitive, it writes a "queued for approval" row into the central database; Cowork surfaces that row to Sara in her approval queue; one-click approve in Cowork triggers Code to send. Layered on top are automatic checks running in both runtimes: brand-voice consistency, recommendation sanity (e.g., flagging if the system suggests an intensive treatment for a patient with a very recent queixa), classifier drift, stale-task detection. As trust accrues, gates that prove reliable can be promoted to autonomous on a per-category basis; high-stakes gates stay human-DRI indefinitely.

**5 — Learning Mechanism.** Every week — and on every flagged anomaly — Cowork runs a learning pass: message-review (which got good responses, which got ignored, which generated complaints), suggestion-review (which Sara accepted, modified, or rejected, with what justification), briefing-review (which patients on the briefing led to relevant in-consultation actions, which were noise), operational telemetry (which Code webhooks fired, which cron jobs ran on time, which automations are failing silently). The output is **patches** — updated message templates, refined suggestion rules, new triage tags, modified briefing structure, Airtable view changes. Patches go through the Quality Gate (Sara or an automatic check, depending on risk) and are deployed back into the Ephemeral Software Layer. **Both Code and Cowork pick up the patches from the next invocation** — same source, same prompts. The loop closes; the system gets better.

### 5.3 What this looks like in production

A concrete Day-30 scenario at Sara's clinic:

1. **Sensor event.** Maria Silva arrives for her 3rd of 4 laser sessions. The equipa marks "session complete" — either by clicking the in-CRM button (booking-platform webhook fires) or by messaging Claude on the clinic's WhatsApp ("Maria, sessão 3 feita"). **Claude Code daemon picks up the event within seconds**, logs the session + parameters + a one-line note to the central database, updates the package status, and fires the patient confirmation: "Sessão 3 de 4 concluída. Falta 1 sessão. Próxima entre 18 e 25 de junho." Maria gets the message before she's left the parking lot.
2. **Audit catch.** The weekly **Cowork** learning pass notices that two of the previous week's twenty-three "session complete" events were classified as ambiguous by Code's WhatsApp parser — the equipa's shorthand had drifted, and Code conservatively queued them for Sara's approval instead of auto-sending.
3. **Root cause & patch.** The learning pass diagnoses the drift (new shorthand from the equipa: "M-3-feita" instead of "Maria, sessão 3 feita"), drafts an updated parser prompt that recognises both, drafts a one-line equipa note acknowledging both shorthands work, and queues the patch.
4. **Quality Gate.** Sara approves the patch in Cowork (one click) and forwards the equipa note in the team's WhatsApp group.
5. **Resolution.** Within minutes, both runtimes pick up the updated parser. The following week, the equipa's shorthand is parsed correctly regardless of variant. The system is measurably more reliable than it was — and Sara did not write a line of code or a line of copy herself.

### 5.4 Why this matters for what comes after Phase 1

Phase 1 leaves all five components in place — but with **Sara as the Quality Gate and Sara (via Cowork) as the executor of the Learning patches.** A potential Phase 2 — *not committed today* — would be the same architecture, with **autonomous quality gates** (LLM-as-judge, sanity tests, brand-voice filters) and **autonomous patching** (Claude writes and deploys the patch, escalating only the high-risk ones). The architecture does not change between phases; the question Phase 2 answers is *"how much of the loop runs without Sara in it."*

This is also why we will not need to rebuild anything to move the clinic from Phase 1 to a possible Phase 2. The central database, the tool layer, and the loop topology are identical. We are not shipping a Cowork product and later replacing it with a different product — we are shipping an operating layer and progressively widening its autonomy if and when the clinic is ready.

---

## 6. What's parked for after Phase 1

After Sara's explicit request, marketing & growth and local presence moved INTO Phase 1 scope (P5–P8). Three topics remain parked, to be revisited once the loop is producing data:

- **Paper note digitalisation** — three approaches on the table (live AI in-consultation, scan/photo post-consultation, capture at the moment of patient-facing document creation). Approach selection is a Phase 1 *discovery* deliverable; the *build* itself is Phase 1.5 or Phase 2 depending on the choice. Until then, paper notes remain a real limitation on Priority 2's suggestion quality.
- **No-show and cancellation recovery** — calendar-gap monitoring + automated outreach to waitlisted or follow-up-due patients. Adds clear revenue but benefits from having P1 (journey messaging) running steady-state on real data first so the recovery messages don't conflict with patterns already in motion.
- **Patient portal (Phase 2 candidate)** — a simple authenticated area where the patient sees the state of their pacotes, full visit history (including all the confirmations from P3), upcoming sessions, and manages consents and channel preferences. **Managed entirely through Cowork — no separate CMS to learn.** Natural evolution from the per-session confirmation flow in P3: the form sends the patient a receipt; the portal lets them see all the receipts in one place. Build this once P1+P3 are producing real engagement data, so the portal reflects what patients actually use.

---

## 7. Delivery model — OBLQAI's 4-phase process · expanded scope ~45 days

The expanded scope (8 priorities including a net-new website + a full marketing operation) requires a ~45-day Phase 1 instead of the canonical 30. Patient-ops and acquisition build in parallel where possible.

| Phase | Window | What happens |
|---|---|---|
| **1. Discovery & Design** | Days 1–5 | Expanded workshop covering all 8 priorities. Confirm booking platform + canal preferences. Confirm domain, Meta/Google ad accounts, GMB ownership. Brand kit audit — exists or needs deriving. Choose paper-note approach. Implementation Blueprint covering patient-ops + marketing + website tracks. |
| **2. Build & Configure** | Days 6–25 | MCPs (booking, WhatsApp, email, SMS, Meta Marketing, Google Ads, GMB, CMS), Airtable schema, Code daemon on VPS, Cowork scheduled tasks, prompts for P1–P8, voz da clínica derivation, suggestion engine in test, **net-new website build runs in parallel**. |
| **3. Testing & Launch** | Days 26–32 | End-to-end testing of each priority. Equipa training. Soft launch: P1 (journey messaging) + P4 (briefing) + new website live + P5 (social media) shipping content. |
| **4. Optimization & Expansion** | Days 33–45, then ongoing | Roll out P2 (suggestions) + P3 (package tracking). Launch P6 (Google Ads) + P7 (Meta Ads) in production. Tune on real data across all priorities. Formal handover into Managed Service after Day 45. |

After Day 45 the clinic moves into OBLQAI's **Managed Service** — ongoing maintenance, monitoring, quarterly capability review, monthly performance check-in, 99.5% uptime on deployed workflows, 2-hour critical-incident response.

**Timeline honesty:** ~45 days for 8 priorities + a net-new site is ambitious. The risk-mitigated version is a 60-day window with the same priority order — happy to discuss if Sara prefers a less compressed timeline.

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
2. Any additions, corrections or changes to the 8-priority list.
3. Confirmation that the **~45-day timeline is acceptable**, or signal to stretch to ~60 days.

**For the Discovery & Design phase (Days 1–5) — patient-ops:**
4. Read/write **access to the booking platform** (or a stand-in account).
5. List of **pacotes currently sold** — name, número de sessões, intervalo recomendado, validade típica.
6. **Sample of patient communication** the clinic already sends — to derive the brand voice.
7. **Decision on paper-note approach** for the pilot (or agreement to defer the build and keep paper for now).
8. Confirmation of the **equipa members** who'll be DRIs for in-room actions.
9. **DPO / data-protection contact** (or confirmation that the clinic uses a standard PT DPA shape).

**For the Discovery & Design phase (Days 1–5) — marketing & website:**
10. **Brand kit** — logo, color guide, typography, photography library. **If none exists**, agreement on whether we derive a v1 in-house during the build, or commission an external designer (separate cost line).
11. **Domain ownership** — current domain (if any), DNS access. If no domain yet, decision on the domain to register.
12. **Hosting + CMS preference** — managed hosting on OBLQAI's VPS (default), or specific provider preference. CMS shape will be proposed in Discovery; Sara approves.
13. **Google Business Profile** — does Sara own/manage the listing, or is it claimed by a third party.
14. **Meta Business Manager + Instagram/Facebook accounts** — admin access. Or agreement to create from scratch.
15. **Initial monthly ad budget** — separate cap for Google + Meta. Sets the test-and-learn baseline for P6/P7 tuning.
16. **Marketing approval cadence** — who else (if anyone) sees campaign drafts before launch. Phase 1 default: Sara alone.

---

## 10. Commercial framework (placeholder — to be confirmed with Joao)

OBLQAI Practice Command engagements are priced as **one-time implementation + monthly managed operations**. The implementation covers workflow setup, integrations, deployment, testing and onboarding. The monthly fee covers secure hosting, monitoring, maintenance, workflow updates, messaging infrastructure, integration stability and compliance supervision.

> **Specific numbers withheld pending Joao's pricing-model confirmation for this engagement.** Practice Command canonical pricing exists for PT / DE / CH (see `Context/pricing.md`) — but **the expanded scope here (net-new website build + 4-priority marketing operation) sits on top of the canonical shape**. Expect a separate one-time **website-build line item** added to the setup fee (rough order: €4–8k PT depending on complexity), with monthly operations absorbing the ongoing marketing + ads runtime. Joao to set the exact numbers before any figure is put in writing.

---

## 11. Why OBLQAI

- We are an **integration and configuration company**, not a custom software house. Phase 1 is delivered by configuring proven components (Claude Cowork, MCP servers, Airtable, the Claude API, Ollama for local inference) into a working operating layer — not by writing software from scratch.
- We deliver in **30 days**, not 6 months, because we don't build the things we configure.
- We bring a **productized methodology** (the 4-phase process + Practice Command capability library) so the engagement is predictable in shape, even when the underlying business is a fresh start on AI.
- The clinic would be among the **first Practice Command engagements** built on the full self-improving-loop architecture — the same operating model OBLQAI itself runs on. We are not selling a stack of integrations; we are installing the loop that keeps the integrations sharp.

---

## Internal notes for Joao (not for the client version)

- **SCOPE DOUBLED on 2026-05-27.** Sara asked for social media management, Google Ads, Meta Ads, and a net-new website + Cowork upkeep. Pulled them out of "Fora da Fase 1" and into Phase 1 as P5–P8. Timeline expanded from ~30 days to ~45 days. Patient-ops + acquisition build in parallel.
- **Healthcare Clinics vertical**, Practice Command canonical pricing applies to the patient-ops layer (PT €8k setup / €950 monthly; DE 1.5x; CH 2x in CHF — per `Context/pricing.md`). **Net-new website build is a separate one-time line item** — rough order €4–8k PT, set the exact number based on CMS choice + design complexity. Monthly operations likely absorbs the marketing/ads runtime; if ad-spend management becomes meaningful effort, may warrant a separate marketing-ops monthly line.
- **No pricing in writing yet**, per your call. Section 10 carries the placeholder; the number lands only after you sign off and the pt-PT translation pass runs.
- **Section 5** uses the canonical self-improving-loop framing from `Context/self-improving-loop-architecture.md` — identical topology to the Renato draft, adapted to the clinic context. ASCII diagram in PT inside the code fence.
- **Phase 2 carefully phrased.** Healthcare clinics aren't excluded from Tier 2 by rule (only law firms are), but Cowork-first house rule applies. Positioned as "if and when," not "Day 1 commitment." Do not let later edits pre-promise autopilot.
- **Booking platform unconfirmed.** BUK vs book.pt assumption needs verification in the next call. Affects which MCP we ship and how the integration timeline looks.
- **Paper notes deferred** but not silenced — Section 6 keeps it visible without scope-creeping Phase 1. Don't let it disappear in subsequent revisions: AI suggestions (Priority 2) are weak as long as patient history is on paper.
- **Brand voice asset doesn't exist.** Plan is to derive it from existing patient comms during Build (Days 6–25). Confirm Sara is OK with that or wants to write a brief beforehand.
- **Brand kit dependency is the new critical-path item.** Net-new website + social engine + ads creative all need it. If Sara doesn't have one, derive a v1 in Discovery (Days 1–5) — likely lean and editable, not a finished brand book. Or commission externally as a separate line item.
- **Timeline ambition.** 45 days for 8 priorities + a site build is aggressive even by OBLQAI standards. The risk-mitigated alternative is 60 days with the same priority order. Section 7 carries the timeline-honesty paragraph explicitly inviting Sara to stretch to 60 if she prefers.
- **Two superseded .docx artifacts** already in the Sara folder from the earlier framework attempt:
  - `Sara-Proposta-Piloto-2026-05-27-PT.docx` — the heavy single-file proposal I built before you asked for the Renato framework. **This DRAFT.md supersedes it.** Keep or delete is your call.
  - `Sara-Discovery-Meeting-Minutes-2026-05-27-{EN,PT}.docx` — the meeting-minutes pair. **Superseded by `2026-05-27-introductory-call-summary.md`.** Same call.
- **Translation timing:** keep this in English until your review + pricing decision. Then translate to **pt-PT (NOT pt-BR)**. Per `feedback_translator_implementer_serial.md`, translation runs serial, not parallel to writing.
- **Framework adoption:** the move to this markdown-first format codifies in `Context/client-doc-framework.md`. Going forward every new client engagement gets the Renato two-file pair from day one.

---

*Draft generated 2026-05-27. Will be revised after Joao's review and any new context Sara shares this week. Do not send before Joao's review, pricing decision, and pt-PT translation pass.*
