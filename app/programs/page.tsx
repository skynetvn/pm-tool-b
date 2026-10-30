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
import { Layers, Plus, ArrowRight } from 'lucide-react';

type Program = {
  id: number; name: string; description: string; owner_name: string | null;
  include_in_portfolio: number; project_count: number; task_count: number;
  progress_pct: number; prev_progress_pct: number;
};
type UserOpt = { id: number; username: string; display_name: string };

function ProgressBar({ pct }: { pct: number }) {
  const clamped = Math.max(0, Math.min(100, Math.round(Number(pct) || 0)));
  return (
    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
      <div className="h-full bg-indigo-600 rounded-full transition-all" style={{ width: `${clamped}%` }} />
    </div>
  );
}

export default function ProgramsPage() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [users, setUsers] = useState<UserOpt[]>([]);
  const [loading, setLoading] = useState(true);

  const [createOpen, setCreateOpen] = useState(false);
  const [form, setForm] = useState({ name: '', description: '', owner_id: '', include_in_portfolio: true });

  const load = () => {
    fetch('/api/programs').then(r => r.ok ? r.json() : []).then(data => { setPrograms(data ?? []); setLoading(false); });
  };

  useEffect(() => {
    load();
    fetch('/api/users').then(r => r.ok ? r.json() : []).then(setUsers);
  }, []);

  const openCreate = () => {
    setForm({ name: '', description: '', owner_id: '', include_in_portfolio: true });
    setCreateOpen(true);
  };

  const submitCreate = async () => {
    if (!form.name.trim()) { toast.error('Tên program là bắt buộc'); return; }
    const res = await fetch('/api/programs', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, owner_id: form.owner_id ? Number(form.owner_id) : null }),
    });
    if (!res.ok) { toast.error((await res.json()).error ?? 'Lỗi khi tạo program'); return; }
    toast.success('Đã tạo program');
    setCreateOpen(false);
    load();
  };

  const toggleInPortfolio = async (p: Program) => {
    const res = await fetch(`/api/programs/${p.id}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: p.name, description: p.description, include_in_portfolio: !p.include_in_portfolio }),
    });
    if (!res.ok) { toast.error('Lỗi khi cập nhật'); return; }
    load();
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      <Sidebar />
      <main className="flex-1 p-4 lg:p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2"><Layers className="h-5 w-5 text-indigo-600" /> Program</h1>
            <p className="text-sm text-slate-500 mt-0.5">Nhóm các dự án lại và chọn program nào lên báo cáo Portfolio</p>
          </div>
          <Button onClick={openCreate} className="bg-indigo-600 hover:bg-indigo-700 gap-1.5"><Plus className="h-4 w-4" /> Tạo program</Button>
        </div>

        {loading ? (
          <p className="text-center text-sm text-slate-400 py-10">Đang tải…</p>
        ) : programs.length === 0 ? (
          <div className="bg-white rounded-xl border shadow-sm py-14 text-center text-sm text-slate-400">Chưa có program nào</div>
        ) : (
          <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-slate-400 border-b bg-slate-50/50">
                  <th className="px-5 py-2.5 font-medium">Program</th>
                  <th className="px-3 py-2.5 font-medium">Dự án</th>
                  <th className="px-3 py-2.5 font-medium">Tiến độ</th>
                  <th className="px-3 py-2.5 font-medium text-center">Lên báo cáo Portfolio</th>
                  <th className="px-3 py-2.5 font-medium w-10"></th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {programs.map(p => (
                  <tr key={p.id}>
                    <td className="px-5 py-3">
                      <Link href={`/programs/${p.id}`} className="font-medium text-slate-800 hover:text-indigo-600">{p.name}</Link>
                      {p.owner_name && <p className="text-xs text-slate-400 mt-0.5">Phụ trách: {p.owner_name}</p>}
                    </td>
                    <td className="px-3 py-3 text-slate-600">{p.project_count} dự án · {p.task_count} task</td>
                    <td className="px-3 py-3 min-w-[160px]">
                      <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                        <span className="font-medium text-slate-700">{Math.round(p.progress_pct)}%</span>
                        <span className="text-slate-400">kỳ trước {Math.round(p.prev_progress_pct)}%</span>
                      </div>
                      <ProgressBar pct={p.progress_pct} />
                    </td>
                    <td className="px-3 py-3 text-center">
                      <button onClick={() => toggleInPortfolio(p)}>
                        <Badge className={`${p.include_in_portfolio ? 'bg-green-50 text-green-700' : 'bg-slate-100 text-slate-500'} border-0 cursor-pointer`}>
                          {p.include_in_portfolio ? 'Có' : 'Không'}
                        </Badge>
                      </button>
                    </td>
                    <td className="px-3 py-3">
                      <Link href={`/programs/${p.id}`}><ArrowRight className="h-4 w-4 text-slate-300 hover:text-indigo-500" /></Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle className="flex items-center gap-2"><Layers className="h-4 w-4 text-indigo-600" /> Tạo program</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label>Tên program</Label>
              <Input className="mt-1.5" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} autoFocus />
            </div>
            <div>
              <Label>Mô tả</Label>
              <Textarea className="mt-1.5" rows={2} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
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
            <label className="flex items-center gap-2 text-sm text-slate-600">
              <input type="checkbox" checked={form.include_in_portfolio} onChange={e => setForm(f => ({ ...f, include_in_portfolio: e.target.checked }))} />
              Đưa program này vào báo cáo Portfolio
            </label>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>Huỷ</Button>
            <Button onClick={submitCreate} className="bg-indigo-600 hover:bg-indigo-700">Tạo program</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
