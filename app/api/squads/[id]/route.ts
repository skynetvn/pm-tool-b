import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { getSessionFromRequest } from '@/lib/auth';

const GOAL_SELECT = `
  SELECT g.*, u.display_name as owner_name, u.username as owner_username,
    COALESCE(kr.avg_progress, 0) as kr_progress,
    COALESCE(kr.kr_count, 0) as kr_count,
    COALESCE(ini.initiative_count, 0) as initiative_count
  FROM goals g
  LEFT JOIN users u ON g.owner_id = u.id
  LEFT JOIN (
    SELECT goal_id,
      AVG(CASE WHEN target_value = start_value THEN 100
        ELSE LEAST(100, GREATEST(0, (current_value - start_value) / NULLIF(target_value - start_value, 0) * 100)) END) as avg_progress,
      COUNT(*) as kr_count
    FROM key_results GROUP BY goal_id
  ) kr ON kr.goal_id = g.id
  LEFT JOIN (
    SELECT goal_id, COUNT(*) as initiative_count FROM initiatives WHERE goal_id IS NOT NULL GROUP BY goal_id
  ) ini ON ini.goal_id = g.id
  WHERE g.squad_id = ?
  ORDER BY g.created_at DESC
`;

async function loadSquad(db: Awaited<ReturnType<typeof getDb>>, id: string) {
  const squad = await db.get(
    `SELECT s.*, u.display_name as lead_name, u.username as lead_username
     FROM squads s LEFT JOIN users u ON s.lead_id = u.id WHERE s.id = ?`, id
  );
  if (!squad) return null;
  const goals = await db.all(GOAL_SELECT, id);
  return { ...(squad as object), goals };
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getSessionFromRequest(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await params;
  const db = await getDb();
  const squad = await loadSquad(db, id);
  if (!squad) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(squad);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getSessionFromRequest(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await params;
  const body = await req.json();
  const db = await getDb();

  await db.run(
    `UPDATE squads SET name = ?, description = ?, lead_id = ? WHERE id = ?`,
    body.name, body.description ?? '', body.lead_id ?? null, id
  );
  const squad = await loadSquad(db, id);
  return NextResponse.json(squad);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getSessionFromRequest(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await params;
  const db = await getDb();
  await db.run('DELETE FROM squads WHERE id = ?', id);
  return NextResponse.json({ ok: true });
}
