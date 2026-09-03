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
import { ArrowLeft, Target, Plus, Trash2, Rocket, MessageSquare, Pencil } from 'lucide-react';

type KeyResult = { id: number; title: string; unit: string; start_value: number; target_value: number; current_value: number };
type Checkin = { id: number; note: string; status: string; user_name: string | null; created_at: string };
type InitiativeLite = { id: number; title: string; status: string; progress_pct: number; owner_name: string | null };
type GoalDetail = {
  id: number; title: string; description: string; period_label: string; status: string;
  owner_id: number | null; owner_name: string | null; start_date: string | null; end_date: string | null;
  key_results: KeyResult[]; initiatives: InitiativeLite[]; checkins: Checkin[];
};
type UserOpt = { id: number; username: string; display_name: string };

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

function krProgress(kr: KeyResult) {
  const range = kr.target_value - kr.start_value;
  if (range === 0) return 100;
  return Math.max(0, Math.min(100, ((Number(kr.current_value) - Number(kr.start_value)) / range) * 100));
}

function ProgressBar({ pct, color = 'bg-blue-600' }: { pct: number; color?: string }) {
  const clamped = Math.max(0, Math.min(100, Math.round(Number(pct) || 0)));
  return (
    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
      <div className={`h-full ${color} rounded-full transition-all`} style={{ width: `${clamped}%` }} />
    </div>
  );
}

export default function GoalDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [goal, setGoal] = useState<GoalDetail | null>(null);
  const [users, setUsers] = useState<UserOpt[]>([]);
  const [loading, setLoading] = useState(true);

  const [editOpen, setEditOpen] = useState(false);
  const [editForm, setEditForm] = useState({ title: '', description: '', period_label: '', owner_id: '', start_date: '', end_date: '', status: 'not_started' });

  const [krOpen, setKrOpen] = useState(false);
  const [krForm, setKrForm] = useState({ title: '', unit: '', start_value: 0, target_value: 100 });

  const [checkinNote, setCheckinNote] = useState('');
  const [checkinStatus, setCheckinStatus] = useState('on_track');

  const load = useCallback(() => {
    fetch(`/api/goals/${id}`).then(r => r.ok ? r.json() : null).then(data => { setGoal(data); setLoading(false); });
  }, [id]);

  useEffect(() => {
    load();
    fetch('/api/users').then(r => r.ok ? r.json() : []).then(setUsers);
  }, [load]);

  const openEdit = () => {
    if (!goal) return;
    setEditForm({
      title: goal.title, description: goal.description ?? '', period_label: goal.period_label ?? '',
      owner_id: goal.owner_id ? String(goal.owner_id) : '', start_date: goal.start_date ?? '', end_date: goal.end_date ?? '',
      status: goal.status,
    });
    setEditOpen(true);
  };

  const saveEdit = async () => {
    const res = await fetch(`/api/goals/${id}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...editForm, owner_id: editForm.owner_id ? Number(editForm.owner_id) : null }),
    });
    if (!res.ok) { toast.error('Lỗi khi cập nhật mục tiêu'); return; }
    toast.success('Đã cập nhật mục tiêu');
    setEditOpen(false);
    load();
  };

  const deleteGoal = async () => {
    if (!goal || !confirm(`Xoá mục tiêu "${goal.title}"?`)) return;
    await fetch(`/api/goals/${id}`, { method: 'DELETE' });
    toast.success('Đã xoá mục tiêu');
    router.push('/goals');
  };

  const addKr = async () => {
    if (!krForm.title.trim()) { toast.error('Tên kết quả then chốt là bắt buộc'); return; }
    const res = await fetch(`/api/goals/${id}/key-results`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(krForm),
    });
    if (!res.ok) { toast.error('Lỗi khi thêm kết quả then chốt'); return; }
    setKrOpen(false);
    setKrForm({ title: '', unit: '', start_value: 0, target_value: 100 });
    load();
  };

  const updateKrValue = async (krId: number, value: number) => {
    await fetch(`/api/key-results/${krId}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ current_value: value }),
    });
    load();
  };

  const deleteKr = async (krId: number) => {
    if (!confirm('Xoá kết quả then chốt này?')) return;
    await fetch(`/api/key-results/${krId}`, { method: 'DELETE' });
    load();
  };

  const submitCheckin = async () => {
    if (!checkinNote.trim()) { toast.error('Nhập nội dung cập nhật'); return; }
    const res = await fetch(`/api/goals/${id}/checkins`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ note: checkinNote, status: checkinStatus }),
    });
    if (!res.ok) { toast.error('Lỗi khi gửi cập nhật'); return; }
    setCheckinNote('');
    toast.success('Đã ghi nhận cập nhật');
    load();
  };

  if (loading) {
    return (
      <div className="flex flex-col lg:flex-row min-h-screen">
        <Sidebar />
        <main className="flex-1 p-6 text-center text-sm text-slate-400">Đang tải…</main>
      </div>
    );
  }
  if (!goal) {
    return (
      <div className="flex flex-col lg:flex-row min-h-screen">
        <Sidebar />
        <main className="flex-1 p-6 text-center text-sm text-slate-400">Không tìm thấy mục tiêu</main>
      </div>
    );
  }

  const st = GOAL_STATUS[goal.status] ?? GOAL_STATUS.not_started;
  const overallProgress = goal.key_results.length
    ? Math.round(goal.key_results.reduce((s, kr) => s + krProgress(kr), 0) / goal.key_results.length)
    : 0;

  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      <Sidebar />
      <main className="flex-1 p-4 lg:p-6 max-w-4xl mx-auto w-full">
        <Link href="/goals" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 mb-4">
          <ArrowLeft className="h-3.5 w-3.5" /> Quay lại danh sách mục tiêu
        </Link>

        {/* Header */}
        <div className="bg-white rounded-xl border shadow-sm p-5 mb-5">
          <div className="flex items-start justify-between gap-3 mb-2">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-lg font-bold text-slate-800">{goal.title}</h1>
              <Badge className={`${st.color} border-0`}>{st.label}</Badge>
            </div>
            <div className="flex gap-2 shrink-0">
              <Button variant="outline" size="sm" onClick={openEdit} className="gap-1.5"><Pencil className="h-3.5 w-3.5" /> Sửa</Button>
              <Button variant="outline" size="sm" onClick={deleteGoal} className="text-red-500 hover:text-red-600"><Trash2 className="h-3.5 w-3.5" /></Button>
            </div>
          </div>
          {goal.description && <p className="text-sm text-slate-600 mb-3">{goal.description}</p>}
          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mb-3">
            {goal.period_label && <span>Giai đoạn: {goal.period_label}</span>}
            {goal.owner_name && <span>· Chủ trì: {goal.owner_name}</span>}
            {goal.start_date && <span>· {goal.start_date} → {goal.end_date || '—'}</span>}
          </div>
          <div className="max-w-md">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
              <span>Tiến độ tổng thể</span>
              <span className="font-medium">{overallProgress}%</span>
            </div>
            <ProgressBar pct={overallProgress} />
          </div>
        </div>

        {/* Key Results */}
        <div className="bg-white rounded-xl border shadow-sm mb-5">
          <div className="flex items-center justify-between px-5 py-3 border-b">
            <h2 className="font-semibold text-slate-700">Kết quả then chốt (Key Results)</h2>
            <Button size="sm" variant="outline" onClick={() => setKrOpen(true)} className="gap-1.5 h-8 text-xs"><Plus className="h-3.5 w-3.5" /> Thêm</Button>
          </div>
          <div className="divide-y">
            {goal.key_results.length === 0 && <p className="px-5 py-6 text-center text-sm text-slate-400">Chưa có kết quả then chốt nào</p>}
            {goal.key_results.map(kr => {
              const pct = krProgress(kr);
              return (
                <div key={kr.id} className="px-5 py-3 group">
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <p className="text-sm font-medium text-slate-800">{kr.title}</p>
                    <button onClick={() => deleteKr(kr.id)} className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1"><ProgressBar pct={pct} /></div>
                    <span className="text-xs text-slate-500 w-14 text-right">{Math.round(pct)}%</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="text-xs text-slate-400">{kr.start_value}{kr.unit}</span>
                    <input
                      type="range" min={Math.min(kr.start_value, kr.target_value)} max={Math.max(kr.start_value, kr.target_value)}
                      value={kr.current_value} step="any"
                      onChange={e => updateKrValue(kr.id, Number(e.target.value))}
                      className="flex-1 accent-blue-600"
                    />
                    <span className="text-xs text-slate-400">{kr.target_value}{kr.unit}</span>
                    <span className="text-xs font-medium text-slate-600 w-16 text-right">{kr.current_value}{kr.unit}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Linked initiatives */}
        <div className="bg-white rounded-xl border shadow-sm mb-5">
          <div className="flex items-center justify-between px-5 py-3 border-b">
            <h2 className="font-semibold text-slate-700 flex items-center gap-2"><Rocket className="h-4 w-4 text-violet-600" /> Sáng kiến liên kết</h2>
            <Link href={`/initiatives?goal_id=${id}`} className="text-xs text-blue-600 hover:underline flex items-center gap-1"><Plus className="h-3.5 w-3.5" /> Thêm sáng kiến</Link>
          </div>
          <div className="divide-y">
            {goal.initiatives.length === 0 && <p className="px-5 py-6 text-center text-sm text-slate-400">Chưa có sáng kiến nào liên kết với mục tiêu này</p>}
            {goal.initiatives.map(ini => {
              const ist = INI_STATUS[ini.status] ?? INI_STATUS.proposed;
              return (
                <Link key={ini.id} href={`/initiatives/${ini.id}`} className="flex items-center justify-between gap-3 px-5 py-3 hover:bg-slate-50 transition-colors">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-800 truncate">{ini.title}</p>
                    <p className="text-xs text-slate-400">{ini.owner_name ?? 'Chưa gán'}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Badge className={`${ist.color} border-0`}>{ist.label}</Badge>
                    <span className="text-xs text-slate-500 w-10 text-right">{ini.progress_pct}%</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Check-ins */}
        <div className="bg-white rounded-xl border shadow-sm">
          <div className="px-5 py-3 border-b">
            <h2 className="font-semibold text-slate-700 flex items-center gap-2"><MessageSquare className="h-4 w-4 text-slate-500" /> Cập nhật tiến độ</h2>
          </div>
          <div className="px-5 py-4 border-b bg-slate-50/50">
            <Textarea
              value={checkinNote} onChange={e => setCheckinNote(e.target.value)}
              placeholder="Ghi lại tiến độ, khó khăn, hoặc kế hoạch tiếp theo…" rows={2} className="mb-2"
            />
            <div className="flex items-center justify-between">
              <select
                value={checkinStatus} onChange={e => setCheckinStatus(e.target.value)}
                className="h-8 text-xs border rounded-md px-2 focus:outline-none focus:ring-1 focus:ring-blue-400 bg-white"
              >
                {Object.entries(GOAL_STATUS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
              </select>
              <Button size="sm" onClick={submitCheckin} className="bg-blue-600 hover:bg-blue-700 h-8 text-xs">Gửi cập nhật</Button>
            </div>
          </div>
          <div className="divide-y">
            {goal.checkins.length === 0 && <p className="px-5 py-6 text-center text-sm text-slate-400">Chưa có cập nhật nào</p>}
            {goal.checkins.map(c => {
              const cst = GOAL_STATUS[c.status] ?? GOAL_STATUS.not_started;
              return (
                <div key={c.id} className="px-5 py-3">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-slate-700">{c.user_name ?? 'Ẩn danh'}</span>
                    <Badge className={`${cst.color} border-0`}>{cst.label}</Badge>
                    <span className="text-xs text-slate-400 ml-auto">{new Date(c.created_at).toLocaleString('vi-VN')}</span>
                  </div>
                  <p className="text-sm text-slate-600 whitespace-pre-wrap">{c.note}</p>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      {/* Edit Goal Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Sửa mục tiêu</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label>Tên mục tiêu</Label>
              <Input className="mt-1.5" value={editForm.title} onChange={e => setEditForm(f => ({ ...f, title: e.target.value }))} />
            </div>
            <div>
              <Label>Mô tả</Label>
              <Textarea className="mt-1.5" rows={2} value={editForm.description} onChange={e => setEditForm(f => ({ ...f, description: e.target.value }))} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Giai đoạn</Label>
                <Input className="mt-1.5" value={editForm.period_label} onChange={e => setEditForm(f => ({ ...f, period_label: e.target.value }))} />
              </div>
              <div>
                <Label>Trạng thái</Label>
                <select
                  className="mt-1.5 w-full h-9 text-sm border rounded-md px-2 focus:outline-none focus:ring-1 focus:ring-blue-400"
                  value={editForm.status} onChange={e => setEditForm(f => ({ ...f, status: e.target.value }))}
                >
                  {Object.entries(GOAL_STATUS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                </select>
              </div>
            </div>
            <div>
              <Label>Người chủ trì</Label>
              <select
                className="mt-1.5 w-full h-9 text-sm border rounded-md px-2 focus:outline-none focus:ring-1 focus:ring-blue-400"
                value={editForm.owner_id} onChange={e => setEditForm(f => ({ ...f, owner_id: e.target.value }))}
              >
                <option value="">— Chưa gán —</option>
                {users.map(u => <option key={u.id} value={u.id}>{u.display_name || u.username}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Ngày bắt đầu</Label>
                <Input className="mt-1.5" type="date" value={editForm.start_date ?? ''} onChange={e => setEditForm(f => ({ ...f, start_date: e.target.value }))} />
              </div>
              <div>
                <Label>Ngày kết thúc</Label>
                <Input className="mt-1.5" type="date" value={editForm.end_date ?? ''} onChange={e => setEditForm(f => ({ ...f, end_date: e.target.value }))} />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)}>Huỷ</Button>
            <Button onClick={saveEdit} className="bg-blue-600 hover:bg-blue-700">Lưu thay đổi</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Key Result Dialog */}
      <Dialog open={krOpen} onOpenChange={setKrOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>Thêm kết quả then chốt</DialogTitle></DialogHeader>
          <div className="space-y-3 py-2">
            <div>
              <Label>Tên kết quả then chốt</Label>
              <Input className="mt-1.5" value={krForm.title} onChange={e => setKrForm(f => ({ ...f, title: e.target.value }))}
                placeholder="VD: Doanh thu (tỷ VND)" autoFocus />
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <Label className="text-xs">Từ</Label>
                <Input className="mt-1" type="number" value={krForm.start_value} onChange={e => setKrForm(f => ({ ...f, start_value: Number(e.target.value) }))} />
              </div>
              <div>
                <Label className="text-xs">Đến</Label>
                <Input className="mt-1" type="number" value={krForm.target_value} onChange={e => setKrForm(f => ({ ...f, target_value: Number(e.target.value) }))} />
              </div>
              <div>
                <Label className="text-xs">Đơn vị</Label>
                <Input className="mt-1" value={krForm.unit} onChange={e => setKrForm(f => ({ ...f, unit: e.target.value }))} placeholder="%, tỷ…" />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setKrOpen(false)}>Huỷ</Button>
            <Button onClick={addKr} className="bg-blue-600 hover:bg-blue-700">Thêm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
