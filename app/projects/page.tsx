'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Sidebar from '@/components/layout/Sidebar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Briefcase, Plus, ArrowRight, TrendingUp, TrendingDown, Minus } from 'lucide-react';

type Project = {
  id: number; name: string; description: string; status: string;
  program_id: number | null; program_name: string | null;
  owner_name: string | null; task_count: number; progress_pct: number; prev_progress_pct: number;
};
type Program = { id: number; name: string };
type UserOpt = { id: number; username: string; display_name: string };

const PROJECT_STATUS: Record<string, { label: string; color: string }> = {
  active:    { label: 'Đang triển khai', color: 'bg-blue-50 text-blue-700' },
  on_hold:   { label: 'Tạm hoãn',        color: 'bg-amber-50 text-amber-700' },
  completed: { label: 'Hoàn thành',      color: 'bg-green-50 text-green-700' },
  cancelled: { label: 'Đã huỷ',          color: 'bg-red-50 text-red-700' },
};

function ProgressBar({ pct, color = 'bg-blue-600' }: { pct: number; color?: string }) {
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

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [users, setUsers] = useState<UserOpt[]>([]);
  const [loading, setLoading] = useState(true);

  const [createOpen, setCreateOpen] = useState(false);
  const [form, setForm] = useState({ name: '', description: '', program_id: '', owner_id: '', start_date: '', end_date: '' });

  const load = () => {
    fetch('/api/projects').then(r => r.ok ? r.json() : []).then(data => { setProjects(data ?? []); setLoading(false); });
  };

  useEffect(() => {
    load();
    fetch('/api/programs').then(r => r.ok ? r.json() : []).then(setPrograms);
    fetch('/api/users').then(r => r.ok ? r.json() : []).then(setUsers);
  }, []);

  const openCreate = () => {
    setForm({ name: '', description: '', program_id: '', owner_id: '', start_date: '', end_date: '' });
    setCreateOpen(true);
  };

  const submitCreate = async () => {
    if (!form.name.trim()) { toast.error('Tên dự án là bắt buộc'); return; }
    const res = await fetch('/api/projects', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, program_id: form.program_id ? Number(form.program_id) : null, owner_id: form.owner_id ? Number(form.owner_id) : null }),
    });
    if (!res.ok) { toast.error((await res.json()).error ?? 'Lỗi khi tạo dự án'); return; }
    toast.success('Đã tạo dự án');
    setCreateOpen(false);
    load();
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      <Sidebar />
      <main className="flex-1 p-4 lg:p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2"><Briefcase className="h-5 w-5 text-blue-600" /> Dự án</h1>
            <p className="text-sm text-slate-500 mt-0.5">Cập nhật task và theo dõi tiến độ từng dự án</p>
          </div>
          <Button onClick={openCreate} className="bg-blue-600 hover:bg-blue-700 gap-1.5"><Plus className="h-4 w-4" /> Tạo dự án</Button>
        </div>

        {loading ? (
          <p className="text-center text-sm text-slate-400 py-10">Đang tải…</p>
        ) : projects.length === 0 ? (
          <div className="bg-white rounded-xl border shadow-sm py-14 text-center text-sm text-slate-400">Chưa có dự án nào</div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map(p => {
              const st = PROJECT_STATUS[p.status] ?? PROJECT_STATUS.active;
              return (
                <Link key={p.id} href={`/projects/${p.id}`} className="bg-white rounded-xl border shadow-sm p-4 hover:shadow-md transition-shadow group">
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <h3 className="font-semibold text-slate-800 text-sm leading-snug">{p.name}</h3>
                    <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-blue-500 transition-colors shrink-0" />
                  </div>
                  <div className="flex items-center gap-2 mb-3 flex-wrap">
                    <Badge className={`${st.color} border-0 text-xs`}>{st.label}</Badge>
                    {p.program_name && <span className="text-xs text-slate-400">· {p.program_name}</span>}
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                    <span>Tiến độ ({p.task_count} task)</span>
                    <div className="flex items-center gap-1.5">
                      <span className="font-medium text-slate-700">{Math.round(p.progress_pct)}%</span>
                      <TrendBadge current={p.progress_pct} previous={p.prev_progress_pct} />
                    </div>
                  </div>
                  <ProgressBar pct={p.progress_pct} />
                  {p.owner_name && <p className="text-xs text-slate-400 mt-2">Phụ trách: {p.owner_name}</p>}
                </Link>
              );
            })}
          </div>
        )}
      </main>

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle className="flex items-center gap-2"><Briefcase className="h-4 w-4 text-blue-600" /> Tạo dự án</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label>Tên dự án</Label>
              <Input className="mt-1.5" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} autoFocus />
            </div>
            <div>
              <Label>Mô tả</Label>
              <Textarea className="mt-1.5" rows={2} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Thuộc Program</Label>
                <select
                  className="mt-1.5 w-full h-9 text-sm border rounded-md px-2 focus:outline-none focus:ring-1 focus:ring-blue-400"
                  value={form.program_id} onChange={e => setForm(f => ({ ...f, program_id: e.target.value }))}
                >
                  <option value="">— Không thuộc Program —</option>
                  {programs.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
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
            <Button variant="outline" onClick={() => setCreateOpen(false)}>Huỷ</Button>
            <Button onClick={submitCreate} className="bg-blue-600 hover:bg-blue-700">Tạo dự án</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
