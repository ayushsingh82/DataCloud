// Smart Contract Interfaces, Types, and Real On-Chain Integration

export interface Dataset {
  id: string;
  cid: string; // IPFS Content ID
  owner: string; // Wallet address
  title: string;
  description: string;
  category: string;
  schemaHash: string;
  size: number; // in bytes
  price: string; // in tFIL
  allowedQueries: QueryType[];
  pdpParams: PDPParams;
  verified: boolean;
  createdAt: number;
  lastProofAt: number;
  totalQueries: number;
  revenue: string; // in tFIL
}

export interface QueryOrder {
  id: string;
  datasetId: string;
  buyer: string; // Wallet address
  queryType: QueryType;
  parameters: Record<string, unknown>;
  price: string; // in tFIL
  status: OrderStatus;
  createdAt: number;
  executedAt?: number;
  resultCid?: string; // IPFS CID of results
  result?: Record<string, unknown>; // Computed query results
  attestation?: QueryAttestation;
}

export interface PDPParams {
  challengeInterval: number; // in seconds
  proofTimeout: number; // in seconds
  slashingAmount: string; // in tFIL
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

// ---------------------------------------------------------------------------
// Contract ABIs — matching the deployed Solidity contracts
// ---------------------------------------------------------------------------

export const DATASET_REGISTRY_ABI = [
  "function registerDataset(string cid, string title, string category, uint256 pricePerQuery, bytes32 schemaHash) external returns (uint256)",
  "function updatePrice(uint256 datasetId, uint256 newPrice) external",
  "function verifyDataset(uint256 datasetId) external",
  "function recordQuery(uint256 datasetId, uint256 revenue) external",
  "function getDataset(uint256 datasetId) external view returns (tuple(uint256 id, string cid, address owner, string title, string category, uint256 pricePerQuery, bytes32 schemaHash, bool verified, uint256 createdAt, uint256 totalQueries, uint256 totalRevenue))",
  "function getDatasetByCid(string cid) external view returns (uint256)",
  "function getOwnerDatasets(address owner) external view returns (uint256[])",
  "function exists(uint256 datasetId) external view returns (bool)",
  "function totalDatasets() external view returns (uint256)",
  "function nextDatasetId() external view returns (uint256)",
  "event DatasetRegistered(uint256 indexed datasetId, string cid, address indexed owner, string title, string category, uint256 pricePerQuery, uint256 timestamp)",
  "event DatasetVerified(uint256 indexed datasetId, address indexed verifier, uint256 timestamp)",
  "event QueryRecorded(uint256 indexed datasetId, uint256 revenue, uint256 timestamp)",
] as const;

export const QUERY_MARKET_ABI = [
  "function createOrder(uint256 datasetId, string queryType, bytes32 queryHash) external payable returns (uint256)",
  "function markExecuting(uint256 orderId) external",
  "function completeOrder(uint256 orderId, string resultCid, bytes32 resultHash) external",
  "function cancelOrder(uint256 orderId) external",
  "function failOrder(uint256 orderId, string reason) external",
  "function setOperator(address newOperator) external",
  "function getOrder(uint256 orderId) external view returns (tuple(uint256 id, uint256 datasetId, address buyer, string queryType, bytes32 queryHash, uint256 price, uint8 status, string resultCid, bytes32 resultHash, uint256 createdAt, uint256 completedAt))",
  "function getBuyerOrders(address buyer) external view returns (uint256[])",
  "function getDatasetOrders(uint256 datasetId) external view returns (uint256[])",
  "function totalOrders() external view returns (uint256)",
  "function totalVolume() external view returns (uint256)",
  "event OrderCreated(uint256 indexed orderId, uint256 indexed datasetId, address indexed buyer, string queryType, uint256 price, uint256 timestamp)",
  "event OrderCompleted(uint256 indexed orderId, string resultCid, bytes32 resultHash, uint256 timestamp)",
  "event OrderCancelled(uint256 indexed orderId, address indexed buyer, uint256 refundAmount, uint256 timestamp)",
] as const;

// ---------------------------------------------------------------------------
// Contract addresses from environment variables
// ---------------------------------------------------------------------------

export function getContractAddresses() {
  return {
    DATASET_REGISTRY: process.env.DATASET_REGISTRY_ADDRESS || '',
    QUERY_MARKET: process.env.QUERY_MARKET_ADDRESS || '',
  };
}

/**
 * Check if smart contracts are configured (env vars set)
 */
export function areContractsConfigured(): boolean {
  return !!(process.env.DATASET_REGISTRY_ADDRESS && process.env.QUERY_MARKET_ADDRESS);
}

// ---------------------------------------------------------------------------
// On-Chain Contract Interactions via ethers.js
// ---------------------------------------------------------------------------

/**
 * Register a dataset on-chain via DatasetRegistry contract
 */
export async function registerDatasetOnChain(
  cid: string,
  title: string,
  category: string,
  pricePerQueryWei: string,
  schemaHash: string,
): Promise<{ transactionHash: string; datasetId: string }> {
  const addresses = getContractAddresses();
  if (!addresses.DATASET_REGISTRY || !process.env.WALLET_PRIVATE_KEY) {
    throw new Error(
      'Smart contracts not configured. Set DATASET_REGISTRY_ADDRESS and WALLET_PRIVATE_KEY.',
    );
  }

  const { ethers } = await import('ethers');
  const provider = new ethers.JsonRpcProvider(
    process.env.FILECOIN_RPC_URL || 'https://api.calibration.node.glif.io/rpc/v1',
  );
  const wallet = new ethers.Wallet(process.env.WALLET_PRIVATE_KEY, provider);
  const contract = new ethers.Contract(
    addresses.DATASET_REGISTRY,
    DATASET_REGISTRY_ABI,
    wallet,
  );

  const schemaBytes32 = ethers.zeroPadValue(
    ethers.toBeArray(ethers.keccak256(ethers.toUtf8Bytes(schemaHash || 'default'))),
    32,
  );

  const tx = await contract.registerDataset(
    cid,
    title,
    category,
    ethers.parseEther(pricePerQueryWei),
    schemaBytes32,
  );
  const receipt = await tx.wait();

  // Parse the DatasetRegistered event to get the datasetId
  const event = receipt.logs
    .map((log: { topics: string[]; data: string }) => {
      try {
        return contract.interface.parseLog(log);
      } catch {
        return null;
      }
    })
    .find((e: { name: string } | null) => e?.name === 'DatasetRegistered');

  const datasetId = event ? event.args.datasetId.toString() : '0';

  return {
    transactionHash: receipt.hash,
    datasetId,
  };
}

/**
 * Create a query order on-chain (with tFIL payment)
 * This is called server-side using the operator wallet.
 * In a production system, the buyer would call this from their wallet.
 */
export async function createOrderOnChain(
  datasetId: string,
  queryType: string,
  queryHash: string,
  priceWei: string,
): Promise<{ transactionHash: string; orderId: string }> {
  const addresses = getContractAddresses();
  if (!addresses.QUERY_MARKET || !process.env.WALLET_PRIVATE_KEY) {
    throw new Error(
      'Smart contracts not configured. Set QUERY_MARKET_ADDRESS and WALLET_PRIVATE_KEY.',
    );
  }

  const { ethers } = await import('ethers');
  const provider = new ethers.JsonRpcProvider(
    process.env.FILECOIN_RPC_URL || 'https://api.calibration.node.glif.io/rpc/v1',
  );
  const wallet = new ethers.Wallet(process.env.WALLET_PRIVATE_KEY, provider);
  const contract = new ethers.Contract(addresses.QUERY_MARKET, QUERY_MARKET_ABI, wallet);

  const queryBytes32 = ethers.keccak256(ethers.toUtf8Bytes(queryHash));

  const tx = await contract.createOrder(datasetId, queryType, queryBytes32, {
    value: ethers.parseEther(priceWei),
  });
  const receipt = await tx.wait();

  const event = receipt.logs
    .map((log: { topics: string[]; data: string }) => {
      try {
        return contract.interface.parseLog(log);
      } catch {
        return null;
      }
    })
    .find((e: { name: string } | null) => e?.name === 'OrderCreated');

  const orderId = event ? event.args.orderId.toString() : '0';

  return {
    transactionHash: receipt.hash,
    orderId,
  };
}

/**
 * Complete a query order on-chain (release payment to dataset owner)
 */
export async function completeOrderOnChain(
  orderId: string,
  resultCid: string,
  resultHash: string,
): Promise<{ transactionHash: string }> {
  const addresses = getContractAddresses();
  if (!addresses.QUERY_MARKET || !process.env.WALLET_PRIVATE_KEY) {
    throw new Error(
      'Smart contracts not configured. Set QUERY_MARKET_ADDRESS and WALLET_PRIVATE_KEY.',
    );
  }

  const { ethers } = await import('ethers');
  const provider = new ethers.JsonRpcProvider(
    process.env.FILECOIN_RPC_URL || 'https://api.calibration.node.glif.io/rpc/v1',
  );
  const wallet = new ethers.Wallet(process.env.WALLET_PRIVATE_KEY, provider);
  const contract = new ethers.Contract(addresses.QUERY_MARKET, QUERY_MARKET_ABI, wallet);

  const resultBytes32 = ethers.keccak256(ethers.toUtf8Bytes(resultHash));

  const tx = await contract.completeOrder(orderId, resultCid, resultBytes32);
  const receipt = await tx.wait();

  return { transactionHash: receipt.hash };
}

/**
 * Fail a query order on-chain (refund buyer)
 */
export async function failOrderOnChain(
  orderId: string,
  reason: string,
): Promise<{ transactionHash: string }> {
  const addresses = getContractAddresses();
  if (!addresses.QUERY_MARKET || !process.env.WALLET_PRIVATE_KEY) {
    throw new Error('Smart contracts not configured.');
  }

  const { ethers } = await import('ethers');
  const provider = new ethers.JsonRpcProvider(
    process.env.FILECOIN_RPC_URL || 'https://api.calibration.node.glif.io/rpc/v1',
  );
  const wallet = new ethers.Wallet(process.env.WALLET_PRIVATE_KEY, provider);
  const contract = new ethers.Contract(addresses.QUERY_MARKET, QUERY_MARKET_ABI, wallet);

  const tx = await contract.failOrder(orderId, reason);
  const receipt = await tx.wait();

  return { transactionHash: receipt.hash };
}

// ---------------------------------------------------------------------------
// Helper functions
// ---------------------------------------------------------------------------

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
    return `${(num * 1000).toFixed(2)} mtFIL`;
  }
  return `${num.toFixed(4)} tFIL`;
}

export function validateQueryParameters(queryType: QueryType, parameters: Record<string, unknown>): boolean {
  switch (queryType) {
    case QueryType.AGGREGATION:
      return !!(parameters.function && parameters.column);
    case QueryType.ML_TRAINING:
      return !!(parameters.modelType && parameters.targetVariable);
    case QueryType.ANALYTICS:
      return !!(parameters.analysisType || parameters.type);
    default:
      return true;
  }
}
