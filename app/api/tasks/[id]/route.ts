import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { getSessionFromRequest } from '@/lib/auth';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getSessionFromRequest(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await params;
  const body = await req.json();
  const db = await getDb();

  await db.run(
    `UPDATE tasks SET title = ?, description = ?, owner_id = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
    body.title, body.description ?? '', body.owner_id ?? null, id
  );

  const task = await db.get('SELECT * FROM tasks WHERE id = ?', id);
  return NextResponse.json(task);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getSessionFromRequest(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await params;
  const db = await getDb();
  await db.run('DELETE FROM tasks WHERE id = ?', id);
  return NextResponse.json({ ok: true });
}
