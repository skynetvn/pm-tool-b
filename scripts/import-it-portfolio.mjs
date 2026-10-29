#!/usr/bin/env node
// Import the "SHB IT Portfolio" markdown export into PM Tool as two programs:
//   1. "Dự án CNTT Phối hợp (CPMO điều phối)"  ← first table (Danh sách dự án CPMO)
//   2. "Workstream & AI"                        ← second table (Workstream & Dự án CNTT nội bộ),
//                                                  duplicate rows merged (see mergeWorkstreamRows)
//
// Usage:
//   node scripts/import-it-portfolio.mjs <file.md>
//
// Env (optional):
//   PM_BASE_URL    default http://localhost:3000
//   PM_USERNAME    default admin
//   PM_PASSWORD    default Khang@19
//   PM_COMPANY_ID  company the programs/projects belong to (default: first company)
//
// Re-running is safe: programs with the same name are deleted (with their projects) and re-created.

import fs from 'fs';

const BASE = process.env.PM_BASE_URL ?? 'http://localhost:3000';
const USERNAME = process.env.PM_USERNAME ?? 'admin';
const PASSWORD = process.env.PM_PASSWORD ?? 'Khang@19';

const PROGRAM_CPMO = 'Dự án CNTT Phối hợp (CPMO điều phối)';
const PROGRAM_WS = 'Workstream & AI';

const PHASE = {
  'Tiền DA': 'Prepare Project',
  'Khởi tạo': 'Initiation',
  'Lập KH': 'Planning',
  'Triển khai': 'Execution',
  'Kết thúc': 'Closing',
};

const file = process.argv[2];
if (!file) {
  console.error('Usage: node scripts/import-it-portfolio.mjs <file.md>');
  process.exit(1);
}

// ── Parse markdown tables ─────────────────────────────────────────────────────
function parseTables(text) {
  const tables = [];
  let cur = null;
  for (const line of text.split('\n')) {
    if (!line.startsWith('|')) { cur = null; continue; }
    const cells = line.trim().slice(1, -1).split('|').map(s =>
      s.trim().replace(/\*\*/g, '').replace(/\\\[/g, '[').replace(/\\\]/g, ']'));
    if (!cur) { cur = { head: cells, rows: [] }; tables.push(cur); continue; }
    if (cells.every(c => /^:?-+:?$/.test(c))) continue;
    cur.rows.push(Object.fromEntries(cur.head.map((h, i) => [h, cells[i] ?? ''])));
  }
  return tables;
}

const tables = parseTables(fs.readFileSync(file, 'utf8'));
const cpmo = tables.find(t => t.head.includes('Mã DA'));
const ws = tables.find(t => t.head.includes('Tên / Mã'));
if (!cpmo || !ws) {
  console.error('Không tìm thấy đủ 2 bảng (CPMO và Workstream) trong file.');
  process.exit(1);
}

const clean = v => (!v || v === '—' || v === '-' ? '' : v);

// ── Merge duplicate Workstream rows ───────────────────────────────────────────
// The Workstream table lists some items twice: once under their category
// (GenAI/AI/Data, Chuyển đổi số, Taskforce) and again under "CNTT Chủ quản"
// with a [CODE] suffix. A coded row is merged into the earlier row with the same
// name (code stripped), or the one named in WS_ALIASES when the wording differs.
const WS_ALIASES = {
  GenAI: 'Ứng dụng GenAI – Chatbot nội bộ đa khối',
  APIM: 'APIM – Nâng cấp HT Quản lý API',
  HUB: 'SHB HUB – HT kết nối thông minh nội bộ',
  CAR: 'CAR – Nâng cấp ATVM TT14/2025',
};

function mergeWorkstreamRows(rows) {
  const items = [];
  for (const r of rows) {
    const code = r['Tên / Mã'].match(/\[([^\]]+)\]\s*$/)?.[1];
    const base = r['Tên / Mã'].replace(/\s*\[[^\]]+\]\s*$/, '');
    const item = {
      code, name: base, types: [r['Loại']], owner: r['Chủ quản'], stage: r['Giai đoạn'],
      pm: r['PM / Phụ trách'],
      result: r['Kết quả công việc gần nhất'], plan: r['Kế hoạch công việc tiếp theo'],
    };
    const dup = code && items.find(i => !i.code && (i.name === base || i.name === WS_ALIASES[code]));
    if (!dup) { items.push(item); continue; }

    if (dup.stage !== item.stage || dup.pm !== item.pm) {
      console.warn(`  ! "${dup.name}" và "${r['Tên / Mã']}" khác Giai đoạn/PM – giữ giá trị của dòng đầu`);
    }
    dup.code = code;
    dup.types.push(item.types[0]);
    // Both rows describe the same status; keep the more detailed wording.
    if (clean(item.result).length > clean(dup.result).length) dup.result = item.result;
    if (clean(item.plan).length > clean(dup.plan).length) dup.plan = item.plan;
    console.log(`  ↳ Gộp "${r['Tên / Mã']}" vào "${dup.name}"`);
  }
  return items.map(i => ({ ...i, name: i.code ? `${i.name} [${i.code}]` : i.name, type: i.types.join(' · ') }));
}

// ── API helpers ───────────────────────────────────────────────────────────────
const loginRes = await fetch(`${BASE}/api/auth/login`, {
  method: 'POST',
  headers: { 'content-type': 'application/json' },
  body: JSON.stringify({ username: USERNAME, password: PASSWORD }),
});
if (!loginRes.ok) {
  console.error(`Đăng nhập thất bại (${loginRes.status}): ${await loginRes.text()}`);
  process.exit(1);
}
const cookie = loginRes.headers.get('set-cookie').split(';')[0];

async function api(path, method = 'GET', body) {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: { 'content-type': 'application/json', cookie },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`${method} ${path} → ${res.status} ${await res.text()}`);
  return res.json();
}

const me = await api('/api/auth/me');
let companyId = process.env.PM_COMPANY_ID ? Number(process.env.PM_COMPANY_ID) : (me.company_id ?? null);
if (companyId === null && me.is_admin) {
  const companies = await api('/api/admin/companies').catch(() => []);
  companyId = companies[0]?.id ?? null;
}

// ── Reset existing programs with the same name ────────────────────────────────
async function resetProgram(name) {
  const programs = await api('/api/programs');
  const projects = await api('/api/projects');
  for (const prog of programs.filter(p => p.name === name)) {
    const owned = projects.filter(p => p.customer_id === prog.id);
    for (const p of owned) await api(`/api/projects/${p.id}`, 'DELETE');
    await api(`/api/programs/${prog.id}`, 'DELETE');
    console.log(`Đã xóa chương trình cũ "${name}" (${owned.length} dự án)`);
  }
}

// ── Create ────────────────────────────────────────────────────────────────────
async function createProject(programId, r) {
  const description = [
    r.code ? `Mã DA: ${r.code}` : null,
    r.type ? `Loại: ${r.type}` : null,
    `Chủ quản: ${r.owner}`,
    `Giai đoạn (gốc): ${r.stage}`,
    '',
    'Kết quả công việc gần nhất:',
    clean(r.result) || '(chưa có)',
    '',
    'Kế hoạch công việc tiếp theo:',
    clean(r.plan) || '(chưa có)',
  ].filter(x => x !== null).join('\n');

  const phase = PHASE[r.stage];
  if (!phase) console.warn(`  ! Giai đoạn không xác định "${r.stage}" cho "${r.name}" → Prepare Project`);

  const project = await api('/api/projects', 'POST', {
    name: r.name,
    client: r.owner,
    customer_id: programId,
    pm_name: clean(r.pm),
    project_owner: r.owner,
    current_phase: phase ?? 'Prepare Project',
    description,
    company_id: companyId,
  });

  const status = r.stage === 'Kết thúc' ? 'closed' : /Tạm dừng/i.test(r.result) ? 'on-hold' : 'active';
  if (status !== 'active') await api(`/api/projects/${project.id}`, 'PATCH', { status });

  for (const [role, value] of [['PM', r.pm], ['SA', r.sa], ['BA', r.ba]]) {
    for (const name of clean(value).split('/').map(s => s.trim()).filter(Boolean)) {
      if (name === 'TBU') continue;
      await api(`/api/projects/${project.id}/team`, 'POST', { domain: 'IT', role, name });
    }
  }
  return project;
}

await resetProgram(PROGRAM_CPMO);
await resetProgram(PROGRAM_WS);

const progCpmo = await api('/api/programs', 'POST', {
  name: PROGRAM_CPMO,
  industry: 'CPMO',
  notes: `Danh sách dự án (CPMO) – ${cpmo.rows.length} dự án. Nguồn: SHB IT Portfolio T10/2026`,
  company_id: companyId,
});
for (const r of cpmo.rows) {
  await createProject(progCpmo.id, {
    code: r['Mã DA'], name: r['Tên dự án'], owner: r['Chủ quản'], stage: r['Giai đoạn'],
    pm: r['PM / Đầu mối IT'], sa: r['SA'], ba: r['BA'],
    result: r['Kết quả công việc gần nhất'], plan: r['Kế hoạch công việc tiếp theo'],
  });
}
console.log(`✓ ${PROGRAM_CPMO}: ${cpmo.rows.length} dự án`);

// Items already tracked in the CPMO program (e.g. "PLATFORM – Khung QTDL …" vs
// CPMO "Khung QTDL …" with Mã DA PLATFORM) stay in CPMO only.
const cpmoNames = new Set(cpmo.rows.map(r => r['Tên dự án']));
const wsItems = mergeWorkstreamRows(ws.rows).filter(i => {
  const base = i.name.replace(/\s*\[[^\]]+\]\s*$/, '');
  const inCpmo = cpmoNames.has(base) || cpmoNames.has(base.replace(/^[^–]+–\s*/, ''));
  if (inCpmo) console.log(`  ↳ Bỏ "${i.name}" khỏi ${PROGRAM_WS} (đã có trong ${PROGRAM_CPMO})`);
  return !inCpmo;
});
const progWs = await api('/api/programs', 'POST', {
  name: PROGRAM_WS,
  industry: 'CNTT',
  notes: `Workstream & Dự án CNTT nội bộ – ${wsItems.length} hạng mục (gộp từ ${ws.rows.length} dòng). Nguồn: SHB IT Portfolio T10/2026`,
  company_id: companyId,
});
for (const item of wsItems) await createProject(progWs.id, item);
console.log(`✓ ${PROGRAM_WS}: ${wsItems.length} hạng mục (gộp từ ${ws.rows.length} dòng)`);
