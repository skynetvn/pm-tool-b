import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { getSessionFromRequest } from '@/lib/auth';

const PROJECT_LIST_SELECT = `
  SELECT p.*, u.display_name as owner_name, u.username as owner_username,
    pg.name as program_name,
    COALESCE(roll.task_count, 0) as task_count,
    COALESCE(roll.progress_pct, 0) as progress_pct,
    COALESCE(roll.prev_progress_pct, 0) as prev_progress_pct
  FROM projects p
  LEFT JOIN users u ON p.owner_id = u.id
  LEFT JOIN programs pg ON p.program_id = pg.id
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
`;

export async function GET(req: NextRequest) {
  const user = await getSessionFromRequest(req);
  if (!user) return NextResponse.json([], { status: 401 });

  const db = await getDb();
  const projects = user.is_admin
    ? await db.all(`${PROJECT_LIST_SELECT} ORDER BY p.created_at DESC`)
    : await db.all(`${PROJECT_LIST_SELECT} WHERE p.company_id = ? ORDER BY p.created_at DESC`, user.company_id);
  return NextResponse.json(projects);
}

export async function POST(req: NextRequest) {
  const user = await getSessionFromRequest(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  if (!body.name?.trim()) return NextResponse.json({ error: 'Tên dự án là bắt buộc' }, { status: 400 });

  const db = await getDb();
  const companyId = user.is_admin ? (body.company_id ?? user.company_id ?? null) : user.company_id;

  const result = await db.run(
    `INSERT INTO projects (company_id, program_id, name, description, owner_id, status, start_date, end_date, created_by)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    companyId, body.program_id ?? null, body.name.trim(), body.description ?? '', body.owner_id ?? null,
    body.status ?? 'active', body.start_date ?? null, body.end_date ?? null, user.id
  );

  const project = await db.get('SELECT * FROM projects WHERE id = ?', result.lastInsertRowid);
  return NextResponse.json(project, { status: 201 });
}
