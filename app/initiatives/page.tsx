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
import { Rocket, Plus, Search, Trash2, Target } from 'lucide-react';

type Initiative = {
  id: number; title: string; description: string; status: string; priority: string;
  owner_id: number | null; owner_name: string | null; goal_id: number | null; goal_title: string | null;
  parent_initiative_id: number | null; parent_initiative_title: string | null; level: 1 | 2 | 3;
  output_product: string | null;
  progress_pct: number; start_date: string | null; end_date: string | null;
};
type Goal = { id: number; title: string };

const LEVEL_LABEL: Record<number, string> = { 1: 'Cấp 1', 2: 'Cấp 2', 3: 'Cấp 3' };
type UserOpt = { id: number; username: string; display_name: string };

const INI_STATUS: Record<string, { label: string; color: string }> = {
  proposed:    { label: 'Đề xuất',      color: 'bg-slate-100 text-slate-600' },
  in_progress: { label: 'Đang triển khai', color: 'bg-blue-50 text-blue-700' },
  on_hold:     { label: 'Tạm hoãn',     color: 'bg-amber-50 text-amber-700' },
  completed:   { label: 'Hoàn thành',   color: 'bg-green-50 text-green-700' },
  cancelled:   { label: 'Đã huỷ',       color: 'bg-red-50 text-red-700' },
};
const PRIORITY: Record<string, { label: string; color: string }> = {
  low:    { label: 'Thấp',   color: 'bg-slate-100 text-slate-500' },
  medium: { label: 'Vừa',    color: 'bg-blue-50 text-blue-600' },
  high:   { label: 'Cao',    color: 'bg-red-50 text-red-600' },
};
const STATUS_ORDER = ['proposed', 'in_progress', 'on_hold', 'completed', 'cancelled'];

const EMPTY_FORM = {
  title: '', description: '', goal_id: '', owner_id: '', priority: 'medium', status: 'proposed', start_date: '', end_date: '',
  level: '1', parent_initiative_id: '', output_product: '',
};

function ProgressBar({ pct }: { pct: number }) {
  const clamped = Math.max(0, Math.min(100, Math.round(Number(pct) || 0)));
  return (
    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
      <div className="h-full bg-violet-600 rounded-full transition-all" style={{ width: `${clamped}%` }} />
    </div>
  );
}

function InitiativesPageInner() {
  const searchParams = useSearchParams();
  const presetGoalId = searchParams.get('goal_id');

  const [initiatives, setInitiatives] = useState<Initiative[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [users, setUsers] = useState<UserOpt[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [goalFilter, setGoalFilter] = useState(presetGoalId ?? 'all');

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ ...EMPTY_FORM, goal_id: presetGoalId ?? '' });
  const [saving, setSaving] = useState(false);

  const loadInitiatives = useCallback(() =>
    fetch('/api/initiatives').then(r => r.ok ? r.json() : []).then(data => { setInitiatives(data ?? []); setLoading(false); }), []);

  useEffect(() => {
    loadInitiatives();
    fetch('/api/goals').then(r => r.ok ? r.json() : []).then(setGoals);
    fetch('/api/users').then(r => r.ok ? r.json() : []).then(setUsers);
  }, [loadInitiatives]);

  useEffect(() => {
    if (presetGoalId) { setOpen(true); setForm(f => ({ ...f, goal_id: presetGoalId })); setGoalFilter(presetGoalId); }
  }, [presetGoalId]);

  const filtered = useMemo(() => {
    return initiatives.filter(i => {
      if (goalFilter !== 'all' && String(i.goal_id) !== goalFilter) return false;
      if (search && !i.title.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [initiatives, goalFilter, search]);

  const grouped = useMemo(() => {
    const map: Record<string, Initiative[]> = {};
    for (const s of STATUS_ORDER) map[s] = [];
    for (const i of filtered) (map[i.status] ??= []).push(i);
    return map;
  }, [filtered]);

  const openCreate = () => { setForm({ ...EMPTY_FORM, goal_id: goalFilter !== 'all' ? goalFilter : '' }); setOpen(true); };

  const saveInitiative = async () => {
    if (!form.title.trim()) { toast.error('Tên sáng kiến là bắt buộc'); return; }
    setSaving(true);
    const res = await fetch('/api/initiatives', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        goal_id: form.goal_id ? Number(form.goal_id) : null,
        owner_id: form.owner_id ? Number(form.owner_id) : null,
        level: Number(form.level),
        parent_initiative_id: form.parent_initiative_id ? Number(form.parent_initiative_id) : null,
        output_product: form.level === '3' ? (form.output_product.trim() || null) : null,
      }),
    });
    setSaving(false);
    if (!res.ok) { toast.error((await res.json()).error ?? 'Lỗi khi tạo sáng kiến'); return; }
    toast.success('Đã tạo sáng kiến');
    setOpen(false);
    loadInitiatives();
  };

  const deleteInitiative = async (i: Initiative) => {
    if (!confirm(`Xoá sáng kiến "${i.title}"?`)) return;
    await fetch(`/api/initiatives/${i.id}`, { method: 'DELETE' });
    toast.success('Đã xoá sáng kiến');
    loadInitiatives();
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      <Sidebar />
      <main className="flex-1 p-4 lg:p-6 max-w-6xl mx-auto w-full">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <div className="flex items-center gap-3">
            <div className="bg-violet-100 rounded-xl p-2.5"><Rocket className="h-6 w-6 text-violet-600" /></div>
            <div>
              <h1 className="text-xl font-bold text-slate-800">Sáng kiến</h1>
              <p className="text-sm text-slate-500">Các sáng kiến hiện thực hoá mục tiêu</p>
            </div>
          </div>
          <Button onClick={openCreate} className="gap-1.5 bg-violet-600 hover:bg-violet-700">
            <Plus className="h-4 w-4" /> Sáng kiến mới
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-2 mb-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <Input className="pl-8 h-9" placeholder="Tìm sáng kiến…" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <select
            value={goalFilter} onChange={e => setGoalFilter(e.target.value)}
            className="h-9 text-sm border rounded-md px-2.5 focus:outline-none focus:ring-1 focus:ring-blue-400 bg-white max-w-xs"
          >
            <option value="all">Tất cả mục tiêu</option>
            {goals.map(g => <option key={g.id} value={g.id}>{g.title}</option>)}
          </select>
        </div>

        {loading && <p className="text-center text-sm text-slate-400 py-10">Đang tải…</p>}
        {!loading && filtered.length === 0 && (
          <div className="bg-white rounded-xl border p-10 text-center">
            <Rocket className="h-8 w-8 text-slate-300 mx-auto mb-2" />
            <p className="text-sm text-slate-500 mb-3">{initiatives.length === 0 ? 'Chưa có sáng kiến nào' : 'Không tìm thấy sáng kiến phù hợp'}</p>
            {initiatives.length === 0 && (
              <Button onClick={openCreate} variant="outline" className="gap-1.5"><Plus className="h-4 w-4" /> Tạo sáng kiến đầu tiên</Button>
            )}
          </div>
        )}

        {/* Kanban by status */}
        {!loading && filtered.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-3">
            {STATUS_ORDER.map(status => {
              const items = grouped[status] ?? [];
              const st = INI_STATUS[status];
              return (
                <div key={status} className="bg-slate-50 rounded-xl p-2.5 min-h-[120px]">
                  <div className="flex items-center justify-between px-1.5 mb-2">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{st.label}</span>
                    <span className="text-xs text-slate-400">{items.length}</span>
                  </div>
                  <div className="flex flex-col gap-2">
                    {items.map(i => {
                      const pr = PRIORITY[i.priority] ?? PRIORITY.medium;
                      return (
                        <Link key={i.id} href={`/initiatives/${i.id}`} className="block bg-white rounded-lg border p-3 hover:shadow-sm transition-shadow group relative">
                          <button
                            onClick={e => { e.preventDefault(); deleteInitiative(i); }}
                            className="absolute top-2 right-2 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                          <p className="text-sm font-medium text-slate-800 pr-5 mb-1.5 line-clamp-2">{i.title}</p>
                          {i.goal_title && (
                            <p className="text-[11px] text-slate-400 mb-1.5 flex items-center gap-1 truncate"><Target className="h-3 w-3 shrink-0" /> {i.goal_title}</p>
                          )}
                          {i.output_product && (
                            <p className="text-[11px] text-violet-500 mb-1.5 truncate">Đầu ra: {i.output_product}</p>
                          )}
                          <ProgressBar pct={i.progress_pct} />
                          <div className="flex items-center justify-between mt-1.5">
                            <div className="flex items-center gap-1">
                              <Badge className={`${pr.color} border-0 text-[10px]`}>{pr.label}</Badge>
                              <Badge className="bg-indigo-50 text-indigo-700 border-0 text-[10px]">{LEVEL_LABEL[i.level] ?? 'Cấp 1'}</Badge>
                            </div>
                            {i.owner_name && <span className="text-[11px] text-slate-400 truncate">{i.owner_name}</span>}
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Create Initiative Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle className="flex items-center gap-2"><Rocket className="h-4 w-4 text-violet-600" /> Sáng kiến mới</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label>Tên sáng kiến <span className="text-red-500">*</span></Label>
              <Input className="mt-1.5" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                placeholder="VD: Ra mắt chương trình khách hàng thân thiết" autoFocus />
            </div>
            <div>
              <Label>Mô tả</Label>
              <Textarea className="mt-1.5" rows={2} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Cấp sáng kiến</Label>
                <select
                  className="mt-1.5 w-full h-9 text-sm border rounded-md px-2 focus:outline-none focus:ring-1 focus:ring-blue-400"
                  value={form.level} onChange={e => setForm(f => ({ ...f, level: e.target.value, parent_initiative_id: '' }))}
                >
                  <option value="1">Cấp 1</option>
                  <option value="2">Cấp 2</option>
                  <option value="3">Cấp 3</option>
                </select>
              </div>
              <div>
                <Label>Sáng kiến cha</Label>
                <select
                  className="mt-1.5 w-full h-9 text-sm border rounded-md px-2 focus:outline-none focus:ring-1 focus:ring-blue-400"
                  value={form.parent_initiative_id} onChange={e => setForm(f => ({ ...f, parent_initiative_id: e.target.value }))}
                  disabled={form.level === '1'}
                >
                  <option value="">— Không có —</option>
                  {initiatives.filter(i => i.level === Number(form.level) - 1).map(i => <option key={i.id} value={i.id}>{i.title}</option>)}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Mục tiêu liên kết</Label>
                <select
                  className="mt-1.5 w-full h-9 text-sm border rounded-md px-2 focus:outline-none focus:ring-1 focus:ring-blue-400"
                  value={form.goal_id} onChange={e => setForm(f => ({ ...f, goal_id: e.target.value }))}
                >
                  <option value="">— Không liên kết —</option>
                  {goals.map(g => <option key={g.id} value={g.id}>{g.title}</option>)}
                </select>
              </div>
              <div>
                <Label>Người phụ trách</Label>
                <select
                  className="mt-1.5 w-full h-9 text-sm border rounded-md px-2 focus:outline-none focus:ring-1 focus:ring-blue-400"
                  value={form.owner_id} onChange={e => setForm(f => ({ ...f, owner_id: e.target.value }))}
                >
                  <option value="">— Chưa gán —</option>
                  {users.map(u => <option key={u.id} value={u.id}>{u.display_name || u.username}</option>)}
                </select>
              </div>
            </div>
            {form.level === '3' && (
              <div>
                <Label>Sản phẩm đầu ra</Label>
                <Input
                  className="mt-1.5" maxLength={255} value={form.output_product}
                  onChange={e => setForm(f => ({ ...f, output_product: e.target.value }))}
                  placeholder="Deliverable/output của sáng kiến cấp 3 này (tối đa 255 ký tự)"
                />
              </div>
            )}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Mức ưu tiên</Label>
                <select
                  className="mt-1.5 w-full h-9 text-sm border rounded-md px-2 focus:outline-none focus:ring-1 focus:ring-blue-400"
                  value={form.priority} onChange={e => setForm(f => ({ ...f, priority: e.target.value }))}
                >
                  {Object.entries(PRIORITY).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                </select>
              </div>
              <div>
                <Label>Trạng thái</Label>
                <select
                  className="mt-1.5 w-full h-9 text-sm border rounded-md px-2 focus:outline-none focus:ring-1 focus:ring-blue-400"
                  value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
                >
                  {STATUS_ORDER.map(k => <option key={k} value={k}>{INI_STATUS[k].label}</option>)}
                </select>
              </div>
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
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Huỷ</Button>
            <Button onClick={saveInitiative} disabled={saving} className="bg-violet-600 hover:bg-violet-700">
              {saving ? 'Đang lưu…' : 'Tạo sáng kiến'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function InitiativesPage() {
  return (
    <Suspense fallback={null}>
      <InitiativesPageInner />
    </Suspense>
  );
}
