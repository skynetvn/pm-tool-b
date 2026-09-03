'use client';
import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import Sidebar from '@/components/layout/Sidebar';
import { Badge } from '@/components/ui/badge';
import {
  Target, Rocket, TrendingUp, CheckCircle2, AlertTriangle,
  ArrowRight, Plus, Clock,
} from 'lucide-react';

type Goal = {
  id: number; title: string; period_label: string; status: string;
  owner_name: string | null; kr_progress: number; kr_count: number; initiative_count: number;
};
type Initiative = {
  id: number; title: string; status: string; priority: string;
  progress_pct: number; owner_name: string | null; goal_title: string | null;
};

const GOAL_STATUS: Record<string, { label: string; color: string }> = {
  not_started: { label: 'Chưa bắt đầu', color: 'bg-slate-100 text-slate-600' },
  on_track:    { label: 'Đúng tiến độ',  color: 'bg-green-50 text-green-700' },
  at_risk:     { label: 'Có rủi ro',     color: 'bg-amber-50 text-amber-700' },
  off_track:   { label: 'Trễ tiến độ',   color: 'bg-red-50 text-red-700' },
  completed:   { label: 'Hoàn thành',    color: 'bg-blue-50 text-blue-700' },
};
const INI_STATUS: Record<string, { label: string; color: string }> = {
  proposed:    { label: 'Đề xuất',      color: 'bg-slate-100 text-slate-600' },
  in_progress: { label: 'Đang triển khai', color: 'bg-blue-50 text-blue-700' },
  on_hold:     { label: 'Tạm hoãn',     color: 'bg-amber-50 text-amber-700' },
  completed:   { label: 'Hoàn thành',   color: 'bg-green-50 text-green-700' },
  cancelled:   { label: 'Đã huỷ',       color: 'bg-red-50 text-red-700' },
};

function ProgressBar({ pct, color = 'bg-blue-600' }: { pct: number; color?: string }) {
  const clamped = Math.max(0, Math.min(100, Math.round(pct)));
  return (
    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
      <div className={`h-full ${color} rounded-full transition-all`} style={{ width: `${clamped}%` }} />
    </div>
  );
}

export default function DashboardPage() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [initiatives, setInitiatives] = useState<Initiative[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/goals').then(r => r.ok ? r.json() : []),
      fetch('/api/initiatives').then(r => r.ok ? r.json() : []),
    ]).then(([g, i]) => { setGoals(g ?? []); setInitiatives(i ?? []); setLoading(false); });
  }, []);

  const kpi = useMemo(() => {
    const totalGoals = goals.length;
    const onTrack = goals.filter(g => g.status === 'on_track' || g.status === 'completed').length;
    const atRisk = goals.filter(g => g.status === 'at_risk' || g.status === 'off_track').length;
    const avgProgress = totalGoals ? Math.round(goals.reduce((s, g) => s + Number(g.kr_progress || 0), 0) / totalGoals) : 0;
    const activeInitiatives = initiatives.filter(i => i.status === 'in_progress').length;
    return { totalGoals, onTrack, atRisk, avgProgress, activeInitiatives, totalInitiatives: initiatives.length };
  }, [goals, initiatives]);

  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      <Sidebar />
      <main className="flex-1 p-4 lg:p-6 max-w-6xl mx-auto w-full">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <h1 className="text-xl font-bold text-slate-800">Tổng quan Mục tiêu & Sáng kiến</h1>
            <p className="text-sm text-slate-500">Theo dõi tiến độ mục tiêu và các sáng kiến đang triển khai</p>
          </div>
          <div className="flex gap-2">
            <Link href="/goals" className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors">
              <Plus className="h-4 w-4" /> Mục tiêu mới
            </Link>
            <Link href="/initiatives" className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white border text-slate-700 text-sm font-medium hover:bg-slate-50 transition-colors">
              <Plus className="h-4 w-4" /> Sáng kiến mới
            </Link>
          </div>
        </div>

        {/* KPI cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          <div className="bg-white rounded-xl border p-4">
            <div className="flex items-center gap-2 text-slate-500 text-xs mb-1.5"><Target className="h-3.5 w-3.5" /> Tổng mục tiêu</div>
            <p className="text-2xl font-bold text-slate-800">{kpi.totalGoals}</p>
          </div>
          <div className="bg-white rounded-xl border p-4">
            <div className="flex items-center gap-2 text-slate-500 text-xs mb-1.5"><CheckCircle2 className="h-3.5 w-3.5" /> Đúng tiến độ</div>
            <p className="text-2xl font-bold text-green-600">{kpi.onTrack}</p>
          </div>
          <div className="bg-white rounded-xl border p-4">
            <div className="flex items-center gap-2 text-slate-500 text-xs mb-1.5"><AlertTriangle className="h-3.5 w-3.5" /> Có rủi ro</div>
            <p className="text-2xl font-bold text-amber-600">{kpi.atRisk}</p>
          </div>
          <div className="bg-white rounded-xl border p-4">
            <div className="flex items-center gap-2 text-slate-500 text-xs mb-1.5"><Rocket className="h-3.5 w-3.5" /> Sáng kiến đang chạy</div>
            <p className="text-2xl font-bold text-slate-800">{kpi.activeInitiatives}<span className="text-sm text-slate-400 font-normal">/{kpi.totalInitiatives}</span></p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-5">
          {/* Goals */}
          <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3 border-b">
              <h2 className="font-semibold text-slate-700 flex items-center gap-2"><Target className="h-4 w-4 text-blue-600" /> Mục tiêu gần đây</h2>
              <Link href="/goals" className="text-xs text-blue-600 hover:underline flex items-center gap-1">Xem tất cả <ArrowRight className="h-3 w-3" /></Link>
            </div>
            <div className="divide-y">
              {loading && <p className="px-5 py-8 text-center text-sm text-slate-400">Đang tải…</p>}
              {!loading && goals.length === 0 && (
                <div className="px-5 py-8 text-center">
                  <p className="text-sm text-slate-400 mb-2">Chưa có mục tiêu nào</p>
                  <Link href="/goals" className="text-sm text-blue-600 hover:underline">Tạo mục tiêu đầu tiên</Link>
                </div>
              )}
              {goals.slice(0, 5).map(g => {
                const st = GOAL_STATUS[g.status] ?? GOAL_STATUS.not_started;
                return (
                  <Link key={g.id} href={`/goals/${g.id}`} className="block px-5 py-3 hover:bg-slate-50 transition-colors">
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <p className="text-sm font-medium text-slate-800 truncate">{g.title}</p>
                      <Badge className={`${st.color} border-0 shrink-0`}>{st.label}</Badge>
                    </div>
                    <ProgressBar pct={g.kr_progress} />
                    <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-400">
                      {g.period_label && <span>{g.period_label}</span>}
                      {g.owner_name && <span>· {g.owner_name}</span>}
                      <span>· {g.kr_count} kết quả then chốt</span>
                      <span>· {g.initiative_count} sáng kiến</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Initiatives */}
          <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3 border-b">
              <h2 className="font-semibold text-slate-700 flex items-center gap-2"><Rocket className="h-4 w-4 text-violet-600" /> Sáng kiến gần đây</h2>
              <Link href="/initiatives" className="text-xs text-blue-600 hover:underline flex items-center gap-1">Xem tất cả <ArrowRight className="h-3 w-3" /></Link>
            </div>
            <div className="divide-y">
              {loading && <p className="px-5 py-8 text-center text-sm text-slate-400">Đang tải…</p>}
              {!loading && initiatives.length === 0 && (
                <div className="px-5 py-8 text-center">
                  <p className="text-sm text-slate-400 mb-2">Chưa có sáng kiến nào</p>
                  <Link href="/initiatives" className="text-sm text-blue-600 hover:underline">Tạo sáng kiến đầu tiên</Link>
                </div>
              )}
              {initiatives.slice(0, 5).map(i => {
                const st = INI_STATUS[i.status] ?? INI_STATUS.proposed;
                return (
                  <Link key={i.id} href={`/initiatives/${i.id}`} className="block px-5 py-3 hover:bg-slate-50 transition-colors">
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <p className="text-sm font-medium text-slate-800 truncate">{i.title}</p>
                      <Badge className={`${st.color} border-0 shrink-0`}>{st.label}</Badge>
                    </div>
                    <ProgressBar pct={i.progress_pct} color="bg-violet-600" />
                    <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-400">
                      {i.goal_title && <span className="flex items-center gap-1"><Target className="h-3 w-3" /> {i.goal_title}</span>}
                      {i.owner_name && <span>· {i.owner_name}</span>}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        {kpi.totalGoals === 0 && kpi.totalInitiatives === 0 && !loading && (
          <div className="mt-6 bg-blue-50 border border-blue-100 rounded-xl p-5 flex items-start gap-3">
            <Clock className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-blue-900">Bắt đầu với hệ thống Quản lý Mục tiêu & Sáng kiến</p>
              <p className="text-sm text-blue-700 mt-0.5">Tạo mục tiêu (Goal) theo từng giai đoạn (quý/năm), thêm kết quả then chốt để đo lường, rồi gắn các sáng kiến (Initiative) để hiện thực hoá mục tiêu đó.</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
