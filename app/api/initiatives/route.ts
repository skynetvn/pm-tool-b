import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { getSessionFromRequest } from '@/lib/auth';

const INITIATIVE_SELECT = `
  SELECT i.*, u.display_name as owner_name, u.username as owner_username, g.title as goal_title, pi.title as parent_initiative_title
  FROM initiatives i
  LEFT JOIN users u ON i.owner_id = u.id
  LEFT JOIN goals g ON i.goal_id = g.id
  LEFT JOIN initiatives pi ON i.parent_initiative_id = pi.id
`;

export async function GET(req: NextRequest) {
  const user = await getSessionFromRequest(req);
  if (!user) return NextResponse.json([], { status: 401 });

  const { searchParams } = new URL(req.url);
  const goalId = searchParams.get('goal_id');

  const db = await getDb();
  const scope = user.is_admin ? '' : ' AND i.company_id = ?';
  const scopeParams = user.is_admin ? [] : [user.company_id];

  let sql = `${INITIATIVE_SELECT} WHERE 1=1${scope}`;
  const params: unknown[] = [...scopeParams];
  if (goalId) { sql += ' AND i.goal_id = ?'; params.push(goalId); }
  sql += ' ORDER BY i.created_at DESC';

  const initiatives = await db.all(sql, ...params);
  return NextResponse.json(initiatives);
}

export async function POST(req: NextRequest) {
  const user = await getSessionFromRequest(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  if (!body.title?.trim()) return NextResponse.json({ error: 'Tên sáng kiến là bắt buộc' }, { status: 400 });

  const db = await getDb();
  const companyId = user.is_admin ? (body.company_id ?? user.company_id ?? null) : user.company_id;

  const result = await db.run(
    `INSERT INTO initiatives (company_id, goal_id, parent_initiative_id, level, title, description, owner_id, status, priority, start_date, end_date, progress_pct, output_product, created_by)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    companyId, body.goal_id ?? null, body.parent_initiative_id ?? null, body.level ?? 1, body.title.trim(), body.description ?? '', body.owner_id ?? null,
    body.status ?? 'proposed', body.priority ?? 'medium', body.start_date ?? null, body.end_date ?? null,
    body.progress_pct ?? 0, body.output_product ?? null, user.id
  );

  const initiative = await db.get('SELECT * FROM initiatives WHERE id = ?', result.lastInsertRowid);
  return NextResponse.json(initiative, { status: 201 });
}
