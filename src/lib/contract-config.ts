/**
 * Client-safe contract configuration for wagmi/viem.
 * Uses NEXT_PUBLIC_ env vars so these are available in the browser.
 */

export const QUERY_MARKET_ADDRESS = (process.env.NEXT_PUBLIC_QUERY_MARKET_ADDRESS || '') as `0x${string}`;
export const DATASET_REGISTRY_ADDRESS = (process.env.NEXT_PUBLIC_DATASET_REGISTRY_ADDRESS || '') as `0x${string}`;

export function isContractConfigured(): boolean {
  return !!(QUERY_MARKET_ADDRESS && QUERY_MARKET_ADDRESS.length > 2);
}

export function isRegistryConfigured(): boolean {
  return !!(DATASET_REGISTRY_ADDRESS && DATASET_REGISTRY_ADDRESS.length > 2);
}

/**
 * DatasetRegistry ABI — seller calls registerDataset to register on-chain.
 */
export const datasetRegistryAbi = [
  {
    name: 'registerDataset',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'cid', type: 'string' },
      { name: 'title', type: 'string' },
      { name: 'category', type: 'string' },
      { name: 'pricePerQuery', type: 'uint256' },
      { name: 'schemaHash', type: 'bytes32' },
    ],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    name: 'getDataset',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'datasetId', type: 'uint256' }],
    outputs: [
      {
        name: '',
        type: 'tuple',
        components: [
          { name: 'id', type: 'uint256' },
          { name: 'cid', type: 'string' },
          { name: 'owner', type: 'address' },
          { name: 'title', type: 'string' },
          { name: 'category', type: 'string' },
          { name: 'pricePerQuery', type: 'uint256' },
          { name: 'schemaHash', type: 'bytes32' },
          { name: 'verified', type: 'bool' },
          { name: 'createdAt', type: 'uint256' },
          { name: 'totalQueries', type: 'uint256' },
          { name: 'totalRevenue', type: 'uint256' },
        ],
      },
    ],
  },
  {
    name: 'DatasetRegistered',
    type: 'event',
    inputs: [
      { name: 'datasetId', type: 'uint256', indexed: true },
      { name: 'cid', type: 'string', indexed: false },
      { name: 'owner', type: 'address', indexed: true },
      { name: 'title', type: 'string', indexed: false },
      { name: 'category', type: 'string', indexed: false },
      { name: 'pricePerQuery', type: 'uint256', indexed: false },
      { name: 'timestamp', type: 'uint256', indexed: false },
    ],
  },
] as const;

/**
 * QueryMarket ABI — only the functions/events needed by the frontend.
 * The buyer calls createOrder (payable) to escrow tFIL.
 * The operator backend calls completeOrder to release payment.
 */
export const queryMarketAbi = [
  {
    name: 'createOrder',
    type: 'function',
    stateMutability: 'payable',
    inputs: [
      { name: 'datasetId', type: 'uint256' },
      { name: 'queryType', type: 'string' },
      { name: 'queryHash', type: 'bytes32' },
    ],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    name: 'completeOrder',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'orderId', type: 'uint256' },
      { name: 'resultCid', type: 'string' },
      { name: 'resultHash', type: 'bytes32' },
    ],
    outputs: [],
  },
  {
    name: 'cancelOrder',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [{ name: 'orderId', type: 'uint256' }],
    outputs: [],
  },
  {
    name: 'getOrder',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'orderId', type: 'uint256' }],
    outputs: [
      {
        name: '',
        type: 'tuple',
        components: [
          { name: 'id', type: 'uint256' },
          { name: 'datasetId', type: 'uint256' },
          { name: 'buyer', type: 'address' },
          { name: 'queryType', type: 'string' },
          { name: 'queryHash', type: 'bytes32' },
          { name: 'price', type: 'uint256' },
          { name: 'status', type: 'uint8' },
          { name: 'resultCid', type: 'string' },
          { name: 'resultHash', type: 'bytes32' },
          { name: 'createdAt', type: 'uint256' },
          { name: 'completedAt', type: 'uint256' },
        ],
      },
    ],
  },
  {
    name: 'OrderCreated',
    type: 'event',
    inputs: [
      { name: 'orderId', type: 'uint256', indexed: true },
      { name: 'datasetId', type: 'uint256', indexed: true },
      { name: 'buyer', type: 'address', indexed: true },
      { name: 'queryType', type: 'string', indexed: false },
      { name: 'price', type: 'uint256', indexed: false },
      { name: 'timestamp', type: 'uint256', indexed: false },
    ],
  },
  {
    name: 'OrderCancelled',
    type: 'event',
    inputs: [
      { name: 'orderId', type: 'uint256', indexed: true },
      { name: 'buyer', type: 'address', indexed: true },
      { name: 'refundAmount', type: 'uint256', indexed: false },
      { name: 'timestamp', type: 'uint256', indexed: false },
    ],
  },
] as const;
