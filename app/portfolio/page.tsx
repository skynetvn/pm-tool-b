'use client';
import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import Sidebar from '@/components/layout/Sidebar';
import { Badge } from '@/components/ui/badge';
import {
  BarChart, Bar, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts';
import {
  Layers, Target, Rocket, TrendingUp, AlertTriangle, CheckCircle2, ArrowRight,
} from 'lucide-react';

type Squad = {
  id: number; name: string; lead_name: string | null;
  goal_count: number; on_track_count: number; at_risk_count: number; completed_count: number;
  avg_kr_progress: number; initiative_count: number;
};
type Goal = {
  id: number; title: string; status: string; period_label: string; owner_name: string | null;
  squad_id: number | null; squad_name: string | null; kr_progress: number;
};
type Initiative = {
  id: number; title: string; status: string; progress_pct: number; owner_name: string | null;
  goal_id: number | null; goal_title: string | null;
};

const GOAL_STATUS: Record<string, { label: string; color: string }> = {
  not_started: { label: 'Chưa bắt đầu', color: 'bg-slate-100 text-slate-600' },
  on_track:    { label: 'Đúng tiến độ',  color: 'bg-green-50 text-green-700' },
  at_risk:     { label: 'Có rủi ro',     color: 'bg-amber-50 text-amber-700' },
  off_track:   { label: 'Trễ tiến độ',   color: 'bg-red-50 text-red-700' },
  completed:   { label: 'Hoàn thành',    color: 'bg-blue-50 text-blue-700' },
};

function healthColor(pct: number, atRisk: number) {
  if (atRisk > 0) return '#D97706';
  if (pct >= 70) return '#16A34A';
  if (pct >= 40) return '#2563EB';
  return '#94A3B8';
}

function ProgressBar({ pct, color = 'bg-blue-600' }: { pct: number; color?: string }) {
  const clamped = Math.max(0, Math.min(100, Math.round(Number(pct) || 0)));
  return (
    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
      <div className={`h-full ${color} rounded-full transition-all`} style={{ width: `${clamped}%` }} />
    </div>
  );
}

export default function PortfolioPage() {
  const [squads, setSquads] = useState<Squad[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [initiatives, setInitiatives] = useState<Initiative[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/squads').then(r => r.ok ? r.json() : []),
      fetch('/api/goals').then(r => r.ok ? r.json() : []),
      fetch('/api/initiatives').then(r => r.ok ? r.json() : []),
    ]).then(([s, g, i]) => { setSquads(s ?? []); setGoals(g ?? []); setInitiatives(i ?? []); setLoading(false); });
  }, []);

  const kpi = useMemo(() => {
    const totalGoals = goals.length;
    const onTrack = goals.filter(g => g.status === 'on_track' || g.status === 'completed').length;
    const atRisk = goals.filter(g => g.status === 'at_risk' || g.status === 'off_track').length;
    const avgProgress = totalGoals ? Math.round(goals.reduce((s, g) => s + Number(g.kr_progress || 0), 0) / totalGoals) : 0;
    const activeInitiatives = initiatives.filter(i => i.status === 'in_progress').length;
    const orphanGoals = goals.filter(g => !g.squad_id).length;
    return { totalGoals, onTrack, atRisk, avgProgress, activeInitiatives, totalInitiatives: initiatives.length, orphanGoals };
  }, [goals, initiatives]);

  const chartData = useMemo(() => squads.map(s => ({
    name: s.name.length > 14 ? s.name.slice(0, 13) + '…' : s.name,
    fullName: s.name,
    progress: Math.round(Number(s.avg_kr_progress) || 0),
    atRisk: s.at_risk_count,
  })), [squads]);

  const atRiskGoals = useMemo(() =>
    goals.filter(g => g.status === 'at_risk' || g.status === 'off_track').slice(0, 6), [goals]);

  const activeInitiativesList = useMemo(() =>
    initiatives.filter(i => i.status === 'in_progress').slice(0, 6), [initiatives]);

  if (loading) {
    return (
      <div className="flex flex-col lg:flex-row min-h-screen">
        <Sidebar />
        <main className="flex-1 p-6 text-center text-sm text-slate-400">Đang tải…</main>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      <Sidebar />
      <main className="flex-1 p-4 lg:p-6 max-w-6xl mx-auto w-full">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-indigo-100 rounded-xl p-2.5"><Layers className="h-6 w-6 text-indigo-600" /></div>
          <div>
            <h1 className="text-xl font-bold text-slate-800">Tổng hợp toàn tổ chức</h1>
            <p className="text-sm text-slate-500">Bức tranh tổng thể mục tiêu &amp; sáng kiến trên tất cả các nhóm (squad)</p>
          </div>
        </div>

        {/* KPI cards */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-6">
          <div className="bg-white rounded-xl border p-4">
            <div className="flex items-center gap-2 text-slate-500 text-xs mb-1.5"><Layers className="h-3.5 w-3.5" /> Số nhóm</div>
            <p className="text-2xl font-bold text-slate-800">{squads.length}</p>
          </div>
          <div className="bg-white rounded-xl border p-4">
            <div className="flex items-center gap-2 text-slate-500 text-xs mb-1.5"><Target className="h-3.5 w-3.5" /> Tổng mục tiêu</div>
            <p className="text-2xl font-bold text-slate-800">{kpi.totalGoals}</p>
          </div>
          <div className="bg-white rounded-xl border p-4">
            <div className="flex items-center gap-2 text-slate-500 text-xs mb-1.5"><TrendingUp className="h-3.5 w-3.5" /> Tiến độ TB</div>
            <p className="text-2xl font-bold text-blue-600">{kpi.avgProgress}%</p>
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

        {/* Squad comparison chart */}
        <div className="bg-white rounded-xl border shadow-sm mb-6">
          <div className="flex items-center justify-between px-5 py-3 border-b">
            <h2 className="font-semibold text-slate-700 flex items-center gap-2"><Layers className="h-4 w-4 text-indigo-600" /> Tiến độ trung bình theo nhóm</h2>
            <Link href="/squads" className="text-xs text-blue-600 hover:underline flex items-center gap-1">Xem tất cả nhóm <ArrowRight className="h-3 w-3" /></Link>
          </div>
          {squads.length === 0 ? (
            <p className="px-5 py-10 text-center text-sm text-slate-400">Chưa có nhóm nào — tạo nhóm để bắt đầu theo dõi tổng hợp.</p>
          ) : (
            <div className="p-4" style={{ height: Math.max(180, chartData.length * 44) }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} layout="vertical" margin={{ left: 8, right: 24, top: 4, bottom: 4 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#EEF1F6" />
                  <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11, fill: '#94A3B8' }} unit="%" />
                  <YAxis type="category" dataKey="name" width={110} tick={{ fontSize: 12, fill: '#334155' }} />
                  <Tooltip
                    formatter={(v) => [`${v}%`, 'Tiến độ trung bình']}
                    labelFormatter={(_, payload) => payload?.[0]?.payload?.fullName ?? ''}
                    contentStyle={{ borderRadius: 10, fontSize: 12, border: '1px solid #E2E8F0' }}
                  />
                  <Bar dataKey="progress" radius={[0, 6, 6, 0]} barSize={18}>
                    {chartData.map((d, idx) => <Cell key={idx} fill={healthColor(d.progress, d.atRisk)} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        <div className="grid lg:grid-cols-2 gap-5 mb-6">
          {/* Squad rollup cards */}
          <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3 border-b">
              <h2 className="font-semibold text-slate-700 flex items-center gap-2"><Layers className="h-4 w-4 text-indigo-600" /> Các nhóm (Squad)</h2>
            </div>
            <div className="divide-y">
              {squads.length === 0 && <p className="px-5 py-8 text-center text-sm text-slate-400">Chưa có nhóm nào</p>}
              {squads.map(s => (
                <Link key={s.id} href={`/squads/${s.id}`} className="block px-5 py-3 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <b className="text-sm text-slate-800">{s.name}</b>
                    <span className="text-xs text-slate-400">{s.goal_count} mục tiêu · {s.initiative_count} sáng kiến</span>
                  </div>
                  <ProgressBar pct={s.avg_kr_progress} color="bg-indigo-600" />
                  <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-400">
                    {s.lead_name && <span>Trưởng nhóm: {s.lead_name}</span>}
                    <span className="text-green-600">{s.on_track_count} đúng tiến độ</span>
                    {s.at_risk_count > 0 && <span className="text-amber-600">{s.at_risk_count} có rủi ro</span>}
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* At-risk goals across org */}
          <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3 border-b">
              <h2 className="font-semibold text-slate-700 flex items-center gap-2"><AlertTriangle className="h-4 w-4 text-amber-600" /> Mục tiêu cần chú ý</h2>
            </div>
            <div className="divide-y">
              {atRiskGoals.length === 0 && (
                <div className="px-5 py-8 text-center text-sm text-slate-400 flex flex-col items-center gap-1.5">
                  <CheckCircle2 className="h-5 w-5 text-green-400" /> Không có mục tiêu nào đang gặp rủi ro
                </div>
              )}
              {atRiskGoals.map(g => {
                const st = GOAL_STATUS[g.status] ?? GOAL_STATUS.not_started;
                return (
                  <Link key={g.id} href={`/goals/${g.id}`} className="block px-5 py-3 hover:bg-slate-50 transition-colors">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <b className="text-sm text-slate-800 truncate">{g.title}</b>
                      <Badge className={`${st.color} border-0 shrink-0`}>{st.label}</Badge>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      {g.squad_name && <span className="flex items-center gap-1"><Layers className="h-3 w-3" />{g.squad_name}</span>}
                      {g.owner_name && <span>· {g.owner_name}</span>}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        {/* Active initiatives across org */}
        <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3 border-b">
            <h2 className="font-semibold text-slate-700 flex items-center gap-2"><Rocket className="h-4 w-4 text-violet-600" /> Sáng kiến đang triển khai</h2>
            <Link href="/initiatives" className="text-xs text-blue-600 hover:underline flex items-center gap-1">Xem tất cả <ArrowRight className="h-3 w-3" /></Link>
          </div>
          <div className="divide-y">
            {activeInitiativesList.length === 0 && <p className="px-5 py-8 text-center text-sm text-slate-400">Không có sáng kiến nào đang triển khai</p>}
            {activeInitiativesList.map(i => (
              <Link key={i.id} href={`/initiatives/${i.id}`} className="block px-5 py-3 hover:bg-slate-50 transition-colors">
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <b className="text-sm text-slate-800 truncate">{i.title}</b>
                  <span className="text-xs text-slate-500 shrink-0">{i.progress_pct}%</span>
                </div>
                <ProgressBar pct={i.progress_pct} color="bg-violet-600" />
                <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-400">
                  {i.goal_title && <span className="flex items-center gap-1"><Target className="h-3 w-3" />{i.goal_title}</span>}
                  {i.owner_name && <span>· {i.owner_name}</span>}
                </div>
              </Link>
            ))}
          </div>
        </div>

        {kpi.orphanGoals > 0 && (
          <p className="text-xs text-slate-400 mt-4 text-center">{kpi.orphanGoals} mục tiêu chưa được gán vào nhóm nào — <Link href="/goals" className="text-blue-600 hover:underline">xem danh sách mục tiêu</Link> để gán nhóm.</p>
        )}
      </main>
    </div>
  );
}
