import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { Dataset, QueryOrder, QueryType, OrderStatus } from '@/lib/contracts';

// ---------------------------------------------------------------------------
// SQLite-backed persistent store
// Database file lives at <project-root>/data/datacloud.db and is auto-created
// on first run. No seed data — the database starts empty.
// ---------------------------------------------------------------------------

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_PATH = path.join(DATA_DIR, 'datacloud.db');

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

let _db: Database.Database | null = null;

function getDb(): Database.Database {
  if (_db) return _db;

  ensureDataDir();

  _db = new Database(DB_PATH);
  _db.pragma('journal_mode = WAL');
  _db.pragma('foreign_keys = ON');

  // ---- Create tables (idempotent) ----------------------------------------

  _db.exec(`
    CREATE TABLE IF NOT EXISTS datasets (
      id              INTEGER PRIMARY KEY AUTOINCREMENT,
      title           TEXT    NOT NULL,
      description     TEXT    NOT NULL DEFAULT '',
      category        TEXT    NOT NULL DEFAULT '',
      owner           TEXT    NOT NULL DEFAULT '',
      price           TEXT    NOT NULL DEFAULT '0',
      size            INTEGER NOT NULL DEFAULT 0,
      records         INTEGER NOT NULL DEFAULT 0,
      format          TEXT    NOT NULL DEFAULT '',
      allowed_queries TEXT    NOT NULL DEFAULT '[]',
      verified        INTEGER NOT NULL DEFAULT 0,
      pdp_enabled     INTEGER NOT NULL DEFAULT 0,
      pdp_frequency   INTEGER NOT NULL DEFAULT 0,
      pdp_last_verified INTEGER NOT NULL DEFAULT 0,
      columns         TEXT    NOT NULL DEFAULT '[]',
      ipfs_cid        TEXT    NOT NULL DEFAULT '',
      encryption      TEXT    NOT NULL DEFAULT '',
      schema_hash     TEXT    NOT NULL DEFAULT '',
      pdp_params      TEXT    NOT NULL DEFAULT '{}',
      total_queries   INTEGER NOT NULL DEFAULT 0,
      total_revenue   TEXT    NOT NULL DEFAULT '0',
      tx_hash         TEXT    NOT NULL DEFAULT '',
      on_chain_id     TEXT    NOT NULL DEFAULT '',
      created_at      INTEGER NOT NULL DEFAULT 0,
      updated_at      INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS query_orders (
      id              INTEGER PRIMARY KEY AUTOINCREMENT,
      dataset_id      TEXT    NOT NULL,
      buyer           TEXT    NOT NULL DEFAULT '',
      query_type      TEXT    NOT NULL DEFAULT '',
      parameters      TEXT    NOT NULL DEFAULT '{}',
      price           TEXT    NOT NULL DEFAULT '0',
      status          TEXT    NOT NULL DEFAULT 'pending',
      result          TEXT    NOT NULL DEFAULT '{}',
      result_cid      TEXT    NOT NULL DEFAULT '',
      attestation     TEXT    NOT NULL DEFAULT '{}',
      tx_hash         TEXT    NOT NULL DEFAULT '',
      on_chain_id     TEXT    NOT NULL DEFAULT '',
      created_at      INTEGER NOT NULL DEFAULT 0,
      updated_at      INTEGER NOT NULL DEFAULT 0,
      completed_at    INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS activity_log (
      id              INTEGER PRIMARY KEY AUTOINCREMENT,
      type            TEXT    NOT NULL DEFAULT '',
      dataset_id      TEXT    NOT NULL DEFAULT '',
      order_id        TEXT    NOT NULL DEFAULT '',
      actor           TEXT    NOT NULL DEFAULT '',
      message         TEXT    NOT NULL DEFAULT '',
      created_at      INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS data_rows (
      id              INTEGER PRIMARY KEY AUTOINCREMENT,
      dataset_id      INTEGER NOT NULL,
      row_data        TEXT    NOT NULL DEFAULT '{}',
      FOREIGN KEY (dataset_id) REFERENCES datasets(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_data_rows_dataset ON data_rows(dataset_id);
  `);

  // Add columns if they don't exist (migrations)
  try {
    _db.exec('ALTER TABLE datasets ADD COLUMN tx_hash TEXT NOT NULL DEFAULT ""');
  } catch { /* column already exists */ }
  try {
    _db.exec('ALTER TABLE datasets ADD COLUMN on_chain_id TEXT NOT NULL DEFAULT ""');
  } catch { /* column already exists */ }
  try {
    _db.exec('ALTER TABLE datasets ADD COLUMN columns TEXT NOT NULL DEFAULT "[]"');
  } catch { /* column already exists */ }
  try {
    _db.exec('ALTER TABLE query_orders ADD COLUMN tx_hash TEXT NOT NULL DEFAULT ""');
  } catch { /* column already exists */ }
  try {
    _db.exec('ALTER TABLE query_orders ADD COLUMN on_chain_id TEXT NOT NULL DEFAULT ""');
  } catch { /* column already exists */ }

  return _db;
}

// ---- Row <-> Domain object mappers ----------------------------------------

interface DatasetRow {
  id: number;
  title: string;
  description: string;
  category: string;
  owner: string;
  price: string;
  size: number;
  records: number;
  format: string;
  allowed_queries: string;
  verified: number;
  pdp_enabled: number;
  pdp_frequency: number;
  pdp_last_verified: number;
  columns: string;
  ipfs_cid: string;
  encryption: string;
  schema_hash: string;
  pdp_params: string;
  total_queries: number;
  total_revenue: string;
  tx_hash: string;
  on_chain_id: string;
  created_at: number;
  updated_at: number;
}

function rowToDataset(row: DatasetRow): Dataset & { records: number; format: string; columns: string[]; txHash: string; onChainId: string } {
  let columns: string[] = [];
  try { columns = JSON.parse(row.columns || '[]'); } catch { columns = []; }
  return {
    id: String(row.id),
    cid: row.ipfs_cid,
    owner: row.owner,
    title: row.title,
    description: row.description,
    category: row.category,
    schemaHash: row.schema_hash,
    size: row.size,
    price: row.price,
    allowedQueries: JSON.parse(row.allowed_queries) as QueryType[],
    pdpParams: JSON.parse(row.pdp_params),
    verified: row.verified === 1,
    createdAt: row.created_at,
    lastProofAt: row.pdp_last_verified,
    totalQueries: row.total_queries,
    revenue: row.total_revenue,
    records: row.records,
    format: row.format,
    columns,
    txHash: row.tx_hash,
    onChainId: row.on_chain_id,
  };
}

interface OrderRow {
  id: number;
  dataset_id: string;
  buyer: string;
  query_type: string;
  parameters: string;
  price: string;
  status: string;
  result: string;
  result_cid: string;
  attestation: string;
  tx_hash: string;
  on_chain_id: string;
  created_at: number;
  updated_at: number;
  completed_at: number;
}

function rowToOrder(row: OrderRow): QueryOrder & { txHash: string; onChainId: string } {
  const order: QueryOrder & { txHash: string; onChainId: string } = {
    id: String(row.id),
    datasetId: row.dataset_id,
    buyer: row.buyer,
    queryType: row.query_type as QueryType,
    parameters: JSON.parse(row.parameters),
    price: row.price,
    status: row.status as OrderStatus,
    createdAt: row.created_at,
    txHash: row.tx_hash,
    onChainId: row.on_chain_id,
  };

  if (row.completed_at > 0) {
    order.executedAt = row.completed_at;
  }
  if (row.result_cid) {
    order.resultCid = row.result_cid;
  }
  const resultData = JSON.parse(row.result);
  if (resultData && Object.keys(resultData).length > 0) {
    order.result = resultData;
  }
  const att = JSON.parse(row.attestation);
  if (att && att.datasetId) {
    order.attestation = att;
  }

  return order;
}

// ---- Activity log types ---------------------------------------------------

export interface ActivityEntry {
  id: string;
  type: string;
  datasetId: string;
  orderId: string;
  actor: string;
  message: string;
  createdAt: number;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

// ---- Datasets -------------------------------------------------------------

export function getDatasets(): Dataset[] {
  const db = getDb();
  const rows = db.prepare('SELECT * FROM datasets ORDER BY created_at DESC').all() as DatasetRow[];
  return rows.map(rowToDataset);
}

export function getDatasetById(id: string): Dataset | undefined {
  const db = getDb();
  const row = db.prepare('SELECT * FROM datasets WHERE id = ?').get(id) as DatasetRow | undefined;
  return row ? rowToDataset(row) : undefined;
}

export function addDataset(
  data: Omit<Dataset, 'id' | 'cid' | 'verified' | 'createdAt' | 'lastProofAt' | 'totalQueries' | 'revenue'> & {
    cid?: string;
    records?: number;
    format?: string;
    columns?: string[];
    txHash?: string;
    onChainId?: string;
  },
): Dataset {
  const db = getDb();
  const now = Date.now();
  const cid = data.cid || '';

  const result = db.prepare(`
    INSERT INTO datasets (
      title, description, category, owner, price, size, records, format,
      allowed_queries, verified, pdp_enabled, pdp_frequency, pdp_last_verified,
      columns, ipfs_cid, encryption, schema_hash, pdp_params,
      total_queries, total_revenue, tx_hash, on_chain_id, created_at, updated_at
    ) VALUES (
      @title, @description, @category, @owner, @price, @size, @records, @format,
      @allowed_queries, @verified, @pdp_enabled, @pdp_frequency, @pdp_last_verified,
      @columns, @ipfs_cid, @encryption, @schema_hash, @pdp_params,
      @total_queries, @total_revenue, @tx_hash, @on_chain_id, @created_at, @updated_at
    )
  `).run({
    title: data.title,
    description: data.description,
    category: data.category,
    owner: data.owner,
    price: data.price,
    size: data.size,
    records: data.records || 0,
    format: data.format || '',
    allowed_queries: JSON.stringify(data.allowedQueries),
    verified: 0,
    pdp_enabled: data.pdpParams ? 1 : 0,
    pdp_frequency: data.pdpParams?.challengeInterval ?? 0,
    pdp_last_verified: now,
    columns: JSON.stringify(data.columns || []),
    ipfs_cid: cid,
    encryption: '',
    schema_hash: data.schemaHash,
    pdp_params: JSON.stringify(data.pdpParams),
    total_queries: 0,
    total_revenue: '0',
    tx_hash: data.txHash || '',
    on_chain_id: data.onChainId || '',
    created_at: now,
    updated_at: now,
  });

  // Log activity
  logActivity({
    type: 'dataset_created',
    datasetId: String(result.lastInsertRowid),
    orderId: '',
    actor: data.owner,
    message: `New dataset listed: ${data.title}`,
  });

  return getDatasetById(String(result.lastInsertRowid))!;
}

export function deleteDataset(id: string): boolean {
  const db = getDb();
  const dataset = getDatasetById(id);
  const result = db.prepare('DELETE FROM datasets WHERE id = ?').run(id);
  if (result.changes > 0 && dataset) {
    logActivity({
      type: 'dataset_deleted',
      datasetId: id,
      orderId: '',
      actor: dataset.owner,
      message: `Dataset deleted: ${dataset.title}`,
    });
  }
  return result.changes > 0;
}

export function updateDataset(id: string, updates: Partial<Dataset> & { txHash?: string; onChainId?: string }): boolean {
  const db = getDb();
  const existing = getDatasetById(id);
  if (!existing) return false;

  const now = Date.now();

  const mapping: Record<string, unknown> = {};
  if (updates.title !== undefined) mapping.title = updates.title;
  if (updates.description !== undefined) mapping.description = updates.description;
  if (updates.category !== undefined) mapping.category = updates.category;
  if (updates.owner !== undefined) mapping.owner = updates.owner;
  if (updates.price !== undefined) mapping.price = updates.price;
  if (updates.size !== undefined) mapping.size = updates.size;
  if (updates.allowedQueries !== undefined) mapping.allowed_queries = JSON.stringify(updates.allowedQueries);
  if (updates.verified !== undefined) mapping.verified = updates.verified ? 1 : 0;
  if (updates.cid !== undefined) mapping.ipfs_cid = updates.cid;
  if (updates.schemaHash !== undefined) mapping.schema_hash = updates.schemaHash;
  if (updates.pdpParams !== undefined) mapping.pdp_params = JSON.stringify(updates.pdpParams);
  if (updates.totalQueries !== undefined) mapping.total_queries = updates.totalQueries;
  if (updates.revenue !== undefined) mapping.total_revenue = updates.revenue;
  if (updates.lastProofAt !== undefined) mapping.pdp_last_verified = updates.lastProofAt;
  if (updates.txHash !== undefined) mapping.tx_hash = updates.txHash;
  if (updates.onChainId !== undefined) mapping.on_chain_id = updates.onChainId;

  mapping.updated_at = now;

  const setClauses = Object.keys(mapping).map((k) => `${k} = @${k}`).join(', ');
  const params = { ...mapping, id: Number(id) };

  db.prepare(`UPDATE datasets SET ${setClauses} WHERE id = @id`).run(params);
  return true;
}

// ---- Data rows (real uploaded data) ----------------------------------------

export function insertDataRows(datasetId: number, rows: Record<string, unknown>[]): number {
  const db = getDb();
  const insert = db.prepare(
    'INSERT INTO data_rows (dataset_id, row_data) VALUES (@dataset_id, @row_data)',
  );

  const insertMany = db.transaction((dataRows: Record<string, unknown>[]) => {
    let count = 0;
    for (const row of dataRows) {
      insert.run({
        dataset_id: datasetId,
        row_data: JSON.stringify(row),
      });
      count++;
    }
    return count;
  });

  const count = insertMany(rows);

  // Update the dataset's record count
  db.prepare('UPDATE datasets SET records = ?, updated_at = ? WHERE id = ?').run(
    count,
    Date.now(),
    datasetId,
  );

  return count;
}

export function getDataRows(datasetId: string): Record<string, unknown>[] {
  const db = getDb();
  const rows = db
    .prepare('SELECT row_data FROM data_rows WHERE dataset_id = ?')
    .all(Number(datasetId)) as Array<{ row_data: string }>;
  return rows.map((r) => JSON.parse(r.row_data));
}

export function getDataRowCount(datasetId: string): number {
  const db = getDb();
  const row = db
    .prepare('SELECT COUNT(*) AS cnt FROM data_rows WHERE dataset_id = ?')
    .get(Number(datasetId)) as { cnt: number };
  return row.cnt;
}

// ---- Query orders ---------------------------------------------------------

export function getQueries(): QueryOrder[] {
  const db = getDb();
  const rows = db.prepare('SELECT * FROM query_orders ORDER BY created_at DESC').all() as OrderRow[];
  return rows.map(rowToOrder);
}

export function getQueryById(id: string): QueryOrder | undefined {
  const db = getDb();
  const row = db.prepare('SELECT * FROM query_orders WHERE id = ?').get(id) as OrderRow | undefined;
  return row ? rowToOrder(row) : undefined;
}

export function addQuery(
  data: Omit<QueryOrder, 'id' | 'status' | 'createdAt'> & { txHash?: string; onChainId?: string },
): QueryOrder {
  const db = getDb();
  const now = Date.now();

  const result = db.prepare(`
    INSERT INTO query_orders (
      dataset_id, buyer, query_type, parameters, price, status,
      result, result_cid, attestation, tx_hash, on_chain_id, created_at, updated_at, completed_at
    ) VALUES (
      @dataset_id, @buyer, @query_type, @parameters, @price, @status,
      @result, @result_cid, @attestation, @tx_hash, @on_chain_id, @created_at, @updated_at, @completed_at
    )
  `).run({
    dataset_id: data.datasetId,
    buyer: data.buyer,
    query_type: data.queryType,
    parameters: JSON.stringify(data.parameters),
    price: data.price,
    status: OrderStatus.PENDING,
    result: '{}',
    result_cid: '',
    attestation: '{}',
    tx_hash: data.txHash || '',
    on_chain_id: data.onChainId || '',
    created_at: now,
    updated_at: now,
    completed_at: 0,
  });

  // Bump dataset's totalQueries
  db.prepare('UPDATE datasets SET total_queries = total_queries + 1, updated_at = ? WHERE id = ?').run(now, data.datasetId);

  logActivity({
    type: 'query_created',
    datasetId: data.datasetId,
    orderId: String(result.lastInsertRowid),
    actor: data.buyer,
    message: `Query order created (${data.queryType}) for dataset #${data.datasetId}`,
  });

  return getQueryById(String(result.lastInsertRowid))!;
}

export function updateQueryStatus(
  id: string,
  status: OrderStatus,
  extra?: Partial<Pick<QueryOrder, 'executedAt' | 'resultCid' | 'attestation'>>,
): QueryOrder | undefined {
  const db = getDb();
  const existing = getQueryById(id);
  if (!existing) return undefined;

  const now = Date.now();
  const completedAt = (status === OrderStatus.COMPLETED) ? (extra?.executedAt ?? now) : 0;

  db.prepare(`
    UPDATE query_orders SET
      status = @status,
      result_cid = @result_cid,
      attestation = @attestation,
      updated_at = @updated_at,
      completed_at = @completed_at
    WHERE id = @id
  `).run({
    id: Number(id),
    status,
    result_cid: extra?.resultCid ?? existing.resultCid ?? '',
    attestation: extra?.attestation ? JSON.stringify(extra.attestation) : (existing.attestation ? JSON.stringify(existing.attestation) : '{}'),
    updated_at: now,
    completed_at: completedAt || (existing.executedAt ?? 0),
  });

  // When a query completes, add its price to the dataset's revenue
  if (status === OrderStatus.COMPLETED) {
    const dataset = getDatasetById(existing.datasetId);
    if (dataset) {
      const newRevenue = (parseFloat(dataset.revenue) + parseFloat(existing.price)).toFixed(2);
      db.prepare('UPDATE datasets SET total_revenue = ?, updated_at = ? WHERE id = ?').run(newRevenue, now, existing.datasetId);
    }

    logActivity({
      type: 'query_completed',
      datasetId: existing.datasetId,
      orderId: id,
      actor: extra?.attestation?.workerId ?? '',
      message: `Query #${id} completed for dataset #${existing.datasetId}`,
    });
  }

  return getQueryById(id);
}

export function updateQueryStatusWithResult(
  id: string,
  status: OrderStatus,
  result: Record<string, unknown>,
  extra?: Partial<Pick<QueryOrder, 'executedAt' | 'resultCid' | 'attestation'>>,
): QueryOrder | undefined {
  const db = getDb();
  const existing = getQueryById(id);
  if (!existing) return undefined;

  const now = Date.now();
  const completedAt = (status === OrderStatus.COMPLETED) ? (extra?.executedAt ?? now) : 0;

  db.prepare(`
    UPDATE query_orders SET
      status = @status,
      result = @result,
      result_cid = @result_cid,
      attestation = @attestation,
      updated_at = @updated_at,
      completed_at = @completed_at
    WHERE id = @id
  `).run({
    id: Number(id),
    status,
    result: JSON.stringify(result),
    result_cid: extra?.resultCid ?? existing.resultCid ?? '',
    attestation: extra?.attestation ? JSON.stringify(extra.attestation) : (existing.attestation ? JSON.stringify(existing.attestation) : '{}'),
    updated_at: now,
    completed_at: completedAt || (existing.executedAt ?? 0),
  });

  if (status === OrderStatus.COMPLETED) {
    const dataset = getDatasetById(existing.datasetId);
    if (dataset) {
      const newRevenue = (parseFloat(dataset.revenue) + parseFloat(existing.price)).toFixed(2);
      db.prepare('UPDATE datasets SET total_revenue = ?, updated_at = ? WHERE id = ?').run(newRevenue, now, existing.datasetId);
    }

    logActivity({
      type: 'query_completed',
      datasetId: existing.datasetId,
      orderId: id,
      actor: extra?.attestation?.workerId ?? '',
      message: `Query #${id} completed for dataset #${existing.datasetId}`,
    });
  }

  return getQueryById(id);
}

// ---- Activity log ---------------------------------------------------------

export function logActivity(entry: {
  type: string;
  datasetId: string;
  orderId: string;
  actor: string;
  message: string;
}): void {
  const db = getDb();
  db.prepare(`
    INSERT INTO activity_log (type, dataset_id, order_id, actor, message, created_at)
    VALUES (@type, @dataset_id, @order_id, @actor, @message, @created_at)
  `).run({
    type: entry.type,
    dataset_id: entry.datasetId,
    order_id: entry.orderId,
    actor: entry.actor,
    message: entry.message,
    created_at: Date.now(),
  });
}

export function getActivityLog(limit = 20): ActivityEntry[] {
  const db = getDb();
  const rows = db.prepare(
    'SELECT * FROM activity_log ORDER BY created_at DESC LIMIT ?',
  ).all(limit) as Array<{
    id: number;
    type: string;
    dataset_id: string;
    order_id: string;
    actor: string;
    message: string;
    created_at: number;
  }>;

  return rows.map((r) => ({
    id: String(r.id),
    type: r.type,
    datasetId: r.dataset_id,
    orderId: r.order_id,
    actor: r.actor,
    message: r.message,
    createdAt: r.created_at,
  }));
}

// ---- Stats helpers --------------------------------------------------------

export function getDatasetCount(): number {
  const db = getDb();
  return (db.prepare('SELECT COUNT(*) AS cnt FROM datasets').get() as { cnt: number }).cnt;
}

export function getQueryCount(): number {
  const db = getDb();
  return (db.prepare('SELECT COUNT(*) AS cnt FROM query_orders').get() as { cnt: number }).cnt;
}

export function getVerifiedDatasetCount(): number {
  const db = getDb();
  return (db.prepare('SELECT COUNT(*) AS cnt FROM datasets WHERE verified = 1').get() as { cnt: number }).cnt;
}

export function getOrderCountByStatus(): Record<string, number> {
  const db = getDb();
  const rows = db.prepare(
    'SELECT status, COUNT(*) AS cnt FROM query_orders GROUP BY status',
  ).all() as Array<{ status: string; cnt: number }>;
  const result: Record<string, number> = {
    pending: 0,
    executing: 0,
    completed: 0,
    failed: 0,
    refunded: 0,
  };
  for (const row of rows) {
    result[row.status] = row.cnt;
  }
  return result;
}

export function getTotalVolume(): number {
  const db = getDb();
  const row = db.prepare(
    "SELECT COALESCE(SUM(CAST(price AS REAL)), 0) AS total FROM query_orders WHERE status = 'completed'",
  ).get() as { total: number };
  return row.total;
}

export function getTotalRevenue(): number {
  const db = getDb();
  const row = db.prepare(
    'SELECT COALESCE(SUM(CAST(total_revenue AS REAL)), 0) AS total FROM datasets',
  ).get() as { total: number };
  return row.total;
}

export function getAveragePrice(): number {
  const db = getDb();
  const row = db.prepare(
    'SELECT COALESCE(AVG(CAST(price AS REAL)), 0) AS avg_price FROM datasets',
  ).get() as { avg_price: number };
  return row.avg_price;
}

export function getCategoryBreakdown(): Array<{ name: string; count: number; totalQueries: number; revenue: string }> {
  const db = getDb();
  const rows = db.prepare(`
    SELECT
      category AS name,
      COUNT(*) AS count,
      COALESCE(SUM(total_queries), 0) AS total_queries,
      COALESCE(SUM(CAST(total_revenue AS REAL)), 0) AS revenue
    FROM datasets
    GROUP BY category
  `).all() as Array<{ name: string; count: number; total_queries: number; revenue: number }>;

  return rows.map((r) => ({
    name: r.name,
    count: r.count,
    totalQueries: r.total_queries,
    revenue: r.revenue.toFixed(2),
  }));
}
