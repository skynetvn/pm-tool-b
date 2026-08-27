import { NextRequest, NextResponse } from 'next/server';
import { getSessionFromRequest } from '@/lib/auth';
import { getDynamicReport, parseDynamicReportParams } from '@/lib/portfolio-dynamic-report';
import { generateDynamicReportPPT } from '@/lib/export/ppt';

export async function GET(req: NextRequest) {
  const user = await getSessionFromRequest(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const params = parseDynamicReportParams(req.nextUrl.searchParams);
  const result = await getDynamicReport(user, params);
  if ('error' in result) return NextResponse.json({ error: result.error }, { status: result.status });

  const buffer = await generateDynamicReportPPT(result.group_by, result.rows, result.meta.generated_at);
  return new NextResponse(buffer as unknown as BodyInit, {
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'Content-Disposition': `attachment; filename="DynamicPortfolioReport_${result.group_by}.pptx"`,
    },
  });
}
