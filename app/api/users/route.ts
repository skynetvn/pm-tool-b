import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { getSessionFromRequest } from '@/lib/auth';

// Lightweight user list for owner-picker dropdowns (Goals/Initiatives).
export async function GET(req: NextRequest) {
  const user = await getSessionFromRequest(req);
  if (!user) return NextResponse.json([], { status: 401 });

  const db = await getDb();
  const users = user.is_admin
    ? await db.all(`SELECT id, username, display_name, company_id FROM users ORDER BY display_name, username`)
    : await db.all(
        `SELECT id, username, display_name, company_id FROM users WHERE company_id = ? ORDER BY display_name, username`,
        user.company_id
      );
  return NextResponse.json(users);
}
