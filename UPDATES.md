# OBLQAI Operations Dashboard — Updates

This file is the human-readable change log for the partner-facing dashboard at
**https://jccosta94.github.io/oblqai-dashboard/**.

Each session that produces meaningful changes to the CRM, costs, or operational
state should append a new entry below. The dashboard reads from `src/data/snapshot.json`,
which also carries a parallel `updates` array — keep both in sync.

Newest entries on top. Format:

```
## YYYY-MM-DD — <one-line headline>

- Bullet of what changed
- Bullet of what changed
```

---

## 2026-05-21 — Renato pilot — proposal + use cases sent, awaiting feedback

- Sent the two-deck deliverable to Renato (Incotin): `Renato-Proposal.pptx` + `Renato-Use-Cases.pptx`. He reviews, then we schedule an alignment call before his 2026-06-15 channels & tools deliverable.
- Renato customer record moved to **Proposal** stage in OBLQAI Ops. Activity logged: "Proposal sent — Completed", next step due 2026-06-15.
- Mirrored everywhere it needs to be: Airtable Activities + customer record, project memory, and this dashboard.

---


## 2026-05-20 — Renato pilot — Use Cases deck shipped alongside proposal

- Renato gets a two-part deliverable for the 2026-06-15 follow-up: (1) `Renato-Proposal.pptx` — 8 slides, what we propose; (2) `Renato-Use-Cases.pptx` — 13 slides, how every flow actually runs through Cowork.
- Use Cases deck covers 11 process flows: online strategy · CRM strategy · website build · consumer-into-CRM funnel · inbound triage · content engine · visuals + scheduling · Google Ads · GMB · weekly review · escalation. Each one shows the schedule → plugin → draft → approve → publish → log loop.
- Both decks copied to dashboard repo (`clients/renato/`) and Airtable Deliverables. Renato Plan excalidraw (already pushed) remains the integrated canvas view.

---


## 2026-05-20 — Project-wide sweep — OpenClaw → Hermes (Nous Research) across artifacts

- **Decision being landed**: Tier 2 / Autopilot runtime is **Hermes** (Nous Research, [hermes-agent.nousresearch.com](https://hermes-agent.nousresearch.com)), not OpenClaw. Hermes is open-source, MIT, with built-in persistent memory + a learning loop, MCP support, native messaging across 20+ platforms, scheduled automations, subagents, sandboxing on six backends (including serverless Modal), and a skills format compatible with Claude's. Hugo brand survives — it's the OBLQAI-curated marketing product that runs on top of Hermes.
- **What changed today**: 163 OpenClaw → Hermes replacements across 28 files. Hit list:
  - `CLAUDE.md` (root, 1) + `.claude/CLAUDE.md` (13)
  - `claude-cowork-service-blueprint-v2.docx` (33 — the canonical service definition)
  - `claude-cowork-README.md` (13)
  - `Comercial/Demos/Advogado-Contratos-*` (33 across 6 files)
  - `Context/active-pilots.md` (3), `Context/verticals.md` (4), `Brand/brand-identity-brief.md` (1)
  - `Website/whyai-consulting/src/data/blogPosts.ts` (2) + `pt-translator.md` agent prompt (1)
  - `Discovery Docs/Vertical Checklists/Law-Firms.md` (4), `Consulting/05-Claude-Cowork-Command-Center-Blueprint.md` (1)
  - `client-implementations/Sara/Sara-Architecture-Diagram-PROMPT.md` (1)
  - All Renato deliverables: discovery call summary (5), requirements summary (1), proposal draft markdown (5), proposal `.pptx` (1), requirements `.xlsx` (4), master plan `.excalidraw` (26), CRM card markdown (3)
  - `oblqai-dashboard/src/data/snapshot.json` deliverable descriptions only (6 — historical updates array preserved unchanged)
  - `tasks.md` (1), `memory.md` (5)
- **Two manual cleanups after the automated pass**: the "Key Terminology" Hermes entry in `.claude/CLAUDE.md` had been mangled into a self-contradiction (Hermes was both "ours" and "Nous's"); rewritten to make clear Hermes is Nous Research's open-source agent used as our Tier 2 runtime. The tech-stack "Agent orchestration" line was clarified the same way. Hugo is consistently framed as the OBLQAI marketing product *running on* Hermes.
- **What was deliberately NOT touched**: this `UPDATES.md` log itself (historical entries describe what was true on each entry's date), the `updates` array in `snapshot.json` (same logic), the `Comercial/_pre-logo-backup-2026-05-14/` backup pptx, and Drive text-mirror Doc copies of binaries — those still carry the older OpenClaw wording and will be regenerated next time a deliverable goes out the door.
- **Verified clean**: zero `OpenClaw` mentions remain in any active artifact across the project (only residual mentions are inside historical log entries in `UPDATES.md` and `snapshot.json`, where they correctly describe past state).
- Memory: `project_hermes_replaces_openclaw.md` records the architecture decision; `reference_hermes_docs_key_facts.md` carries the official-docs verification of MCP + Skills compatibility; `reference_hermes_vs_openclaw.md` and `reference_hugo_product_name.md` updated to resolved-state.

---

## 2026-05-20 — Renato — proposal deck v3 — added cost-savings slide (PT-anchored)

- `Renato-Proposal.pptx` is now 8 slides (was 7). The new slide 3 — **"The alternative cost picture — Portugal"** — sits between the scope/kits slide and the open-questions sequence, four columns wide: **PEOPLE** (operator you don't pay — agency OR junior + freelance), **BUILDS** (configurator + the cheap shortcuts a PT SMB would actually approve), **STACK** (SaaS subscriptions Cowork displaces), **MISTAKES** (wasted ad spend, delayed B2C entry, RGPD risk, the ~€80k–240k/season ES-reference market). Brand standard (cream + copper + Georgia/Calibri).
- Ranges re-anchored from CH/UK-coded benchmarks to PT SMB reality across two review passes by Joao: the PEOPLE column dropped from a five-person fantasy team to the two paths Incotin would actually take (agency on retainer OR one junior generalist + occasional freelance); BUILDS was pared to just the configurator as the one realistic spend (€4-12k) plus three cheap shortcuts. STACK kept as global SaaS list price for now — open to similar treatment if Joao flags.
- No OBLQAI price appears on the slide. Footer is explicit: *"Not a quote — an alternative-cost reference. OBLQAI engagement pricing covered in the proposal call."* Keeps off-blueprint pricing posture intact.
- Standalone single-slide source kept at `client-implementations/Renato/Renato-Proposal-CostSlide.pptx` for future reuse / standalone send.
- iCloud-eviction note: the deck had been evicted to cloud-only (1.18MB metadata, zero local blocks) and required `brctl download` from Joao's Terminal before the sandbox could read it. Pattern worth remembering for any future binary edit where the file appears locked.

---

## 2026-05-19 — Renato — per-customer requirements workbook v1 adapted from template

- Copied the canonical "Claude Coworker Requirements Blueprint" from `Discovery Docs/` (template left untouched) and adapted it for Renato/Incotin: `client-implementations/Renato/Renato-Requirements-v1.xlsx`.
- 16 sheets pre-filled: customer context, discovery answers (from the 2026-05-19 call), 8 candidate workflows captured + scored, current/future workflow map for the two priority workflows (INCOMIX configurator + B2C inbound triage), 6 Claude role cards, 6 skill definitions, 17 MCP/connector entries, 14 actions+permissions rows, and 7 plugin specs (6 Phase 1 + Hugo Phase 2).
- Every unresolved item marked `TBD — Renato delivers 2026-06-15` (or BrightWeb-blocked / post-call-2). The workbook is the requirements engineer's spine for the day Renato's channel/tool decisions land.
- Companion Markdown summary uploaded as a Google Doc in Renato's Drive folder; the binary xlsx stays in the iCloud-synced repo since it's above the inline upload limit. Airtable Deliverables row created and linked to the Renato customer record. New "Renato — Requirements Workbook v1" entry now appears on the Renato dashboard card.
- Decision recorded: every customer engagement after discovery should get its own adapted copy of this workbook. The template lives in `Discovery Docs/`; per-customer copies live under `client-implementations/<Customer>/`.

---

## 2026-05-20 — Renato — proposal deck shipped (with OBLQAI logo + weekly cadence) + master plan + refreshed notes wired to Drive, Airtable, and dashboard

- Three new artifacts pushed for Renato: (a) the 7-slide proposal-mode deck `Renato-Proposal.pptx` now carries the OBLQAI wordmark on every slide and drops the "Internal draft" caption — review cadence stated as weekly with Joao or Tiago Fernandes for the first 2 months (settling to monthly after the pilot); (b) the master plan diagram Joao compiled (`Renato_Plan.excalidraw`, 2,364 elements, 2.1 MB) combining the Capabilities Map + Scope Summary + Process Flow 1 (Consumer Acquisition) + Process Flow 3 (Inbound Triage) + the Still-in-Motion panel into a single canvas; (c) a refreshed Drive copy of the discovery call notes with cleaner formatting.
- All three are now linked from the Renato CRM card on this dashboard and recorded as Deliverable rows in the OBLQAI Ops Airtable (linked to the Renato customer record).
- Drive limitation noted: the GDrive MCP can't ingest binary uploads larger than ~265KB inline per tool call. The proposal `.pptx` (1.2 MB) and the master plan `.excalidraw` (2.1 MB) stay as canonical files in `client-implementations/Renato/`; their Drive entries are searchable content mirrors / pointer docs. If clean Drive copies of the binaries matter, Joao can upload them through the Drive UI directly.
- Process Flows 4–7 (E-commerce model · Checkout & Payment · Customer Service Window · Escalation Playbook) are NOT in this round of uploads — flagged earlier for Joao to review before sharing further.

---

## 2026-05-19 — Sergio + Sara + Zé Maria deliverables uploaded to Drive — every CRM card's deliverable now opens a working Google Doc

- Created OBLQAI → Clients → Sergio — Alpaca Law, OBLQAI → Clients → Sara — Beauty Clinic, and OBLQAI → Clients → Zé Maria — Agency + Construction in Drive. Uploaded 10 deliverables total: 7 Sergio docs (Meeting Notes, Alpaca research brief, Use-Case recommendations, Next-Steps plan, Alpaca-vs-Cowork plain-language EN + PT, formal proposal), Sara's 16-slide aesthetic-clinic deck, Zé Maria's v0.2 proposal, and the Example Agency reference deck Zé Maria used as a benchmark. Every customer's deliverables array in snapshot.json now has working URLs.
- Conversion path: the GDrive MCP still rejects docx/pptx/pdf binary uploads (same error as prior rounds), so docs were converted server-side — pandoc for the 7 Sergio .docx files, python-pptx text extraction for Sara's and Zé Maria's .pptx decks, pdftotext for the Example reference. Each Drive copy is a Markdown/text mirror; the canonical formatted source files remain in the project repo under client-implementations/.
- Two staleness flags surfaced inline: (a) Sara's deck slide 3 still carries the pre-2026-05-14 Practice Command pricing (Tier 1 €2.000–2.500 / €1.299/mo; Tier 2 €3.000–4.000 / €2.299/mo); current canonical is PT €8.000 / €950/mo. The .pptx source needs revising before any further client send. (b) Sergio's Next-Steps Plan internal pricing note references the parked Legal Efficiency Suite numbers — flagged inline.
- Operations board: "Jo to add all updated docs to company Google Drive + share links on dashboard" moved from Todo → In progress; description updated to reflect what's done and what's still outstanding. Outstanding for the next pass: Miranda — she has 4 deliverables on file (Implementation Proposal pdf, Pitch Deck pptx, Live Demo html, Demo Video Script md) that were NOT requested in this round; her stage is still Lead so this may be intentional but flagging for explicit Joao decision.
- Sergio activity entries (proposal sent, etc.) and Sara/Zé Maria touches are NOT yet logged in the Activities section — offered separately, awaiting Joao's call on whether to backfill from history or only log new touches going forward.

---

## 2026-05-19 — Global Docs uploaded to Drive — all six dashboard globalDocs links now live; staleness flags surfaced inline

- Created OBLQAI → General Docs in Drive and uploaded all six globalDocs as Google Docs (the GDrive MCP doesn't accept docx/pdf binary uploads in this session — the canonical .docx and .pdf source files remain in the project repo and are referenced from each Drive doc). Every dashboard globalDoc URL is now wired to a live Drive link.
- Service Blueprint v2 uploaded as a Markdown-converted searchable mirror with a clear pointer back to the canonical .docx in repo. Practice Command Pricing Canon written fresh from memory + CLAUDE.md and uploaded as a new standalone doc — supersedes the Healthcare row of the Service Blueprint. Discovery Process Overview, ROI Scoring Framework, Brand Identity House Standard, and the four Vertical Checklists files (README + Home Services + Healthcare Clinics + Law Firms) uploaded into a Vertical Checklists subfolder.
- Three staleness flags surfaced inline at the top of each affected doc and noted in the dashboard descriptions: (a) Discovery Process Overview still references the deprecated €1,500 audit and the old 4-vertical list (restaurants / health & beauty / real estate are out of scope); (b) Vertical Checklists README still links to those out-of-scope vertical files; (c) Healthcare Clinics checklist still carries the pre-2026-05-14 Practice Command monthly numbers (€1,870 / €2,805 / CHF 3,740 — current canonical is €950 / €1,425 / CHF 1,900); (d) Home Services checklist contains unfinalized Field Service Command pricing ranges in writing (€5-12k / €15-30k / €1,500-3,500/mo). Drive docs include warnings; source files on disk need revising before treating as canonical.
- The Service Blueprint .docx itself also carries the OLD Healthcare pricing row (€2,000–2,500 setup / €1,299 monthly) — the Drive doc flags this; revising the actual .docx is a separate task on the board if/when the blueprint is next revved.

---

## 2026-05-19 — Renato proposal v2 (CRM + email added); Brand Standard approved; Legal Efficiency pricing task parked; June 15 follow-up queued

- Renato proposal updated to v2 — added a fourth Phase-1 bundle: headless Airtable CRM (Contacts / Conversations / Stores / Products, manipulated through Claude, no Airtable UI for Renato's team) and an email connector (inbound triage into the same CRM, pt-PT reply drafts, weekly digest). Reasoning: Joao flagged on the discovery call that Renato is likely to want both, and they sit beneath everything else in the proposal — better to surface them as scoped from Day 1 than to land them as a surprise later. The email provider stays dependent on Renato's 2026-06-15 tools-list decision. v2 doc is now linked from the Renato CRM card; v1 remains in Drive as history.
- Operations board changes: "Set date for initial call with Renato" marked Done (call completed 2026-05-19). "Approve OBLQAI Brand Standard v1.0 §01-§03" marked Done (approved by Joao 2026-05-19; was previously overdue against its 2026-05-16 due date). "Finalize Legal Efficiency Suite pricing" removed from the board for now — parking the work, will re-add when Sergio's deal forces the question.
- New task added for Joao with a 2026-06-15 due date: follow up with Renato on the channels & tools list. Pairs with the Cowork scheduled task that fires 2026-06-16 morning to either summarize what arrived or draft a pt-PT chase email.
- Internal note: the discovery workbook (Discovery Docs/claude_coworker_requirements_blueprint_with_workflow_map.xlsx) was checked for coverage of per-client CLAUDE.md / memory.md / tasks.md / Context/ scaffolding. Result: not covered. The workbook addresses the Anthropic-side architecture (skills, MCP, connectors, plugins, agents) but nothing about the project-files structure Jo's global CLAUDE.md mandates. Worth a follow-up to either add a sheet or extend one of the discovery markdowns.

---

## 2026-05-19 — Renato (Incotin) discovery call complete — Cowork pilot anchored on B2C website + configurator; cost line correction on Upload-Post

- Renato is Incotin (incotin.com.pt), a paint manufacturer based in Lavra/Matosinhos. Construction + furniture/metalmecânica products, INCOMIX color-matching as the differentiator, markets across PT/ES/FR + Lusophone Africa. Strong B2B trade backbone, near-zero on AI and consumer marketing. Concrete ask is opening a B2C channel for end consumers (particulares), anchored on a new B2C section of their website with a guided paint configurator that helps consumers pick the right product for their job.
- Engagement positioned as Tier 1 Claude Cowork Setup using the website rebuild as the natural entry use case, with Hugo (OpenClaw marketing autopilot, Tier 2) as a Phase 2 upgrade once the consumer funnel is live and producing data. CRM record updated to reflect this — Renato was previously marked as a Tier 2 OpenClaw lead; that has been corrected to Cowork-first with Hugo as the upgrade path, consistent with the house rule.
- Renato committed to deliver his final decisions on B2C channels (own webshop vs. marketplaces vs. retail-led vs. hybrid) and operating tool stack by 2026-06-15. Proposal is therefore a roadmap, not a fixed scope, until that list lands. A Cowork scheduled task fires 2026-06-16 morning to either summarize what arrived or draft a polite pt-PT chase email for Joao's review.
- Two new deliverables now in Drive and linked from the Renato CRM card: the full discovery-call summary and the Cowork roadmap proposal draft. Both live in OBLQAI → Clients → Renato — Incotin. The proposal includes an Internal Notes section that needs stripping before any client-facing version is sent, and carries no pricing — off-blueprint vertical, Joao to set the model before any number goes in writing.
- Cost correction: Upload-Post monthly subscription updated from €15 → €25 (the €15 figure was entered in error on 2026-05-14; €25 is the actual billing). Monthly burn moves from €315.90 → €325.90. No other cost-line changes.

---

## 2026-05-19 — oblqai.com goes bilingual — EN + pt-PT live with header toggle

- The marketing site at oblqai.com now ships in English and European Portuguese. A copper-accented PT | EN toggle in the top bar (desktop and mobile) switches the whole site — chrome, marketing copy, the three blog posts, and the SEO meta. URL strategy is path-prefix (`/pt/...` for Portuguese, `/...` for English) so both languages are independently crawlable. Language choice persists across reload and route navigation.
- Business meaning: we can now run paid and organic acquisition in Portuguese without sending prospects to an English page. The GDPR-compliant-AI post and the founder-POV post on lawyer supervision both rank for queries Portuguese clinic owners and lawyers actually type — the Portuguese version unlocks that surface directly. Same infrastructure is extensible to German (1.5x PT market multiplier) when we decide to lean into DE acquisition.
- Process note for partners: this was shipped via a sub-agent pipeline inside Claude Code — i18n-architect → pt-translator → react-implementer → playwright-qa → brand-qa. The Playwright behavioral suite (15 assertions, all green) caught three runtime bugs that static tooling missed: i18next resolution overreach, a LangGuard re-render race, and a featured-post filter regression. Static QA alone would have shipped them. Lesson institutionalized: behavioral testing is now mandatory for user-visible UI features.
- Scope-excluded by design: Pricing.tsx remains dormant with v1-era pricing copy in both languages — component is unmounted so not visible, content debt for when we remount it with Practice Command canonical numbers. Blog post bodies stay translated only to pt-PT; further languages are a future decision.
- Technical follow-ups parked deliberately: production JS bundle is 735KB in a single chunk (Vite warns past 500KB). Route-level code-splitting is the standard fix, but we are deferring until real-world TTI data from PT/DE traffic justifies the work — premature optimization without measurement is the wrong tradeoff for a B2B marketing surface that mostly converts on desktop. Will revisit if a mobile-heavy paid acquisition campaign launches.

---

## 2026-05-18 — Weekly recap: no material changes to CRM or costs

- Pipeline holds steady since 2026-05-16: Sergio (Proposal), Sara / Renato / Zé Maria (Discovery), Miranda (Lead). Five active records — no new leads, no stage moves, no MRR or setup-fee changes, no package/tier/market changes.
- No new or changed cost lines. Monthly burn unchanged at **€315.90/mo** (Anthropic Claude Pro Max €221.40 still dominant; Codex €25, Google AI €22, Hostinger VPS €20.50, Upload-Post €15, Google Workspace €12; Firebase, GitHub, Cowork, n8n at €0).
- Tasks board: 4 In progress, 4 Todo, 2 Done. Brand Standard v1.0 §01-§03 approval (Jo) slipped past its 2026-05-16 due date over the weekend and is now overdue. Three tasks land their due date today (2026-05-18): chatbot tuning (Jo), Drive doc upload (Jo), social content strategy (Miguel).
- Two pilots still gated on prospect availability: Renato (first OpenClaw pilot) and Zé Maria (rescheduling the missed initial call). Sergio's proposal response is the other open thread — follow-up due 2026-05-19.
- Nothing to escalate this week — system checked, state is intentionally unchanged.

---

## 2026-05-16 — Site repositioned as Claude Cowork implementation partner

- Homepage rewritten end-to-end to lead with **Claude Cowork**, not generic "AI automation". New hero: *"Claude Cowork, implemented for European SMBs."* Eyebrow, subhead, footer tagline, methodology and differentiators all updated to lead on the implementation-partner role rather than the prior "integration layer / productized AI operating layer" framing.
- New **"Bringing Claude Cowork into your office"** section on the homepage. Stylized Cowork desktop mockup matching the real app's three-pane layout (Chat / Cowork / Code mode tabs, left nav + Recents, center thread with Act / Opus / Queue composer, right Progress + workspace + Context panels) running a live Q1-supplier-audit demo task with a copper human-in-the-loop review banner. Five floating connector tiles (QuickBooks · HubSpot · Google Drive · Airtable · Gmail) ring the mockup with "Connected" status badges so the integration story reads at a glance.
- Five hero outcome cards replaced with Cowork-anchored copy: *An autonomous operations engine · A tireless executive assistant · Bespoke proposals in minutes · Absorb growth without adding headcount · Shift from builder to editor*.
- Services section rewritten as **"Four pieces of work, one Cowork install"** — Cowork Install & Configure / MCP & Connector Engineering / Agentic Workflow Design / Team Adoption & Managed Service.
- Differentiators rewritten as **"The Cowork implementation partner"** — Anthropic's official agent / We live in the agent / Live in 30 days / Stay on the line after launch.
- Use Cases page: five Aha! cards now carry Cowork-specific narratives across Legal, E-commerce, Marketing, Healthcare, SaaS. Slider labels swapped from "Before AI / After AI" to **"Before Claude / With Claude Cowork"**, and a per-industry *"Drafted / Analyzed / Recommended / Triaged by Claude"* badge now sits on the After side of every comparison.
- Live at https://oblqai.com — deployed via Firebase Hosting (`claude-cowork-consulting` project).

## 2026-05-15 — Website refresh shipped — new Use Cases page + blog repositioned

- New **/use-cases** page is live on oblqai.com — an interactive Before/After slider paired with a 5-industry tile picker (Legal, E-Commerce, Marketing, Healthcare, Software). Each scenario is anchored to a concrete operational outcome the system delivers: **€2.4M risk surfaced** on a 247-contract M&A diligence, **€340k/mo margin** from pricing intelligence across the catalog, a **complete multi-channel launch kit** in 4 hours vs. a 6-week agency cycle, **€58,200 recovered** from a denied-claims backlog, **support backlog cut 71%** with first-response time down from 14h to 4m.
- Blog rewritten and repositioned. The prior set of fictional client case studies has been removed — composites that read as real are a credibility risk for the brand. Replaced with three new posts spanning three angles: SEO authority (GDPR-compliant AI for clinics in CH/DE/PT), founder POV (why we don't sell autonomous AI to law firms — bylined Joao), and operational walkthrough (what Practice Command actually replaces in a clinic by week 1, 4, 12). Seven more posts queued in the editorial slate.
- Header navigation now exposes **Use Cases** as a top-level link alongside Services, Process, ROI Calculator, and Blog.
- House standard preserved end-to-end: cream-on-cream layout with a single dark CTA band at the bottom (sandwich rule), Georgia editorial headers, copper as the sole accent.

## 2026-05-14 — Practice Command monthly halved (multiplier re-tune, two passes)

- Internal pricing stack re-tuned in two passes today. **Pass 1:** Intelligence / Compliance / Integrations dropped from **10x → 5x** each. **Pass 2:** Compute dropped from **5x → 2x** and Messaging from **3x → 2x**. Total stack moves from **38x → 19x** — exactly half.
- Monthly Practice Command prices drop accordingly: **PT €1,870 → €950/mo**, **DE €2,805 → €1,425/mo**, **CH CHF 3,740 → CHF 1,900/mo**. That's a **~50% cut** to monthly recurring revenue per Practice Command client vs. where we started the day.
- One-time build is unchanged (PT €8,000, DE €12,000, CH CHF 16,000) — implementation effort is the same; only ongoing operational load is lighter, reflecting maturing tooling (cheaper Claude usage, pre-built MCPs, productized RGPD templates, VPS consolidation, standardized messaging infra) and a more aggressive pilot entry price.
- All open Healthcare quotes (Sara) and any Healthcare prospects should re-quote off the new monthly. Canonical pricing memory and project CLAUDE.md updated to match.

## 2026-05-14 — Upload-Post added to internal costs (€15/month)

- New cost line: **Upload-Post** at €15/month (multi-platform social media scheduler, supports the organic content strategy Miguel is putting together). Monthly burn now **€315.90**.

## 2026-05-14 — Kanban columns now cap their height

- Each column on the Operations board (To do / In progress / Done) is now capped at ~24rem with internal vertical scroll.
- The column header shows the count and a small "· scroll" hint once a column has more than 3 cards. Keeps the dashboard footprint stable no matter how Done grows over time.

## 2026-05-14 — Three new tasks on the board, all due 18 May

- **Jo** — configure the website chatbot for our purpose (tune the system prompt + knowledge base to land on-brand).
- **Jo** — add all updated docs to company Google Drive and share the links on the dashboard so deliverables become clickable. (This replaces the earlier Drive task on the board — same scope, moved to the 18 May deadline.)
- **Miguel** — define the social media organic content strategy (channels, cadence, pillars, examples, KPIs).

## 2026-05-14 — Operations board (internal kanban) added

- New section at the bottom of the dashboard: **Operations board** — a To do / In progress / Done kanban for internal tasks.
- Each card shows the task title, owner chip, one-line description, due date (turns orange when due in ≤3 days), and a linked-customer tag when applicable.
- Data lives in Airtable (`Why AI Consulting CRM` → `Tasks` table). Add a row there with Title, Status, Owner, Description, Due Date — the dashboard reflects it on the next snapshot refresh.
- Seeded with 8 tasks summarizing where things stand right now (proposal follow-up, initial-call scheduling for Renato + Zé Maria, brand-standard approval, Drive uploads, etc.).
- The weekly Cowork scheduled task now also picks up the Tasks table on its Monday refresh.

## 2026-05-14 — Pipeline view is now compact

- Customer cards in the pipeline shrunk from large to one-glance: name + vertical + market + a two-line "Next" excerpt. Full details still one click away on the customer page.
- Active stage columns narrowed from 256px → 208px. Empty stage columns shrank to 112px with a discrete em-dash placeholder, so the structure of the full pipeline is still visible without taking half the page.
- Net effect: the pipeline section is roughly half as tall.

## 2026-05-14 — Recent updates + Activity log: cap to 2, expand to see history

- Both sections now show the 2 most recent entries by default with a "View N older" toggle that reveals the rest inside a max-height scrollable container. Keeps the page short and partners focused on what changed this week without losing the historical log.

## 2026-05-14 — Website + dashboard aligned to House Standard v1.0

- Applied the OBLQAI Brand Identity (House Standard v1.0) across both surfaces. The three hard locks are now codified everywhere: one accent (orange `#FF8449`), two type families (Inter + Georgia), no AI tropes.
- **Website (oblqai.com)** — hero rewritten with Georgia Bold display headline + italic orange accent, cream ground replaces the old cool gradient, sand-paper case-study card replaces the cyan blob. Header on cream-tinted blur. Footer is now ink-ground with the typeset OBLQ·AI wordmark and editorial column structure. Cyan / generic-gray classes across all components swept to brand tokens.
- **Dashboard** — footer now carries the typeset OBLQ·AI wordmark per the placement rule (header carries the mark, footer carries the typeset wordmark — never both). Added the full gray-ramp tokens (`--color-gray-01..06`) and re-mapped legacy variables to the House Standard six-stop ramp.
- Promoted h2/h3 section headlines on the website to Georgia (`font-editorial` / `font-display`) across Services, Pricing, Calculator, Methodology, Differentiators, Contact, BlogSection, and DiscoveryCTA.

## 2026-05-14 — Dashboard branding now matches the OBLQAI logo

- Replaced the text wordmark in the header with the actual OBLQAI logo image (black "oblq" + orange "Ai"). Also appears small in the footer.
- Retuned the accent color from the copper editorial tone (`#C27C4E`) to the website orange (`#FF8449`) so the dashboard reads as the same brand as oblqai.com.
- New favicon — black square + orange dot — to match.

## 2026-05-14 — Customer detail pages + Global docs section

- Customer cards on the pipeline are now clickable — each opens a detail page with the customer's full notes, key fields, and a list of every deliverable we have on file (proposals, decks, demos, research briefs).
- Added a **Global / general docs** section at the bottom of the main page for reference materials partners might want (Service Blueprint v2, pricing canon, discovery process, brand standards).
- Moved **Recent updates** down: main page flow is now KPIs → Pipeline → Costs → Updates → Activities → Global docs.
- Deliverables are listed by title + filename + type for now. Actual clickable file links depend on where the files get hosted — see the open question in the next session note.

## 2026-05-14 — Full pipeline now visible on the dashboard

- The "Customers by stage" section now shows ALL 11 planned stages as columns (Lead, Qualified, Discovery, Audit, Proposal, Negotiation, Won, Onboarding, Live, Churned, Lost), not just the ones with active customers. Empty stages render as dashed placeholders so partners can see how the pipeline is structured end-to-end.
- Layout switched to a horizontal scroll so the full flow stays in one row at any screen width.

## 2026-05-14 — Dashboard goes live; partner change log begins

- Launched the partner operations dashboard at `jccosta94.github.io/oblqai-dashboard`.
- Reconciled Airtable CRM + costs with GitHub `ops` so all three surfaces agree on stages, packages, and tiers (vocabulary now matches the ObliqAI Ops project board: Lead / Qualified / Discovery / Audit / Proposal / Negotiation / Won / Onboarding / Live / Churned / Lost).
- Added **OpenAI Codex** to internal costs at €25/month (will scale to €100 once usage steps up). Monthly burn now €300.90.
- Cleared the stale €2,499 MRR on Sergio's record — Legal Efficiency Suite pricing hasn't been finalized; old per-vertical pricing no longer applies.
- Filled in missing fields for Renato and Zé Maria (Vertical: Other / Out of Scope · Tier · Market · notes).

### Pipeline movement
- **Sergio** → Proposal sent. Next move: follow up on his answer.
- **Sara** → Discovery (call scheduled 2026-05-15, 18:00).
- **Renato** → Discovery (waiting on him for a date for the initial call).
- **Zé Maria** → Discovery (need to set a new date for the initial call).
- **Miranda** → Lead (still pre-engagement).
