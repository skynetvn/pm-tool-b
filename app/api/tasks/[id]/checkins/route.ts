import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { getSessionFromRequest } from '@/lib/auth';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getSessionFromRequest(req);
  if (!user) return NextResponse.json([], { status: 401 });
  const { id } = await params;
  const db = await getDb();
  const checkins = await db.all(
    `SELECT c.*, u.display_name as user_name FROM task_checkins c LEFT JOIN users u ON c.user_id = u.id WHERE c.task_id = ? ORDER BY c.created_at DESC`,
    id
  );
  return NextResponse.json(checkins);
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getSessionFromRequest(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await params;
  const body = await req.json();
  if (!body.note?.trim()) return NextResponse.json({ error: 'Nhập nội dung cập nhật' }, { status: 400 });

  const db = await getDb();
  const status = body.status ?? 'on_track';
  const progressPct = Math.max(0, Math.min(100, Number(body.progress_pct ?? 0)));

  await db.run(
    `INSERT INTO task_checkins (task_id, user_id, status, progress_pct, note) VALUES (?, ?, ?, ?, ?)`,
    id, user.id, status, progressPct, body.note.trim()
  );
  await db.run(
    `UPDATE tasks SET status = ?, progress_pct = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
    status, progressPct, id
  );

  const task = await db.get('SELECT * FROM tasks WHERE id = ?', id);
  const checkins = await db.all(
    `SELECT c.*, u.display_name as user_name FROM task_checkins c LEFT JOIN users u ON c.user_id = u.id WHERE c.task_id = ? ORDER BY c.created_at DESC`,
    id
  );
  return NextResponse.json({ ...(task as object), checkins }, { status: 201 });
}
