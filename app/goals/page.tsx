'use client';
import { useEffect, useState, useCallback, useMemo, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import Sidebar from '@/components/layout/Sidebar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Target, Plus, Search, Trash2, Layers } from 'lucide-react';

type Goal = {
  id: number; title: string; description: string; period_label: string; status: string;
  owner_id: number | null; owner_name: string | null; squad_id: number | null; squad_name: string | null;
  start_date: string | null; end_date: string | null;
  kr_progress: number; kr_count: number; initiative_count: number;
};
type UserOpt = { id: number; username: string; display_name: string };
type Squad = { id: number; name: string };

const GOAL_STATUS: Record<string, { label: string; color: string }> = {
  not_started: { label: 'Chưa bắt đầu', color: 'bg-slate-100 text-slate-600' },
  on_track:    { label: 'Đúng tiến độ',  color: 'bg-green-50 text-green-700' },
  at_risk:     { label: 'Có rủi ro',     color: 'bg-amber-50 text-amber-700' },
  off_track:   { label: 'Trễ tiến độ',   color: 'bg-red-50 text-red-700' },
  completed:   { label: 'Hoàn thành',    color: 'bg-blue-50 text-blue-700' },
};

const EMPTY_FORM = {
  title: '', description: '', period_label: '', owner_id: '', squad_id: '', start_date: '', end_date: '',
  key_results: [{ title: '', unit: '', start_value: 0, target_value: 100 }] as { title: string; unit: string; start_value: number; target_value: number }[],
};

function ProgressBar({ pct }: { pct: number }) {
  const clamped = Math.max(0, Math.min(100, Math.round(Number(pct) || 0)));
  return (
    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
      <div className="h-full bg-blue-600 rounded-full transition-all" style={{ width: `${clamped}%` }} />
    </div>
  );
}

function GoalsPageInner() {
  const searchParams = useSearchParams();
  const presetSquadId = searchParams.get('squad_id');

  const [goals, setGoals] = useState<Goal[]>([]);
  const [users, setUsers] = useState<UserOpt[]>([]);
  const [squads, setSquads] = useState<Squad[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [squadFilter, setSquadFilter] = useState(presetSquadId ?? 'all');

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ ...EMPTY_FORM, squad_id: presetSquadId ?? '' });
  const [saving, setSaving] = useState(false);

  const loadGoals = useCallback(() =>
    fetch('/api/goals').then(r => r.ok ? r.json() : []).then(data => { setGoals(data ?? []); setLoading(false); }), []);

  useEffect(() => {
    loadGoals();
    fetch('/api/users').then(r => r.ok ? r.json() : []).then(setUsers);
    fetch('/api/squads').then(r => r.ok ? r.json() : []).then(setSquads);
  }, [loadGoals]);

  useEffect(() => {
    if (presetSquadId) { setOpen(true); setForm(f => ({ ...f, squad_id: presetSquadId })); setSquadFilter(presetSquadId); }
  }, [presetSquadId]);

  const filtered = useMemo(() => {
    return goals.filter(g => {
      if (statusFilter !== 'all' && g.status !== statusFilter) return false;
      if (squadFilter !== 'all' && String(g.squad_id) !== squadFilter) return false;
      if (search && !g.title.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [goals, statusFilter, squadFilter, search]);

  const openCreate = () => { setForm({ ...EMPTY_FORM, squad_id: squadFilter !== 'all' ? squadFilter : '' }); setOpen(true); };

  const addKr = () => setForm(f => ({ ...f, key_results: [...f.key_results, { title: '', unit: '', start_value: 0, target_value: 100 }] }));
  const removeKr = (i: number) => setForm(f => ({ ...f, key_results: f.key_results.filter((_, idx) => idx !== i) }));
  const updateKr = (i: number, patch: Partial<{ title: string; unit: string; start_value: number; target_value: number }>) =>
    setForm(f => ({ ...f, key_results: f.key_results.map((kr, idx) => idx === i ? { ...kr, ...patch } : kr) }));

  const saveGoal = async () => {
    if (!form.title.trim()) { toast.error('Tên mục tiêu là bắt buộc'); return; }
    setSaving(true);
    const res = await fetch('/api/goals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        owner_id: form.owner_id ? Number(form.owner_id) : null,
        squad_id: form.squad_id ? Number(form.squad_id) : null,
        key_results: form.key_results.filter(kr => kr.title.trim()),
      }),
    });
    setSaving(false);
    if (!res.ok) { toast.error((await res.json()).error ?? 'Lỗi khi tạo mục tiêu'); return; }
    toast.success('Đã tạo mục tiêu');
    setOpen(false);
    loadGoals();
  };

  const deleteGoal = async (g: Goal) => {
    if (!confirm(`Xoá mục tiêu "${g.title}"? Các sáng kiến liên kết sẽ được gỡ liên kết.`)) return;
    await fetch(`/api/goals/${g.id}`, { method: 'DELETE' });
    toast.success('Đã xoá mục tiêu');
    loadGoals();
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      <Sidebar />
      <main className="flex-1 p-4 lg:p-6 max-w-6xl mx-auto w-full">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 rounded-xl p-2.5"><Target className="h-6 w-6 text-blue-600" /></div>
            <div>
              <h1 className="text-xl font-bold text-slate-800">Mục tiêu</h1>
              <p className="text-sm text-slate-500">Quản lý các mục tiêu và kết quả then chốt (OKR)</p>
            </div>
          </div>
          <Button onClick={openCreate} className="gap-1.5 bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4" /> Mục tiêu mới
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-2 mb-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <Input className="pl-8 h-9" placeholder="Tìm mục tiêu…" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <select
            value={squadFilter}
            onChange={e => setSquadFilter(e.target.value)}
            className="h-9 text-sm border rounded-md px-2.5 focus:outline-none focus:ring-1 focus:ring-blue-400 bg-white"
          >
            <option value="all">Tất cả nhóm</option>
            {squads.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="h-9 text-sm border rounded-md px-2.5 focus:outline-none focus:ring-1 focus:ring-blue-400 bg-white"
          >
            <option value="all">Tất cả trạng thái</option>
            {Object.entries(GOAL_STATUS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
          </select>
        </div>

        {/* Goal list */}
        <div className="grid gap-3">
          {loading && <p className="text-center text-sm text-slate-400 py-10">Đang tải…</p>}
          {!loading && filtered.length === 0 && (
            <div className="bg-white rounded-xl border p-10 text-center">
              <Target className="h-8 w-8 text-slate-300 mx-auto mb-2" />
              <p className="text-sm text-slate-500 mb-3">{goals.length === 0 ? 'Chưa có mục tiêu nào' : 'Không tìm thấy mục tiêu phù hợp'}</p>
              {goals.length === 0 && (
                <Button onClick={openCreate} variant="outline" className="gap-1.5"><Plus className="h-4 w-4" /> Tạo mục tiêu đầu tiên</Button>
              )}
            </div>
          )}
          {filtered.map(g => {
            const st = GOAL_STATUS[g.status] ?? GOAL_STATUS.not_started;
            return (
              <div key={g.id} className="bg-white rounded-xl border shadow-sm p-4 hover:shadow transition-shadow group">
                <div className="flex items-start justify-between gap-3">
                  <Link href={`/goals/${g.id}`} className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1.5">
                      <h3 className="font-semibold text-slate-800 hover:text-blue-600 transition-colors">{g.title}</h3>
                      <Badge className={`${st.color} border-0`}>{st.label}</Badge>
                      {g.squad_name && <Badge className="bg-emerald-50 text-emerald-700 border-0 gap-1"><Layers className="h-3 w-3" />{g.squad_name}</Badge>}
                      {g.period_label && <span className="text-xs text-slate-400">{g.period_label}</span>}
                    </div>
                    {g.description && <p className="text-sm text-slate-500 mb-2 line-clamp-1">{g.description}</p>}
                    <div className="max-w-sm mb-1.5">
                      <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                        <span>Tiến độ kết quả then chốt</span>
                        <span className="font-medium">{Math.round(Number(g.kr_progress) || 0)}%</span>
                      </div>
                      <ProgressBar pct={g.kr_progress} />
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-400">
                      {g.owner_name && <span>Chủ trì: {g.owner_name}</span>}
                      <span>· {g.kr_count} kết quả then chốt</span>
                      <span>· {g.initiative_count} sáng kiến</span>
                    </div>
                  </Link>
                  <button
                    onClick={() => deleteGoal(g)}
                    className="text-slate-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 shrink-0"
                    title="Xoá"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* ── Create Goal Dialog ── */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><Target className="h-4 w-4 text-blue-600" /> Mục tiêu mới</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label>Tên mục tiêu <span className="text-red-500">*</span></Label>
              <Input className="mt-1.5" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                placeholder="VD: Tăng trưởng doanh thu quý 1" autoFocus />
            </div>
            <div>
              <Label>Mô tả</Label>
              <Textarea className="mt-1.5" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                placeholder="Bối cảnh, phạm vi, lý do thực hiện…" rows={2} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Giai đoạn</Label>
                <Input className="mt-1.5" value={form.period_label} onChange={e => setForm(f => ({ ...f, period_label: e.target.value }))}
                  placeholder="VD: Q1 2026" />
              </div>
              <div>
                <Label>Nhóm (Squad)</Label>
                <select
                  className="mt-1.5 w-full h-9 text-sm border rounded-md px-2 focus:outline-none focus:ring-1 focus:ring-blue-400"
                  value={form.squad_id}
                  onChange={e => setForm(f => ({ ...f, squad_id: e.target.value }))}
                >
                  <option value="">— Không thuộc nhóm —</option>
                  {squads.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
            </div>
            <div>
              <Label>Người chủ trì</Label>
              <select
                className="mt-1.5 w-full h-9 text-sm border rounded-md px-2 focus:outline-none focus:ring-1 focus:ring-blue-400"
                value={form.owner_id}
                onChange={e => setForm(f => ({ ...f, owner_id: e.target.value }))}
              >
                <option value="">— Chưa gán —</option>
                {users.map(u => <option key={u.id} value={u.id}>{u.display_name || u.username}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Ngày bắt đầu</Label>
                <Input className="mt-1.5" type="date" value={form.start_date} onChange={e => setForm(f => ({ ...f, start_date: e.target.value }))} />
              </div>
              <div>
                <Label>Ngày kết thúc</Label>
                <Input className="mt-1.5" type="date" value={form.end_date} onChange={e => setForm(f => ({ ...f, end_date: e.target.value }))} />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <Label>Kết quả then chốt (Key Results)</Label>
                <button type="button" onClick={addKr} className="text-xs text-blue-600 hover:underline flex items-center gap-1">
                  <Plus className="h-3 w-3" /> Thêm
                </button>
              </div>
              <div className="space-y-2">
                {form.key_results.map((kr, i) => (
                  <div key={i} className="flex gap-2 items-start">
                    <Input
                      className="flex-1 h-9 text-sm"
                      placeholder={`Kết quả then chốt ${i + 1}`}
                      value={kr.title}
                      onChange={e => updateKr(i, { title: e.target.value })}
                    />
                    <Input
                      className="w-20 h-9 text-sm" type="number" placeholder="Từ"
                      value={kr.start_value} onChange={e => updateKr(i, { start_value: Number(e.target.value) })}
                    />
                    <Input
                      className="w-20 h-9 text-sm" type="number" placeholder="Đến"
                      value={kr.target_value} onChange={e => updateKr(i, { target_value: Number(e.target.value) })}
                    />
                    <Input
                      className="w-16 h-9 text-sm" placeholder="Đơn vị"
                      value={kr.unit} onChange={e => updateKr(i, { unit: e.target.value })}
                    />
                    {form.key_results.length > 1 && (
                      <button type="button" onClick={() => removeKr(i)} className="text-slate-300 hover:text-red-500 mt-2">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Huỷ</Button>
            <Button onClick={saveGoal} disabled={saving} className="bg-blue-600 hover:bg-blue-700">
              {saving ? 'Đang lưu…' : 'Tạo mục tiêu'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function GoalsPage() {
  return (
    <Suspense fallback={null}>
      <GoalsPageInner />
    </Suspense>
  );
}
