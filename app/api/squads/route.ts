import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { getSessionFromRequest } from '@/lib/auth';

const SQUAD_SELECT = `
  SELECT s.*, u.display_name as lead_name, u.username as lead_username,
    COALESCE(g.goal_count, 0) as goal_count,
    COALESCE(g.on_track_count, 0) as on_track_count,
    COALESCE(g.at_risk_count, 0) as at_risk_count,
    COALESCE(g.completed_count, 0) as completed_count,
    COALESCE(g.avg_kr_progress, 0) as avg_kr_progress,
    COALESCE(ini.initiative_count, 0) as initiative_count
  FROM squads s
  LEFT JOIN users u ON s.lead_id = u.id
  LEFT JOIN (
    SELECT gg.squad_id,
      COUNT(*) as goal_count,
      COUNT(*) FILTER (WHERE gg.status IN ('on_track','completed')) as on_track_count,
      COUNT(*) FILTER (WHERE gg.status IN ('at_risk','off_track')) as at_risk_count,
      COUNT(*) FILTER (WHERE gg.status = 'completed') as completed_count,
      AVG(COALESCE(kr.avg_progress, 0)) as avg_kr_progress
    FROM goals gg
    LEFT JOIN (
      SELECT goal_id,
        AVG(CASE WHEN target_value = start_value THEN 100
          ELSE LEAST(100, GREATEST(0, (current_value - start_value) / NULLIF(target_value - start_value, 0) * 100)) END) as avg_progress
      FROM key_results GROUP BY goal_id
    ) kr ON kr.goal_id = gg.id
    WHERE gg.squad_id IS NOT NULL GROUP BY gg.squad_id
  ) g ON g.squad_id = s.id
  LEFT JOIN (
    SELECT gg.squad_id, COUNT(i.*) as initiative_count
    FROM goals gg JOIN initiatives i ON i.goal_id = gg.id
    WHERE gg.squad_id IS NOT NULL GROUP BY gg.squad_id
  ) ini ON ini.squad_id = s.id
`;

export async function GET(req: NextRequest) {
  const user = await getSessionFromRequest(req);
  if (!user) return NextResponse.json([], { status: 401 });

  const db = await getDb();
  const squads = user.is_admin
    ? await db.all(`${SQUAD_SELECT} ORDER BY s.created_at DESC`)
    : await db.all(`${SQUAD_SELECT} WHERE s.company_id = ? ORDER BY s.created_at DESC`, user.company_id);
  return NextResponse.json(squads);
}

export async function POST(req: NextRequest) {
  const user = await getSessionFromRequest(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  if (!body.name?.trim()) return NextResponse.json({ error: 'Tên nhóm là bắt buộc' }, { status: 400 });

  const db = await getDb();
  const companyId = user.is_admin ? (body.company_id ?? user.company_id ?? null) : user.company_id;

  const result = await db.run(
    `INSERT INTO squads (company_id, name, description, lead_id) VALUES (?, ?, ?, ?)`,
    companyId, body.name.trim(), body.description ?? '', body.lead_id ?? null
  );
  const squad = await db.get('SELECT * FROM squads WHERE id = ?', result.lastInsertRowid);
  return NextResponse.json(squad, { status: 201 });
}
