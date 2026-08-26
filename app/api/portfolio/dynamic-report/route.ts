import { NextRequest, NextResponse } from 'next/server';
import { getSessionFromRequest } from '@/lib/auth';
import { getDynamicReport, parseDynamicReportParams } from '@/lib/portfolio-dynamic-report';

export async function GET(req: NextRequest) {
  const user = await getSessionFromRequest(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const params = parseDynamicReportParams(req.nextUrl.searchParams);
  const result = await getDynamicReport(user, params);

  if ('error' in result) return NextResponse.json({ error: result.error }, { status: result.status });
  return NextResponse.json(result);
}
