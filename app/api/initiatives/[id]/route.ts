import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { getSessionFromRequest } from '@/lib/auth';

async function loadInitiative(db: Awaited<ReturnType<typeof getDb>>, id: string) {
  const initiative = await db.get(
    `SELECT i.*, u.display_name as owner_name, u.username as owner_username, g.title as goal_title, pi.title as parent_initiative_title
     FROM initiatives i LEFT JOIN users u ON i.owner_id = u.id LEFT JOIN goals g ON i.goal_id = g.id
     LEFT JOIN initiatives pi ON i.parent_initiative_id = pi.id
     WHERE i.id = ?`, id
  );
  if (!initiative) return null;
  const checkins = await db.all(
    `SELECT c.*, u.display_name as user_name FROM initiative_checkins c LEFT JOIN users u ON c.user_id = u.id WHERE c.initiative_id = ? ORDER BY c.created_at DESC`, id
  );
  return { ...(initiative as object), checkins };
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getSessionFromRequest(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await params;
  const db = await getDb();
  const initiative = await loadInitiative(db, id);
  if (!initiative) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(initiative);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getSessionFromRequest(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await params;
  const body = await req.json();
  const db = await getDb();

  await db.run(
    `UPDATE initiatives SET title = ?, description = ?, owner_id = ?, goal_id = ?, parent_initiative_id = ?, level = ?, status = ?, priority = ?, start_date = ?, end_date = ?, progress_pct = ?, output_product = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
    body.title, body.description ?? '', body.owner_id ?? null, body.goal_id ?? null, body.parent_initiative_id ?? null, body.level ?? 1, body.status ?? 'proposed',
    body.priority ?? 'medium', body.start_date ?? null, body.end_date ?? null, body.progress_pct ?? 0, body.output_product ?? null, id
  );

  const initiative = await loadInitiative(db, id);
  return NextResponse.json(initiative);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getSessionFromRequest(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await params;
  const db = await getDb();
  await db.run('DELETE FROM initiatives WHERE id = ?', id);
  return NextResponse.json({ ok: true });
}
