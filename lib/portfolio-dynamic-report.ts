import { getDb } from '@/lib/db';
import { statusWeight } from '@/lib/status-weights';
import { calculateRAG, DEFAULT_RAG_CONFIG, type RagConfig } from '@/lib/rag';

// ─── Types ──────────────────────────────────────────────────────────────────
export type GroupBy = 'program' | 'project' | 'phase' | 'rag' | 'pm' | 'month' | 'activity';
export type MetricKey = 'schedule' | 'budget' | 'risk' | 'resource' | 'bugs' | 'milestone';

export const ALL_METRICS: MetricKey[] = ['schedule', 'budget', 'risk', 'resource', 'bugs', 'milestone'];
const DONE_BUG_RE = /done|closed|resolved|complete/i;

type ProjectRow = {
  id: number; name: string; customer_id: number | null; program_name: string | null;
  pm_name: string | null; current_phase: string; start_date: string | null; end_date: string | null;
};

export type ProjectMetrics = {
  schedule: { completion_pct: number; rag: 'red' | 'amber' | 'green'; spi: number | null; days_until_deadline: number | null };
  budget: { planned: number; actual: number; approved: number; variance_pct: number | null };
  risk: { open_risks: number; total_risks: number; open_issues: number; total_issues: number };
  resource: { allocated: number; actual: number; fill_rate_pct: number | null };
  bugs: { open: number; critical: number };
  milestone: { total: number; overdue: number; upcoming: number };
};

export type ReportRow = {
  key: string; label: string; count: number; drillable: boolean;
  drill: ({ group_by: GroupBy } & Record<string, string | number>) | null;
  metrics: Record<string, unknown>;
  detail?: { status: string; plan_start: string | null; plan_end: string | null; actual_start: string | null; actual_end: string | null; priority: string };
};
export type ReportResult = { group_by: GroupBy; rows: ReportRow[]; meta: { generated_at: string; project_id?: number; project_count?: number } };

export type DynamicReportParams = {
  groupBy: GroupBy;
  metrics: MetricKey[];
  filterProgramId: string | null;
  filterProjectId: string | null;
  filterPhase: string | null;
  filterRag: string | null;
  filterPm: string | null;
  periodStart: string | null;
  periodEnd: string | null;
};

export type ReportUser = { is_admin: number; company_id: number | null };

export function parseDynamicReportParams(searchParams: URLSearchParams): DynamicReportParams {
  const groupBy = (searchParams.get('group_by') ?? 'program') as GroupBy;
  const metricsParam = searchParams.get('metrics');
  const metrics: MetricKey[] = metricsParam
    ? metricsParam.split(',').map(s => s.trim()).filter((m): m is MetricKey => ALL_METRICS.includes(m as MetricKey))
    : ALL_METRICS;
  return {
    groupBy, metrics,
    filterProgramId: searchParams.get('program_id'),
    filterProjectId: searchParams.get('project_id'),
    filterPhase: searchParams.get('phase'),
    filterRag: searchParams.get('rag'),
    filterPm: searchParams.get('pm'),
    periodStart: searchParams.get('period_start'),
    periodEnd: searchParams.get('period_end'),
  };
}

// ─── Core aggregation ───────────────────────────────────────────────────────
export async function getDynamicReport(user: ReportUser, params: DynamicReportParams): Promise<ReportResult | { error: string; status: number }> {
  const db = await getDb();
  const { groupBy, metrics, filterProgramId, filterProjectId, filterPhase, filterRag, filterPm, periodStart, periodEnd } = params;

  const cc = user.is_admin ? '' : 'AND p.company_id = ?';
  const cp = user.is_admin ? [] : [user.company_id];

  // ─── Activity-level drill: leaf rows for a single project ─────────────────
  if (groupBy === 'activity') {
    if (!filterProjectId) return { error: 'project_id is required for group_by=activity', status: 400 };
    const projectId = Number(filterProjectId);
    const rows = await db.all<{
      id: number; no: string; activity: string; status: string; completion_pct: number;
      plan_start: string | null; plan_end: string | null; actual_start: string | null; actual_end: string | null; priority: string;
    }>(
      `SELECT id, no, activity, status, completion_pct, plan_start, plan_end, actual_start, actual_end, priority
       FROM activities WHERE project_id = ? AND parent_id IS NULL ORDER BY order_idx, id`,
      projectId
    );
    return {
      group_by: groupBy,
      rows: rows.map(r => ({
        key: String(r.id),
        label: r.activity || r.no || `Activity ${r.id}`,
        count: 1,
        drillable: false,
        drill: null,
        metrics: { schedule: { completion_pct: r.completion_pct ?? 0, rag: null, spi: null, days_until_deadline: null } },
        detail: { status: r.status, plan_start: r.plan_start, plan_end: r.plan_end, actual_start: r.actual_start, actual_end: r.actual_end, priority: r.priority },
      })),
      meta: { generated_at: new Date().toISOString(), project_id: projectId },
    };
  }

  // ─── Month drill: budget spend trend across the (filtered) project scope ──
  if (groupBy === 'month') {
    const projectIds = await scopedProjectIds(db, user, cc, cp, { filterProgramId, filterProjectId, filterPhase, filterPm });
    const months = last6MonthRange(periodStart, periodEnd);
    if (projectIds.length === 0) {
      return {
        group_by: groupBy,
        rows: months.map(m => ({ key: m, label: m, count: 0, drillable: false, drill: null, metrics: { budget: { planned: 0, actual: 0, approved: 0, variance_pct: null } } })),
        meta: { generated_at: new Date().toISOString() },
      };
    }
    const spendRows = await db.all<{ ym: string; total: number }>(
      `SELECT TO_CHAR(expense_date, 'YYYY-MM') as ym, SUM(amount) as total
       FROM budget_expenses
       WHERE project_id IN (${projectIds.join(',')}) AND expense_date >= ? AND expense_date <= ?
       GROUP BY ym`,
      `${months[0]}-01`, `${months[months.length - 1]}-31`
    );
    const spendMap = Object.fromEntries(spendRows.map(r => [r.ym, Number(r.total) || 0]));
    return {
      group_by: groupBy,
      rows: months.map(m => ({
        key: m, label: m, count: projectIds.length, drillable: false, drill: null,
        metrics: { budget: { planned: 0, actual: spendMap[m] ?? 0, approved: 0, variance_pct: null } },
      })),
      meta: { generated_at: new Date().toISOString(), project_count: projectIds.length },
    };
  }

  // ─── Project-level base data (shared by program/project/phase/rag/pm) ─────
  const whereParts: string[] = ['1=1', cc].filter(Boolean);
  const whereArgs: unknown[] = [...cp];
  if (filterProgramId) { whereParts.push('AND p.customer_id = ?'); whereArgs.push(Number(filterProgramId)); }
  if (filterProjectId) { whereParts.push('AND p.id = ?'); whereArgs.push(Number(filterProjectId)); }
  if (filterPhase) { whereParts.push('AND p.current_phase = ?'); whereArgs.push(filterPhase); }
  if (filterPm) { whereParts.push('AND COALESCE(p.pm_name, \'\') = ?'); whereArgs.push(filterPm); }

  const projects = await db.all<ProjectRow & { allocated_headcount: number }>(
    `SELECT p.id, p.name, p.customer_id, c.name as program_name, p.pm_name, p.current_phase,
            p.start_date, p.end_date, COALESCE(ppa.allocated_headcount, 0) as allocated_headcount
     FROM projects p
     LEFT JOIN customers c ON p.customer_id = c.id
     LEFT JOIN program_project_allocations ppa ON ppa.project_id = p.id AND ppa.program_id = p.customer_id
     WHERE ${whereParts.join(' ')}
     ORDER BY p.name`,
    ...whereArgs
  );

  if (projects.length === 0) {
    return { group_by: groupBy, rows: [], meta: { generated_at: new Date().toISOString() } };
  }
  const ids = projects.map(p => p.id);
  const idList = ids.join(',');

  const [riskCounts, issueCounts, activityRows, budgetRows, fteRows, bugRows, milestoneRows] = await Promise.all([
    metrics.includes('risk') ? db.all<{ project_id: number; total: number; open: number }>(
      `SELECT project_id, COUNT(*) as total, SUM(CASE WHEN status='Open' OR status='In Progress' THEN 1 ELSE 0 END) as open
       FROM risks WHERE project_id IN (${idList}) GROUP BY project_id`
    ) : Promise.resolve([]),
    metrics.includes('risk') ? db.all<{ project_id: number; total: number; open: number }>(
      `SELECT project_id, COUNT(*) as total, SUM(CASE WHEN status='Open' OR status='In Progress' THEN 1 ELSE 0 END) as open
       FROM issues WHERE project_id IN (${idList}) GROUP BY project_id`
    ) : Promise.resolve([]),
    metrics.includes('schedule') ? db.all<{ project_id: number; no: string; status: string }>(
      `SELECT project_id, no, status FROM activities WHERE project_id IN (${idList})`
    ) : Promise.resolve([]),
    metrics.includes('budget') ? db.all<{ project_id: number; planned: number; actual: number; approved: number }>(
      `SELECT project_id, SUM(planned_amount) as planned, SUM(actual_amount) as actual, SUM(approved_amount) as approved
       FROM budget_items WHERE project_id IN (${idList}) GROUP BY project_id`
    ) : Promise.resolve([]),
    metrics.includes('resource') ? db.all<{ project_id: number; fte: number }>(
      `SELECT project_id,
              COALESCE(SUM(
                CASE WHEN capacity_json IS NOT NULL AND length(trim(capacity_json)) > 2
                     THEN CAST((capacity_json::jsonb ->> TO_CHAR(CURRENT_DATE, 'YYYY-MM')) AS FLOAT)
                     ELSE 0 END
              ), 0) as fte
       FROM team_members WHERE project_id IN (${idList}) GROUP BY project_id`
    ) : Promise.resolve([]),
    metrics.includes('bugs') ? db.all<{ project_id: number; status: string; severity: string; cnt: number }>(
      `SELECT b.project_id, b.status, b.severity, COUNT(*) as cnt
       FROM bugs b
       WHERE b.project_id IN (${idList})
         AND b.snapshot_date = (SELECT MAX(b2.snapshot_date) FROM bugs b2 WHERE b2.project_id = b.project_id AND b2.snapshot_date != '')
         AND b.snapshot_date IS NOT NULL AND b.snapshot_date != ''
       GROUP BY b.project_id, b.status, b.severity`
    ) : Promise.resolve([]),
    metrics.includes('milestone') ? db.all<{ project_id: number; end_date: string }>(
      `SELECT project_id, end_date FROM milestones WHERE project_id IN (${idList})`
    ) : Promise.resolve([]),
  ]);

  // Postgres returns SUM()/COUNT() as strings (bigint precision safety) — normalize to numbers here
  // so every downstream consumer (per-project metrics, group aggregation) does arithmetic, not string concat.
  const riskMap = Object.fromEntries(riskCounts.map(r => [r.project_id, { total: Number(r.total) || 0, open: Number(r.open) || 0 }]));
  const issueMap = Object.fromEntries(issueCounts.map(r => [r.project_id, { total: Number(r.total) || 0, open: Number(r.open) || 0 }]));
  const budgetMap = Object.fromEntries(budgetRows.map(r => [r.project_id, r]));
  const fteMap = Object.fromEntries(fteRows.map(r => [r.project_id, Number(r.fte) || 0]));

  const actStatsByProject: Record<number, { total: number; weightedSum: number }> = {};
  for (const row of activityRows) {
    if (row.no === 'EPIC') continue;
    if (!actStatsByProject[row.project_id]) actStatsByProject[row.project_id] = { total: 0, weightedSum: 0 };
    const s = actStatsByProject[row.project_id];
    s.total++;
    s.weightedSum += statusWeight(row.status);
  }

  const bugStatsByProject: Record<number, { open: number; critical: number }> = {};
  for (const row of bugRows) {
    if (!bugStatsByProject[row.project_id]) bugStatsByProject[row.project_id] = { open: 0, critical: 0 };
    const s = bugStatsByProject[row.project_id];
    const isDone = DONE_BUG_RE.test(row.status ?? '');
    if (!isDone) s.open += Number(row.cnt) || 0;
    if ((row.severity ?? '').toLowerCase() === 'critical') s.critical += Number(row.cnt) || 0;
  }

  const today = new Date().toISOString().slice(0, 10);
  const in30 = new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10);
  const msStatsByProject: Record<number, { total: number; overdue: number; upcoming: number }> = {};
  for (const row of milestoneRows) {
    if (!msStatsByProject[row.project_id]) msStatsByProject[row.project_id] = { total: 0, overdue: 0, upcoming: 0 };
    const s = msStatsByProject[row.project_id];
    s.total++;
    if (row.end_date && row.end_date < today) s.overdue++;
    else if (row.end_date && row.end_date <= in30) s.upcoming++;
  }

  const ragCfg = (user.company_id
    ? await db.get<Record<string, unknown>>('SELECT * FROM company_rag_config WHERE company_id = ?', user.company_id)
    : null) ?? DEFAULT_RAG_CONFIG;
  const nowMs = Date.now();

  const perProject = projects.map(p => {
    const openRisks = riskMap[p.id]?.open ?? 0;
    const openIssues = issueMap[p.id]?.open ?? 0;
    const stats = actStatsByProject[p.id] ?? { total: 0, weightedSum: 0 };
    const completionPct = stats.total > 0 ? Math.round((stats.weightedSum / stats.total) * 100) : 0;

    const { rag, spi, days_until_deadline } = calculateRAG({
      current_phase: p.current_phase,
      effective_start: p.start_date,
      effective_end: p.end_date,
      completion_pct: completionPct,
      total_activities: stats.total,
      open_risks: openRisks,
      open_issues: openIssues,
      nowMs,
      config: ragCfg as unknown as RagConfig,
    });

    const b = budgetMap[p.id];
    const planned = Number(b?.planned) || 0;
    const actual = Number(b?.actual) || 0;
    const approved = Number(b?.approved) || 0;

    const allocated = Number(p.allocated_headcount) || 0;
    const actualFte = fteMap[p.id] ?? 0;

    const bugStats = bugStatsByProject[p.id] ?? { open: 0, critical: 0 };
    const msStats = msStatsByProject[p.id] ?? { total: 0, overdue: 0, upcoming: 0 };

    const projectMetrics: ProjectMetrics = {
      schedule: { completion_pct: completionPct, rag, spi, days_until_deadline },
      budget: { planned, actual, approved, variance_pct: planned > 0 ? Math.round(((actual - planned) / planned) * 100) : null },
      risk: { open_risks: openRisks, total_risks: riskMap[p.id]?.total ?? 0, open_issues: openIssues, total_issues: issueMap[p.id]?.total ?? 0 },
      resource: { allocated, actual: actualFte, fill_rate_pct: allocated > 0 ? Math.round((actualFte / allocated) * 100) : null },
      bugs: bugStats,
      milestone: msStats,
    };

    return {
      id: p.id, name: p.name, program_id: p.customer_id, program_name: p.program_name,
      pm_name: p.pm_name, phase: p.current_phase, rag, metrics: projectMetrics,
    };
  });

  const scoped = filterRag ? perProject.filter(p => p.rag === filterRag) : perProject;

  // ─── group_by = project: one row per project, no aggregation ─────────────
  if (groupBy === 'project') {
    return {
      group_by: groupBy,
      rows: scoped.map(p => ({
        key: String(p.id),
        label: p.name,
        count: 1,
        drillable: true,
        drill: { group_by: 'activity' as GroupBy, project_id: p.id },
        metrics: pickMetrics(p.metrics, metrics),
      })),
      meta: { generated_at: new Date().toISOString(), project_count: scoped.length },
    };
  }

  // ─── program / phase / rag / pm: aggregate across member projects ────────
  const keyOf = (p: (typeof scoped)[number]): { key: string; label: string; filterParam: string } => {
    if (groupBy === 'phase') return { key: p.phase, label: p.phase, filterParam: 'phase' };
    if (groupBy === 'rag') return { key: p.rag, label: p.rag, filterParam: 'rag' };
    if (groupBy === 'pm') {
      const name = p.pm_name?.trim() || '(Chưa gán PM)';
      return { key: name, label: name, filterParam: 'pm' };
    }
    if (p.program_id) return { key: String(p.program_id), label: p.program_name ?? `Program ${p.program_id}`, filterParam: 'program_id' };
    return { key: '__none__', label: '(Không thuộc chương trình)', filterParam: 'program_id' };
  };

  const groups: Record<string, { label: string; filterParam: string; members: typeof scoped }> = {};
  for (const p of scoped) {
    const { key, label, filterParam } = keyOf(p);
    if (!groups[key]) groups[key] = { label, filterParam, members: [] };
    groups[key].members.push(p);
  }

  const rows: ReportRow[] = Object.entries(groups).map(([key, g]) => {
    const n = g.members.length;
    const agg: Partial<Record<MetricKey, unknown>> = {};

    if (metrics.includes('schedule')) {
      const avgPct = Math.round(g.members.reduce((s, p) => s + p.metrics.schedule.completion_pct, 0) / n);
      const ragCounts = { red: 0, amber: 0, green: 0 };
      for (const p of g.members) ragCounts[p.metrics.schedule.rag]++;
      agg.schedule = { completion_pct: avgPct, rag_counts: ragCounts };
    }
    if (metrics.includes('budget')) {
      const planned = g.members.reduce((s, p) => s + p.metrics.budget.planned, 0);
      const actual = g.members.reduce((s, p) => s + p.metrics.budget.actual, 0);
      const approved = g.members.reduce((s, p) => s + p.metrics.budget.approved, 0);
      agg.budget = { planned, actual, approved, variance_pct: planned > 0 ? Math.round(((actual - planned) / planned) * 100) : null };
    }
    if (metrics.includes('risk')) {
      agg.risk = {
        open_risks: g.members.reduce((s, p) => s + p.metrics.risk.open_risks, 0),
        total_risks: g.members.reduce((s, p) => s + p.metrics.risk.total_risks, 0),
        open_issues: g.members.reduce((s, p) => s + p.metrics.risk.open_issues, 0),
        total_issues: g.members.reduce((s, p) => s + p.metrics.risk.total_issues, 0),
      };
    }
    if (metrics.includes('resource')) {
      const allocated = g.members.reduce((s, p) => s + p.metrics.resource.allocated, 0);
      const actualFte = g.members.reduce((s, p) => s + p.metrics.resource.actual, 0);
      agg.resource = { allocated, actual: actualFte, fill_rate_pct: allocated > 0 ? Math.round((actualFte / allocated) * 100) : null };
    }
    if (metrics.includes('bugs')) {
      agg.bugs = {
        open: g.members.reduce((s, p) => s + p.metrics.bugs.open, 0),
        critical: g.members.reduce((s, p) => s + p.metrics.bugs.critical, 0),
      };
    }
    if (metrics.includes('milestone')) {
      agg.milestone = {
        total: g.members.reduce((s, p) => s + p.metrics.milestone.total, 0),
        overdue: g.members.reduce((s, p) => s + p.metrics.milestone.overdue, 0),
        upcoming: g.members.reduce((s, p) => s + p.metrics.milestone.upcoming, 0),
      };
    }

    return {
      key, label: g.label, count: n, drillable: true,
      drill: { group_by: 'project' as GroupBy, [g.filterParam]: key },
      metrics: agg,
    };
  });

  rows.sort((a, b) => b.count - a.count);

  return {
    group_by: groupBy,
    rows,
    meta: { generated_at: new Date().toISOString(), project_count: scoped.length },
  };
}

// ─── Helpers ────────────────────────────────────────────────────────────────
function pickMetrics(m: ProjectMetrics, keys: MetricKey[]): Partial<ProjectMetrics> {
  const out: Partial<ProjectMetrics> = {};
  for (const k of keys) out[k] = m[k] as never;
  return out;
}

async function scopedProjectIds(
  db: Awaited<ReturnType<typeof getDb>>,
  user: ReportUser,
  cc: string, cp: unknown[],
  f: { filterProgramId: string | null; filterProjectId: string | null; filterPhase: string | null; filterPm: string | null }
): Promise<number[]> {
  const whereParts: string[] = ['1=1', cc].filter(Boolean);
  const args: unknown[] = [...cp];
  if (f.filterProgramId) { whereParts.push('AND p.customer_id = ?'); args.push(Number(f.filterProgramId)); }
  if (f.filterProjectId) { whereParts.push('AND p.id = ?'); args.push(Number(f.filterProjectId)); }
  if (f.filterPhase) { whereParts.push('AND p.current_phase = ?'); args.push(f.filterPhase); }
  if (f.filterPm) { whereParts.push('AND COALESCE(p.pm_name, \'\') = ?'); args.push(f.filterPm); }
  const rows = await db.all<{ id: number }>(`SELECT p.id FROM projects p WHERE ${whereParts.join(' ')}`, ...args);
  return rows.map(r => r.id);
}

function last6MonthRange(start: string | null, end: string | null): string[] {
  if (start && end) {
    const months: string[] = [];
    const d = new Date(start.slice(0, 7) + '-01T00:00:00Z');
    const endD = new Date(end.slice(0, 7) + '-01T00:00:00Z');
    while (d <= endD && months.length < 24) {
      months.push(d.toISOString().slice(0, 7));
      d.setUTCMonth(d.getUTCMonth() + 1);
    }
    return months.length > 0 ? months : [new Date().toISOString().slice(0, 7)];
  }
  const months: string[] = [];
  const d = new Date();
  d.setUTCDate(1);
  d.setUTCMonth(d.getUTCMonth() - 5);
  for (let i = 0; i < 6; i++) {
    months.push(d.toISOString().slice(0, 7));
    d.setUTCMonth(d.getUTCMonth() + 1);
  }
  return months;
}
