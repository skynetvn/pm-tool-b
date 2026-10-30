import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { getSessionFromRequest } from '@/lib/auth';

async function loadProject(db: Awaited<ReturnType<typeof getDb>>, id: string) {
  const project = await db.get(
    `SELECT p.*, u.display_name as owner_name, u.username as owner_username, pg.name as program_name, pg.id as program_id_check
     FROM projects p LEFT JOIN users u ON p.owner_id = u.id LEFT JOIN programs pg ON p.program_id = pg.id
     WHERE p.id = ?`, id
  );
  if (!project) return null;

  const tasks = await db.all(
    `SELECT t.*, u.display_name as owner_name,
       cur.status as current_status, cur.progress_pct as current_progress, cur.note as current_note, cur.created_at as current_at,
       prevc.status as previous_status, prevc.progress_pct as previous_progress, prevc.note as previous_note, prevc.created_at as previous_at
     FROM tasks t
     LEFT JOIN users u ON t.owner_id = u.id
     LEFT JOIN LATERAL (
       SELECT * FROM task_checkins WHERE task_id = t.id ORDER BY created_at DESC LIMIT 1
     ) cur ON true
     LEFT JOIN LATERAL (
       SELECT * FROM task_checkins WHERE task_id = t.id ORDER BY created_at DESC LIMIT 1 OFFSET 1
     ) prevc ON true
     WHERE t.project_id = ?
     ORDER BY t.order_idx, t.id`, id
  );

  return { ...(project as object), tasks };
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getSessionFromRequest(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await params;
  const db = await getDb();
  const project = await loadProject(db, id);
  if (!project) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(project);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getSessionFromRequest(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await params;
  const body = await req.json();
  const db = await getDb();

  await db.run(
    `UPDATE projects SET name = ?, description = ?, owner_id = ?, program_id = ?, status = ?, start_date = ?, end_date = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
    body.name, body.description ?? '', body.owner_id ?? null, body.program_id ?? null,
    body.status ?? 'active', body.start_date ?? null, body.end_date ?? null, id
  );

  const project = await loadProject(db, id);
  return NextResponse.json(project);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getSessionFromRequest(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await params;
  const db = await getDb();
  await db.run('DELETE FROM projects WHERE id = ?', id);
  return NextResponse.json({ ok: true });
}
