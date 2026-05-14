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
