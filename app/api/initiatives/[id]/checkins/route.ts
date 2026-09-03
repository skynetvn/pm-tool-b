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
    'INSERT INTO initiative_checkins (initiative_id, user_id, note, progress_pct) VALUES (?, ?, ?, ?)',
    id, user.id, body.note.trim(), body.progress_pct ?? null
  );
  if (body.progress_pct !== undefined && body.progress_pct !== null) {
    await db.run('UPDATE initiatives SET progress_pct = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', body.progress_pct, id);
  }
  const checkins = await db.all(
    `SELECT c.*, u.display_name as user_name FROM initiative_checkins c LEFT JOIN users u ON c.user_id = u.id WHERE c.initiative_id = ? ORDER BY c.created_at DESC`, id
  );
  return NextResponse.json(checkins, { status: 201 });
}
