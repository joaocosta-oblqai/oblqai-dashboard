import { useState } from 'react';
import {
  HashRouter,
  Link,
  Route,
  Routes,
  useParams,
} from 'react-router-dom';
import snapshot from './data/snapshot.json';
import type {
  Snapshot,
  Customer,
  Cost,
  Activity,
  Update,
  Deliverable,
  Task,
} from './types';
import './App.css';

const data = snapshot as Snapshot;

// Matches the ObliqAI Ops GitHub Projects v2 board vocabulary
const STAGE_ORDER = [
  'Lead',
  'Qualified',
  'Discovery',
  'Audit',
  'Proposal',
  'Negotiation',
  'Won',
  'Onboarding',
  'Live',
  'Churned',
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

// One column per planned stage, in canonical order, even when empty
function groupByStage(customers: Customer[]) {
  const groups = new Map<string, Customer[]>(
    STAGE_ORDER.map((s) => [s, []])
  );
  const extras: [string, Customer[]][] = [];
  for (const c of customers) {
    const k = c.stage ?? 'Unassigned';
    if (groups.has(k)) {
      groups.get(k)!.push(c);
    } else {
      const found = extras.find(([n]) => n === k);
      if (found) found[1].push(c);
      else extras.push([k, [c]]);
    }
  }
  return [...groups.entries(), ...extras];
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

function customerHref(c: Customer) {
  return `/customer/${c.slug ?? c.id}`;
}

// Compact card — name + vertical + a single next-action line.
// Full detail is one click away on the customer page.
function CustomerCard({ c }: { c: Customer }) {
  return (
    <Link
      to={customerHref(c)}
      className="block rounded-md border border-[#D8CFC0] bg-white p-2.5 shadow-sm transition hover:border-[var(--color-copper)]"
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-serif text-sm leading-tight">{c.name.trim()}</h3>
        {typeof c.mrr === 'number' && c.mrr > 0 && (
          <span className="whitespace-nowrap rounded-full bg-[var(--color-copper)] px-1.5 py-0.5 text-[10px] font-semibold text-white">
            {fmtEUR(c.mrr)}
          </span>
        )}
      </div>
      {c.vertical && (
        <div className="mt-1 truncate text-xs text-[var(--color-muted)]">
          {c.vertical}
          {c.market && <span> · {c.market}</span>}
        </div>
      )}
      {c.nextAction && (
        <div className="mt-1.5 line-clamp-2 text-[11px] text-[var(--color-charcoal)]">
          <span className="font-semibold uppercase tracking-wide text-[var(--color-copper)]">
            Next ·{' '}
          </span>
          {c.nextAction}
        </div>
      )}
    </Link>
  );
}

function Pipeline({ customers }: { customers: Customer[] }) {
  const groups = groupByStage(customers);
  const populatedCount = groups.filter(([, items]) => items.length > 0).length;
  return (
    <section className="mb-12">
      <SectionHeader
        eyebrow="Pipeline"
        title="Customers by stage"
        subtitle={`${customers.length} customers · ${populatedCount} of ${groups.length} stages active. Pipeline flows left to right: Lead → Live (the last two are terminal outcomes).`}
      />
      <div className="-mx-1 overflow-x-auto pb-2 [scrollbar-width:thin]">
        <div className="flex min-w-max items-stretch gap-2 px-1">
          {groups.map(([stage, items]) => {
            const empty = items.length === 0;
            // Empty stages render as narrow placeholders so the active stages
            // dominate the visual weight without losing the full pipeline.
            return (
              <div
                key={stage}
                className={
                  empty
                    ? 'w-28 shrink-0 rounded-md border border-dashed border-[#D8CFC0] bg-transparent p-2'
                    : 'w-52 shrink-0 rounded-md bg-[#EFE7D7] p-2'
                }
              >
                <div
                  className={
                    'mb-2 flex items-baseline justify-between border-b pb-1.5 ' +
                    (empty ? 'border-[#E0D6C5]' : 'border-[#D8CFC0]')
                  }
                >
                  <h4
                    className={
                      'font-serif text-xs font-bold uppercase tracking-wider ' +
                      (empty ? 'text-[var(--color-faint)]' : '')
                    }
                  >
                    {stage}
                  </h4>
                  <span
                    className={
                      'text-[10px] font-semibold ' +
                      (empty
                        ? 'text-[var(--color-faint)]'
                        : 'text-[var(--color-muted)]')
                    }
                  >
                    {items.length}
                  </span>
                </div>
                {empty ? (
                  <p className="text-[10px] italic leading-tight text-[var(--color-faint)]">
                    —
                  </p>
                ) : (
                  <div className="space-y-1.5">
                    {items.map((c) => (
                      <CustomerCard key={c.id} c={c} />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
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

function UpdateCard({ u }: { u: Update }) {
  return (
    <article className="rounded-lg border border-[#D8CFC0] bg-white p-5">
      <div className="mb-2 flex items-baseline justify-between gap-3">
        <h3 className="font-serif text-lg leading-tight">{u.headline}</h3>
        <span className="whitespace-nowrap text-xs uppercase tracking-wide text-[var(--color-copper)]">
          {fmtDate(u.date)}
        </span>
      </div>
      <ul className="list-disc space-y-1 pl-5 text-sm text-[var(--color-charcoal)]">
        {u.body.map((line, j) => (
          <li key={j}>{line}</li>
        ))}
      </ul>
    </article>
  );
}

function Updates({ updates }: { updates: Update[] }) {
  const [expanded, setExpanded] = useState(false);
  if (!updates || updates.length === 0) return null;
  const recent = updates.slice(0, 2);
  const rest = updates.slice(2);
  return (
    <section className="mb-12">
      <SectionHeader
        eyebrow="What's new"
        title="Recent updates"
        subtitle={`Showing the ${recent.length} most recent of ${updates.length} ${updates.length === 1 ? 'entry' : 'entries'} · newest first`}
      />
      <div className="space-y-4">
        {recent.map((u, i) => (
          <UpdateCard key={`${u.date}-${i}`} u={u} />
        ))}
      </div>
      {rest.length > 0 && (
        <div className="mt-4">
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="text-xs font-semibold uppercase tracking-widest text-[var(--color-copper)] hover:opacity-80"
          >
            {expanded ? `↑ Hide older updates` : `↓ View ${rest.length} older update${rest.length === 1 ? '' : 's'}`}
          </button>
          {expanded && (
            <div className="mt-3 max-h-96 space-y-3 overflow-y-auto rounded-lg border border-dashed border-[#D8CFC0] bg-[#FBF7EE] p-3 [scrollbar-width:thin]">
              {rest.map((u, i) => (
                <UpdateCard key={`older-${u.date}-${i}`} u={u} />
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  );
}

function ActivityRow({
  a,
  byId,
}: {
  a: Activity;
  byId: Map<string, string>;
}) {
  return (
    <li className="rounded-lg border border-[#D8CFC0] bg-white p-3 text-sm">
      <div className="flex items-baseline justify-between gap-2">
        <div className="font-semibold">{a.activity}</div>
        <div className="text-xs text-[var(--color-muted)]">{fmtDate(a.date)}</div>
      </div>
      <div className="mt-1 text-xs text-[var(--color-muted)]">
        {(a.customerIds ?? []).map((id) => byId.get(id) ?? id).join(', ')}{' '}
        {a.type && `· ${a.type}`} {a.status && `· ${a.status}`}
      </div>
      {a.details && (
        <div className="mt-2 text-sm text-[var(--color-charcoal)]">
          {a.details}
        </div>
      )}
    </li>
  );
}

function Activities({
  activities,
  customers,
}: {
  activities: Activity[];
  customers: Customer[];
}) {
  const [expanded, setExpanded] = useState(false);
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
  const recent = sorted.slice(0, 2);
  const rest = sorted.slice(2);
  return (
    <section className="mb-12">
      <SectionHeader
        eyebrow="Recent activity"
        title="Activity log"
        subtitle={`Showing the ${recent.length} most recent of ${activities.length} ${activities.length === 1 ? 'activity' : 'activities'}`}
      />
      <ul className="space-y-2">
        {recent.map((a) => (
          <ActivityRow key={a.id} a={a} byId={byId} />
        ))}
      </ul>
      {rest.length > 0 && (
        <div className="mt-4">
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="text-xs font-semibold uppercase tracking-widest text-[var(--color-copper)] hover:opacity-80"
          >
            {expanded ? `↑ Hide older activity` : `↓ View ${rest.length} older ${rest.length === 1 ? 'entry' : 'entries'}`}
          </button>
          {expanded && (
            <ul className="mt-3 max-h-96 space-y-2 overflow-y-auto rounded-lg border border-dashed border-[#D8CFC0] bg-[#FBF7EE] p-3 [scrollbar-width:thin]">
              {rest.map((a) => (
                <ActivityRow key={`older-${a.id}`} a={a} byId={byId} />
              ))}
            </ul>
          )}
        </div>
      )}
    </section>
  );
}

const TYPE_LABEL: Record<string, string> = {
  pdf: 'PDF',
  docx: 'Word',
  pptx: 'Deck',
  xlsx: 'Spreadsheet',
  md: 'Markdown',
  html: 'Demo',
  other: 'File',
};

function DeliverableRow({ d }: { d: Deliverable }) {
  const label = TYPE_LABEL[d.type ?? 'other'] ?? 'File';
  const inner = (
    <div className="flex items-start justify-between gap-3 rounded-md border border-[#D8CFC0] bg-white p-3 text-sm hover:border-[var(--color-copper)]">
      <div className="min-w-0 flex-1">
        <div className="font-semibold text-[var(--color-ink)]">{d.title}</div>
        {d.filename && (
          <div className="truncate text-xs text-[var(--color-muted)]">
            {d.filename}
          </div>
        )}
        {d.description && (
          <div className="mt-1 text-xs text-[var(--color-charcoal)]">
            {d.description}
          </div>
        )}
      </div>
      <div className="flex shrink-0 flex-col items-end gap-1">
        <span className="rounded-full bg-[#EFE7D7] px-2 py-0.5 text-[10px] uppercase tracking-wide text-[var(--color-muted)]">
          {label}
        </span>
        {d.url ? (
          <span className="text-xs font-semibold text-[var(--color-copper)]">
            Open →
          </span>
        ) : (
          <span className="text-xs italic text-[var(--color-faint)]">
            link pending
          </span>
        )}
      </div>
    </div>
  );
  if (d.url) {
    return (
      <a href={d.url} target="_blank" rel="noopener noreferrer" className="block">
        {inner}
      </a>
    );
  }
  return inner;
}

function TaskCard({
  t,
  customersById,
}: {
  t: Task;
  customersById: Map<string, Customer>;
}) {
  const linked = (t.customerIds ?? [])
    .map((id) => customersById.get(id))
    .filter((c): c is Customer => Boolean(c));
  const dueSoon = (() => {
    if (!t.dueDate) return false;
    const days = Math.floor(
      (new Date(t.dueDate).getTime() - Date.now()) / 86400000
    );
    return t.status !== 'Done' && days <= 3;
  })();
  return (
    <div className="rounded-md border border-[#D8CFC0] bg-white p-2.5 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <h4 className="font-serif text-sm leading-tight">{t.title}</h4>
        {t.owner && (
          <span className="whitespace-nowrap rounded-full border border-[#D8CFC0] bg-[#FBF7EE] px-1.5 py-0.5 text-[10px] font-semibold text-[var(--color-charcoal)]">
            {t.owner}
          </span>
        )}
      </div>
      {t.description && (
        <p className="mt-1 text-[11px] leading-snug text-[var(--color-charcoal)]">
          {t.description}
        </p>
      )}
      <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-[10px] text-[var(--color-muted)]">
        {t.dueDate && (
          <span
            className={
              'uppercase tracking-wide ' +
              (dueSoon
                ? 'font-semibold text-[var(--color-accent)]'
                : '')
            }
          >
            Due {fmtDate(t.dueDate)}
          </span>
        )}
        {linked.map((c) => (
          <Link
            key={c.id}
            to={customerHref(c)}
            className="rounded-full bg-[#EFE7D7] px-1.5 py-0.5 hover:bg-[var(--color-cream-deep)]"
          >
            {c.name.trim().split(' — ')[0]}
          </Link>
        ))}
      </div>
    </div>
  );
}

function TasksBoard({
  tasks,
  customers,
}: {
  tasks: Task[];
  customers: Customer[];
}) {
  if (!tasks || tasks.length === 0) return null;
  const cols: { id: string; label: string; tone: 'gray' | 'yellow' | 'green' }[] = [
    { id: 'Todo', label: 'To do', tone: 'gray' },
    { id: 'In progress', label: 'In progress', tone: 'yellow' },
    { id: 'Done', label: 'Done', tone: 'green' },
  ];
  const customersById = new Map(customers.map((c) => [c.id, c]));
  const grouped = new Map<string, Task[]>(cols.map((c) => [c.id, []]));
  for (const t of tasks) {
    const key = grouped.has(t.status) ? t.status : 'Todo';
    grouped.get(key)!.push(t);
  }
  // Sort within each column: due date ASC (no-date last), then title.
  for (const arr of grouped.values()) {
    arr.sort((a, b) => {
      const ad = a.dueDate ?? '9999-12-31';
      const bd = b.dueDate ?? '9999-12-31';
      if (ad !== bd) return ad < bd ? -1 : 1;
      return a.title.localeCompare(b.title);
    });
  }
  const toneBg: Record<string, string> = {
    gray: '#EFE7D7',
    yellow: '#F7E6BE',
    green: '#DDEAD2',
  };
  return (
    <section className="mb-12">
      <SectionHeader
        eyebrow="Internal"
        title="Operations board"
        subtitle={`${tasks.length} task${tasks.length === 1 ? '' : 's'} · add new ones in Airtable (Tasks table) and ask Claude to refresh`}
      />
      {/* Each column is capped to max-h-96 with internal scroll so the board
          can't grow unbounded as Done accumulates over time. Column header
          stays visible above the scroll area (count tells you what you can't
          see at a glance). */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {cols.map((c) => {
          const items = grouped.get(c.id) ?? [];
          const overflow = items.length > 3;
          return (
            <div
              key={c.id}
              className="rounded-lg p-3"
              style={{ backgroundColor: toneBg[c.tone] }}
            >
              <div className="mb-3 flex items-baseline justify-between border-b border-[#D8CFC0] pb-2">
                <h4 className="font-serif text-sm font-bold uppercase tracking-wider">
                  {c.label}
                </h4>
                <span className="text-xs font-semibold text-[var(--color-muted)]">
                  {items.length}
                  {overflow && (
                    <span className="ml-1 text-[10px] font-normal italic text-[var(--color-faint)]">
                      · scroll
                    </span>
                  )}
                </span>
              </div>
              {items.length === 0 ? (
                <p className="text-xs italic text-[var(--color-faint)]">
                  Nothing here.
                </p>
              ) : (
                <div className="max-h-96 space-y-2 overflow-y-auto pr-1 [scrollbar-width:thin]">
                  {items.map((t) => (
                    <TaskCard key={t.id} t={t} customersById={customersById} />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

function GlobalDocs({ docs }: { docs: Deliverable[] }) {
  if (!docs || docs.length === 0) return null;
  return (
    <section className="mb-12">
      <SectionHeader
        eyebrow="Reference"
        title="Global / general docs"
        subtitle="OBLQAI reference materials — service blueprint, pricing canon, brand standards. Useful context for partners."
      />
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {docs.map((d, i) => (
          <DeliverableRow key={`${d.title}-${i}`} d={d} />
        ))}
      </div>
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
    (c) => c.stage !== 'Won' && c.stage !== 'Lost' && c.stage !== 'Churned'
  ).length;
  const stats = [
    { label: 'Customers in pipeline', value: pipeline.toString() },
    { label: 'Monthly recurring revenue', value: fmtEUR(mrr) },
    { label: 'Monthly operating cost', value: fmtEUR(monthlyCost) },
    { label: 'Net monthly', value: fmtEUR(mrr - monthlyCost) },
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

// Logo lives in /public/oblqai-logo.png — Vite respects the Pages base path
const LOGO_SRC = `${import.meta.env.BASE_URL}oblqai-logo.png`;

function PageShell({ children }: { children: React.ReactNode }) {
  const { generatedAt } = data;
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-8 md:py-12">
      <header className="mb-10 flex items-end justify-between gap-6 border-b border-[#D8CFC0] pb-6">
        <Link to="/" className="block hover:opacity-80">
          <img
            src={LOGO_SRC}
            alt="OBLQAI"
            className="h-12 w-auto md:h-16"
          />
          <div className="mt-2 text-xs uppercase tracking-widest text-[var(--color-muted)]">
            Partner Operations Dashboard
          </div>
        </Link>
        <div className="text-right text-xs text-[var(--color-muted)]">
          <div>Last updated</div>
          <div className="text-[var(--color-ink)]">{fmtDate(generatedAt)}</div>
        </div>
      </header>
      {children}
      {/* Footer carries the typeset wordmark per the House Standard placement rule
          (header carries the mark, footer carries the typeset wordmark — never both). */}
      <footer className="mt-16 border-t border-[var(--color-gray-01)] pt-6">
        <div className="flex flex-col items-start justify-between gap-3 text-xs uppercase tracking-[0.18em] text-[var(--color-muted)] md:flex-row md:items-center">
          <div
            className="font-sans text-lg font-bold leading-none text-[var(--color-ink)] normal-case tracking-[-0.01em]"
          >
            OBLQ
            <span className="text-[var(--color-accent)]">·</span>
            AI
          </div>
          <div>Internal partner view · Snapshot generated {fmtDate(generatedAt)}</div>
          <a
            href="https://oblqai.com"
            className="text-[var(--color-accent)] hover:opacity-80"
          >
            oblqai.com
          </a>
        </div>
      </footer>
    </div>
  );
}

function Dashboard() {
  const { customers, costs, activities, updates, globalDocs, tasks } = data;
  return (
    <PageShell>
      <KPIStrip customers={customers} costs={costs} />
      <Pipeline customers={customers} />
      <Costs costs={costs} />
      <Updates updates={updates ?? []} />
      <Activities activities={activities} customers={customers} />
      <TasksBoard tasks={tasks ?? []} customers={customers} />
      <GlobalDocs docs={globalDocs ?? []} />
    </PageShell>
  );
}

function CustomerDetail() {
  const { slug } = useParams<{ slug: string }>();
  const c = data.customers.find(
    (cust) => cust.slug === slug || cust.id === slug
  );
  if (!c) {
    return (
      <PageShell>
        <div className="rounded-lg border border-[#D8CFC0] bg-white p-6 text-center">
          <p className="mb-3 font-serif text-xl">Customer not found</p>
          <Link
            to="/"
            className="text-sm font-semibold text-[var(--color-copper)]"
          >
            ← Back to dashboard
          </Link>
        </div>
      </PageShell>
    );
  }
  const deliverables = c.deliverables ?? [];
  const fields: { label: string; value: string | number | undefined }[] = [
    { label: 'Stage', value: c.stage },
    { label: 'Vertical', value: c.vertical },
    { label: 'Package', value: c.verticalPackage },
    { label: 'Tier', value: c.tier },
    { label: 'Market', value: c.market },
    {
      label: 'MRR',
      value: typeof c.mrr === 'number' ? fmtEUR(c.mrr) : undefined,
    },
    {
      label: 'Setup fee',
      value: typeof c.setupFee === 'number' ? fmtEUR(c.setupFee) : undefined,
    },
    { label: 'Contact', value: c.contact },
    { label: 'Email', value: c.email },
    { label: 'Phone', value: c.phone },
    { label: 'Last touch', value: c.lastTouch && fmtDate(c.lastTouch) },
  ];
  return (
    <PageShell>
      <div className="mb-6">
        <Link
          to="/"
          className="text-xs font-semibold uppercase tracking-widest text-[var(--color-copper)] hover:underline"
        >
          ← Back to dashboard
        </Link>
      </div>
      <header className="mb-8 border-b border-[#D8CFC0] pb-4">
        <h1 className="font-serif text-3xl md:text-4xl">{c.name.trim()}</h1>
        {c.stage && (
          <div className="mt-2 inline-block rounded-full bg-[var(--color-copper)] px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
            {c.stage}
          </div>
        )}
      </header>

      <section className="mb-10 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
        {fields
          .filter((f) => f.value !== undefined && f.value !== null && f.value !== '')
          .map((f) => (
            <div
              key={f.label}
              className="rounded-lg border border-[#D8CFC0] bg-white p-3"
            >
              <div className="text-xs uppercase tracking-wide text-[var(--color-faint)]">
                {f.label}
              </div>
              <div className="text-sm font-medium text-[var(--color-ink)]">
                {f.value}
              </div>
            </div>
          ))}
      </section>

      {c.nextAction && (
        <section className="mb-10">
          <SectionHeader eyebrow="Next" title="What we're doing next" />
          <div className="rounded-lg border border-[#D8CFC0] bg-white p-4">
            <div className="text-base text-[var(--color-ink)]">
              {c.nextAction}
            </div>
            {c.nextActionDate && (
              <div className="mt-1 text-xs text-[var(--color-muted)]">
                {fmtDate(c.nextActionDate)}
              </div>
            )}
          </div>
        </section>
      )}

      {c.notes && (
        <section className="mb-10">
          <SectionHeader eyebrow="Context" title="Notes" />
          <div className="rounded-lg border border-[#D8CFC0] bg-white p-4 text-sm leading-relaxed text-[var(--color-charcoal)]">
            {c.notes}
          </div>
        </section>
      )}

      <section className="mb-10">
        <SectionHeader
          eyebrow="Deliverables"
          title="Files on this engagement"
          subtitle={
            deliverables.length === 0
              ? 'No deliverables logged yet'
              : `${deliverables.length} ${deliverables.length === 1 ? 'file' : 'files'} on file. Items marked "link pending" exist on Joao's machine — public links coming once hosting is set up.`
          }
        />
        {deliverables.length === 0 ? (
          <div className="rounded-lg border border-dashed border-[#D8CFC0] bg-[#FBF7EE] p-6 text-center text-sm text-[var(--color-muted)]">
            Nothing on file yet for this engagement.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {deliverables.map((d, i) => (
              <DeliverableRow key={`${d.title}-${i}`} d={d} />
            ))}
          </div>
        )}
      </section>
    </PageShell>
  );
}

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/customer/:slug" element={<CustomerDetail />} />
        <Route path="*" element={<Dashboard />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
