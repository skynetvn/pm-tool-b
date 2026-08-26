'use client';
import { useEffect, useState, useCallback, useMemo } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { ChevronRight, FileSpreadsheet, Presentation, Save, Bookmark, X } from 'lucide-react';
import { toast } from 'sonner';

// ─── Types ──────────────────────────────────────────────────────────────────
type GroupBy = 'program' | 'project' | 'phase' | 'rag' | 'pm' | 'month' | 'activity';
type MetricKey = 'schedule' | 'budget' | 'risk' | 'resource' | 'bugs' | 'milestone';

const METRIC_LABELS: Record<MetricKey, string> = {
  schedule: 'Tiến độ', budget: 'Ngân sách', risk: 'Rủi ro & Vấn đề',
  resource: 'Nguồn lực', bugs: 'Bugs', milestone: 'Milestone',
};
const DIMENSION_LABELS: Record<Exclude<GroupBy, 'activity'>, string> = {
  program: 'Chương trình', project: 'Dự án', phase: 'Giai đoạn', rag: 'Sức khỏe (RAG)', pm: 'PM', month: 'Theo tháng',
};
const RAG_PILL: Record<string, string> = {
  red: 'bg-red-50 text-red-600 border border-red-200',
  amber: 'bg-amber-50 text-amber-600 border border-amber-200',
  green: 'bg-green-50 text-green-600 border border-green-200',
};

type Drill = { group_by: GroupBy } & Record<string, string | number>;
type RowMetrics = {
  schedule?: { completion_pct: number; rag?: 'red' | 'amber' | 'green' | null; rag_counts?: { red: number; amber: number; green: number }; spi?: number | null; days_until_deadline?: number | null };
  budget?: { planned: number; actual: number; approved: number; variance_pct: number | null };
  risk?: { open_risks: number; total_risks: number; open_issues: number; total_issues: number };
  resource?: { allocated: number; actual: number; fill_rate_pct: number | null };
  bugs?: { open: number; critical: number };
  milestone?: { total: number; overdue: number; upcoming: number };
};
type ReportRow = {
  key: string; label: string; count: number; drillable: boolean; drill: Drill | null;
  metrics: RowMetrics;
  detail?: { status: string; priority: string };
};
type ReportResponse = { group_by: GroupBy; rows: ReportRow[]; meta: { generated_at: string; project_count?: number } };
type Filters = Record<string, string>;
type Crumb = { label: string; groupBy: GroupBy; filters: Filters };
type SavedView = { id: number; name: string; group_by: GroupBy; metrics: MetricKey[]; period_start: string; period_end: string };

const money = (n: number) => n.toLocaleString('vi-VN') + ' ₫';

export default function DynamicReportPage() {
  const [groupBy, setGroupBy] = useState<GroupBy>('program');
  const [metrics, setMetrics] = useState<Set<MetricKey>>(new Set(['schedule', 'budget', 'risk', 'resource', 'bugs', 'milestone']));
  const [filters, setFilters] = useState<Filters>({});
  const [crumbs, setCrumbs] = useState<Crumb[]>([{ label: 'Portfolio', groupBy: 'program', filters: {} }]);
  const [periodStart, setPeriodStart] = useState('');
  const [periodEnd, setPeriodEnd] = useState('');
  const [data, setData] = useState<ReportResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [savedViews, setSavedViews] = useState<SavedView[]>([]);
  const [saveOpen, setSaveOpen] = useState(false);
  const [saveName, setSaveName] = useState('');
  const [exporting, setExporting] = useState<'xlsx' | 'pptx' | null>(null);

  const buildQuery = useCallback((gb: GroupBy, f: Filters) => {
    const p = new URLSearchParams();
    p.set('group_by', gb);
    p.set('metrics', Array.from(metrics).join(','));
    if (periodStart) p.set('period_start', periodStart);
    if (periodEnd) p.set('period_end', periodEnd);
    for (const [k, v] of Object.entries(f)) p.set(k, v);
    return p.toString();
  }, [metrics, periodStart, periodEnd]);

  const load = useCallback(async (gb: GroupBy, f: Filters) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/portfolio/dynamic-report?${buildQuery(gb, f)}`);
      if (!res.ok) throw new Error('Failed to load report');
      setData(await res.json());
    } catch (e) {
      toast.error(String(e));
    } finally {
      setLoading(false);
    }
  }, [buildQuery]);

  useEffect(() => { load(groupBy, filters); }, [groupBy, filters, load]);

  useEffect(() => {
    fetch('/api/portfolio/dynamic-views').then(r => r.json()).then(d => setSavedViews(d.views ?? [])).catch(() => {});
  }, []);

  const handleDimensionChange = (v: string | null) => {
    if (!v) return;
    setGroupBy(v as GroupBy);
    // Changing dimension at the current scope replaces the current crumb's groupBy, keeping the scope filters.
    setCrumbs(prev => {
      const next = [...prev];
      next[next.length - 1] = { ...next[next.length - 1], groupBy: v as GroupBy };
      return next;
    });
  };

  const handleRowClick = (row: ReportRow) => {
    if (!row.drillable || !row.drill) return;
    const { group_by: nextGb, ...extra } = row.drill;
    const nextFilters = { ...filters, ...Object.fromEntries(Object.entries(extra).map(([k, v]) => [k, String(v)])) };
    setFilters(nextFilters);
    setGroupBy(nextGb);
    setCrumbs(prev => [...prev, { label: row.label, groupBy: nextGb, filters: nextFilters }]);
  };

  const handleCrumbClick = (idx: number) => {
    const c = crumbs[idx];
    setCrumbs(crumbs.slice(0, idx + 1));
    setFilters(c.filters);
    setGroupBy(c.groupBy);
  };

  const toggleMetric = (m: MetricKey) => {
    setMetrics(prev => {
      const next = new Set(prev);
      if (next.has(m)) { if (next.size > 1) next.delete(m); } else next.add(m);
      return next;
    });
  };

  const applyView = (v: SavedView) => {
    setMetrics(new Set(v.metrics.length ? v.metrics : (['schedule', 'budget', 'risk', 'resource', 'bugs', 'milestone'] as MetricKey[])));
    setPeriodStart(v.period_start ?? '');
    setPeriodEnd(v.period_end ?? '');
    setFilters({});
    setGroupBy(v.group_by);
    setCrumbs([{ label: 'Portfolio', groupBy: v.group_by, filters: {} }]);
  };

  const saveView = async () => {
    if (!saveName.trim()) return;
    try {
      const res = await fetch('/api/portfolio/dynamic-views', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: saveName.trim(), group_by: groupBy, metrics: Array.from(metrics), period_start: periodStart, period_end: periodEnd }),
      });
      if (!res.ok) throw new Error('Save failed');
      const { id } = await res.json();
      setSavedViews(prev => [{ id, name: saveName.trim(), group_by: groupBy, metrics: Array.from(metrics), period_start: periodStart, period_end: periodEnd }, ...prev]);
      setSaveOpen(false);
      setSaveName('');
      toast.success('Đã lưu view');
    } catch (e) {
      toast.error(String(e));
    }
  };

  const deleteView = async (id: number) => {
    try {
      await fetch(`/api/portfolio/dynamic-views/${id}`, { method: 'DELETE' });
      setSavedViews(prev => prev.filter(v => v.id !== id));
    } catch (e) {
      toast.error(String(e));
    }
  };

  const doExport = async (kind: 'xlsx' | 'pptx') => {
    setExporting(kind);
    try {
      const path = kind === 'xlsx' ? '/api/export/portfolio/dynamic-report' : '/api/export/portfolio/dynamic-report-ppt';
      const res = await fetch(`${path}?${buildQuery(groupBy, filters)}`);
      if (!res.ok) throw new Error('Export failed');
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `DynamicPortfolioReport.${kind}`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success('Đã xuất file');
    } catch (e) {
      toast.error(String(e));
    } finally {
      setExporting(null);
    }
  };

  const activeMetrics = useMemo(() => Array.from(metrics), [metrics]);

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 p-6 lg:p-8 max-w-[1400px] mx-auto w-full">
        <div className="flex items-center justify-between mb-1">
          <h1 className="text-2xl font-bold text-slate-800">Dynamic Portfolio Report</h1>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setSaveOpen(true)}>
              <Save className="size-4 mr-1.5" /> Lưu view
            </Button>
            <Button variant="outline" size="sm" onClick={() => doExport('xlsx')} disabled={exporting !== null}>
              <FileSpreadsheet className="size-4 mr-1.5" /> {exporting === 'xlsx' ? 'Đang xuất...' : 'Excel'}
            </Button>
            <Button variant="outline" size="sm" onClick={() => doExport('pptx')} disabled={exporting !== null}>
              <Presentation className="size-4 mr-1.5" /> {exporting === 'pptx' ? 'Đang xuất...' : 'PowerPoint'}
            </Button>
          </div>
        </div>
        <p className="text-sm text-slate-500 mb-4">Tổng hợp đa chiều từ dự án lên portfolio — click vào một dòng để xem chi tiết.</p>

        {/* Breadcrumb */}
        <div className="flex items-center gap-1 text-sm mb-4 flex-wrap">
          {crumbs.map((c, i) => (
            <span key={i} className="flex items-center gap-1">
              {i > 0 && <ChevronRight className="size-3.5 text-slate-400" />}
              <button
                onClick={() => handleCrumbClick(i)}
                className={i === crumbs.length - 1 ? 'font-semibold text-slate-800' : 'text-blue-600 hover:underline'}
              >
                {c.label}
              </button>
            </span>
          ))}
        </div>

        {/* Toolbar */}
        <div className="bg-white rounded-lg ring-1 ring-slate-200 p-4 mb-4 flex flex-wrap items-end gap-4">
          <div>
            <Label className="text-xs text-slate-500 mb-1 block">Nhóm theo (dimension)</Label>
            <Select value={groupBy === 'activity' ? 'project' : groupBy} onValueChange={handleDimensionChange}>
              <SelectTrigger className="w-44 h-9"><SelectValue /></SelectTrigger>
              <SelectContent>
                {(Object.entries(DIMENSION_LABELS) as [Exclude<GroupBy, 'activity'>, string][]).map(([k, label]) => (
                  <SelectItem key={k} value={k}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {groupBy === 'month' && (
            <>
              <div>
                <Label className="text-xs text-slate-500 mb-1 block">Từ ngày</Label>
                <Input type="date" className="h-9 w-40" value={periodStart} onChange={e => setPeriodStart(e.target.value)} />
              </div>
              <div>
                <Label className="text-xs text-slate-500 mb-1 block">Đến ngày</Label>
                <Input type="date" className="h-9 w-40" value={periodEnd} onChange={e => setPeriodEnd(e.target.value)} />
              </div>
            </>
          )}

          <div className="flex-1 min-w-64">
            <Label className="text-xs text-slate-500 mb-1 block">Chỉ số (metrics)</Label>
            <div className="flex flex-wrap gap-1.5">
              {(Object.keys(METRIC_LABELS) as MetricKey[]).map(m => (
                <button
                  key={m}
                  onClick={() => toggleMetric(m)}
                  className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-colors ${
                    metrics.has(m) ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {METRIC_LABELS[m]}
                </button>
              ))}
            </div>
          </div>

          {savedViews.length > 0 && (
            <div>
              <Label className="text-xs text-slate-500 mb-1 block">Saved views</Label>
              <div className="flex flex-wrap gap-1.5">
                {savedViews.map(v => (
                  <span key={v.id} className="inline-flex items-center gap-1 pl-2.5 pr-1 py-1 rounded-full text-xs bg-slate-100 text-slate-700 border border-slate-200">
                    <button onClick={() => applyView(v)} className="flex items-center gap-1 hover:text-blue-600">
                      <Bookmark className="size-3" /> {v.name}
                    </button>
                    <button onClick={() => deleteView(v.id)} className="p-0.5 hover:text-red-600">
                      <X className="size-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg ring-1 ring-slate-200 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{groupBy === 'activity' ? 'Activity' : DIMENSION_LABELS[groupBy as Exclude<GroupBy, 'activity'>] ?? 'Nhóm'}</TableHead>
                <TableHead className="text-right">Số dự án</TableHead>
                {groupBy === 'activity' && <TableHead>Trạng thái</TableHead>}
                {activeMetrics.includes('schedule') && <TableHead>Tiến độ</TableHead>}
                {activeMetrics.includes('budget') && groupBy !== 'activity' && <TableHead>Ngân sách (thực tế / kế hoạch)</TableHead>}
                {activeMetrics.includes('risk') && groupBy !== 'activity' && <TableHead className="text-right">Rủi ro / Vấn đề</TableHead>}
                {activeMetrics.includes('resource') && groupBy !== 'activity' && <TableHead>FTE (thực tế / định biên)</TableHead>}
                {activeMetrics.includes('bugs') && groupBy !== 'activity' && <TableHead className="text-right">Bugs (mở / critical)</TableHead>}
                {activeMetrics.includes('milestone') && groupBy !== 'activity' && <TableHead className="text-right">Milestone (trễ / sắp tới)</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading && (
                <TableRow><TableCell colSpan={8} className="text-center text-slate-400 py-8">Đang tải...</TableCell></TableRow>
              )}
              {!loading && data?.rows.length === 0 && (
                <TableRow><TableCell colSpan={8} className="text-center text-slate-400 py-8">Không có dữ liệu</TableCell></TableRow>
              )}
              {!loading && data?.rows.map(row => {
                const m = row.metrics;
                return (
                  <TableRow
                    key={row.key}
                    onClick={() => handleRowClick(row)}
                    className={row.drillable ? 'cursor-pointer hover:bg-slate-50' : ''}
                  >
                    <TableCell className="font-medium text-slate-800">
                      {groupBy === 'rag' ? (
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold uppercase ${RAG_PILL[row.key] ?? ''}`}>{row.label}</span>
                      ) : row.label}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">{row.count}</TableCell>
                    {groupBy === 'activity' && <TableCell className="text-slate-600">{row.detail?.status}</TableCell>}
                    {activeMetrics.includes('schedule') && m.schedule && (
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-24 h-2 rounded-full bg-slate-100 overflow-hidden">
                            <div className="h-full bg-blue-500" style={{ width: `${m.schedule.completion_pct}%` }} />
                          </div>
                          <span className="text-xs tabular-nums text-slate-600">{m.schedule.completion_pct}%</span>
                          {m.schedule.rag && (
                            <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase ${RAG_PILL[m.schedule.rag]}`}>{m.schedule.rag}</span>
                          )}
                          {m.schedule.rag_counts && (
                            <span className="text-[10px] text-slate-400 tabular-nums">
                              🔴{m.schedule.rag_counts.red} 🟡{m.schedule.rag_counts.amber} 🟢{m.schedule.rag_counts.green}
                            </span>
                          )}
                        </div>
                      </TableCell>
                    )}
                    {activeMetrics.includes('budget') && groupBy !== 'activity' && m.budget && (
                      <TableCell className="text-sm tabular-nums">
                        {money(m.budget.actual)} <span className="text-slate-400">/ {money(m.budget.planned)}</span>
                        {m.budget.variance_pct !== null && (
                          <span className={`ml-1.5 text-xs font-medium ${m.budget.variance_pct > 0 ? 'text-red-500' : 'text-green-600'}`}>
                            ({m.budget.variance_pct > 0 ? '+' : ''}{m.budget.variance_pct}%)
                          </span>
                        )}
                      </TableCell>
                    )}
                    {activeMetrics.includes('risk') && groupBy !== 'activity' && m.risk && (
                      <TableCell className="text-right tabular-nums text-sm">
                        <span className={m.risk.open_risks > 0 ? 'text-red-500 font-medium' : 'text-slate-400'}>{m.risk.open_risks}</span>
                        {' / '}
                        <span className={m.risk.open_issues > 0 ? 'text-amber-500 font-medium' : 'text-slate-400'}>{m.risk.open_issues}</span>
                      </TableCell>
                    )}
                    {activeMetrics.includes('resource') && groupBy !== 'activity' && m.resource && (
                      <TableCell className="text-sm tabular-nums">
                        {m.resource.actual} / {m.resource.allocated}
                        {m.resource.fill_rate_pct !== null && <span className="text-slate-400"> ({m.resource.fill_rate_pct}%)</span>}
                      </TableCell>
                    )}
                    {activeMetrics.includes('bugs') && groupBy !== 'activity' && m.bugs && (
                      <TableCell className="text-right tabular-nums text-sm">
                        <span className={m.bugs.open > 0 ? 'text-amber-500 font-medium' : 'text-slate-400'}>{m.bugs.open}</span>
                        {' ('}<span className={m.bugs.critical > 0 ? 'text-red-500 font-medium' : 'text-slate-400'}>{m.bugs.critical}</span>{')'}
                      </TableCell>
                    )}
                    {activeMetrics.includes('milestone') && groupBy !== 'activity' && m.milestone && (
                      <TableCell className="text-right tabular-nums text-sm">
                        <span className={m.milestone.overdue > 0 ? 'text-red-500 font-medium' : 'text-slate-400'}>{m.milestone.overdue}</span>
                        {' / '}
                        <span className="text-slate-500">{m.milestone.upcoming}</span>
                      </TableCell>
                    )}
                    {row.drillable && (
                      <TableCell className="w-6 pr-3"><ChevronRight className="size-4 text-slate-300" /></TableCell>
                    )}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </main>

      <Dialog open={saveOpen} onOpenChange={setSaveOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Lưu view hiện tại</DialogTitle></DialogHeader>
          <div className="py-2">
            <Label className="text-xs text-slate-500 mb-1 block">Tên view</Label>
            <Input value={saveName} onChange={e => setSaveName(e.target.value)} placeholder="VD: Ngân sách theo chương trình Q3" />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSaveOpen(false)}>Hủy</Button>
            <Button onClick={saveView}>Lưu</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
