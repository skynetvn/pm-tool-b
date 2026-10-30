import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { getSessionFromRequest } from '@/lib/auth';

// Portfolio = roll-up of every Program for the company. Each Program carries
// `include_in_portfolio` so a Program can be excluded from the Portfolio total
// while its own Program-level report still shows everything.
const PROGRAM_ROLLUP_SELECT = `
  SELECT pr.id, pr.name, pr.include_in_portfolio, u.display_name as owner_name,
    COALESCE(roll.project_count, 0) as project_count,
    COALESCE(roll.task_count, 0) as task_count,
    COALESCE(roll.progress_pct, 0) as progress_pct,
    COALESCE(roll.prev_progress_pct, 0) as prev_progress_pct,
    COALESCE(roll.at_risk_count, 0) as at_risk_count,
    COALESCE(roll.off_track_count, 0) as off_track_count,
    COALESCE(roll.done_count, 0) as done_count
  FROM programs pr
  LEFT JOIN users u ON pr.owner_id = u.id
  LEFT JOIN (
    SELECT p.program_id,
      COUNT(DISTINCT p.id) as project_count,
      COUNT(t.id) as task_count,
      COALESCE(AVG(t.progress_pct), 0) as progress_pct,
      COALESCE(AVG(COALESCE(prevc.progress_pct, t.progress_pct)), 0) as prev_progress_pct,
      COUNT(*) FILTER (WHERE t.status = 'at_risk') as at_risk_count,
      COUNT(*) FILTER (WHERE t.status = 'off_track') as off_track_count,
      COUNT(*) FILTER (WHERE t.status = 'done') as done_count
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
  if (!user) return NextResponse.json({ programs: [] }, { status: 401 });

  const db = await getDb();
  const programs = user.is_admin
    ? await db.all(`${PROGRAM_ROLLUP_SELECT} ORDER BY pr.name`)
    : await db.all(`${PROGRAM_ROLLUP_SELECT} WHERE pr.company_id = ? ORDER BY pr.name`, user.company_id);

  return NextResponse.json({ programs });
}
