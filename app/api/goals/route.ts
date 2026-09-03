import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { getSessionFromRequest } from '@/lib/auth';

const GOAL_SELECT = `
  SELECT g.*, u.display_name as owner_name, u.username as owner_username,
    sq.name as squad_name,
    COALESCE(kr.avg_progress, 0) as kr_progress,
    COALESCE(kr.kr_count, 0) as kr_count,
    COALESCE(ini.initiative_count, 0) as initiative_count
  FROM goals g
  LEFT JOIN users u ON g.owner_id = u.id
  LEFT JOIN squads sq ON g.squad_id = sq.id
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
`;

export async function GET(req: NextRequest) {
  const user = await getSessionFromRequest(req);
  if (!user) return NextResponse.json([], { status: 401 });

  const db = await getDb();
  const goals = user.is_admin
    ? await db.all(`${GOAL_SELECT} ORDER BY g.created_at DESC`)
    : await db.all(`${GOAL_SELECT} WHERE g.company_id = ? ORDER BY g.created_at DESC`, user.company_id);
  return NextResponse.json(goals);
}

export async function POST(req: NextRequest) {
  const user = await getSessionFromRequest(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  if (!body.title?.trim()) return NextResponse.json({ error: 'Tên mục tiêu là bắt buộc' }, { status: 400 });

  const db = await getDb();
  const companyId = user.is_admin ? (body.company_id ?? user.company_id ?? null) : user.company_id;

  const result = await db.run(
    `INSERT INTO goals (company_id, squad_id, parent_goal_id, title, description, owner_id, period_label, start_date, end_date, status, created_by)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    companyId, body.squad_id ?? null, body.parent_goal_id ?? null, body.title.trim(), body.description ?? '',
    body.owner_id ?? null, body.period_label ?? '', body.start_date ?? null, body.end_date ?? null,
    body.status ?? 'not_started', user.id
  );

  const keyResults: { title: string; unit?: string; start_value?: number; target_value?: number }[] = body.key_results ?? [];
  for (let i = 0; i < keyResults.length; i++) {
    const kr = keyResults[i];
    if (!kr.title?.trim()) continue;
    await db.run(
      `INSERT INTO key_results (goal_id, title, unit, start_value, target_value, current_value, order_idx) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      result.lastInsertRowid, kr.title.trim(), kr.unit ?? '', kr.start_value ?? 0, kr.target_value ?? 100, kr.start_value ?? 0, i
    );
  }

  const goal = await db.get('SELECT * FROM goals WHERE id = ?', result.lastInsertRowid);
  return NextResponse.json(goal, { status: 201 });
}
