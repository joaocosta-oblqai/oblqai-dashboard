#!/usr/bin/env node
/**
 * Fetches the OBLQAI Ops base from Airtable and writes
 * src/data/snapshot.json. Run daily from GitHub Actions.
 *
 * Required env: AIRTABLE_TOKEN
 * Optional env: BASE_ID (defaults to the OBLQAI CRM base)
 */
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, '..', 'src', 'data', 'snapshot.json');

const TOKEN = process.env.AIRTABLE_TOKEN;
const BASE_ID = process.env.BASE_ID ?? 'app227z9ZnnKPhhfL';

if (!TOKEN) {
  console.error('Missing AIRTABLE_TOKEN env');
  process.exit(1);
}

const CUSTOMERS = 'tblWL2k466OWjPOEr';
const ACTIVITIES = 'tblCG7CCTSRrZraXJ';
const COSTS = 'tbl0ItOffPAqtklCp';
const TASKS = 'tblY1oN3f3S2obHsX';

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

const mapCustomer = (r) => {
  const f = r.fields ?? {};
  return {
    id: r.id,
    name: f['Customer'] ?? '',
    contact: f['Contact Person'],
    email: f['Email'],
    phone: f['Phone'],
    vertical: pickName(f['Vertical']),
    verticalPackage: pickName(f['Vertical Package']),
    tier: pickName(f['Tier']),
    stage: pickName(f['Stage']),
    market: pickName(f['Market']),
    setupFee: f['Setup Fee (€)'],
    mrr: f['MRR (€)'],
    nextAction: f['Next Action'],
    nextActionDate: f['Next Action Date'],
    lastTouch: f['Last Touch'],
    notes: f['Notes'],
  };
};

const mapCost = (r) => {
  const f = r.fields ?? {};
  return {
    id: r.id,
    description: f['Description'] ?? '',
    customerIds: f['Customer'] ?? [],
    scope: pickName(f['Scope']),
    date: f['Date'],
    category: pickName(f['Category']),
    vendor: pickName(f['Vendor']),
    amountEur: f['Amount EUR'],
    amountUsd: f['Amount USD'],
    cadence: pickName(f['Cadence']),
    notes: f['Notes'],
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
    nextStep: f['Next Step'],
    nextStepDue: f['Next Step Due'],
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
    dueDate: f['Due Date'],
    customerIds: f['Customer'] ?? [],
    notes: f['Notes'],
  };
};

async function main() {
  const [customers, activities, costs, tasks] = await Promise.all([
    listAll(CUSTOMERS),
    listAll(ACTIVITIES),
    listAll(COSTS),
    listAll(TASKS),
  ]);

  const snapshot = {
    generatedAt: new Date().toISOString(),
    customers: customers.map(mapCustomer),
    activities: activities.map(mapActivity),
    costs: costs.map(mapCost),
    tasks: tasks.map(mapTask),
  };

  mkdirSync(dirname(OUT), { recursive: true });
  writeFileSync(OUT, JSON.stringify(snapshot, null, 2) + '\n');
  console.log(
    `Wrote ${OUT} — ${snapshot.customers.length} customers, ` +
      `${snapshot.activities.length} activities, ${snapshot.costs.length} costs, ` +
      `${snapshot.tasks.length} tasks`
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
