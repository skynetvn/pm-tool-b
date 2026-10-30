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
import { ArrowLeft, Layers, Trash2, Pencil, TrendingUp, TrendingDown, Minus } from 'lucide-react';

type ProjectRow = {
  id: number; name: string; status: string; owner_name: string | null;
  task_count: number; progress_pct: number; prev_progress_pct: number;
};
type ProgramDetail = {
  id: number; name: string; description: string; owner_id: number | null; owner_name: string | null;
  include_in_portfolio: number; projects: ProjectRow[];
};
type UserOpt = { id: number; username: string; display_name: string };

const PROJECT_STATUS: Record<string, { label: string; color: string }> = {
  active:    { label: 'Đang triển khai', color: 'bg-blue-50 text-blue-700' },
  on_hold:   { label: 'Tạm hoãn',        color: 'bg-amber-50 text-amber-700' },
  completed: { label: 'Hoàn thành',      color: 'bg-green-50 text-green-700' },
  cancelled: { label: 'Đã huỷ',          color: 'bg-red-50 text-red-700' },
};

function ProgressBar({ pct, color = 'bg-indigo-600' }: { pct: number; color?: string }) {
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

export default function ProgramDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [program, setProgram] = useState<ProgramDetail | null>(null);
  const [users, setUsers] = useState<UserOpt[]>([]);
  const [loading, setLoading] = useState(true);

  const [editOpen, setEditOpen] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', description: '', owner_id: '', include_in_portfolio: true });

  const load = useCallback(() => {
    fetch(`/api/programs/${id}`).then(r => r.ok ? r.json() : null).then(data => { setProgram(data); setLoading(false); });
  }, [id]);

  useEffect(() => {
    load();
    fetch('/api/users').then(r => r.ok ? r.json() : []).then(setUsers);
  }, [load]);

  const openEdit = () => {
    if (!program) return;
    setEditForm({
      name: program.name, description: program.description ?? '',
      owner_id: program.owner_id ? String(program.owner_id) : '', include_in_portfolio: !!program.include_in_portfolio,
    });
    setEditOpen(true);
  };

  const saveEdit = async () => {
    const res = await fetch(`/api/programs/${id}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...editForm, owner_id: editForm.owner_id ? Number(editForm.owner_id) : null }),
    });
    if (!res.ok) { toast.error('Lỗi khi cập nhật program'); return; }
    toast.success('Đã cập nhật program');
    setEditOpen(false);
    load();
  };

  const deleteProgram = async () => {
    if (!program || !confirm(`Xoá program "${program.name}"? Các dự án sẽ không còn thuộc program nào.`)) return;
    await fetch(`/api/programs/${id}`, { method: 'DELETE' });
    toast.success('Đã xoá program');
    router.push('/programs');
  };

  if (loading) {
    return (
      <div className="flex flex-col lg:flex-row min-h-screen">
        <Sidebar />
        <main className="flex-1 p-6 text-center text-sm text-slate-400">Đang tải…</main>
      </div>
    );
  }
  if (!program) {
    return (
      <div className="flex flex-col lg:flex-row min-h-screen">
        <Sidebar />
        <main className="flex-1 p-6 text-center text-sm text-slate-400">Không tìm thấy program</main>
      </div>
    );
  }

  const taskTotal = program.projects.reduce((s, p) => s + Number(p.task_count || 0), 0);
  const overallProgress = program.projects.length
    ? Math.round(program.projects.reduce((s, p) => s + Number(p.progress_pct || 0), 0) / program.projects.length)
    : 0;
  const prevOverallProgress = program.projects.length
    ? Math.round(program.projects.reduce((s, p) => s + Number(p.prev_progress_pct || 0), 0) / program.projects.length)
    : 0;

  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      <Sidebar />
      <main className="flex-1 p-4 lg:p-6 max-w-5xl mx-auto w-full">
        <Link href="/programs" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 mb-4">
          <ArrowLeft className="h-3.5 w-3.5" /> Quay lại danh sách program
        </Link>

        <div className="bg-white rounded-xl border shadow-sm p-5 mb-5">
          <div className="flex items-start justify-between gap-3 mb-2">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-lg font-bold text-slate-800">{program.name}</h1>
              <Badge className={`${program.include_in_portfolio ? 'bg-green-50 text-green-700' : 'bg-slate-100 text-slate-500'} border-0`}>
                {program.include_in_portfolio ? 'Có trong báo cáo Portfolio' : 'Không tính vào Portfolio'}
              </Badge>
            </div>
            <div className="flex gap-2 shrink-0">
              <Button variant="outline" size="sm" onClick={openEdit} className="gap-1.5"><Pencil className="h-3.5 w-3.5" /> Sửa</Button>
              <Button variant="outline" size="sm" onClick={deleteProgram} className="text-red-500 hover:text-red-600"><Trash2 className="h-3.5 w-3.5" /></Button>
            </div>
          </div>
          {program.description && <p className="text-sm text-slate-600 mb-3">{program.description}</p>}
          {program.owner_name && <p className="text-xs text-slate-400 mb-4">Phụ trách: {program.owner_name}</p>}
          <div className="max-w-md">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
              <span>Tiến độ chung ({program.projects.length} dự án, {taskTotal} task)</span>
              <span className="font-medium">{overallProgress}% <span className="text-slate-400">(kỳ trước {prevOverallProgress}%)</span></span>
            </div>
            <ProgressBar pct={overallProgress} />
          </div>
        </div>

        <div className="bg-white rounded-xl border shadow-sm">
          <div className="px-5 py-3 border-b">
            <h2 className="font-semibold text-slate-700">Dự án trong program</h2>
          </div>
          {program.projects.length === 0 ? (
            <p className="px-5 py-8 text-center text-sm text-slate-400">Chưa có dự án nào thuộc program này</p>
          ) : (
            <div className="divide-y">
              {program.projects.map(p => {
                const st = PROJECT_STATUS[p.status] ?? PROJECT_STATUS.active;
                return (
                  <Link key={p.id} href={`/projects/${p.id}`} className="flex items-center justify-between gap-4 px-5 py-3 hover:bg-slate-50">
                    <div className="min-w-0">
                      <p className="font-medium text-slate-800 text-sm truncate">{p.name}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <Badge className={`${st.color} border-0 text-xs`}>{st.label}</Badge>
                        <span className="text-xs text-slate-400">{p.task_count} task</span>
                      </div>
                    </div>
                    <div className="w-40 shrink-0">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-medium text-slate-700">{Math.round(p.progress_pct)}%</span>
                        <TrendBadge current={p.progress_pct} previous={p.prev_progress_pct} />
                      </div>
                      <ProgressBar pct={p.progress_pct} color="bg-blue-600" />
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </main>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle className="flex items-center gap-2"><Layers className="h-4 w-4 text-indigo-600" /> Sửa program</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label>Tên program</Label>
              <Input className="mt-1.5" value={editForm.name} onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))} />
            </div>
            <div>
              <Label>Mô tả</Label>
              <Textarea className="mt-1.5" rows={2} value={editForm.description} onChange={e => setEditForm(f => ({ ...f, description: e.target.value }))} />
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
            <label className="flex items-center gap-2 text-sm text-slate-600">
              <input type="checkbox" checked={editForm.include_in_portfolio} onChange={e => setEditForm(f => ({ ...f, include_in_portfolio: e.target.checked }))} />
              Đưa program này vào báo cáo Portfolio
            </label>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)}>Huỷ</Button>
            <Button onClick={saveEdit} className="bg-indigo-600 hover:bg-indigo-700">Lưu thay đổi</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
