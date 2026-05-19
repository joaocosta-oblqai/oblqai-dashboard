# OBLQAI Operations Dashboard

Read-only partner dashboard for OBLQAI: pipeline, MRR, monthly burn, activity log, deliverables, tasks, and the change log.

- **Source of truth:** Airtable base `OBLQAI Ops` (`appZwvjOYN2SDJhsj`) — 7 tables: Customers, Deliverables, Activities, Updates, Costs, Tasks, Global docs.
- **Refresh cadence:** Daily at 06:00 UTC via GitHub Actions.
- **Live URL:** https://jccosta94.github.io/oblqai-dashboard/

## How it works

1. A GitHub Action runs `scripts/snapshot.mjs` against the Airtable API.
2. The script writes `src/data/snapshot.json` (what the React app reads) and regenerates `UPDATES.md` (the human-readable change log) from the Airtable Updates table.
3. If either file changed, the action commits it back to `main`.
4. Vite builds the static site and `actions/deploy-pages` publishes it.

No Airtable credentials ever reach the browser; the page only reads from the baked JSON snapshot.

## Why Airtable

The four founders edit Airtable directly (CRM stages, costs, tasks, weekly update entries). This dashboard is a read-only mirror — partners visit the GH Pages URL, founders write to Airtable. Per the team's positioning, we do not build a custom write-side portal here; that contradicts the Claude-as-the-operational-interface product pitch.

## Local dev

```bash
npm install
npm run dev
```

To refresh the local snapshot from Airtable, export a Personal Access Token with read access to the `OBLQAI Ops` base, then:

```bash
AIRTABLE_TOKEN=pat... node scripts/snapshot.mjs
```

The script writes both `src/data/snapshot.json` and `UPDATES.md`. Do not hand-edit either file — add a new row in the Airtable Updates table instead, and it'll appear here on the next sync.

## Required GitHub secret

- `AIRTABLE_TOKEN` — Airtable Personal Access Token with `data.records:read` scope on the `OBLQAI Ops` base (`appZwvjOYN2SDJhsj`).

## Table IDs

For reference (these are what `scripts/snapshot.mjs` reads):

| Table | ID |
|---|---|
| Customers | `tblKUKYLDAwm0tUo1` |
| Deliverables | `tblTZ68UFVuZs7rsh` |
| Activities | `tblVb8ZB8AUlhFstQ` |
| Updates | `tbl6yTWfjDHJXwLtb` |
| Costs | `tblZ0iY7XcwvMOlus` |
| Tasks | `tblKiUYazLdttUz9U` |
| Global docs | `tblX8Vt7HiFLQn5rq` |

## Migration note (2026-05-19)

This dashboard previously read from the older base `app227z9ZnnKPhhfL` ("Why AI Consulting CRM") and the daily refresh had broken some time ago — `snapshot.json` and `UPDATES.md` were being hand-edited by Cowork sessions. As of 2026-05-19 the new `OBLQAI Ops` base is the canonical store, `scripts/snapshot.mjs` reads from it, and both output files are now derived. The old base is retired.
