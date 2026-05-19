#!/usr/bin/env node
/**
 * Fetches the OBLQAI Ops Airtable base and writes:
 *   - src/data/snapshot.json    (what the dashboard React app reads)
 *   - UPDATES.md                (human-readable change log for partners)
 *
 * Run daily from GitHub Actions; can also be run locally with AIRTABLE_TOKEN set.
 *
 * Required env: AIRTABLE_TOKEN
 * Optional env: BASE_ID (defaults to the OBLQAI Ops base)
 *
 * Airtable is the single source of truth. This script never writes back to Airtable.
 */
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, '..');
const OUT_JSON = join(REPO_ROOT, 'src', 'data', 'snapshot.json');
const OUT_MD = join(REPO_ROOT, 'UPDATES.md');

const TOKEN = process.env.AIRTABLE_TOKEN;
const BASE_ID = process.env.BASE_ID ?? 'appZwvjOYN2SDJhsj';

if (!TOKEN) {
  console.error('Missing AIRTABLE_TOKEN env');
  process.exit(1);
}

// Table IDs in the OBLQAI Ops base (appZwvjOYN2SDJhsj).
const TABLES = {
  customers:    'tblKUKYLDAwm0tUo1',
  deliverables: 'tblTZ68UFVuZs7rsh',
  activities:   'tblVb8ZB8AUlhFstQ',
  updates:      'tbl6yTWfjDHJXwLtb',
  costs:        'tblZ0iY7XcwvMOlus',
  tasks:        'tblKiUYazLdttUz9U',
  globalDocs:   'tblX8Vt7HiFLQn5rq',
};

async function listAll(tableId) {
  const out = [];
  let offset;
  do {
    const url = new URL(`https://api.airtable.com/v0/${BASE_ID}/${tableId}`);
    url.searchParams.set('pageSize', '100');
    if (offset) url.searchParams.set('offset', offset);
    const r = await fetch(url, {
      headers: { Authorization: `Bearer ${TOKEN}` },
    });
    if (!r.ok) {
      throw new Error(`Airtable ${tableId}: ${r.status} ${await r.text()}`);
    }
    const data = await r.json();
    out.push(...data.records);
    offset = data.offset;
  } while (offset);
  return out;
}

const pickName = (v) => (v && typeof v === 'object' && 'name' in v ? v.name : v);

// Build a quick lookup: airtableRecordId -> customer slug, so linked-record
// arrays can be flattened back to slug-keyed groupings if ever needed.
const indexBy = (rows, getKey) => {
  const m = new Map();
  for (const r of rows) m.set(r.id, getKey(r));
  return m;
};

const mapCustomer = (r) => {
  const f = r.fields ?? {};
  return {
    id: r.id,
    slug: f['Slug'] ?? '',
    name: f['Name'] ?? '',
    contact: f['Contact'],
    vertical: pickName(f['Vertical']),
    verticalPackage: pickName(f['Vertical package']),
    tier: pickName(f['Tier']),
    stage: pickName(f['Stage']),
    market: pickName(f['Market']),
    nextAction: f['Next action'],
    lastTouch: f['Last touch'],
    notes: f['Notes'],
    // deliverables[] is filled in after we read the Deliverables table — see main()
    deliverables: [],
  };
};

const mapDeliverable = (r) => {
  const f = r.fields ?? {};
  return {
    customerId: (f['Customer'] ?? [])[0], // linked record id (single in practice)
    title: f['Title'] ?? '',
    filename: f['Filename'],
    type: pickName(f['Type']),
    url: f['URL'],
    description: f['Description'],
  };
};

const mapActivity = (r) => {
  const f = r.fields ?? {};
  return {
    id: r.id,
    activity: f['Activity'] ?? '',
    customerIds: f['Customer'] ?? [],
    date: f['Date'],
    type: pickName(f['Type']),
    status: pickName(f['Status']),
    details: f['Details'],
    nextStep: f['Next step'],
    nextStepDue: f['Next step due'],
  };
};

const mapUpdate = (r) => {
  const f = r.fields ?? {};
  const bodyText = f['Body'] ?? '';
  // Body is stored as plain text with paragraphs separated by blank lines.
  // The dashboard expects body as an array of paragraphs (rendered as bullets).
  const body = bodyText
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
  return {
    date: f['Date'],
    headline: f['Headline'] ?? '',
    body,
  };
};

const mapCost = (r) => {
  const f = r.fields ?? {};
  return {
    id: r.id,
    description: f['Description'] ?? '',
    scope: pickName(f['Scope']),
    date: f['Date'],
    category: pickName(f['Category']),
    vendor: f['Vendor'],
    amountEur: f['Amount (EUR)'],
    cadence: pickName(f['Cadence']),
    notes: f['Notes'],
  };
};

const mapTask = (r) => {
  const f = r.fields ?? {};
  return {
    id: r.id,
    title: f['Title'] ?? '',
    status: pickName(f['Status']) ?? 'Todo',
    owner: f['Owner'],
    description: f['Description'],
    dueDate: f['Due date'],
  };
};

const mapGlobalDoc = (r) => {
  const f = r.fields ?? {};
  return {
    title: f['Title'] ?? '',
    filename: f['Filename'],
    type: pickName(f['Type']),
    url: f['URL'],
    description: f['Description'],
  };
};

// Sort updates newest-first by date, with a stable secondary sort on headline
// for entries that share a date.
const sortUpdates = (updates) =>
  [...updates].sort((a, b) => {
    const da = a.date ?? '';
    const db = b.date ?? '';
    if (db !== da) return db.localeCompare(da);
    return (a.headline ?? '').localeCompare(b.headline ?? '');
  });

const UPDATES_MD_HEADER = `# OBLQAI Operations Dashboard — Updates

This file is the human-readable change log for the partner-facing dashboard at
**https://jccosta94.github.io/oblqai-dashboard/**.

It is regenerated automatically from the OBLQAI Ops Airtable base on every
dashboard refresh. Do not hand-edit — add new entries to the Updates table in
Airtable and they will appear here on the next sync.

Newest entries on top. Format:

\`\`\`
## YYYY-MM-DD — <one-line headline>

- Bullet of what changed
- Bullet of what changed
\`\`\`

---
`;

const renderUpdatesMd = (updates) => {
  const sections = updates.map((u) => {
    const bullets = (u.body ?? []).map((p) => `- ${p}`).join('\n\n');
    return `## ${u.date ?? '(undated)'} — ${u.headline ?? ''}\n\n${bullets}`;
  });
  return `${UPDATES_MD_HEADER}\n\n${sections.join('\n\n---\n\n')}\n`;
};

async function main() {
  const [customers, deliverables, activities, updates, costs, tasks, globalDocs] =
    await Promise.all([
      listAll(TABLES.customers),
      listAll(TABLES.deliverables),
      listAll(TABLES.activities),
      listAll(TABLES.updates),
      listAll(TABLES.costs),
      listAll(TABLES.tasks),
      listAll(TABLES.globalDocs),
    ]);

  const mappedCustomers = customers.map(mapCustomer);
  const customerById = new Map(mappedCustomers.map((c) => [c.id, c]));

  // Attach deliverables to their customer (strip customerId from each, since
  // the snapshot.json shape carries them nested).
  for (const d of deliverables.map(mapDeliverable)) {
    const c = customerById.get(d.customerId);
    if (!c) continue;
    const { customerId, ...rest } = d;
    c.deliverables.push(rest);
  }

  const sortedUpdates = sortUpdates(updates.map(mapUpdate));

  const snapshot = {
    generatedAt: new Date().toISOString(),
    customers: mappedCustomers,
    updates: sortedUpdates,
    activities: activities.map(mapActivity),
    costs: costs.map(mapCost),
    tasks: tasks.map(mapTask),
    globalDocs: globalDocs.map(mapGlobalDoc),
  };

  mkdirSync(dirname(OUT_JSON), { recursive: true });
  writeFileSync(OUT_JSON, JSON.stringify(snapshot, null, 2) + '\n');
  writeFileSync(OUT_MD, renderUpdatesMd(sortedUpdates));

  console.log(
    `Wrote ${OUT_JSON} and ${OUT_MD}\n` +
      `  customers:    ${snapshot.customers.length}\n` +
      `  deliverables: ${deliverables.length} (nested under customers)\n` +
      `  activities:   ${snapshot.activities.length}\n` +
      `  updates:      ${snapshot.updates.length}\n` +
      `  costs:        ${snapshot.costs.length}\n` +
      `  tasks:        ${snapshot.tasks.length}\n` +
      `  globalDocs:   ${snapshot.globalDocs.length}`
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
