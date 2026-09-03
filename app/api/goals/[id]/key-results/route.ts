import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { getSessionFromRequest } from '@/lib/auth';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getSessionFromRequest(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await params;
  const body = await req.json();
  if (!body.title?.trim()) return NextResponse.json({ error: 'Tên kết quả then chốt là bắt buộc' }, { status: 400 });

  const db = await getDb();
  const countRow = await db.get<{ c: string | number }>('SELECT COUNT(*) as c FROM key_results WHERE goal_id = ?', id);
  const result = await db.run(
    `INSERT INTO key_results (goal_id, title, unit, start_value, target_value, current_value, order_idx) VALUES (?, ?, ?, ?, ?, ?, ?)`,
    id, body.title.trim(), body.unit ?? '', body.start_value ?? 0, body.target_value ?? 100,
    body.start_value ?? 0, Number(countRow?.c ?? 0)
  );
  const kr = await db.get('SELECT * FROM key_results WHERE id = ?', result.lastInsertRowid);
  return NextResponse.json(kr, { status: 201 });
}
