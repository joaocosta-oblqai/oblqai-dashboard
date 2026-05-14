import snapshot from './data/snapshot.json';
import type { Snapshot, Customer, Cost, Activity } from './types';
import './App.css';

const data = snapshot as Snapshot;

const STAGE_ORDER = [
  'Lead',
  'Discovery',
  'Discovery Call',
  'Proposal Sent',
  'Onboarding',
  'Active',
  'Won',
  'Lost',
];

function fmtEUR(n?: number) {
  if (typeof n !== 'number') return '—';
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(n);
}

function fmtDate(s?: string) {
  if (!s) return '';
  return new Date(s).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function groupByStage(customers: Customer[]) {
  const groups = new Map<string, Customer[]>();
  for (const c of customers) {
    const k = c.stage ?? 'Unassigned';
    if (!groups.has(k)) groups.set(k, []);
    groups.get(k)!.push(c);
  }
  // sort stages by canonical order, push unknowns to the end
  return [...groups.entries()].sort(([a], [b]) => {
    const ai = STAGE_ORDER.indexOf(a);
    const bi = STAGE_ORDER.indexOf(b);
    if (ai === -1 && bi === -1) return a.localeCompare(b);
    if (ai === -1) return 1;
    if (bi === -1) return -1;
    return ai - bi;
  });
}

function sumCosts(costs: Cost[]) {
  return costs.reduce((acc, c) => acc + (c.amountEur ?? 0), 0);
}

function costsByCategory(costs: Cost[]) {
  const m = new Map<string, number>();
  for (const c of costs) {
    const k = c.category ?? 'Uncategorized';
    m.set(k, (m.get(k) ?? 0) + (c.amountEur ?? 0));
  }
  return [...m.entries()].sort((a, b) => b[1] - a[1]);
}

function CustomerCard({ c }: { c: Customer }) {
  return (
    <div className="rounded-lg border border-[#D8CFC0] bg-white p-4 shadow-sm">
      <div className="mb-2 flex items-start justify-between gap-3">
        <h3 className="font-serif text-base leading-tight">{c.name.trim()}</h3>
        {typeof c.mrr === 'number' && c.mrr > 0 && (
          <span className="whitespace-nowrap rounded-full bg-[var(--color-copper)] px-2 py-0.5 text-xs font-semibold text-white">
            {fmtEUR(c.mrr)} MRR
          </span>
        )}
      </div>
      <div className="space-y-0.5 text-xs text-[var(--color-muted)]">
        {c.vertical && (
          <div>
            <span className="text-[var(--color-faint)]">Vertical:</span>{' '}
            <span className="text-[var(--color-ink)]">{c.vertical}</span>
          </div>
        )}
        {c.verticalPackage && (
          <div>
            <span className="text-[var(--color-faint)]">Package:</span>{' '}
            <span className="text-[var(--color-ink)]">{c.verticalPackage}</span>
          </div>
        )}
        {c.market && (
          <div>
            <span className="text-[var(--color-faint)]">Market:</span>{' '}
            <span className="text-[var(--color-ink)]">{c.market}</span>
          </div>
        )}
      </div>
      {c.nextAction && (
        <div className="mt-3 border-t border-dashed border-[#D8CFC0] pt-2 text-xs">
          <div className="font-semibold uppercase tracking-wide text-[var(--color-copper)]">
            Next
          </div>
          <div className="text-[var(--color-ink)]">{c.nextAction}</div>
          {c.nextActionDate && (
            <div className="text-[var(--color-muted)]">
              {fmtDate(c.nextActionDate)}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function Pipeline({ customers }: { customers: Customer[] }) {
  const groups = groupByStage(customers);
  return (
    <section className="mb-12">
      <SectionHeader
        eyebrow="Pipeline"
        title="Customers by stage"
        subtitle={`${customers.length} customers across ${groups.length} stages`}
      />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {groups.map(([stage, items]) => (
          <div key={stage} className="rounded-lg bg-[#EFE7D7] p-3">
            <div className="mb-3 flex items-baseline justify-between border-b border-[#D8CFC0] pb-2">
              <h4 className="font-serif text-sm font-bold uppercase tracking-wider">
                {stage}
              </h4>
              <span className="text-xs text-[var(--color-muted)]">
                {items.length}
              </span>
            </div>
            <div className="space-y-3">
              {items.map((c) => (
                <CustomerCard key={c.id} c={c} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Costs({ costs }: { costs: Cost[] }) {
  const total = sumCosts(costs);
  const byCat = costsByCategory(costs);
  return (
    <section className="mb-12">
      <SectionHeader
        eyebrow="Operating costs"
        title="Monthly burn"
        subtitle={`${fmtEUR(total)} / month — ${costs.length} line items`}
      />
      <div className="mb-4 grid grid-cols-2 gap-3 md:grid-cols-4">
        {byCat.map(([cat, amt]) => (
          <div
            key={cat}
            className="rounded-lg border border-[#D8CFC0] bg-white p-3"
          >
            <div className="text-xs uppercase tracking-wide text-[var(--color-faint)]">
              {cat}
            </div>
            <div className="font-serif text-xl">{fmtEUR(amt)}</div>
            <div className="text-xs text-[var(--color-muted)]">
              {((amt / total) * 100).toFixed(0)}% of total
            </div>
          </div>
        ))}
      </div>
      <div className="overflow-hidden rounded-lg border border-[#D8CFC0] bg-white">
        <table className="w-full text-sm">
          <thead className="bg-[#EFE7D7] text-left text-xs uppercase tracking-wide text-[var(--color-muted)]">
            <tr>
              <th className="px-3 py-2">Description</th>
              <th className="px-3 py-2">Vendor</th>
              <th className="px-3 py-2">Category</th>
              <th className="px-3 py-2">Scope</th>
              <th className="px-3 py-2">Cadence</th>
              <th className="px-3 py-2 text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {costs.map((c) => (
              <tr
                key={c.id}
                className="border-t border-[#EAE0CF] hover:bg-[#FBF7EE]"
              >
                <td className="px-3 py-2">{c.description}</td>
                <td className="px-3 py-2 text-[var(--color-muted)]">
                  {c.vendor ?? '—'}
                </td>
                <td className="px-3 py-2 text-[var(--color-muted)]">
                  {c.category ?? '—'}
                </td>
                <td className="px-3 py-2 text-[var(--color-muted)]">
                  {c.scope ?? '—'}
                </td>
                <td className="px-3 py-2 text-[var(--color-muted)]">
                  {c.cadence ?? '—'}
                </td>
                <td className="px-3 py-2 text-right font-medium">
                  {fmtEUR(c.amountEur)}
                </td>
              </tr>
            ))}
            <tr className="border-t-2 border-[var(--color-ink)] bg-[#FBF7EE]">
              <td className="px-3 py-2 font-bold" colSpan={5}>
                Total monthly
              </td>
              <td className="px-3 py-2 text-right font-bold">
                {fmtEUR(total)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
}

function Activities({
  activities,
  customers,
}: {
  activities: Activity[];
  customers: Customer[];
}) {
  if (activities.length === 0) {
    return (
      <section className="mb-12">
        <SectionHeader
          eyebrow="Recent activity"
          title="Activity log"
          subtitle="No activities recorded yet"
        />
        <div className="rounded-lg border border-dashed border-[#D8CFC0] bg-[#FBF7EE] p-6 text-center text-sm text-[var(--color-muted)]">
          Activities from meetings, calls, and deliverables will appear here
          once logged.
        </div>
      </section>
    );
  }
  const byId = new Map(customers.map((c) => [c.id, c.name]));
  const sorted = [...activities].sort((a, b) =>
    (b.date ?? '').localeCompare(a.date ?? '')
  );
  return (
    <section className="mb-12">
      <SectionHeader
        eyebrow="Recent activity"
        title="Activity log"
        subtitle={`${activities.length} activities`}
      />
      <ul className="space-y-2">
        {sorted.slice(0, 15).map((a) => (
          <li
            key={a.id}
            className="rounded-lg border border-[#D8CFC0] bg-white p-3 text-sm"
          >
            <div className="flex items-baseline justify-between gap-2">
              <div className="font-semibold">{a.activity}</div>
              <div className="text-xs text-[var(--color-muted)]">
                {fmtDate(a.date)}
              </div>
            </div>
            <div className="mt-1 text-xs text-[var(--color-muted)]">
              {(a.customerIds ?? [])
                .map((id) => byId.get(id) ?? id)
                .join(', ')}{' '}
              {a.type && `· ${a.type}`} {a.status && `· ${a.status}`}
            </div>
            {a.details && (
              <div className="mt-2 text-sm text-[var(--color-charcoal)]">
                {a.details}
              </div>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}

function SectionHeader({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mb-4">
      <div className="mb-1 text-xs font-semibold uppercase tracking-widest text-[var(--color-copper)]">
        {eyebrow}
      </div>
      <h2 className="font-serif text-2xl md:text-3xl">{title}</h2>
      {subtitle && (
        <div className="mt-1 text-sm text-[var(--color-muted)]">{subtitle}</div>
      )}
    </div>
  );
}

function KPIStrip({
  customers,
  costs,
}: {
  customers: Customer[];
  costs: Cost[];
}) {
  const mrr = customers.reduce((a, c) => a + (c.mrr ?? 0), 0);
  const monthlyCost = sumCosts(costs);
  const pipeline = customers.filter(
    (c) => c.stage !== 'Won' && c.stage !== 'Lost'
  ).length;
  const stats = [
    { label: 'Customers in pipeline', value: pipeline.toString() },
    { label: 'Monthly recurring revenue', value: fmtEUR(mrr) },
    { label: 'Monthly operating cost', value: fmtEUR(monthlyCost) },
    {
      label: 'Net monthly',
      value: fmtEUR(mrr - monthlyCost),
    },
  ];
  return (
    <section className="mb-10 grid grid-cols-2 gap-3 md:grid-cols-4">
      {stats.map((s) => (
        <div
          key={s.label}
          className="rounded-lg border border-[#D8CFC0] bg-white p-4"
        >
          <div className="text-xs uppercase tracking-wide text-[var(--color-faint)]">
            {s.label}
          </div>
          <div className="font-serif text-2xl">{s.value}</div>
        </div>
      ))}
    </section>
  );
}

function App() {
  const { customers, costs, activities, generatedAt } = data;
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-8 md:py-12">
      <header className="mb-10 flex items-end justify-between gap-6 border-b border-[#D8CFC0] pb-6">
        <div>
          <div className="font-serif text-3xl md:text-4xl">
            <span className="text-[var(--color-ink)]">OBLQ</span>
            <span className="text-[var(--color-copper)]"> · AI</span>
          </div>
          <div className="mt-1 text-xs uppercase tracking-widest text-[var(--color-muted)]">
            Partner Operations Dashboard
          </div>
        </div>
        <div className="text-right text-xs text-[var(--color-muted)]">
          <div>Last updated</div>
          <div className="text-[var(--color-ink)]">{fmtDate(generatedAt)}</div>
        </div>
      </header>

      <KPIStrip customers={customers} costs={costs} />
      <Pipeline customers={customers} />
      <Costs costs={costs} />
      <Activities activities={activities} customers={customers} />

      <footer className="mt-16 border-t border-[#D8CFC0] pt-6 text-center text-xs text-[var(--color-muted)]">
        OBLQAI · Internal partner view · Data refreshed daily from Airtable
      </footer>
    </div>
  );
}

export default App;
