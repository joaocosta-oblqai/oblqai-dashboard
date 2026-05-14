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
