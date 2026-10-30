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
import { ArrowLeft, Briefcase, Trash2, Pencil, Plus, ListChecks, MessageSquare } from 'lucide-react';

type Task = {
  id: number; title: string; description: string; owner_id: number | null; owner_name: string | null;
  status: string; progress_pct: number;
  current_status: string | null; current_progress: number | null; current_note: string | null; current_at: string | null;
  previous_status: string | null; previous_progress: number | null; previous_note: string | null; previous_at: string | null;
};
type ProjectDetail = {
  id: number; name: string; description: string; status: string;
  program_id: number | null; program_name: string | null;
  owner_id: number | null; owner_name: string | null;
  start_date: string | null; end_date: string | null; tasks: Task[];
};
type UserOpt = { id: number; username: string; display_name: string };
type Program = { id: number; name: string };

const PROJECT_STATUS: Record<string, { label: string; color: string }> = {
  active:    { label: 'Đang triển khai', color: 'bg-blue-50 text-blue-700' },
  on_hold:   { label: 'Tạm hoãn',        color: 'bg-amber-50 text-amber-700' },
  completed: { label: 'Hoàn thành',      color: 'bg-green-50 text-green-700' },
  cancelled: { label: 'Đã huỷ',          color: 'bg-red-50 text-red-700' },
};
const TASK_STATUS: Record<string, { label: string; color: string }> = {
  not_started: { label: 'Chưa bắt đầu', color: 'bg-slate-100 text-slate-600' },
  on_track:    { label: 'Đúng tiến độ', color: 'bg-green-50 text-green-700' },
  at_risk:     { label: 'Có rủi ro',    color: 'bg-amber-50 text-amber-700' },
  off_track:   { label: 'Trễ tiến độ',  color: 'bg-red-50 text-red-700' },
  done:        { label: 'Hoàn thành',   color: 'bg-blue-50 text-blue-700' },
};

function ProgressBar({ pct, color = 'bg-blue-600' }: { pct: number; color?: string }) {
  const clamped = Math.max(0, Math.min(100, Math.round(Number(pct) || 0)));
  return (
    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
      <div className={`h-full ${color} rounded-full transition-all`} style={{ width: `${clamped}%` }} />
    </div>
  );
}

function PeriodCell({ status, progress, note }: { status: string | null; progress: number | null; note?: string | null }) {
  if (status === null) return <span className="text-xs text-slate-300">— Chưa có —</span>;
  const st = TASK_STATUS[status] ?? TASK_STATUS.not_started;
  return (
    <div>
      <div className="flex items-center gap-1.5">
        <Badge className={`${st.color} border-0 text-xs`}>{st.label}</Badge>
        <span className="text-xs font-medium text-slate-600">{progress ?? 0}%</span>
      </div>
      {note && <p className="text-xs text-slate-400 mt-0.5 truncate max-w-[220px]" title={note}>{note}</p>}
    </div>
  );
}

export default function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [project, setProject] = useState<ProjectDetail | null>(null);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [users, setUsers] = useState<UserOpt[]>([]);
  const [loading, setLoading] = useState(true);

  const [editOpen, setEditOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '', description: '', program_id: '', owner_id: '', status: 'active', start_date: '', end_date: '',
  });

  const [taskOpen, setTaskOpen] = useState(false);
  const [taskForm, setTaskForm] = useState({ title: '', description: '', owner_id: '' });

  const [checkinTask, setCheckinTask] = useState<Task | null>(null);
  const [checkinForm, setCheckinForm] = useState({ status: 'on_track', progress_pct: 0, note: '' });

  const load = useCallback(() => {
    fetch(`/api/projects/${id}`).then(r => r.ok ? r.json() : null).then(data => { setProject(data); setLoading(false); });
  }, [id]);

  useEffect(() => {
    load();
    fetch('/api/programs').then(r => r.ok ? r.json() : []).then(setPrograms);
    fetch('/api/users').then(r => r.ok ? r.json() : []).then(setUsers);
  }, [load]);

  const openEdit = () => {
    if (!project) return;
    setEditForm({
      name: project.name, description: project.description ?? '',
      program_id: project.program_id ? String(project.program_id) : '', owner_id: project.owner_id ? String(project.owner_id) : '',
      status: project.status, start_date: project.start_date ?? '', end_date: project.end_date ?? '',
    });
    setEditOpen(true);
  };

  const saveEdit = async () => {
    const res = await fetch(`/api/projects/${id}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...editForm, program_id: editForm.program_id ? Number(editForm.program_id) : null, owner_id: editForm.owner_id ? Number(editForm.owner_id) : null }),
    });
    if (!res.ok) { toast.error('Lỗi khi cập nhật dự án'); return; }
    toast.success('Đã cập nhật dự án');
    setEditOpen(false);
    load();
  };

  const deleteProject = async () => {
    if (!project || !confirm(`Xoá dự án "${project.name}"? Toàn bộ task sẽ bị xoá.`)) return;
    await fetch(`/api/projects/${id}`, { method: 'DELETE' });
    toast.success('Đã xoá dự án');
    router.push('/projects');
  };

  const openAddTask = () => {
    setTaskForm({ title: '', description: '', owner_id: '' });
    setTaskOpen(true);
  };

  const submitTask = async () => {
    if (!taskForm.title.trim()) { toast.error('Tên task là bắt buộc'); return; }
    const res = await fetch('/api/tasks', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...taskForm, project_id: project?.id, owner_id: taskForm.owner_id ? Number(taskForm.owner_id) : null }),
    });
    if (!res.ok) { toast.error((await res.json()).error ?? 'Lỗi khi tạo task'); return; }
    toast.success('Đã thêm task');
    setTaskOpen(false);
    load();
  };

  const deleteTask = async (task: Task) => {
    if (!confirm(`Xoá task "${task.title}"?`)) return;
    await fetch(`/api/tasks/${task.id}`, { method: 'DELETE' });
    toast.success('Đã xoá task');
    load();
  };

  const openCheckin = (task: Task) => {
    setCheckinTask(task);
    setCheckinForm({ status: task.status, progress_pct: task.progress_pct, note: '' });
  };

  const submitCheckin = async () => {
    if (!checkinTask) return;
    if (!checkinForm.note.trim()) { toast.error('Nhập nội dung cập nhật'); return; }
    const res = await fetch(`/api/tasks/${checkinTask.id}/checkins`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(checkinForm),
    });
    if (!res.ok) { toast.error('Lỗi khi gửi cập nhật'); return; }
    toast.success('Đã ghi nhận cập nhật');
    setCheckinTask(null);
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
  if (!project) {
    return (
      <div className="flex flex-col lg:flex-row min-h-screen">
        <Sidebar />
        <main className="flex-1 p-6 text-center text-sm text-slate-400">Không tìm thấy dự án</main>
      </div>
    );
  }

  const st = PROJECT_STATUS[project.status] ?? PROJECT_STATUS.active;
  const overallProgress = project.tasks.length
    ? Math.round(project.tasks.reduce((s, t) => s + Number(t.progress_pct || 0), 0) / project.tasks.length)
    : 0;
  const prevOverallProgress = project.tasks.length
    ? Math.round(project.tasks.reduce((s, t) => s + Number(t.previous_progress ?? t.progress_pct ?? 0), 0) / project.tasks.length)
    : 0;

  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      <Sidebar />
      <main className="flex-1 p-4 lg:p-6 max-w-5xl mx-auto w-full">
        <Link href="/projects" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 mb-4">
          <ArrowLeft className="h-3.5 w-3.5" /> Quay lại danh sách dự án
        </Link>

        {/* Header */}
        <div className="bg-white rounded-xl border shadow-sm p-5 mb-5">
          <div className="flex items-start justify-between gap-3 mb-2">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-lg font-bold text-slate-800">{project.name}</h1>
              <Badge className={`${st.color} border-0`}>{st.label}</Badge>
            </div>
            <div className="flex gap-2 shrink-0">
              <Button variant="outline" size="sm" onClick={openEdit} className="gap-1.5"><Pencil className="h-3.5 w-3.5" /> Sửa</Button>
              <Button variant="outline" size="sm" onClick={deleteProject} className="text-red-500 hover:text-red-600"><Trash2 className="h-3.5 w-3.5" /></Button>
            </div>
          </div>
          {project.description && <p className="text-sm text-slate-600 mb-3">{project.description}</p>}
          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mb-4">
            {project.program_name && (
              <Link href={`/programs/${project.program_id}`} className="flex items-center gap-1 text-blue-600 hover:underline">
                Program: {project.program_name}
              </Link>
            )}
            {project.owner_name && <span>· Phụ trách: {project.owner_name}</span>}
            {project.start_date && <span>· {project.start_date} → {project.end_date || '—'}</span>}
          </div>
          <div className="max-w-md">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
              <span>Tiến độ chung ({project.tasks.length} task)</span>
              <span className="font-medium">{overallProgress}% <span className="text-slate-400">(kỳ trước {prevOverallProgress}%)</span></span>
            </div>
            <ProgressBar pct={overallProgress} />
          </div>
        </div>

        {/* Tasks */}
        <div className="bg-white rounded-xl border shadow-sm">
          <div className="px-5 py-3 border-b flex items-center justify-between">
            <h2 className="font-semibold text-slate-700 flex items-center gap-2"><ListChecks className="h-4 w-4 text-slate-500" /> Task</h2>
            <Button size="sm" onClick={openAddTask} className="gap-1.5 bg-blue-600 hover:bg-blue-700 h-8 text-xs"><Plus className="h-3.5 w-3.5" /> Thêm task</Button>
          </div>
          {project.tasks.length === 0 ? (
            <p className="px-5 py-8 text-center text-sm text-slate-400">Chưa có task nào</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs text-slate-400 border-b">
                    <th className="px-5 py-2 font-medium">Task</th>
                    <th className="px-3 py-2 font-medium">Kỳ trước</th>
                    <th className="px-3 py-2 font-medium">Kỳ này</th>
                    <th className="px-3 py-2 font-medium w-10"></th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {project.tasks.map(t => (
                    <tr key={t.id} className="align-top">
                      <td className="px-5 py-3">
                        <p className="font-medium text-slate-700">{t.title}</p>
                        {t.owner_name && <p className="text-xs text-slate-400 mt-0.5">{t.owner_name}</p>}
                      </td>
                      <td className="px-3 py-3">
                        <PeriodCell status={t.previous_status} progress={t.previous_progress} note={t.previous_note} />
                      </td>
                      <td className="px-3 py-3">
                        <PeriodCell status={t.current_status ?? t.status} progress={t.current_progress ?? t.progress_pct} note={t.current_note} />
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-1">
                          <Button variant="outline" size="sm" className="h-7 text-xs gap-1" onClick={() => openCheckin(t)}>
                            <MessageSquare className="h-3 w-3" /> Cập nhật
                          </Button>
                          <Button variant="outline" size="sm" className="h-7 w-7 p-0 text-red-500 hover:text-red-600" onClick={() => deleteTask(t)}>
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Edit Project Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle className="flex items-center gap-2"><Briefcase className="h-4 w-4 text-blue-600" /> Sửa dự án</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label>Tên dự án</Label>
              <Input className="mt-1.5" value={editForm.name} onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))} />
            </div>
            <div>
              <Label>Mô tả</Label>
              <Textarea className="mt-1.5" rows={2} value={editForm.description} onChange={e => setEditForm(f => ({ ...f, description: e.target.value }))} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Thuộc Program</Label>
                <select
                  className="mt-1.5 w-full h-9 text-sm border rounded-md px-2 focus:outline-none focus:ring-1 focus:ring-blue-400"
                  value={editForm.program_id} onChange={e => setEditForm(f => ({ ...f, program_id: e.target.value }))}
                >
                  <option value="">— Không thuộc Program —</option>
                  {programs.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
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
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Trạng thái</Label>
                <select
                  className="mt-1.5 w-full h-9 text-sm border rounded-md px-2 focus:outline-none focus:ring-1 focus:ring-blue-400"
                  value={editForm.status} onChange={e => setEditForm(f => ({ ...f, status: e.target.value }))}
                >
                  {Object.entries(PROJECT_STATUS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
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
            <Button onClick={saveEdit} className="bg-blue-600 hover:bg-blue-700">Lưu thay đổi</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Task Dialog */}
      <Dialog open={taskOpen} onOpenChange={setTaskOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Thêm task</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label>Tên task</Label>
              <Input className="mt-1.5" value={taskForm.title} onChange={e => setTaskForm(f => ({ ...f, title: e.target.value }))} autoFocus />
            </div>
            <div>
              <Label>Mô tả</Label>
              <Textarea className="mt-1.5" rows={2} value={taskForm.description} onChange={e => setTaskForm(f => ({ ...f, description: e.target.value }))} />
            </div>
            <div>
              <Label>Người phụ trách</Label>
              <select
                className="mt-1.5 w-full h-9 text-sm border rounded-md px-2 focus:outline-none focus:ring-1 focus:ring-blue-400"
                value={taskForm.owner_id} onChange={e => setTaskForm(f => ({ ...f, owner_id: e.target.value }))}
              >
                <option value="">— Chưa gán —</option>
                {users.map(u => <option key={u.id} value={u.id}>{u.display_name || u.username}</option>)}
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setTaskOpen(false)}>Huỷ</Button>
            <Button onClick={submitTask} className="bg-blue-600 hover:bg-blue-700">Thêm task</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Check-in Dialog */}
      <Dialog open={!!checkinTask} onOpenChange={open => !open && setCheckinTask(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Cập nhật: {checkinTask?.title}</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label>Trạng thái kỳ này</Label>
              <select
                className="mt-1.5 w-full h-9 text-sm border rounded-md px-2 focus:outline-none focus:ring-1 focus:ring-blue-400"
                value={checkinForm.status} onChange={e => setCheckinForm(f => ({ ...f, status: e.target.value }))}
              >
                {Object.entries(TASK_STATUS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
              </select>
            </div>
            <div>
              <div className="flex items-center gap-3">
                <Label className="shrink-0">Tiến độ %</Label>
                <input
                  type="range" min={0} max={100}
                  value={checkinForm.progress_pct}
                  onChange={e => setCheckinForm(f => ({ ...f, progress_pct: Number(e.target.value) }))}
                  className="flex-1 accent-blue-600"
                />
                <span className="text-xs font-medium text-slate-600 w-10">{checkinForm.progress_pct}%</span>
              </div>
            </div>
            <div>
              <Label>Ghi chú cập nhật</Label>
              <Textarea
                className="mt-1.5" rows={3} value={checkinForm.note}
                onChange={e => setCheckinForm(f => ({ ...f, note: e.target.value }))}
                placeholder="Tiến độ, khó khăn, hoặc kế hoạch tiếp theo…"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCheckinTask(null)}>Huỷ</Button>
            <Button onClick={submitCheckin} className="bg-blue-600 hover:bg-blue-700">Gửi cập nhật</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
