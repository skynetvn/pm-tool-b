'use client';
import { useEffect, useState, useCallback, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/layout/Sidebar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { ArrowLeft, Layers, Trash2, Target, Pencil, Plus } from 'lucide-react';

type GoalLite = {
  id: number; title: string; status: string; period_label: string; owner_name: string | null;
  kr_progress: number; kr_count: number; initiative_count: number;
};
type SquadDetail = {
  id: number; name: string; description: string; lead_id: number | null; lead_name: string | null; goals: GoalLite[];
};
type UserOpt = { id: number; username: string; display_name: string };

const GOAL_STATUS: Record<string, { label: string; color: string }> = {
  not_started: { label: 'Chưa bắt đầu', color: 'bg-slate-100 text-slate-600' },
  on_track:    { label: 'Đúng tiến độ',  color: 'bg-green-50 text-green-700' },
  at_risk:     { label: 'Có rủi ro',     color: 'bg-amber-50 text-amber-700' },
  off_track:   { label: 'Trễ tiến độ',   color: 'bg-red-50 text-red-700' },
  completed:   { label: 'Hoàn thành',    color: 'bg-blue-50 text-blue-700' },
};

function ProgressBar({ pct, color = 'bg-emerald-600' }: { pct: number; color?: string }) {
  const clamped = Math.max(0, Math.min(100, Math.round(Number(pct) || 0)));
  return (
    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
      <div className={`h-full ${color} rounded-full transition-all`} style={{ width: `${clamped}%` }} />
    </div>
  );
}

export default function SquadDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [squad, setSquad] = useState<SquadDetail | null>(null);
  const [users, setUsers] = useState<UserOpt[]>([]);
  const [loading, setLoading] = useState(true);

  const [editOpen, setEditOpen] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', description: '', lead_id: '' });

  const load = useCallback(() => {
    fetch(`/api/squads/${id}`).then(r => r.ok ? r.json() : null).then(data => { setSquad(data); setLoading(false); });
  }, [id]);

  useEffect(() => {
    load();
    fetch('/api/users').then(r => r.ok ? r.json() : []).then(setUsers);
  }, [load]);

  const openEdit = () => {
    if (!squad) return;
    setEditForm({ name: squad.name, description: squad.description ?? '', lead_id: squad.lead_id ? String(squad.lead_id) : '' });
    setEditOpen(true);
  };

  const saveEdit = async () => {
    const res = await fetch(`/api/squads/${id}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...editForm, lead_id: editForm.lead_id ? Number(editForm.lead_id) : null }),
    });
    if (!res.ok) { toast.error('Lỗi khi cập nhật nhóm'); return; }
    toast.success('Đã cập nhật nhóm');
    setEditOpen(false);
    load();
  };

  const deleteSquad = async () => {
    if (!squad || !confirm(`Xoá nhóm "${squad.name}"? Các mục tiêu thuộc nhóm sẽ được gỡ liên kết.`)) return;
    await fetch(`/api/squads/${id}`, { method: 'DELETE' });
    toast.success('Đã xoá nhóm');
    router.push('/squads');
  };

  if (loading) {
    return (
      <div className="flex flex-col lg:flex-row min-h-screen">
        <Sidebar />
        <main className="flex-1 p-6 text-center text-sm text-slate-400">Đang tải…</main>
      </div>
    );
  }
  if (!squad) {
    return (
      <div className="flex flex-col lg:flex-row min-h-screen">
        <Sidebar />
        <main className="flex-1 p-6 text-center text-sm text-slate-400">Không tìm thấy nhóm</main>
      </div>
    );
  }

  const avgProgress = squad.goals.length
    ? Math.round(squad.goals.reduce((s, g) => s + Number(g.kr_progress || 0), 0) / squad.goals.length)
    : 0;

  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      <Sidebar />
      <main className="flex-1 p-4 lg:p-6 max-w-4xl mx-auto w-full">
        <Link href="/squads" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 mb-4">
          <ArrowLeft className="h-3.5 w-3.5" /> Quay lại danh sách nhóm
        </Link>

        <div className="bg-white rounded-xl border shadow-sm p-5 mb-5">
          <div className="flex items-start justify-between gap-3 mb-2">
            <h1 className="text-lg font-bold text-slate-800">{squad.name}</h1>
            <div className="flex gap-2 shrink-0">
              <Button variant="outline" size="sm" onClick={openEdit} className="gap-1.5"><Pencil className="h-3.5 w-3.5" /> Sửa</Button>
              <Button variant="outline" size="sm" onClick={deleteSquad} className="text-red-500 hover:text-red-600"><Trash2 className="h-3.5 w-3.5" /></Button>
            </div>
          </div>
          {squad.description && <p className="text-sm text-slate-600 mb-3">{squad.description}</p>}
          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mb-3">
            {squad.lead_name && <span>Trưởng nhóm: {squad.lead_name}</span>}
            <span>· {squad.goals.length} mục tiêu</span>
          </div>
          <div className="max-w-md">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
              <span>Tiến độ trung bình của nhóm</span>
              <span className="font-medium">{avgProgress}%</span>
            </div>
            <ProgressBar pct={avgProgress} />
          </div>
        </div>

        <div className="bg-white rounded-xl border shadow-sm">
          <div className="flex items-center justify-between px-5 py-3 border-b">
            <h2 className="font-semibold text-slate-700 flex items-center gap-2"><Target className="h-4 w-4 text-blue-600" /> Mục tiêu trong nhóm</h2>
            <Link href={`/goals?squad_id=${id}`} className="text-xs text-blue-600 hover:underline flex items-center gap-1"><Plus className="h-3.5 w-3.5" /> Thêm mục tiêu</Link>
          </div>
          <div className="divide-y">
            {squad.goals.length === 0 && <p className="px-5 py-6 text-center text-sm text-slate-400">Chưa có mục tiêu nào trong nhóm này</p>}
            {squad.goals.map(g => {
              const st = GOAL_STATUS[g.status] ?? GOAL_STATUS.not_started;
              return (
                <Link key={g.id} href={`/goals/${g.id}`} className="block px-5 py-3 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <p className="text-sm font-medium text-slate-800 truncate">{g.title}</p>
                    <Badge className={`${st.color} border-0 shrink-0`}>{st.label}</Badge>
                  </div>
                  <ProgressBar pct={g.kr_progress} color="bg-blue-600" />
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
      </main>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Sửa nhóm</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label>Tên nhóm</Label>
              <Input className="mt-1.5" value={editForm.name} onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))} />
            </div>
            <div>
              <Label>Mô tả</Label>
              <Textarea className="mt-1.5" rows={2} value={editForm.description} onChange={e => setEditForm(f => ({ ...f, description: e.target.value }))} />
            </div>
            <div>
              <Label>Trưởng nhóm</Label>
              <select
                className="mt-1.5 w-full h-9 text-sm border rounded-md px-2 focus:outline-none focus:ring-1 focus:ring-blue-400"
                value={editForm.lead_id} onChange={e => setEditForm(f => ({ ...f, lead_id: e.target.value }))}
              >
                <option value="">— Chưa gán —</option>
                {users.map(u => <option key={u.id} value={u.id}>{u.display_name || u.username}</option>)}
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)}>Huỷ</Button>
            <Button onClick={saveEdit} className="bg-emerald-600 hover:bg-emerald-700">Lưu thay đổi</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
