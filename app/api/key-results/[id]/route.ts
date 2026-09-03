import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { getSessionFromRequest } from '@/lib/auth';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getSessionFromRequest(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await params;
  const body = await req.json();
  const db = await getDb();

  if (body.current_value !== undefined && Object.keys(body).length === 1) {
    await db.run('UPDATE key_results SET current_value = ? WHERE id = ?', body.current_value, id);
  } else {
    await db.run(
      `UPDATE key_results SET title = ?, unit = ?, start_value = ?, target_value = ?, current_value = ? WHERE id = ?`,
      body.title, body.unit ?? '', body.start_value ?? 0, body.target_value ?? 100, body.current_value ?? 0, id
    );
  }
  const kr = await db.get('SELECT * FROM key_results WHERE id = ?', id);
  return NextResponse.json(kr);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getSessionFromRequest(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await params;
  const db = await getDb();
  await db.run('DELETE FROM key_results WHERE id = ?', id);
  return NextResponse.json({ ok: true });
}
