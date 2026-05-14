# OBLQAI Operations Dashboard

Read-only partner dashboard for OBLQAI: pipeline, MRR, monthly burn, and activity log.

- **Source of truth:** Airtable base `Why AI Consulting CRM` (`app227z9ZnnKPhhfL`).
- **Refresh cadence:** Daily at 06:00 UTC via GitHub Actions.
- **Live URL:** https://jccosta94.github.io/oblqai-dashboard/

## How it works

1. A GitHub Action runs `scripts/snapshot.mjs` against the Airtable API.
2. The script writes `src/data/snapshot.json`.
3. If the snapshot changed, the action commits it back to `main`.
4. Vite builds the static site and `actions/deploy-pages` publishes it.

No Airtable credentials ever reach the browser; the page only reads from
the baked JSON snapshot.

## Local dev

```bash
npm install
npm run dev
```

To refresh the local snapshot from Airtable, export a Personal Access Token
with read access to the base, then:

```bash
AIRTABLE_TOKEN=pat... node scripts/snapshot.mjs
```

## Required GitHub secret

- `AIRTABLE_TOKEN` — Airtable Personal Access Token with `data.records:read`
  scope on the OBLQAI CRM base.
