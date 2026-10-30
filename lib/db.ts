import { Pool } from 'pg';
import crypto from 'crypto';

// ── Interface ──────────────────────────────────────────────────────────────────
export interface DbClient {
  get<T = Record<string, unknown>>(sql: string, ...params: unknown[]): Promise<T | undefined>;
  all<T = Record<string, unknown>>(sql: string, ...params: unknown[]): Promise<T[]>;
  run(sql: string, ...params: unknown[]): Promise<{ lastInsertRowid: number | bigint; changes: number }>;
  exec(sql: string): Promise<void>;
}

// ── PostgreSQL Client ──────────────────────────────────────────────────────────
class PostgresClient implements DbClient {
  constructor(private pool: Pool) {}

  private toPositional(sql: string): string {
    const hadOrIgnore = /\bINSERT\s+OR\s+IGNORE\b/i.test(sql);
    let result = sql.replace(/\bINSERT\s+OR\s+IGNORE\s+INTO\b/gi, 'INSERT INTO');
    if (hadOrIgnore) result = result.replace(/\s*;?\s*$/, ' ON CONFLICT DO NOTHING');
    let i = 0;
    return result.replace(/\?/g, () => `$${++i}`);
  }

  private needsReturningId(sql: string): boolean {
    const match = /INSERT\s+(?:OR\s+\w+\s+)?INTO\s+(\w+)/i.exec(sql);
    const table = match?.[1]?.toLowerCase();
    // Tables that use non-SERIAL primary keys (no 'id' column to RETURNING)
    const noIdTables = ['settings'];
    return !!table && !noIdTables.includes(table);
  }

  async get<T>(sql: string, ...params: unknown[]): Promise<T | undefined> {
    const { rows } = await this.pool.query(this.toPositional(sql), params.length ? params : undefined);
    return rows[0] as T | undefined;
  }
  async all<T>(sql: string, ...params: unknown[]): Promise<T[]> {
    const { rows } = await this.pool.query(this.toPositional(sql), params.length ? params : undefined);
    return rows as T[];
  }
  async run(sql: string, ...params: unknown[]): Promise<{ lastInsertRowid: number | bigint; changes: number }> {
    const isInsert = /^\s*INSERT\s/i.test(sql);
    let pgSql = this.toPositional(sql);
    if (isInsert && this.needsReturningId(sql)) pgSql += ' RETURNING id';
    const result = await this.pool.query(pgSql, params.length ? params : undefined);
    return { lastInsertRowid: result.rows[0]?.id ?? 0, changes: result.rowCount ?? 0 };
  }
  async exec(sql: string): Promise<void> {
    const stmts = sql.split(';').map(s => s.trim()).filter(Boolean);
    for (const stmt of stmts) await this.pool.query(stmt);
  }
}

// ── Helpers ────────────────────────────────────────────────────────────────────
function hashPwd(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

// ── PostgreSQL schema ──────────────────────────────────────────────────────────
// Simple, focused model: Portfolio = all Programs; Program groups Projects;
// Project groups Tasks; Tasks are updated via free-form check-ins (status +
// progress note). The latest two check-ins of a task are its "previous period"
// and "current period" — no fixed calendar period is enforced.
async function initPostgresSchema(db: DbClient) {
  await db.exec(`
    CREATE TABLE IF NOT EXISTS companies (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL UNIQUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      username TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      display_name TEXT DEFAULT '',
      company_id INTEGER REFERENCES companies(id) ON DELETE SET NULL,
      is_admin INTEGER DEFAULT 0,
      onboarding_completed INTEGER DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS sessions (
      id TEXT PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      expires_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL DEFAULT ''
    );
    CREATE TABLE IF NOT EXISTS demo_requests (
      id SERIAL PRIMARY KEY,
      full_name TEXT NOT NULL,
      phone TEXT NOT NULL,
      email TEXT NOT NULL,
      company_name TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending',
      notes TEXT DEFAULT '',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS programs (
      id SERIAL PRIMARY KEY,
      company_id INTEGER REFERENCES companies(id) ON DELETE CASCADE,
      name TEXT NOT NULL,
      description TEXT DEFAULT '',
      owner_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
      include_in_portfolio INTEGER NOT NULL DEFAULT 1,
      created_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS projects (
      id SERIAL PRIMARY KEY,
      company_id INTEGER REFERENCES companies(id) ON DELETE CASCADE,
      program_id INTEGER REFERENCES programs(id) ON DELETE SET NULL,
      name TEXT NOT NULL,
      description TEXT DEFAULT '',
      owner_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
      status TEXT NOT NULL DEFAULT 'active',
      start_date TEXT,
      end_date TEXT,
      created_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS tasks (
      id SERIAL PRIMARY KEY,
      project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
      title TEXT NOT NULL,
      description TEXT DEFAULT '',
      owner_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
      status TEXT NOT NULL DEFAULT 'not_started',
      progress_pct INTEGER NOT NULL DEFAULT 0,
      order_idx INTEGER DEFAULT 0,
      created_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS task_checkins (
      id SERIAL PRIMARY KEY,
      task_id INTEGER NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
      user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
      status TEXT NOT NULL DEFAULT 'on_track',
      progress_pct INTEGER NOT NULL DEFAULT 0,
      note TEXT DEFAULT '',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);
}

// ── Migrations for existing databases missing new columns ──────────────────────
async function migratePostgresSchema(pool: Pool) {
  const migrations = [
    `ALTER TABLE users ADD COLUMN IF NOT EXISTS company_id INTEGER REFERENCES companies(id) ON DELETE SET NULL`,
    `ALTER TABLE users ADD COLUMN IF NOT EXISTS onboarding_completed INTEGER DEFAULT 0`,
    `ALTER TABLE companies ADD COLUMN IF NOT EXISTS headcount_quota INTEGER DEFAULT 0`,
    `ALTER TABLE programs ADD COLUMN IF NOT EXISTS include_in_portfolio INTEGER NOT NULL DEFAULT 1`,
  ];
  for (const sql of migrations) {
    try { await pool.query(sql); } catch { /* column already exists */ }
  }
}

// ── One-time cleanup: drop the old project-centric & OKR schema entirely ───────
// Runs once (guarded by a settings flag) so it never clobbers data on repeat boots.
async function dropLegacySchema(pool: Pool) {
  const FLAG = 'legacy_schema_dropped_v1';
  try {
    const done = await pool.query('SELECT value FROM settings WHERE key = $1', [FLAG]);
    if (done.rows.length > 0) return;
  } catch {
    /* settings table may not exist yet on first run */
  }

  const legacyTables = [
    // OKR model (Squad/Goal/Initiative)
    'initiative_checkins', 'initiatives', 'goal_checkins', 'key_results', 'goals', 'squads',
    // Old project-centric model (project/budget/operations/bugs/jira/...)
    'milestone_epics', 'milestones', 'bug_import_mappings', 'bugs',
    'jira_jql_presets', 'jira_sync_mappings', 'timeline_import_mappings',
    'portfolio_budget_allocations', 'portfolio_budget_categories', 'portfolio_budgets',
    'portfolio_program_allocations', 'program_project_allocations', 'portfolio_members',
    'operations_incidents', 'operations_expenses', 'operations_budget_items', 'operations_systems',
    'budget_expenses', 'budget_items',
    'documents', 'project_holidays', 'escalation_levels', 'meetings', 'team_members',
    'risks', 'issues', 'activities',
    // Old "projects"/"customers" tables are superseded by the new simplified
    // projects/programs tables above; drop them only if they still carry the
    // legacy columns (i.e. this is truly the old table, not the new one).
    'company_rag_config', 'company_jira_config',
  ];
  for (const table of legacyTables) {
    try { await pool.query(`DROP TABLE IF EXISTS ${table} CASCADE`); } catch { /* ignore */ }
  }

  // The old "projects" and "customers" tables predate this rewrite and carry
  // columns (client, pm_name, customer_id, ...) the new schema doesn't use.
  // Only drop "projects" here if it still has a legacy column — otherwise it's
  // already the new, simplified table and must be left alone.
  try {
    const col = await pool.query(
      `SELECT 1 FROM information_schema.columns WHERE table_name = 'projects' AND column_name = 'client'`
    );
    if (col.rows.length > 0) await pool.query('DROP TABLE IF EXISTS projects CASCADE');
  } catch { /* ignore */ }
  try { await pool.query('DROP TABLE IF EXISTS customers CASCADE'); } catch { /* ignore */ }

  try {
    await pool.query(
      `INSERT INTO settings (key, value) VALUES ($1, $2) ON CONFLICT (key) DO NOTHING`,
      [FLAG, new Date().toISOString()]
    );
  } catch { /* settings table may not exist yet — will retry next boot */ }
}

// ── Seed default users ─────────────────────────────────────────────────────────
async function seedAuthData(db: DbClient) {
  const row = await db.get<{ c: string | number }>('SELECT COUNT(*) as c FROM users');
  if (Number(row?.c ?? 0) > 0) return;

  await db.run('INSERT OR IGNORE INTO companies (name) VALUES (?)', 'Default Company');
  const company = await db.get<{ id: number }>("SELECT id FROM companies WHERE name = 'Default Company'");

  await db.run(
    'INSERT OR IGNORE INTO users (username, password_hash, display_name, is_admin) VALUES (?, ?, ?, ?)',
    'admin', hashPwd('Khang@19'), 'Administrator', 1
  );
  if (company) {
    await db.run(
      'INSERT OR IGNORE INTO users (username, password_hash, display_name, company_id, is_admin) VALUES (?, ?, ?, ?, ?)',
      'ct_user1', hashPwd('Ctech@26'), 'CT User 1', company.id, 0
    );
  }
}

// ── Singleton ──────────────────────────────────────────────────────────────────
let _client: DbClient | null = null;

export async function getDb(): Promise<DbClient> {
  if (_client) return _client;

  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL environment variable is required. Set it to your PostgreSQL connection string.');
  }

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_URL.includes('railway.internal')
      ? false
      : { rejectUnauthorized: false },
  });
  const client = new PostgresClient(pool);
  await dropLegacySchema(pool);
  await initPostgresSchema(client);
  await migratePostgresSchema(pool);
  _client = client;

  await seedAuthData(_client);
  return _client;
}

// ── Types ──────────────────────────────────────────────────────────────────────
export type Program = {
  id: number; company_id: number | null; name: string; description: string;
  owner_id: number | null; include_in_portfolio: number;
  created_by: number | null; created_at: string; updated_at: string;
};
export type Project = {
  id: number; company_id: number | null; program_id: number | null;
  name: string; description: string; owner_id: number | null;
  status: 'active' | 'on_hold' | 'completed' | 'cancelled';
  start_date: string | null; end_date: string | null;
  created_by: number | null; created_at: string; updated_at: string;
};
export type Task = {
  id: number; project_id: number; title: string; description: string;
  owner_id: number | null;
  status: 'not_started' | 'on_track' | 'at_risk' | 'off_track' | 'done';
  progress_pct: number; order_idx: number;
  created_by: number | null; created_at: string; updated_at: string;
};
export type TaskCheckin = {
  id: number; task_id: number; user_id: number | null;
  status: string; progress_pct: number; note: string; created_at: string;
};
