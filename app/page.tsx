'use client';
import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import Sidebar from '@/components/layout/Sidebar';
import { Badge } from '@/components/ui/badge';
import {
  Briefcase, Layers, TrendingUp, TrendingDown, Minus, AlertTriangle,
  ArrowRight, Plus, Clock,
} from 'lucide-react';

type Project = {
  id: number; name: string; status: string; owner_name: string | null;
  task_count: number; progress_pct: number; prev_progress_pct: number;
};
type Program = {
  id: number; name: string; project_count: number; task_count: number;
  progress_pct: number; at_risk_count: number; off_track_count: number;
};

const PROJECT_STATUS: Record<string, { label: string; color: string }> = {
  active:    { label: 'Đang triển khai', color: 'bg-blue-50 text-blue-700' },
  on_hold:   { label: 'Tạm hoãn',        color: 'bg-amber-50 text-amber-700' },
  completed: { label: 'Hoàn thành',      color: 'bg-green-50 text-green-700' },
  cancelled: { label: 'Đã huỷ',          color: 'bg-red-50 text-red-700' },
};

function ProgressBar({ pct, color = 'bg-blue-600' }: { pct: number; color?: string }) {
  const clamped = Math.max(0, Math.min(100, Math.round(pct)));
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

export default function DashboardPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/projects').then(r => r.ok ? r.json() : []),
      fetch('/api/programs').then(r => r.ok ? r.json() : []),
    ]).then(([p, pg]) => { setProjects(p ?? []); setPrograms(pg ?? []); setLoading(false); });
  }, []);

  const kpi = useMemo(() => {
    const totalProjects = projects.length;
    const totalTasks = projects.reduce((s, p) => s + Number(p.task_count || 0), 0);
    const avgProgress = totalProjects ? Math.round(projects.reduce((s, p) => s + Number(p.progress_pct || 0), 0) / totalProjects) : 0;
    const avgPrevProgress = totalProjects ? Math.round(projects.reduce((s, p) => s + Number(p.prev_progress_pct || 0), 0) / totalProjects) : 0;
    const atRisk = programs.reduce((s, p) => s + Number(p.at_risk_count || 0) + Number(p.off_track_count || 0), 0);
    return { totalProjects, totalTasks, avgProgress, avgPrevProgress, atRisk, totalPrograms: programs.length };
  }, [projects, programs]);

  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      <Sidebar />
      <main className="flex-1 p-4 lg:p-6 max-w-6xl mx-auto w-full">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <h1 className="text-xl font-bold text-slate-800">Tổng quan</h1>
            <p className="text-sm text-slate-500">Cập nhật task, theo dõi tiến độ kỳ trước/kỳ này của từng dự án</p>
          </div>
          <div className="flex gap-2">
            <Link href="/projects" className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors">
              <Plus className="h-4 w-4" /> Dự án mới
            </Link>
            <Link href="/programs" className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white border text-slate-700 text-sm font-medium hover:bg-slate-50 transition-colors">
              <Plus className="h-4 w-4" /> Program mới
            </Link>
          </div>
        </div>

        {/* KPI cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          <div className="bg-white rounded-xl border p-4">
            <div className="flex items-center gap-2 text-slate-500 text-xs mb-1.5"><Briefcase className="h-3.5 w-3.5" /> Dự án</div>
            <p className="text-2xl font-bold text-slate-800">{kpi.totalProjects}</p>
          </div>
          <div className="bg-white rounded-xl border p-4">
            <div className="flex items-center gap-2 text-slate-500 text-xs mb-1.5"><Layers className="h-3.5 w-3.5" /> Program</div>
            <p className="text-2xl font-bold text-slate-800">{kpi.totalPrograms}</p>
          </div>
          <div className="bg-white rounded-xl border p-4">
            <div className="flex items-center gap-2 text-slate-500 text-xs mb-1.5">Tiến độ chung ({kpi.totalTasks} task)</div>
            <p className="text-2xl font-bold text-slate-800">{kpi.avgProgress}%</p>
            <div className="mt-1"><TrendBadge current={kpi.avgProgress} previous={kpi.avgPrevProgress} /></div>
          </div>
          <div className="bg-white rounded-xl border p-4">
            <div className="flex items-center gap-2 text-slate-500 text-xs mb-1.5"><AlertTriangle className="h-3.5 w-3.5" /> Task rủi ro/trễ</div>
            <p className="text-2xl font-bold text-amber-600">{kpi.atRisk}</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-5">
          {/* Projects */}
          <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3 border-b">
              <h2 className="font-semibold text-slate-700 flex items-center gap-2"><Briefcase className="h-4 w-4 text-blue-600" /> Dự án gần đây</h2>
              <Link href="/projects" className="text-xs text-blue-600 hover:underline flex items-center gap-1">Xem tất cả <ArrowRight className="h-3 w-3" /></Link>
            </div>
            <div className="divide-y">
              {loading && <p className="px-5 py-8 text-center text-sm text-slate-400">Đang tải…</p>}
              {!loading && projects.length === 0 && (
                <div className="px-5 py-8 text-center">
                  <p className="text-sm text-slate-400 mb-2">Chưa có dự án nào</p>
                  <Link href="/projects" className="text-sm text-blue-600 hover:underline">Tạo dự án đầu tiên</Link>
                </div>
              )}
              {projects.slice(0, 5).map(p => {
                const st = PROJECT_STATUS[p.status] ?? PROJECT_STATUS.active;
                return (
                  <Link key={p.id} href={`/projects/${p.id}`} className="block px-5 py-3 hover:bg-slate-50 transition-colors">
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <p className="text-sm font-medium text-slate-800 truncate">{p.name}</p>
                      <Badge className={`${st.color} border-0 shrink-0`}>{st.label}</Badge>
                    </div>
                    <ProgressBar pct={p.progress_pct} />
                    <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-400">
                      <span>{Math.round(p.progress_pct)}%</span>
                      <TrendBadge current={p.progress_pct} previous={p.prev_progress_pct} />
                      <span>· {p.task_count} task</span>
                      {p.owner_name && <span>· {p.owner_name}</span>}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Programs */}
          <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3 border-b">
              <h2 className="font-semibold text-slate-700 flex items-center gap-2"><Layers className="h-4 w-4 text-indigo-600" /> Program</h2>
              <Link href="/portfolio" className="text-xs text-blue-600 hover:underline flex items-center gap-1">Báo cáo Portfolio <ArrowRight className="h-3 w-3" /></Link>
            </div>
            <div className="divide-y">
              {loading && <p className="px-5 py-8 text-center text-sm text-slate-400">Đang tải…</p>}
              {!loading && programs.length === 0 && (
                <div className="px-5 py-8 text-center">
                  <p className="text-sm text-slate-400 mb-2">Chưa có program nào</p>
                  <Link href="/programs" className="text-sm text-blue-600 hover:underline">Tạo program đầu tiên</Link>
                </div>
              )}
              {programs.slice(0, 5).map(p => (
                <Link key={p.id} href={`/programs/${p.id}`} className="block px-5 py-3 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <p className="text-sm font-medium text-slate-800 truncate">{p.name}</p>
                    <span className="text-xs text-slate-400 shrink-0">{Math.round(p.progress_pct)}%</span>
                  </div>
                  <ProgressBar pct={p.progress_pct} color="bg-indigo-600" />
                  <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-400">
                    <span>{p.project_count} dự án</span>
                    <span>· {p.task_count} task</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {kpi.totalProjects === 0 && kpi.totalPrograms === 0 && !loading && (
          <div className="mt-6 bg-blue-50 border border-blue-100 rounded-xl p-5 flex items-start gap-3">
            <Clock className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-blue-900">Bắt đầu quản lý dự án</p>
              <p className="text-sm text-blue-700 mt-0.5">Tạo một Dự án, thêm Task vào đó rồi cập nhật tiến độ định kỳ. Nhóm nhiều dự án vào một Program, và chọn program nào lên Báo cáo Portfolio.</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
