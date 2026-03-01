// Smart Contract Interfaces and Types

export interface Dataset {
  id: string;
  cid: string; // IPFS Content ID
  owner: string; // Wallet address
  title: string;
  description: string;
  category: string;
  schemaHash: string;
  size: number; // in bytes
  price: string; // in FIL
  allowedQueries: QueryType[];
  pdpParams: PDPParams;
  verified: boolean;
  createdAt: number;
  lastProofAt: number;
  totalQueries: number;
  revenue: string; // in FIL
}

export interface QueryOrder {
  id: string;
  datasetId: string;
  buyer: string; // Wallet address
  queryType: QueryType;
  parameters: Record<string, unknown>;
  price: string; // in FIL
  status: OrderStatus;
  createdAt: number;
  executedAt?: number;
  resultCid?: string; // IPFS CID of results
  attestation?: QueryAttestation;
}

export interface PDPParams {
  challengeInterval: number; // in seconds
  proofTimeout: number; // in seconds
  slashingAmount: string; // in FIL
  requiredProofs: number;
}

export interface QueryAttestation {
  datasetId: string;
  queryHash: string;
  resultHash: string;
  workerId: string;
  timestamp: number;
  signature: string;
}

export enum QueryType {
  AGGREGATION = 'aggregation',
  ML_TRAINING = 'ml_training',
  ANALYTICS = 'analytics',
  CORRELATION = 'correlation',
  COHORT = 'cohort',
  CUSTOM = 'custom'
}

export enum OrderStatus {
  PENDING = 'pending',
  EXECUTING = 'executing',
  COMPLETED = 'completed',
  FAILED = 'failed',
  REFUNDED = 'refunded'
}

// Contract ABIs (simplified)
export const DATASET_REGISTRY_ABI = [
  {
    "name": "registerDataset",
    "type": "function",
    "inputs": [
      {"name": "cid", "type": "string"},
      {"name": "schemaHash", "type": "bytes32"},
      {"name": "accessPolicy", "type": "bytes"},
      {"name": "priceModel", "type": "uint256"},
      {"name": "pdpParams", "type": "tuple"}
    ],
    "outputs": [{"name": "datasetId", "type": "uint256"}]
  },
  {
    "name": "updateDataset",
    "type": "function",
    "inputs": [
      {"name": "datasetId", "type": "uint256"},
      {"name": "updates", "type": "bytes"}
    ]
  },
  {
    "name": "getDataset",
    "type": "function",
    "inputs": [{"name": "datasetId", "type": "uint256"}],
    "outputs": [{"name": "dataset", "type": "tuple"}]
  }
] as const;

export const QUERY_MARKET_ABI = [
  {
    "name": "createQueryOrder",
    "type": "function",
    "inputs": [
      {"name": "datasetId", "type": "uint256"},
      {"name": "queryParams", "type": "bytes"},
      {"name": "maxPrice", "type": "uint256"}
    ],
    "outputs": [{"name": "orderId", "type": "uint256"}]
  },
  {
    "name": "executeQuery",
    "type": "function",
    "inputs": [
      {"name": "orderId", "type": "uint256"},
      {"name": "attestation", "type": "bytes"}
    ]
  },
  {
    "name": "getOrder",
    "type": "function",
    "inputs": [{"name": "orderId", "type": "uint256"}],
    "outputs": [{"name": "order", "type": "tuple"}]
  }
] as const;

export const PROOF_MANAGER_ABI = [
  {
    "name": "submitProof",
    "type": "function",
    "inputs": [
      {"name": "datasetId", "type": "uint256"},
      {"name": "proof", "type": "bytes"},
      {"name": "challenge", "type": "bytes32"}
    ]
  },
  {
    "name": "verifyProof",
    "type": "function",
    "inputs": [
      {"name": "datasetId", "type": "uint256"},
      {"name": "proof", "type": "bytes"}
    ],
    "outputs": [{"name": "valid", "type": "bool"}]
  },
  {
    "name": "getDatasetHealth",
    "type": "function",
    "inputs": [{"name": "datasetId", "type": "uint256"}],
    "outputs": [{"name": "healthScore", "type": "uint256"}]
  }
] as const;

// Contract addresses (these would be deployed addresses)
export const CONTRACT_ADDRESSES = {
  DATASET_REGISTRY: "0x1234567890123456789012345678901234567890",
  QUERY_MARKET: "0x2345678901234567890123456789012345678901",
  PROOF_MANAGER: "0x3456789012345678901234567890123456789012"
} as const;

// Utility functions for contract interactions
//
// In demo mode (no real blockchain), the class delegates to the in-memory
// store so that callers get realistic-looking data without a live contract.
// We use a lazy-import helper to avoid a circular dependency with store.ts
// (which imports types from this file).
export class DataCloudContracts {
  private provider: unknown;
  private signer: unknown;
  /** When true the class returns data from the in-memory store. */
  private demoMode: boolean;

  constructor(provider: unknown, signer?: unknown) {
    this.provider = provider;
    this.signer = signer;
    // If the provider is falsy (null / undefined) we operate in demo mode.
    this.demoMode = !provider;
  }

  /** Lazily import the store to avoid circular deps at module-parse time. */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private async store(): Promise<any> {
    return await import('@/lib/store');
  }

  // ---- Dataset Registry methods ------------------------------------------

  async registerDataset(
    dataset: Omit<Dataset, 'id' | 'verified' | 'createdAt' | 'totalQueries' | 'revenue'>,
  ): Promise<string> {
    if (this.demoMode) {
      const store = await this.store();
      const created = store.addDataset(dataset);
      return created.id;
    }
    // In production this would call the on-chain registerDataset function
    console.log('Registering dataset on-chain:', dataset.title);
    return 'mock-dataset-id';
  }

  async getDataset(datasetId: string): Promise<Dataset | null> {
    if (this.demoMode) {
      const store = await this.store();
      return store.getDatasetById(datasetId) ?? null;
    }
    // In production this would call the on-chain getDataset function
    return null;
  }

  async updateDataset(datasetId: string, updates: Partial<Dataset>): Promise<boolean> {
    if (this.demoMode) {
      const store = await this.store();
      const existing = store.getDatasetById(datasetId);
      if (!existing) return false;
      // Apply shallow updates to the in-memory object. The store holds the
      // reference so mutations are visible everywhere.
      Object.assign(existing, updates);
      return true;
    }
    console.log('Updating dataset on-chain:', datasetId, updates);
    return true;
  }

  // ---- Query Market methods ----------------------------------------------

  async createQueryOrder(
    datasetId: string,
    queryType: QueryType,
    parameters: Record<string, unknown>,
    maxPrice: string,
  ): Promise<string> {
    if (this.demoMode) {
      const store = await this.store();
      const order = store.addQuery({
        datasetId,
        buyer: (this.signer as string) || '0x0000000000000000000000000000000000000000',
        queryType,
        parameters,
        price: maxPrice,
      });
      return order.id;
    }
    console.log('Creating query order on-chain:', { datasetId, queryType, parameters, maxPrice });
    return 'mock-order-id';
  }

  async getQueryOrder(orderId: string): Promise<QueryOrder | null> {
    if (this.demoMode) {
      const store = await this.store();
      return store.getQueryById(orderId) ?? null;
    }
    return null;
  }

  async executeQuery(orderId: string, attestation: QueryAttestation): Promise<boolean> {
    if (this.demoMode) {
      const store = await this.store();
      const updated = store.updateQueryStatus(orderId, OrderStatus.COMPLETED, {
        executedAt: attestation.timestamp,
        resultCid: `QmResult${attestation.timestamp}`,
        attestation,
      });
      return !!updated;
    }
    console.log('Executing query on-chain:', orderId, attestation);
    return true;
  }

  // ---- Proof Manager methods ---------------------------------------------

  async submitProof(datasetId: string, proof: string, challenge: string): Promise<boolean> {
    if (this.demoMode) {
      // Simulate proof acceptance: update the dataset's lastProofAt timestamp
      const store = await this.store();
      const dataset = store.getDatasetById(datasetId);
      if (dataset) {
        dataset.lastProofAt = Date.now();
      }
      return true;
    }
    console.log('Submitting proof on-chain:', { datasetId, proof, challenge });
    return true;
  }

  async verifyProof(datasetId: string, proof: string): Promise<boolean> {
    if (this.demoMode) {
      // In demo mode proofs are always valid when the dataset exists
      const store = await this.store();
      return !!store.getDatasetById(datasetId);
    }
    console.log('Verifying proof on-chain:', { datasetId, proof });
    return true;
  }

  async getDatasetHealth(datasetId: string): Promise<number> {
    if (this.demoMode) {
      const store = await this.store();
      const dataset = store.getDatasetById(datasetId);
      if (!dataset) return 0;
      // Derive a deterministic health score from the dataset's proof
      // freshness: 100 if proof < 1 h old, decaying linearly to 0 at 24 h.
      const hoursSinceProof = (Date.now() - dataset.lastProofAt) / 3600000;
      return Math.max(0, Math.min(100, Math.round(100 - (hoursSinceProof / 24) * 100)));
    }
    // In production this would query the on-chain health score
    return Math.floor(Math.random() * 100);
  }
}

// Helper functions
export function calculateQueryPrice(basePrice: string, queryType: QueryType, datasetSize: number): string {
  const base = parseFloat(basePrice);
  let multiplier = 1;

  switch (queryType) {
    case QueryType.AGGREGATION:
      multiplier = 1;
      break;
    case QueryType.ANALYTICS:
      multiplier = 3;
      break;
    case QueryType.ML_TRAINING:
      multiplier = 5;
      break;
    case QueryType.CUSTOM:
      multiplier = 10;
      break;
    default:
      multiplier = 2;
  }

  // Factor in dataset size (larger datasets cost more)
  const sizeMultiplier = Math.max(1, datasetSize / (1024 * 1024 * 1024)); // GB
  
  return (base * multiplier * Math.sqrt(sizeMultiplier)).toFixed(4);
}

export function formatFIL(amount: string): string {
  const num = parseFloat(amount);
  if (num < 0.001) {
    return `${(num * 1000).toFixed(2)} mFIL`;
  }
  return `${num.toFixed(4)} FIL`;
}

export function validateQueryParameters(queryType: QueryType, parameters: Record<string, unknown>): boolean {
  switch (queryType) {
    case QueryType.AGGREGATION:
      return !!(parameters.function && parameters.column);
    case QueryType.ML_TRAINING:
      return !!(parameters.modelType && parameters.targetVariable);
    case QueryType.ANALYTICS:
      return !!(parameters.analysisType);
    default:
      return true;
  }
}
