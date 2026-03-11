import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { Dataset, QueryOrder, QueryType, OrderStatus } from '@/lib/contracts';

// ---------------------------------------------------------------------------
// SQLite-backed persistent store
// Database file lives at <project-root>/data/datacloud.db and is auto-created
// on first run. The module exports the same public interface as the previous
// in-memory store so that API routes continue to work without changes.
// ---------------------------------------------------------------------------

// ---- Database initialisation -----------------------------------------------

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
      ipfs_cid        TEXT    NOT NULL DEFAULT '',
      encryption      TEXT    NOT NULL DEFAULT '',
      schema_hash     TEXT    NOT NULL DEFAULT '',
      pdp_params      TEXT    NOT NULL DEFAULT '{}',
      total_queries   INTEGER NOT NULL DEFAULT 0,
      total_revenue   TEXT    NOT NULL DEFAULT '0',
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
  `);

  // ---- Seed data on first run --------------------------------------------

  const count = _db.prepare('SELECT COUNT(*) AS cnt FROM datasets').get() as { cnt: number };
  if (count.cnt === 0) {
    seedData(_db);
  }

  return _db;
}

// ---- Seed helper -----------------------------------------------------------

function seedData(db: Database.Database) {
  const now = Date.now();

  const insertDataset = db.prepare(`
    INSERT INTO datasets (
      title, description, category, owner, price, size, records, format,
      allowed_queries, verified, pdp_enabled, pdp_frequency, pdp_last_verified,
      ipfs_cid, encryption, schema_hash, pdp_params,
      total_queries, total_revenue, created_at, updated_at
    ) VALUES (
      @title, @description, @category, @owner, @price, @size, @records, @format,
      @allowed_queries, @verified, @pdp_enabled, @pdp_frequency, @pdp_last_verified,
      @ipfs_cid, @encryption, @schema_hash, @pdp_params,
      @total_queries, @total_revenue, @created_at, @updated_at
    )
  `);

  const insertOrder = db.prepare(`
    INSERT INTO query_orders (
      dataset_id, buyer, query_type, parameters, price, status,
      result, result_cid, attestation, created_at, updated_at, completed_at
    ) VALUES (
      @dataset_id, @buyer, @query_type, @parameters, @price, @status,
      @result, @result_cid, @attestation, @created_at, @updated_at, @completed_at
    )
  `);

  const insertActivity = db.prepare(`
    INSERT INTO activity_log (type, dataset_id, order_id, actor, message, created_at)
    VALUES (@type, @dataset_id, @order_id, @actor, @message, @created_at)
  `);

  const seedTx = db.transaction(() => {
    // Dataset 1 - Financial Transactions
    insertDataset.run({
      title: 'Financial Transactions Dataset',
      description: 'Anonymized financial transaction data with demographic insights. Perfect for fraud detection and spending pattern analysis.',
      category: 'Finance',
      owner: '0x742d35Cc6634C0532925a3b8D0c7b3a7D5d4c6f8',
      price: '0.05',
      size: 2469606195,
      records: 0,
      format: 'parquet',
      allowed_queries: JSON.stringify([QueryType.AGGREGATION, QueryType.ANALYTICS, QueryType.ML_TRAINING]),
      verified: 1,
      pdp_enabled: 1,
      pdp_frequency: 3600,
      pdp_last_verified: now - 3600000,
      ipfs_cid: 'QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG',
      encryption: 'AES-256-GCM',
      schema_hash: '0x1234567890abcdef',
      pdp_params: JSON.stringify({ challengeInterval: 3600, proofTimeout: 300, slashingAmount: '0.1', requiredProofs: 24 }),
      total_queries: 1247,
      total_revenue: '62.35',
      created_at: now - 172800000,
      updated_at: now - 172800000,
    });

    // Dataset 2 - Healthcare Research
    insertDataset.run({
      title: 'Healthcare Research Data',
      description: 'De-identified patient data for medical research and drug discovery. Includes lab results, treatment outcomes, and demographic data.',
      category: 'Healthcare',
      owner: '0x8ba1f109551bD432803012645Hac136c1c5e0',
      price: '0.12',
      size: 6120000000,
      records: 0,
      format: 'parquet',
      allowed_queries: JSON.stringify([QueryType.AGGREGATION, QueryType.ANALYTICS, QueryType.ML_TRAINING, QueryType.CORRELATION]),
      verified: 1,
      pdp_enabled: 1,
      pdp_frequency: 1800,
      pdp_last_verified: now - 1800000,
      ipfs_cid: 'QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco',
      encryption: 'AES-256-GCM',
      schema_hash: '0xabcdef1234567890',
      pdp_params: JSON.stringify({ challengeInterval: 1800, proofTimeout: 300, slashingAmount: '0.2', requiredProofs: 48 }),
      total_queries: 892,
      total_revenue: '107.04',
      created_at: now - 604800000,
      updated_at: now - 604800000,
    });

    // Dataset 3 - E-commerce Behavior
    insertDataset.run({
      title: 'E-commerce Behavior Analytics',
      description: 'Customer behavior patterns, purchase history, and recommendation engine training data from major e-commerce platforms.',
      category: 'E-commerce',
      owner: '0x9f4f2726179a224501d762422c946590d91',
      price: '0.08',
      size: 1932735284,
      records: 0,
      format: 'parquet',
      allowed_queries: JSON.stringify([QueryType.AGGREGATION, QueryType.ANALYTICS, QueryType.COHORT]),
      verified: 0,
      pdp_enabled: 1,
      pdp_frequency: 7200,
      pdp_last_verified: now - 7200000,
      ipfs_cid: 'QmNLei78zWmzUdbeRB3CiUfAizWUrbeeZh5K1rhAQKCh51',
      encryption: 'AES-256-GCM',
      schema_hash: '0x567890abcdef1234',
      pdp_params: JSON.stringify({ challengeInterval: 7200, proofTimeout: 300, slashingAmount: '0.15', requiredProofs: 12 }),
      total_queries: 2156,
      total_revenue: '172.48',
      created_at: now - 259200000,
      updated_at: now - 259200000,
    });

    // Seed orders
    insertOrder.run({
      dataset_id: '1',
      buyer: '0x95222290DD7278Aa3Ddd389Cc1E1d165CC4BAfe5',
      query_type: QueryType.AGGREGATION,
      parameters: JSON.stringify({ function: 'AVG', column: 'transaction_amount', groupBy: 'age_group' }),
      price: '0.05',
      status: OrderStatus.COMPLETED,
      result: '{}',
      result_cid: 'QmResult1234567890abcdef',
      attestation: JSON.stringify({
        datasetId: '1',
        queryHash: '0xquery123',
        resultHash: '0xresult123',
        workerId: 'worker-001',
        timestamp: now - 3300000,
        signature: '0xsignature123',
      }),
      created_at: now - 3600000,
      updated_at: now - 3300000,
      completed_at: now - 3300000,
    });

    insertOrder.run({
      dataset_id: '2',
      buyer: '0x742d35Cc6634C0532925a3b8D0c7b3a7D5d4c6f8',
      query_type: QueryType.ML_TRAINING,
      parameters: JSON.stringify({
        modelType: 'logistic_regression',
        targetVariable: 'treatment_success',
        features: ['age', 'gender', 'medical_history', 'lab_values'],
      }),
      price: '0.18',
      status: OrderStatus.EXECUTING,
      result: '{}',
      result_cid: '',
      attestation: '{}',
      created_at: now - 1800000,
      updated_at: now - 1800000,
      completed_at: 0,
    });

    insertOrder.run({
      dataset_id: '3',
      buyer: '0x8ba1f109551bD432803012645Hac136c1c5e0',
      query_type: QueryType.COHORT,
      parameters: JSON.stringify({
        cohortDefinition: 'first_purchase',
        timePeriod: 'monthly',
        metric: 'retention_rate',
      }),
      price: '0.12',
      status: OrderStatus.PENDING,
      result: '{}',
      result_cid: '',
      attestation: '{}',
      created_at: now - 600000,
      updated_at: now - 600000,
      completed_at: 0,
    });

    // Seed activity log
    insertActivity.run({
      type: 'dataset_created',
      dataset_id: '1',
      order_id: '',
      actor: '0x742d35Cc6634C0532925a3b8D0c7b3a7D5d4c6f8',
      message: 'New dataset listed: Financial Transactions Dataset',
      created_at: now - 172800000,
    });
    insertActivity.run({
      type: 'dataset_created',
      dataset_id: '2',
      order_id: '',
      actor: '0x8ba1f109551bD432803012645Hac136c1c5e0',
      message: 'New dataset listed: Healthcare Research Data',
      created_at: now - 604800000,
    });
    insertActivity.run({
      type: 'dataset_created',
      dataset_id: '3',
      order_id: '',
      actor: '0x9f4f2726179a224501d762422c946590d91',
      message: 'New dataset listed: E-commerce Behavior Analytics',
      created_at: now - 259200000,
    });
    insertActivity.run({
      type: 'query_created',
      dataset_id: '1',
      order_id: '1',
      actor: '0x95222290DD7278Aa3Ddd389Cc1E1d165CC4BAfe5',
      message: 'Query order created for Financial Transactions Dataset',
      created_at: now - 3600000,
    });
    insertActivity.run({
      type: 'query_completed',
      dataset_id: '1',
      order_id: '1',
      actor: 'worker-001',
      message: 'Query completed for Financial Transactions Dataset',
      created_at: now - 3300000,
    });
  });

  seedTx();
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
  ipfs_cid: string;
  encryption: string;
  schema_hash: string;
  pdp_params: string;
  total_queries: number;
  total_revenue: string;
  created_at: number;
  updated_at: number;
}

function rowToDataset(row: DatasetRow): Dataset {
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
  created_at: number;
  updated_at: number;
  completed_at: number;
}

function rowToOrder(row: OrderRow): QueryOrder {
  const order: QueryOrder = {
    id: String(row.id),
    datasetId: row.dataset_id,
    buyer: row.buyer,
    queryType: row.query_type as QueryType,
    parameters: JSON.parse(row.parameters),
    price: row.price,
    status: row.status as OrderStatus,
    createdAt: row.created_at,
  };

  if (row.completed_at > 0) {
    order.executedAt = row.completed_at;
  }
  if (row.result_cid) {
    order.resultCid = row.result_cid;
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

// ---- CID helper -----------------------------------------------------------

function generateCid(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = 'Qm';
  for (let i = 0; i < 44; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// ---------------------------------------------------------------------------
// Public API – same interface as the old in-memory store
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
  },
): Dataset {
  const db = getDb();
  const now = Date.now();
  const cid = data.cid || generateCid();

  const result = db.prepare(`
    INSERT INTO datasets (
      title, description, category, owner, price, size, records, format,
      allowed_queries, verified, pdp_enabled, pdp_frequency, pdp_last_verified,
      ipfs_cid, encryption, schema_hash, pdp_params,
      total_queries, total_revenue, created_at, updated_at
    ) VALUES (
      @title, @description, @category, @owner, @price, @size, @records, @format,
      @allowed_queries, @verified, @pdp_enabled, @pdp_frequency, @pdp_last_verified,
      @ipfs_cid, @encryption, @schema_hash, @pdp_params,
      @total_queries, @total_revenue, @created_at, @updated_at
    )
  `).run({
    title: data.title,
    description: data.description,
    category: data.category,
    owner: data.owner,
    price: data.price,
    size: data.size,
    records: 0,
    format: '',
    allowed_queries: JSON.stringify(data.allowedQueries),
    verified: 0,
    pdp_enabled: data.pdpParams ? 1 : 0,
    pdp_frequency: data.pdpParams?.challengeInterval ?? 0,
    pdp_last_verified: now,
    ipfs_cid: cid,
    encryption: '',
    schema_hash: data.schemaHash,
    pdp_params: JSON.stringify(data.pdpParams),
    total_queries: 0,
    total_revenue: '0',
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

export function updateDataset(id: string, updates: Partial<Dataset>): boolean {
  const db = getDb();
  const existing = getDatasetById(id);
  if (!existing) return false;

  const now = Date.now();

  // Build SET clauses dynamically based on what is provided
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

  mapping.updated_at = now;

  const setClauses = Object.keys(mapping).map((k) => `${k} = @${k}`).join(', ');
  const params = { ...mapping, id: Number(id) };

  db.prepare(`UPDATE datasets SET ${setClauses} WHERE id = @id`).run(params);
  return true;
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
  data: Omit<QueryOrder, 'id' | 'status' | 'createdAt'>,
): QueryOrder {
  const db = getDb();
  const now = Date.now();

  const result = db.prepare(`
    INSERT INTO query_orders (
      dataset_id, buyer, query_type, parameters, price, status,
      result, result_cid, attestation, created_at, updated_at, completed_at
    ) VALUES (
      @dataset_id, @buyer, @query_type, @parameters, @price, @status,
      @result, @result_cid, @attestation, @created_at, @updated_at, @completed_at
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
    created_at: now,
    updated_at: now,
    completed_at: 0,
  });

  // Bump dataset's totalQueries
  db.prepare('UPDATE datasets SET total_queries = total_queries + 1, updated_at = ? WHERE id = ?').run(now, data.datasetId);

  // Log activity
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
