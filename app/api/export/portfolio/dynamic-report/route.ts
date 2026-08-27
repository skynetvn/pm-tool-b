import { NextRequest, NextResponse } from 'next/server';
import ExcelJS from 'exceljs';
import { getSessionFromRequest } from '@/lib/auth';
import { getDynamicReport, parseDynamicReportParams, type ReportRow, type MetricKey, type GroupBy } from '@/lib/portfolio-dynamic-report';

const NAVY = 'FF1E293B';
const WHITE = 'FFFFFFFF';
const RED_BG = 'FFFEE2E2';
const RED_FN = 'FFB91C1C';
const AMBER_BG = 'FFFEF3C7';
const AMBER_FN = 'FFB45309';
const GREEN_BG = 'FFDCFCE7';
const GREEN_FN = 'FF15803D';
const STRIPE = 'FFF8FAFC';
const SEP = 'FFE2E8F0';

const HEADER_FONT: Partial<ExcelJS.Font> = { color: { argb: WHITE }, bold: true, size: 10, name: 'Calibri' };
const BODY_FONT: Partial<ExcelJS.Font> = { size: 9, name: 'Calibri' };

function solidFill(argb: string): ExcelJS.Fill {
  return { type: 'pattern', pattern: 'solid', fgColor: { argb } };
}
function ragFill(rag: string): { bg: ExcelJS.Fill; fn: string } {
  if (rag === 'red') return { bg: solidFill(RED_BG), fn: RED_FN };
  if (rag === 'amber') return { bg: solidFill(AMBER_BG), fn: AMBER_FN };
  return { bg: solidFill(GREEN_BG), fn: GREEN_FN };
}

const DIMENSION_LABELS: Record<GroupBy, string> = {
  program: 'Chương trình', project: 'Dự án', phase: 'Giai đoạn', rag: 'Sức khỏe (RAG)', pm: 'PM', month: 'Tháng', activity: 'Activity',
};
const money = (n: number) => Math.round(n).toLocaleString('vi-VN');

export async function GET(req: NextRequest) {
  const user = await getSessionFromRequest(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const params = parseDynamicReportParams(req.nextUrl.searchParams);
  const result = await getDynamicReport(user, params);
  if ('error' in result) return NextResponse.json({ error: result.error }, { status: result.status });

  const wb = new ExcelJS.Workbook();
  wb.creator = 'PM Tool';
  wb.created = new Date();
  const ws = wb.addWorksheet('Dynamic Report');

  const metrics = params.metrics;
  const isActivity = result.group_by === 'activity';
  const isMonth = result.group_by === 'month';

  type Col = { header: string; width: number; get: (r: ReportRow) => string | number };
  const cols: Col[] = [
    { header: DIMENSION_LABELS[result.group_by], width: 28, get: r => r.label },
    { header: 'Số dự án', width: 10, get: r => r.count },
  ];
  if (isActivity) {
    cols.push({ header: 'Trạng thái', width: 16, get: r => r.detail?.status ?? '' });
  }
  if (!isMonth && metrics.includes('schedule' as MetricKey)) {
    cols.push({ header: '% Hoàn thành', width: 13, get: r => (r.metrics.schedule as { completion_pct: number } | undefined)?.completion_pct ?? '' });
    if (!isActivity) {
      cols.push({
        header: 'RAG', width: 10,
        get: r => {
          const s = r.metrics.schedule as { rag?: string; rag_counts?: { red: number; amber: number; green: number } } | undefined;
          if (!s) return '';
          if (s.rag) return s.rag.toUpperCase();
          if (s.rag_counts) return `${s.rag_counts.red}R / ${s.rag_counts.amber}A / ${s.rag_counts.green}G`;
          return '';
        },
      });
    }
  }
  if (metrics.includes('budget' as MetricKey)) {
    cols.push({ header: 'Ngân sách thực tế (₫)', width: 20, get: r => money((r.metrics.budget as { actual: number } | undefined)?.actual ?? 0) });
    cols.push({ header: 'Ngân sách kế hoạch (₫)', width: 20, get: r => money((r.metrics.budget as { planned: number } | undefined)?.planned ?? 0) });
    cols.push({ header: 'Chênh lệch %', width: 13, get: r => (r.metrics.budget as { variance_pct: number | null } | undefined)?.variance_pct ?? '' });
  }
  if (!isActivity && !isMonth && metrics.includes('risk' as MetricKey)) {
    cols.push({ header: 'Rủi ro mở', width: 11, get: r => (r.metrics.risk as { open_risks: number } | undefined)?.open_risks ?? 0 });
    cols.push({ header: 'Vấn đề mở', width: 11, get: r => (r.metrics.risk as { open_issues: number } | undefined)?.open_issues ?? 0 });
  }
  if (!isActivity && !isMonth && metrics.includes('resource' as MetricKey)) {
    cols.push({ header: 'FTE thực tế', width: 12, get: r => (r.metrics.resource as { actual: number } | undefined)?.actual ?? 0 });
    cols.push({ header: 'FTE định biên', width: 12, get: r => (r.metrics.resource as { allocated: number } | undefined)?.allocated ?? 0 });
    cols.push({ header: 'Fill rate %', width: 12, get: r => (r.metrics.resource as { fill_rate_pct: number | null } | undefined)?.fill_rate_pct ?? '' });
  }
  if (!isActivity && !isMonth && metrics.includes('bugs' as MetricKey)) {
    cols.push({ header: 'Bugs mở', width: 10, get: r => (r.metrics.bugs as { open: number } | undefined)?.open ?? 0 });
    cols.push({ header: 'Bugs critical', width: 12, get: r => (r.metrics.bugs as { critical: number } | undefined)?.critical ?? 0 });
  }
  if (!isActivity && !isMonth && metrics.includes('milestone' as MetricKey)) {
    cols.push({ header: 'Milestone trễ', width: 12, get: r => (r.metrics.milestone as { overdue: number } | undefined)?.overdue ?? 0 });
    cols.push({ header: 'Milestone sắp tới', width: 15, get: r => (r.metrics.milestone as { upcoming: number } | undefined)?.upcoming ?? 0 });
  }

  // Title
  const titleRow = ws.addRow([`Dynamic Portfolio Report — Nhóm theo: ${DIMENSION_LABELS[result.group_by]}`]);
  ws.mergeCells(1, 1, 1, cols.length);
  titleRow.getCell(1).font = { bold: true, size: 14, color: { argb: 'FF1E293B' }, name: 'Calibri' };
  titleRow.height = 26;
  ws.addRow([`Generated: ${new Date(result.meta.generated_at).toLocaleString('vi-VN')}`]);
  ws.addRow([]);

  // Header
  const hdrRow = ws.addRow(cols.map(c => c.header));
  hdrRow.eachCell(cell => {
    cell.fill = solidFill(NAVY);
    cell.font = HEADER_FONT;
    cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
    cell.border = { bottom: { style: 'thin', color: { argb: SEP } }, right: { style: 'thin', color: { argb: SEP } } };
  });
  hdrRow.height = 26;
  cols.forEach((c, i) => { ws.getColumn(i + 1).width = c.width; });

  // Body
  result.rows.forEach((r, i) => {
    const row = ws.addRow(cols.map(c => c.get(r)));
    row.eachCell(cell => {
      cell.font = BODY_FONT;
      cell.alignment = { vertical: 'middle' };
      cell.border = { bottom: { style: 'thin', color: { argb: SEP } }, right: { style: 'thin', color: { argb: SEP } } };
    });
    if (i % 2 === 1) row.eachCell(cell => { cell.fill = solidFill(STRIPE); });

    // Color the RAG column for single-rag rows (project/activity leaf level)
    const ragColIdx = cols.findIndex(c => c.header === 'RAG');
    if (ragColIdx >= 0) {
      const s = r.metrics.schedule as { rag?: string } | undefined;
      if (s?.rag) {
        const { bg, fn } = ragFill(s.rag);
        const cell = row.getCell(ragColIdx + 1);
        cell.fill = bg;
        cell.font = { ...BODY_FONT, bold: true, color: { argb: fn } };
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
      }
    }
    row.height = 18;
  });

  const buffer = await wb.xlsx.writeBuffer();
  return new NextResponse(Buffer.from(buffer), {
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename="DynamicPortfolioReport_${result.group_by}.xlsx"`,
    },
  });
}
