import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { getSessionFromRequest } from '@/lib/auth';

export async function POST(req: NextRequest) {
  const user = await getSessionFromRequest(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  if (!body.project_id) return NextResponse.json({ error: 'Thiếu project_id' }, { status: 400 });
  if (!body.title?.trim()) return NextResponse.json({ error: 'Tên task là bắt buộc' }, { status: 400 });

  const db = await getDb();
  const countRow = await db.get<{ c: string | number }>(
    'SELECT COUNT(*) as c FROM tasks WHERE project_id = ?', body.project_id
  );

  const result = await db.run(
    `INSERT INTO tasks (project_id, title, description, owner_id, status, progress_pct, order_idx, created_by)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    body.project_id, body.title.trim(), body.description ?? '', body.owner_id ?? null,
    'not_started', 0, Number(countRow?.c ?? 0), user.id
  );

  const task = await db.get('SELECT * FROM tasks WHERE id = ?', result.lastInsertRowid);
  return NextResponse.json(task, { status: 201 });
}
