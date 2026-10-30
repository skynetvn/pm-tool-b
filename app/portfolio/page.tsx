'use client';
import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import Sidebar from '@/components/layout/Sidebar';
import { Badge } from '@/components/ui/badge';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts';
import { BarChart3, Layers, TrendingUp, TrendingDown, Minus, AlertTriangle, CheckCircle2 } from 'lucide-react';

type ProgramRollup = {
  id: number; name: string; include_in_portfolio: number; owner_name: string | null;
  project_count: number; task_count: number; progress_pct: number; prev_progress_pct: number;
  at_risk_count: number; off_track_count: number; done_count: number;
};

function ProgressBar({ pct, color = 'bg-blue-600' }: { pct: number; color?: string }) {
  const clamped = Math.max(0, Math.min(100, Math.round(Number(pct) || 0)));
  return (
    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
      <div className={`h-full ${color} rounded-full transition-all`} style={{ width: `${clamped}%` }} />
    </div>
  );
}

function TrendBadge({ current, previous }: { current: number; previous: number }) {
  const diff = Math.round(current - previous);
  if (diff > 0) return <span className="inline-flex items-center gap-0.5 text-xs text-green-600"><TrendingUp className="h-3 w-3" /> +{diff}%</span>;
  if (diff < 0) return <span className="inline-flex items-center gap-0.5 text-xs text-red-600"><TrendingDown className="h-3 w-3" /> {diff}%</span>;
  return <span className="inline-flex items-center gap-0.5 text-xs text-slate-400"><Minus className="h-3 w-3" /> 0%</span>;
}

export default function PortfolioPage() {
  const [programs, setPrograms] = useState<ProgramRollup[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/portfolio').then(r => r.ok ? r.json() : { programs: [] }).then(data => {
      setPrograms(data.programs ?? []);
      setLoading(false);
    });
  }, []);

  const included = useMemo(() => programs.filter(p => p.include_in_portfolio), [programs]);

  const kpi = useMemo(() => {
    const projectCount = included.reduce((s, p) => s + Number(p.project_count || 0), 0);
    const taskCount = included.reduce((s, p) => s + Number(p.task_count || 0), 0);
    const avgProgress = included.length
      ? Math.round(included.reduce((s, p) => s + Number(p.progress_pct || 0), 0) / included.length)
      : 0;
    const avgPrevProgress = included.length
      ? Math.round(included.reduce((s, p) => s + Number(p.prev_progress_pct || 0), 0) / included.length)
      : 0;
    const atRisk = included.reduce((s, p) => s + Number(p.at_risk_count || 0) + Number(p.off_track_count || 0), 0);
    return { projectCount, taskCount, avgProgress, avgPrevProgress, atRisk };
  }, [included]);

  const chartData = included.map(p => ({ name: p.name, progress: Math.round(p.progress_pct), prev: Math.round(p.prev_progress_pct) }));

  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      <Sidebar />
      <main className="flex-1 p-4 lg:p-6">
        <div className="mb-5">
          <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2"><BarChart3 className="h-5 w-5 text-blue-600" /> Báo cáo Portfolio</h1>
          <p className="text-sm text-slate-500 mt-0.5">Tổng hợp từ các Program được chọn lên báo cáo</p>
        </div>

        {loading ? (
          <p className="text-center text-sm text-slate-400 py-10">Đang tải…</p>
        ) : (
          <>
            {/* KPI cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
              <div className="bg-white rounded-xl border shadow-sm p-4">
                <p className="text-xs text-slate-400 mb-1">Tiến độ chung</p>
                <p className="text-2xl font-bold text-slate-800">{kpi.avgProgress}%</p>
                <div className="mt-1"><TrendBadge current={kpi.avgProgress} previous={kpi.avgPrevProgress} /></div>
              </div>
              <div className="bg-white rounded-xl border shadow-sm p-4">
                <p className="text-xs text-slate-400 mb-1">Program lên báo cáo</p>
                <p className="text-2xl font-bold text-slate-800">{included.length}<span className="text-sm text-slate-400">/{programs.length}</span></p>
              </div>
              <div className="bg-white rounded-xl border shadow-sm p-4">
                <p className="text-xs text-slate-400 mb-1">Dự án / Task</p>
                <p className="text-2xl font-bold text-slate-800">{kpi.projectCount}<span className="text-sm text-slate-400"> dự án</span></p>
                <p className="text-xs text-slate-400 mt-0.5">{kpi.taskCount} task</p>
              </div>
              <div className="bg-white rounded-xl border shadow-sm p-4">
                <p className="text-xs text-slate-400 mb-1">Task có rủi ro / trễ</p>
                <p className="text-2xl font-bold text-amber-600 flex items-center gap-1.5"><AlertTriangle className="h-5 w-5" /> {kpi.atRisk}</p>
              </div>
            </div>

            {/* Chart */}
            {chartData.length > 0 && (
              <div className="bg-white rounded-xl border shadow-sm p-4 mb-5">
                <h2 className="text-sm font-semibold text-slate-700 mb-3">Tiến độ theo Program (kỳ này vs kỳ trước)</h2>
                <ResponsiveContainer width="100%" height={Math.max(180, chartData.length * 44)}>
                  <BarChart data={chartData} layout="vertical" margin={{ left: 8, right: 24 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                    <XAxis type="number" domain={[0, 100]} tickFormatter={v => `${v}%`} fontSize={12} />
                    <YAxis type="category" dataKey="name" width={140} fontSize={12} />
                    <Tooltip formatter={(v) => `${v}%`} />
                    <Bar dataKey="prev" name="Kỳ trước" fill="#cbd5e1" radius={[3, 3, 3, 3]} barSize={10} />
                    <Bar dataKey="progress" name="Kỳ này" fill="#2563eb" radius={[3, 3, 3, 3]} barSize={10} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Program table */}
            <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
              <div className="px-5 py-3 border-b flex items-center gap-2">
                <Layers className="h-4 w-4 text-slate-500" />
                <h2 className="font-semibold text-slate-700">Tất cả Program</h2>
              </div>
              {programs.length === 0 ? (
                <p className="px-5 py-8 text-center text-sm text-slate-400">Chưa có program nào</p>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-xs text-slate-400 border-b bg-slate-50/50">
                      <th className="px-5 py-2.5 font-medium">Program</th>
                      <th className="px-3 py-2.5 font-medium">Tiến độ</th>
                      <th className="px-3 py-2.5 font-medium">Task rủi ro/trễ</th>
                      <th className="px-3 py-2.5 font-medium">Hoàn thành</th>
                      <th className="px-3 py-2.5 font-medium text-center">Trong Portfolio</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {programs.map(p => (
                      <tr key={p.id} className={!p.include_in_portfolio ? 'opacity-50' : ''}>
                        <td className="px-5 py-3">
                          <Link href={`/programs/${p.id}`} className="font-medium text-slate-800 hover:text-blue-600">{p.name}</Link>
                          <p className="text-xs text-slate-400 mt-0.5">{p.project_count} dự án · {p.task_count} task</p>
                        </td>
                        <td className="px-3 py-3 min-w-[160px]">
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span className="font-medium text-slate-700">{Math.round(p.progress_pct)}%</span>
                            <TrendBadge current={p.progress_pct} previous={p.prev_progress_pct} />
                          </div>
                          <ProgressBar pct={p.progress_pct} />
                        </td>
                        <td className="px-3 py-3">
                          {(p.at_risk_count + p.off_track_count) > 0 ? (
                            <Badge className="bg-amber-50 text-amber-700 border-0">{p.at_risk_count + p.off_track_count}</Badge>
                          ) : <span className="text-slate-300">—</span>}
                        </td>
                        <td className="px-3 py-3">
                          <span className="inline-flex items-center gap-1 text-slate-600"><CheckCircle2 className="h-3.5 w-3.5 text-green-500" /> {p.done_count}</span>
                        </td>
                        <td className="px-3 py-3 text-center">
                          <Badge className={`${p.include_in_portfolio ? 'bg-green-50 text-green-700' : 'bg-slate-100 text-slate-500'} border-0`}>
                            {p.include_in_portfolio ? 'Có' : 'Không'}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
