import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { getSessionFromRequest } from '@/lib/auth';

async function loadProgram(db: Awaited<ReturnType<typeof getDb>>, id: string) {
  const program = await db.get(
    `SELECT pr.*, u.display_name as owner_name, u.username as owner_username
     FROM programs pr LEFT JOIN users u ON pr.owner_id = u.id WHERE pr.id = ?`, id
  );
  if (!program) return null;

  const projects = await db.all(
    `SELECT p.*, u.display_name as owner_name,
       COALESCE(roll.task_count, 0) as task_count,
       COALESCE(roll.progress_pct, 0) as progress_pct,
       COALESCE(roll.prev_progress_pct, 0) as prev_progress_pct
     FROM projects p
     LEFT JOIN users u ON p.owner_id = u.id
     LEFT JOIN (
       SELECT t.project_id,
         COUNT(t.id) as task_count,
         COALESCE(AVG(t.progress_pct), 0) as progress_pct,
         COALESCE(AVG(COALESCE(prevc.progress_pct, t.progress_pct)), 0) as prev_progress_pct
       FROM tasks t
       LEFT JOIN LATERAL (
         SELECT progress_pct FROM task_checkins WHERE task_id = t.id ORDER BY created_at DESC LIMIT 1 OFFSET 1
       ) prevc ON true
       GROUP BY t.project_id
     ) roll ON roll.project_id = p.id
     WHERE p.program_id = ?
     ORDER BY p.created_at DESC`, id
  );

  return { ...(program as object), projects };
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getSessionFromRequest(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await params;
  const db = await getDb();
  const program = await loadProgram(db, id);
  if (!program) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(program);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getSessionFromRequest(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await params;
  const body = await req.json();
  const db = await getDb();

  await db.run(
    `UPDATE programs SET name = ?, description = ?, owner_id = ?, include_in_portfolio = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
    body.name, body.description ?? '', body.owner_id ?? null, body.include_in_portfolio === false ? 0 : 1, id
  );

  const program = await loadProgram(db, id);
  return NextResponse.json(program);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getSessionFromRequest(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await params;
  const db = await getDb();
  await db.run('DELETE FROM programs WHERE id = ?', id);
  return NextResponse.json({ ok: true });
}
