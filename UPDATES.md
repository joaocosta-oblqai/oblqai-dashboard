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
