import { Dataset, QueryOrder, QueryType, OrderStatus } from '@/lib/contracts';

// ---------------------------------------------------------------------------
// In-memory data store
// In production this would be backed by a database. The arrays persist for
// the lifetime of the server process which is sufficient for demo / dev work.
// ---------------------------------------------------------------------------

let nextDatasetId = 4; // next auto-increment (mock data uses 1-3)
let nextOrderId = 4;   // next auto-increment (mock data uses 1-3)

// ---- Seed datasets --------------------------------------------------------

const datasets: Dataset[] = [
  {
    id: '1',
    cid: 'QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG',
    owner: '0x742d35Cc6634C0532925a3b8D0c7b3a7D5d4c6f8',
    title: 'Financial Transactions Dataset',
    description:
      'Anonymized financial transaction data with demographic insights. Perfect for fraud detection and spending pattern analysis.',
    category: 'Finance',
    schemaHash: '0x1234567890abcdef',
    size: 2469606195, // ~2.3 GB
    price: '0.05',
    allowedQueries: [QueryType.AGGREGATION, QueryType.ANALYTICS, QueryType.ML_TRAINING],
    pdpParams: {
      challengeInterval: 3600,
      proofTimeout: 300,
      slashingAmount: '0.1',
      requiredProofs: 24,
    },
    verified: true,
    createdAt: Date.now() - 172800000,
    lastProofAt: Date.now() - 3600000,
    totalQueries: 1247,
    revenue: '62.35',
  },
  {
    id: '2',
    cid: 'QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco',
    owner: '0x8ba1f109551bD432803012645Hac136c1c5e0',
    title: 'Healthcare Research Data',
    description:
      'De-identified patient data for medical research and drug discovery. Includes lab results, treatment outcomes, and demographic data.',
    category: 'Healthcare',
    schemaHash: '0xabcdef1234567890',
    size: 6120000000, // ~5.7 GB
    price: '0.12',
    allowedQueries: [
      QueryType.AGGREGATION,
      QueryType.ANALYTICS,
      QueryType.ML_TRAINING,
      QueryType.CORRELATION,
    ],
    pdpParams: {
      challengeInterval: 1800,
      proofTimeout: 300,
      slashingAmount: '0.2',
      requiredProofs: 48,
    },
    verified: true,
    createdAt: Date.now() - 604800000,
    lastProofAt: Date.now() - 1800000,
    totalQueries: 892,
    revenue: '107.04',
  },
  {
    id: '3',
    cid: 'QmNLei78zWmzUdbeRB3CiUfAizWUrbeeZh5K1rhAQKCh51',
    owner: '0x9f4f2726179a224501d762422c946590d91',
    title: 'E-commerce Behavior Analytics',
    description:
      'Customer behavior patterns, purchase history, and recommendation engine training data from major e-commerce platforms.',
    category: 'E-commerce',
    schemaHash: '0x567890abcdef1234',
    size: 1932735284, // ~1.8 GB
    price: '0.08',
    allowedQueries: [QueryType.AGGREGATION, QueryType.ANALYTICS, QueryType.COHORT],
    pdpParams: {
      challengeInterval: 7200,
      proofTimeout: 300,
      slashingAmount: '0.15',
      requiredProofs: 12,
    },
    verified: false,
    createdAt: Date.now() - 259200000,
    lastProofAt: Date.now() - 7200000,
    totalQueries: 2156,
    revenue: '172.48',
  },
];

// ---- Seed orders ----------------------------------------------------------

const orders: QueryOrder[] = [
  {
    id: '1',
    datasetId: '1',
    buyer: '0x95222290DD7278Aa3Ddd389Cc1E1d165CC4BAfe5',
    queryType: QueryType.AGGREGATION,
    parameters: {
      function: 'AVG',
      column: 'transaction_amount',
      groupBy: 'age_group',
    },
    price: '0.05',
    status: OrderStatus.COMPLETED,
    createdAt: Date.now() - 3600000,
    executedAt: Date.now() - 3300000,
    resultCid: 'QmResult1234567890abcdef',
    attestation: {
      datasetId: '1',
      queryHash: '0xquery123',
      resultHash: '0xresult123',
      workerId: 'worker-001',
      timestamp: Date.now() - 3300000,
      signature: '0xsignature123',
    },
  },
  {
    id: '2',
    datasetId: '2',
    buyer: '0x742d35Cc6634C0532925a3b8D0c7b3a7D5d4c6f8',
    queryType: QueryType.ML_TRAINING,
    parameters: {
      modelType: 'logistic_regression',
      targetVariable: 'treatment_success',
      features: ['age', 'gender', 'medical_history', 'lab_values'],
    },
    price: '0.18',
    status: OrderStatus.EXECUTING,
    createdAt: Date.now() - 1800000,
  },
  {
    id: '3',
    datasetId: '3',
    buyer: '0x8ba1f109551bD432803012645Hac136c1c5e0',
    queryType: QueryType.COHORT,
    parameters: {
      cohortDefinition: 'first_purchase',
      timePeriod: 'monthly',
      metric: 'retention_rate',
    },
    price: '0.12',
    status: OrderStatus.PENDING,
    createdAt: Date.now() - 600000,
  },
];

// ---------------------------------------------------------------------------
// Dataset helpers
// ---------------------------------------------------------------------------

export function getDatasets(): Dataset[] {
  return [...datasets];
}

export function getDatasetById(id: string): Dataset | undefined {
  return datasets.find((d) => d.id === id);
}

/** Generate a pseudo-random IPFS-style CID for demo purposes. */
function generateCid(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = 'Qm';
  for (let i = 0; i < 44; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export function addDataset(
  data: Omit<Dataset, 'id' | 'cid' | 'verified' | 'createdAt' | 'lastProofAt' | 'totalQueries' | 'revenue'> & {
    cid?: string;
  },
): Dataset {
  const newDataset: Dataset = {
    ...data,
    id: (nextDatasetId++).toString(),
    cid: data.cid || generateCid(),
    verified: false,
    createdAt: Date.now(),
    lastProofAt: Date.now(),
    totalQueries: 0,
    revenue: '0',
  };
  datasets.push(newDataset);
  return newDataset;
}

export function deleteDataset(id: string): boolean {
  const index = datasets.findIndex((d) => d.id === id);
  if (index === -1) return false;
  datasets.splice(index, 1);
  return true;
}

// ---------------------------------------------------------------------------
// Query / order helpers
// ---------------------------------------------------------------------------

export function getQueries(): QueryOrder[] {
  return [...orders];
}

export function getQueryById(id: string): QueryOrder | undefined {
  return orders.find((o) => o.id === id);
}

export function addQuery(
  data: Omit<QueryOrder, 'id' | 'status' | 'createdAt'>,
): QueryOrder {
  const newOrder: QueryOrder = {
    ...data,
    id: (nextOrderId++).toString(),
    status: OrderStatus.PENDING,
    createdAt: Date.now(),
  };
  orders.push(newOrder);

  // Also bump the dataset's totalQueries counter
  const dataset = datasets.find((d) => d.id === newOrder.datasetId);
  if (dataset) {
    dataset.totalQueries += 1;
  }

  return newOrder;
}

export function updateQueryStatus(
  id: string,
  status: OrderStatus,
  extra?: Partial<Pick<QueryOrder, 'executedAt' | 'resultCid' | 'attestation'>>,
): QueryOrder | undefined {
  const order = orders.find((o) => o.id === id);
  if (!order) return undefined;

  order.status = status;
  if (extra?.executedAt !== undefined) order.executedAt = extra.executedAt;
  if (extra?.resultCid !== undefined) order.resultCid = extra.resultCid;
  if (extra?.attestation !== undefined) order.attestation = extra.attestation;

  // When a query completes, add its price to the dataset's revenue
  if (status === OrderStatus.COMPLETED) {
    const dataset = datasets.find((d) => d.id === order.datasetId);
    if (dataset) {
      dataset.revenue = (parseFloat(dataset.revenue) + parseFloat(order.price)).toFixed(2);
    }
  }

  return order;
}
