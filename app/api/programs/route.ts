import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { getSessionFromRequest } from '@/lib/auth';

const PROGRAM_LIST_SELECT = `
  SELECT pr.*, u.display_name as owner_name, u.username as owner_username,
    COALESCE(roll.project_count, 0) as project_count,
    COALESCE(roll.task_count, 0) as task_count,
    COALESCE(roll.progress_pct, 0) as progress_pct,
    COALESCE(roll.prev_progress_pct, 0) as prev_progress_pct
  FROM programs pr
  LEFT JOIN users u ON pr.owner_id = u.id
  LEFT JOIN (
    SELECT p.program_id,
      COUNT(DISTINCT p.id) as project_count,
      COUNT(t.id) as task_count,
      COALESCE(AVG(t.progress_pct), 0) as progress_pct,
      COALESCE(AVG(COALESCE(prevc.progress_pct, t.progress_pct)), 0) as prev_progress_pct
    FROM projects p
    LEFT JOIN tasks t ON t.project_id = p.id
    LEFT JOIN LATERAL (
      SELECT progress_pct FROM task_checkins WHERE task_id = t.id ORDER BY created_at DESC LIMIT 1 OFFSET 1
    ) prevc ON true
    GROUP BY p.program_id
  ) roll ON roll.program_id = pr.id
`;

export async function GET(req: NextRequest) {
  const user = await getSessionFromRequest(req);
  if (!user) return NextResponse.json([], { status: 401 });

  const db = await getDb();
  const programs = user.is_admin
    ? await db.all(`${PROGRAM_LIST_SELECT} ORDER BY pr.created_at DESC`)
    : await db.all(`${PROGRAM_LIST_SELECT} WHERE pr.company_id = ? ORDER BY pr.created_at DESC`, user.company_id);
  return NextResponse.json(programs);
}

export async function POST(req: NextRequest) {
  const user = await getSessionFromRequest(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  if (!body.name?.trim()) return NextResponse.json({ error: 'Tên program là bắt buộc' }, { status: 400 });

  const db = await getDb();
  const companyId = user.is_admin ? (body.company_id ?? user.company_id ?? null) : user.company_id;

  const result = await db.run(
    `INSERT INTO programs (company_id, name, description, owner_id, include_in_portfolio, created_by)
     VALUES (?, ?, ?, ?, ?, ?)`,
    companyId, body.name.trim(), body.description ?? '', body.owner_id ?? null,
    body.include_in_portfolio === false ? 0 : 1, user.id
  );

  const program = await db.get('SELECT * FROM programs WHERE id = ?', result.lastInsertRowid);
  return NextResponse.json(program, { status: 201 });
}
