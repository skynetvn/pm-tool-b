import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { getSessionFromRequest } from '@/lib/auth';

async function loadGoal(db: Awaited<ReturnType<typeof getDb>>, id: string) {
  const goal = await db.get(
    `SELECT g.*, u.display_name as owner_name, u.username as owner_username, sq.name as squad_name, pg.title as parent_goal_title
     FROM goals g LEFT JOIN users u ON g.owner_id = u.id LEFT JOIN squads sq ON g.squad_id = sq.id
     LEFT JOIN goals pg ON g.parent_goal_id = pg.id WHERE g.id = ?`, id
  );
  if (!goal) return null;
  const key_results = await db.all('SELECT * FROM key_results WHERE goal_id = ? ORDER BY order_idx, id', id);
  const initiatives = await db.all(
    `SELECT i.*, u.display_name as owner_name FROM initiatives i LEFT JOIN users u ON i.owner_id = u.id WHERE i.goal_id = ? ORDER BY i.created_at DESC`, id
  );
  const checkins = await db.all(
    `SELECT c.*, u.display_name as user_name FROM goal_checkins c LEFT JOIN users u ON c.user_id = u.id WHERE c.goal_id = ? ORDER BY c.created_at DESC`, id
  );
  return { ...(goal as object), key_results, initiatives, checkins };
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getSessionFromRequest(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await params;
  const db = await getDb();
  const goal = await loadGoal(db, id);
  if (!goal) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(goal);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getSessionFromRequest(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await params;
  const body = await req.json();
  const db = await getDb();

  await db.run(
    `UPDATE goals SET title = ?, description = ?, owner_id = ?, squad_id = ?, period_label = ?, start_date = ?, end_date = ?, status = ?, parent_goal_id = ?, level = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
    body.title, body.description ?? '', body.owner_id ?? null, body.squad_id ?? null, body.period_label ?? '',
    body.start_date ?? null, body.end_date ?? null, body.status ?? 'not_started', body.parent_goal_id ?? null, body.level ?? 1, id
  );

  const goal = await loadGoal(db, id);
  return NextResponse.json(goal);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getSessionFromRequest(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await params;
  const db = await getDb();
  await db.run('DELETE FROM goals WHERE id = ?', id);
  return NextResponse.json({ ok: true });
}
