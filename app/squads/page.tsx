'use client';
import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import Sidebar from '@/components/layout/Sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Layers, Plus, Target, Rocket, Trash2 } from 'lucide-react';

type Squad = {
  id: number; name: string; description: string; lead_id: number | null; lead_name: string | null;
  goal_count: number; on_track_count: number; at_risk_count: number; completed_count: number;
  avg_kr_progress: number; initiative_count: number;
};
type UserOpt = { id: number; username: string; display_name: string };

const EMPTY_FORM = { name: '', description: '', lead_id: '' };

function ProgressBar({ pct }: { pct: number }) {
  const clamped = Math.max(0, Math.min(100, Math.round(Number(pct) || 0)));
  return (
    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
      <div className="h-full bg-emerald-600 rounded-full transition-all" style={{ width: `${clamped}%` }} />
    </div>
  );
}

export default function SquadsPage() {
  const [squads, setSquads] = useState<Squad[]>([]);
  const [users, setUsers] = useState<UserOpt[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const load = useCallback(() =>
    fetch('/api/squads').then(r => r.ok ? r.json() : []).then(data => { setSquads(data ?? []); setLoading(false); }), []);

  useEffect(() => {
    load();
    fetch('/api/users').then(r => r.ok ? r.json() : []).then(setUsers);
  }, [load]);

  const openCreate = () => { setForm(EMPTY_FORM); setOpen(true); };

  const saveSquad = async () => {
    if (!form.name.trim()) { toast.error('Tên nhóm là bắt buộc'); return; }
    setSaving(true);
    const res = await fetch('/api/squads', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, lead_id: form.lead_id ? Number(form.lead_id) : null }),
    });
    setSaving(false);
    if (!res.ok) { toast.error((await res.json()).error ?? 'Lỗi khi tạo nhóm'); return; }
    toast.success('Đã tạo nhóm');
    setOpen(false);
    load();
  };

  const deleteSquad = async (s: Squad) => {
    if (!confirm(`Xoá nhóm "${s.name}"? Các mục tiêu thuộc nhóm sẽ được gỡ liên kết.`)) return;
    await fetch(`/api/squads/${s.id}`, { method: 'DELETE' });
    toast.success('Đã xoá nhóm');
    load();
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      <Sidebar />
      <main className="flex-1 p-4 lg:p-6 max-w-6xl mx-auto w-full">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-100 rounded-xl p-2.5"><Layers className="h-6 w-6 text-emerald-600" /></div>
            <div>
              <h1 className="text-xl font-bold text-slate-800">Nhóm (Squad)</h1>
              <p className="text-sm text-slate-500">Nhóm mục tiêu theo đội thực thi để theo dõi tổng hợp</p>
            </div>
          </div>
          <Button onClick={openCreate} className="gap-1.5 bg-emerald-600 hover:bg-emerald-700">
            <Plus className="h-4 w-4" /> Nhóm mới
          </Button>
        </div>

        <div className="grid gap-3">
          {loading && <p className="text-center text-sm text-slate-400 py-10">Đang tải…</p>}
          {!loading && squads.length === 0 && (
            <div className="bg-white rounded-xl border p-10 text-center">
              <Layers className="h-8 w-8 text-slate-300 mx-auto mb-2" />
              <p className="text-sm text-slate-500 mb-3">Chưa có nhóm nào</p>
              <Button onClick={openCreate} variant="outline" className="gap-1.5"><Plus className="h-4 w-4" /> Tạo nhóm đầu tiên</Button>
            </div>
          )}
          {squads.map(s => (
            <div key={s.id} className="bg-white rounded-xl border shadow-sm p-4 hover:shadow transition-shadow group">
              <div className="flex items-start justify-between gap-3">
                <Link href={`/squads/${s.id}`} className="flex-1 min-w-0">
                  <h3 className="font-semibold text-slate-800 hover:text-emerald-600 transition-colors mb-1.5">{s.name}</h3>
                  {s.description && <p className="text-sm text-slate-500 mb-2 line-clamp-1">{s.description}</p>}
                  <div className="max-w-sm mb-2">
                    <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                      <span>Tiến độ trung bình</span>
                      <span className="font-medium">{Math.round(Number(s.avg_kr_progress) || 0)}%</span>
                    </div>
                    <ProgressBar pct={s.avg_kr_progress} />
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-400 flex-wrap">
                    {s.lead_name && <span>Trưởng nhóm: {s.lead_name}</span>}
                    <span className="flex items-center gap-1"><Target className="h-3 w-3" /> {s.goal_count} mục tiêu</span>
                    <span className="flex items-center gap-1"><Rocket className="h-3 w-3" /> {s.initiative_count} sáng kiến</span>
                    <span className="text-green-600">{s.on_track_count} đúng tiến độ</span>
                    {s.at_risk_count > 0 && <span className="text-amber-600">{s.at_risk_count} có rủi ro</span>}
                  </div>
                </Link>
                <button
                  onClick={() => deleteSquad(s)}
                  className="text-slate-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 shrink-0"
                  title="Xoá"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle className="flex items-center gap-2"><Layers className="h-4 w-4 text-emerald-600" /> Nhóm mới</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label>Tên nhóm <span className="text-red-500">*</span></Label>
              <Input className="mt-1.5" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                placeholder="VD: Squad Tăng trưởng" autoFocus />
            </div>
            <div>
              <Label>Mô tả</Label>
              <Textarea className="mt-1.5" rows={2} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                placeholder="Phạm vi phụ trách, sản phẩm/thị trường liên quan…" />
            </div>
            <div>
              <Label>Trưởng nhóm</Label>
              <select
                className="mt-1.5 w-full h-9 text-sm border rounded-md px-2 focus:outline-none focus:ring-1 focus:ring-blue-400"
                value={form.lead_id} onChange={e => setForm(f => ({ ...f, lead_id: e.target.value }))}
              >
                <option value="">— Chưa gán —</option>
                {users.map(u => <option key={u.id} value={u.id}>{u.display_name || u.username}</option>)}
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Huỷ</Button>
            <Button onClick={saveSquad} disabled={saving} className="bg-emerald-600 hover:bg-emerald-700">
              {saving ? 'Đang lưu…' : 'Tạo nhóm'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
