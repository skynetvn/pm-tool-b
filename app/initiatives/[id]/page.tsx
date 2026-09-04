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
import { ArrowLeft, Rocket, Trash2, Target, MessageSquare, Pencil } from 'lucide-react';

type Checkin = { id: number; note: string; progress_pct: number | null; user_name: string | null; created_at: string };
type InitiativeDetail = {
  id: number; title: string; description: string; status: string; priority: string;
  owner_id: number | null; owner_name: string | null; goal_id: number | null; goal_title: string | null;
  parent_initiative_id: number | null; parent_initiative_title: string | null; level: 1 | 2 | 3;
  output_product: string | null;
  progress_pct: number; start_date: string | null; end_date: string | null; checkins: Checkin[];
};
type Goal = { id: number; title: string };
type UserOpt = { id: number; username: string; display_name: string };
type InitiativeOpt = { id: number; title: string; level: 1 | 2 | 3 };
const LEVEL_LABEL: Record<number, string> = { 1: 'Cấp 1', 2: 'Cấp 2', 3: 'Cấp 3' };

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

function ProgressBar({ pct }: { pct: number }) {
  const clamped = Math.max(0, Math.min(100, Math.round(Number(pct) || 0)));
  return (
    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
      <div className="h-full bg-violet-600 rounded-full transition-all" style={{ width: `${clamped}%` }} />
    </div>
  );
}

export default function InitiativeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [initiative, setInitiative] = useState<InitiativeDetail | null>(null);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [users, setUsers] = useState<UserOpt[]>([]);
  const [allInitiatives, setAllInitiatives] = useState<InitiativeOpt[]>([]);
  const [loading, setLoading] = useState(true);

  const [editOpen, setEditOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    title: '', description: '', goal_id: '', owner_id: '', status: 'proposed', priority: 'medium',
    start_date: '', end_date: '', progress_pct: 0,
    level: '1', parent_initiative_id: '', output_product: '',
  });

  const [checkinNote, setCheckinNote] = useState('');
  const [checkinProgress, setCheckinProgress] = useState<number | null>(null);

  const load = useCallback(() => {
    fetch(`/api/initiatives/${id}`).then(r => r.ok ? r.json() : null).then(data => { setInitiative(data); setLoading(false); });
  }, [id]);

  useEffect(() => {
    load();
    fetch('/api/goals').then(r => r.ok ? r.json() : []).then(setGoals);
    fetch('/api/users').then(r => r.ok ? r.json() : []).then(setUsers);
    fetch('/api/initiatives').then(r => r.ok ? r.json() : []).then(setAllInitiatives);
  }, [load]);

  const openEdit = () => {
    if (!initiative) return;
    setEditForm({
      title: initiative.title, description: initiative.description ?? '',
      goal_id: initiative.goal_id ? String(initiative.goal_id) : '', owner_id: initiative.owner_id ? String(initiative.owner_id) : '',
      status: initiative.status, priority: initiative.priority,
      start_date: initiative.start_date ?? '', end_date: initiative.end_date ?? '', progress_pct: initiative.progress_pct,
      level: String(initiative.level ?? 1), parent_initiative_id: initiative.parent_initiative_id ? String(initiative.parent_initiative_id) : '',
      output_product: initiative.output_product ?? '',
    });
    setEditOpen(true);
  };

  const saveEdit = async () => {
    const res = await fetch(`/api/initiatives/${id}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...editForm,
        goal_id: editForm.goal_id ? Number(editForm.goal_id) : null,
        owner_id: editForm.owner_id ? Number(editForm.owner_id) : null,
        level: Number(editForm.level),
        parent_initiative_id: editForm.parent_initiative_id ? Number(editForm.parent_initiative_id) : null,
        output_product: editForm.level === '3' ? (editForm.output_product.trim() || null) : null,
      }),
    });
    if (!res.ok) { toast.error('Lỗi khi cập nhật sáng kiến'); return; }
    toast.success('Đã cập nhật sáng kiến');
    setEditOpen(false);
    load();
  };

  const deleteInitiative = async () => {
    if (!initiative || !confirm(`Xoá sáng kiến "${initiative.title}"?`)) return;
    await fetch(`/api/initiatives/${id}`, { method: 'DELETE' });
    toast.success('Đã xoá sáng kiến');
    router.push('/initiatives');
  };

  const submitCheckin = async () => {
    if (!checkinNote.trim()) { toast.error('Nhập nội dung cập nhật'); return; }
    const res = await fetch(`/api/initiatives/${id}/checkins`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ note: checkinNote, progress_pct: checkinProgress }),
    });
    if (!res.ok) { toast.error('Lỗi khi gửi cập nhật'); return; }
    setCheckinNote('');
    setCheckinProgress(null);
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
  if (!initiative) {
    return (
      <div className="flex flex-col lg:flex-row min-h-screen">
        <Sidebar />
        <main className="flex-1 p-6 text-center text-sm text-slate-400">Không tìm thấy sáng kiến</main>
      </div>
    );
  }

  const st = INI_STATUS[initiative.status] ?? INI_STATUS.proposed;
  const pr = PRIORITY[initiative.priority] ?? PRIORITY.medium;

  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      <Sidebar />
      <main className="flex-1 p-4 lg:p-6 max-w-4xl mx-auto w-full">
        <Link href="/initiatives" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 mb-4">
          <ArrowLeft className="h-3.5 w-3.5" /> Quay lại danh sách sáng kiến
        </Link>

        {/* Header */}
        <div className="bg-white rounded-xl border shadow-sm p-5 mb-5">
          <div className="flex items-start justify-between gap-3 mb-2">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-lg font-bold text-slate-800">{initiative.title}</h1>
              <Badge className={`${st.color} border-0`}>{st.label}</Badge>
              <Badge className={`${pr.color} border-0`}>Ưu tiên {pr.label.toLowerCase()}</Badge>
              <Badge className="bg-indigo-50 text-indigo-700 border-0">{LEVEL_LABEL[initiative.level] ?? 'Cấp 1'}</Badge>
            </div>
            <div className="flex gap-2 shrink-0">
              <Button variant="outline" size="sm" onClick={openEdit} className="gap-1.5"><Pencil className="h-3.5 w-3.5" /> Sửa</Button>
              <Button variant="outline" size="sm" onClick={deleteInitiative} className="text-red-500 hover:text-red-600"><Trash2 className="h-3.5 w-3.5" /></Button>
            </div>
          </div>
          {initiative.description && <p className="text-sm text-slate-600 mb-3">{initiative.description}</p>}
          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mb-3">
            {initiative.goal_title && (
              <Link href={`/goals/${initiative.goal_id}`} className="flex items-center gap-1 text-blue-600 hover:underline">
                <Target className="h-3 w-3" /> {initiative.goal_title}
              </Link>
            )}
            {initiative.parent_initiative_title && (
              <Link href={`/initiatives/${initiative.parent_initiative_id}`} className="flex items-center gap-1 text-violet-600 hover:underline">
                Thuộc: {initiative.parent_initiative_title}
              </Link>
            )}
            {initiative.owner_name && <span>· Phụ trách: {initiative.owner_name}</span>}
            {initiative.start_date && <span>· {initiative.start_date} → {initiative.end_date || '—'}</span>}
          </div>
          {initiative.output_product && (
            <p className="text-xs text-slate-500 mb-3"><span className="font-medium text-slate-600">Sản phẩm đầu ra:</span> {initiative.output_product}</p>
          )}
          <div className="max-w-md">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
              <span>Tiến độ</span>
              <span className="font-medium">{initiative.progress_pct}%</span>
            </div>
            <ProgressBar pct={initiative.progress_pct} />
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
            <div className="flex items-center gap-3">
              <Label className="text-xs shrink-0">Cập nhật % tiến độ:</Label>
              <input
                type="range" min={0} max={100}
                value={checkinProgress ?? initiative.progress_pct}
                onChange={e => setCheckinProgress(Number(e.target.value))}
                className="flex-1 accent-violet-600"
              />
              <span className="text-xs font-medium text-slate-600 w-10">{checkinProgress ?? initiative.progress_pct}%</span>
              <Button size="sm" onClick={submitCheckin} className="bg-violet-600 hover:bg-violet-700 h-8 text-xs shrink-0">Gửi cập nhật</Button>
            </div>
          </div>
          <div className="divide-y">
            {initiative.checkins.length === 0 && <p className="px-5 py-6 text-center text-sm text-slate-400">Chưa có cập nhật nào</p>}
            {initiative.checkins.map(c => (
              <div key={c.id} className="px-5 py-3">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium text-slate-700">{c.user_name ?? 'Ẩn danh'}</span>
                  {c.progress_pct !== null && <Badge className="bg-violet-50 text-violet-700 border-0">{c.progress_pct}%</Badge>}
                  <span className="text-xs text-slate-400 ml-auto">{new Date(c.created_at).toLocaleString('vi-VN')}</span>
                </div>
                <p className="text-sm text-slate-600 whitespace-pre-wrap">{c.note}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Edit Initiative Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle className="flex items-center gap-2"><Rocket className="h-4 w-4 text-violet-600" /> Sửa sáng kiến</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label>Tên sáng kiến</Label>
              <Input className="mt-1.5" value={editForm.title} onChange={e => setEditForm(f => ({ ...f, title: e.target.value }))} />
            </div>
            <div>
              <Label>Mô tả</Label>
              <Textarea className="mt-1.5" rows={2} value={editForm.description} onChange={e => setEditForm(f => ({ ...f, description: e.target.value }))} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Cấp sáng kiến</Label>
                <select
                  className="mt-1.5 w-full h-9 text-sm border rounded-md px-2 focus:outline-none focus:ring-1 focus:ring-blue-400"
                  value={editForm.level} onChange={e => setEditForm(f => ({ ...f, level: e.target.value, parent_initiative_id: '' }))}
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
                  value={editForm.parent_initiative_id} onChange={e => setEditForm(f => ({ ...f, parent_initiative_id: e.target.value }))}
                  disabled={editForm.level === '1'}
                >
                  <option value="">— Không có —</option>
                  {allInitiatives.filter(i => i.level === Number(editForm.level) - 1 && i.id !== initiative.id).map(i => <option key={i.id} value={i.id}>{i.title}</option>)}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Mục tiêu liên kết</Label>
                <select
                  className="mt-1.5 w-full h-9 text-sm border rounded-md px-2 focus:outline-none focus:ring-1 focus:ring-blue-400"
                  value={editForm.goal_id} onChange={e => setEditForm(f => ({ ...f, goal_id: e.target.value }))}
                >
                  <option value="">— Không liên kết —</option>
                  {goals.map(g => <option key={g.id} value={g.id}>{g.title}</option>)}
                </select>
              </div>
              <div>
                <Label>Người phụ trách</Label>
                <select
                  className="mt-1.5 w-full h-9 text-sm border rounded-md px-2 focus:outline-none focus:ring-1 focus:ring-blue-400"
                  value={editForm.owner_id} onChange={e => setEditForm(f => ({ ...f, owner_id: e.target.value }))}
                >
                  <option value="">— Chưa gán —</option>
                  {users.map(u => <option key={u.id} value={u.id}>{u.display_name || u.username}</option>)}
                </select>
              </div>
            </div>
            {editForm.level === '3' && (
              <div>
                <Label>Sản phẩm đầu ra</Label>
                <Input
                  className="mt-1.5" maxLength={255} value={editForm.output_product}
                  onChange={e => setEditForm(f => ({ ...f, output_product: e.target.value }))}
                  placeholder="Deliverable/output của sáng kiến cấp 3 này (tối đa 255 ký tự)"
                />
              </div>
            )}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Mức ưu tiên</Label>
                <select
                  className="mt-1.5 w-full h-9 text-sm border rounded-md px-2 focus:outline-none focus:ring-1 focus:ring-blue-400"
                  value={editForm.priority} onChange={e => setEditForm(f => ({ ...f, priority: e.target.value }))}
                >
                  {Object.entries(PRIORITY).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                </select>
              </div>
              <div>
                <Label>Trạng thái</Label>
                <select
                  className="mt-1.5 w-full h-9 text-sm border rounded-md px-2 focus:outline-none focus:ring-1 focus:ring-blue-400"
                  value={editForm.status} onChange={e => setEditForm(f => ({ ...f, status: e.target.value }))}
                >
                  {Object.entries(INI_STATUS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Ngày bắt đầu</Label>
                <Input className="mt-1.5" type="date" value={editForm.start_date} onChange={e => setEditForm(f => ({ ...f, start_date: e.target.value }))} />
              </div>
              <div>
                <Label>Ngày kết thúc</Label>
                <Input className="mt-1.5" type="date" value={editForm.end_date} onChange={e => setEditForm(f => ({ ...f, end_date: e.target.value }))} />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)}>Huỷ</Button>
            <Button onClick={saveEdit} className="bg-violet-600 hover:bg-violet-700">Lưu thay đổi</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
