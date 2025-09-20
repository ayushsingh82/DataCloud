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
  parameters: Record<string, any>;
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
export class DataCloudContracts {
  private provider: any;
  private signer: any;

  constructor(provider: any, signer?: any) {
    this.provider = provider;
    this.signer = signer;
  }

  // Dataset Registry methods
  async registerDataset(dataset: Omit<Dataset, 'id' | 'verified' | 'createdAt' | 'totalQueries' | 'revenue'>): Promise<string> {
    // Implementation would interact with smart contract
    console.log('Registering dataset:', dataset);
    return 'mock-dataset-id';
  }

  async getDataset(datasetId: string): Promise<Dataset | null> {
    // Mock implementation
    return null;
  }

  async updateDataset(datasetId: string, updates: Partial<Dataset>): Promise<boolean> {
    console.log('Updating dataset:', datasetId, updates);
    return true;
  }

  // Query Market methods
  async createQueryOrder(datasetId: string, queryType: QueryType, parameters: Record<string, any>, maxPrice: string): Promise<string> {
    console.log('Creating query order:', { datasetId, queryType, parameters, maxPrice });
    return 'mock-order-id';
  }

  async getQueryOrder(orderId: string): Promise<QueryOrder | null> {
    // Mock implementation
    return null;
  }

  async executeQuery(orderId: string, attestation: QueryAttestation): Promise<boolean> {
    console.log('Executing query:', orderId, attestation);
    return true;
  }

  // Proof Manager methods
  async submitProof(datasetId: string, proof: string, challenge: string): Promise<boolean> {
    console.log('Submitting proof:', { datasetId, proof, challenge });
    return true;
  }

  async verifyProof(datasetId: string, proof: string): Promise<boolean> {
    console.log('Verifying proof:', { datasetId, proof });
    return true;
  }

  async getDatasetHealth(datasetId: string): Promise<number> {
    // Mock implementation - returns health score 0-100
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

export function validateQueryParameters(queryType: QueryType, parameters: Record<string, any>): boolean {
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
