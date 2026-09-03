import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { getSessionFromRequest } from '@/lib/auth';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getSessionFromRequest(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await params;
  const body = await req.json();
  if (!body.note?.trim()) return NextResponse.json({ error: 'Nội dung cập nhật là bắt buộc' }, { status: 400 });

  const db = await getDb();
  await db.run(
    'INSERT INTO goal_checkins (goal_id, user_id, note, status) VALUES (?, ?, ?, ?)',
    id, user.id, body.note.trim(), body.status ?? 'on_track'
  );
  if (body.status) {
    await db.run('UPDATE goals SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', body.status, id);
  }
  const checkins = await db.all(
    `SELECT c.*, u.display_name as user_name FROM goal_checkins c LEFT JOIN users u ON c.user_id = u.id WHERE c.goal_id = ? ORDER BY c.created_at DESC`, id
  );
  return NextResponse.json(checkins, { status: 201 });
}
