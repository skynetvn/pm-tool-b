import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { getSessionFromRequest } from '@/lib/auth';

// GET: list saved dynamic-report views for the current user
export async function GET(req: NextRequest) {
  const user = await getSessionFromRequest(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const db = await getDb();
  const rows = await db.all<{
    id: number; name: string; group_by: string; metrics_json: string;
    period_start: string; period_end: string; created_at: string;
  }>(
    `SELECT id, name, group_by, metrics_json, period_start, period_end, created_at
     FROM portfolio_dynamic_views WHERE user_id = ? ORDER BY created_at DESC`,
    user.id
  );
  return NextResponse.json({
    views: rows.map(r => ({ ...r, metrics: JSON.parse(r.metrics_json || '[]') })),
  });
}

// POST: save a new view
export async function POST(req: NextRequest) {
  const user = await getSessionFromRequest(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const name: string = (body.name ?? '').trim();
  const groupBy: string = body.group_by ?? 'program';
  const metrics: string[] = Array.isArray(body.metrics) ? body.metrics : [];
  const periodStart: string = body.period_start ?? '';
  const periodEnd: string = body.period_end ?? '';

  if (!name) return NextResponse.json({ error: 'Name is required' }, { status: 400 });

  const db = await getDb();
  const result = await db.run(
    `INSERT INTO portfolio_dynamic_views (company_id, user_id, name, group_by, metrics_json, period_start, period_end)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    user.company_id, user.id, name, groupBy, JSON.stringify(metrics), periodStart, periodEnd
  );
  return NextResponse.json({ id: result.lastInsertRowid });
}
