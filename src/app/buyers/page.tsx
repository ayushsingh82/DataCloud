'use client';

import { useState, useEffect, useCallback } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

// Types matching what the API returns
interface ApiDataset {
  id: string;
  title: string;
  description: string;
  category: string;
  owner: string;
  price: string;
  size: number;
  records?: number;
  format?: string;
  columns?: string[];
  allowedQueries: string[];
  verified: boolean;
  cid: string;
  onChainId?: string;
  totalQueries: number;
  revenue: string;
}

interface QueryResult {
  id: string;
  status: string;
  price: string;
  result?: Record<string, unknown>;
  resultCid?: string;
  attestation?: Record<string, unknown>;
}

const QUERY_TYPE_LABELS: Record<string, string> = {
  aggregation: 'Statistical Aggregation',
  ml_training: 'Machine Learning Training',
  analytics: 'Analytics',
  correlation: 'Correlation Analysis',
  cohort: 'Cohort Analysis',
  custom: 'Custom Query',
};

const QUERY_COST_MULTIPLIERS: Record<string, number> = {
  aggregation: 1,
  analytics: 1.6,
  ml_training: 3,
  cohort: 2.4,
  correlation: 2,
  custom: 2,
};

export default function BuyersPage() {
  // Wallet address fetched at execution time via dynamic import to avoid hydration issues
  const [walletAddress, setWalletAddress] = useState('');

  // Step state
  const [datasets, setDatasets] = useState<ApiDataset[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDataset, setSelectedDataset] = useState<ApiDataset | null>(null);
  const [selectedQueryType, setSelectedQueryType] = useState('');

  // Query parameters
  const [aggFunction, setAggFunction] = useState('sum');
  const [aggColumn, setAggColumn] = useState('');
  const [aggGroupBy, setAggGroupBy] = useState('');
  const [mlModel, setMlModel] = useState('logistic');
  const [mlTarget, setMlTarget] = useState('');
  const [mlFeatures, setMlFeatures] = useState('');
  const [corrVariables, setCorrVariables] = useState('');
  const [cohortDef, setCohortDef] = useState('signup');
  const [cohortPeriod, setCohortPeriod] = useState('monthly');
  const [cohortMetric, setCohortMetric] = useState('retention');

  // Execution state
  const [executing, setExecuting] = useState(false);
  const [paymentStep, setPaymentStep] = useState('');
  const [queryResult, setQueryResult] = useState<QueryResult | null>(null);
  const [error, setError] = useState('');

  // Fetch datasets
  const fetchDatasets = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/datasets?limit=50');
      const json = await res.json();
      if (json.success) {
        setDatasets(json.data);
      }
    } catch (err) {
      console.error('Failed to fetch datasets:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDatasets();
  }, [fetchDatasets]);

  // Calculate cost
  const estimatedCost = selectedDataset && selectedQueryType
    ? (parseFloat(selectedDataset.price) * (QUERY_COST_MULTIPLIERS[selectedQueryType] || 1)).toFixed(4)
    : '0';

  // Build parameters object
  function getQueryParameters(): Record<string, unknown> {
    switch (selectedQueryType) {
      case 'aggregation':
        return { function: aggFunction, column: aggColumn || 'value', groupBy: aggGroupBy || undefined };
      case 'ml_training':
        return { modelType: mlModel, targetVariable: mlTarget || 'target', features: mlFeatures ? mlFeatures.split(',').map(s => s.trim()) : [] };
      case 'cohort':
        return { cohortDefinition: cohortDef, timePeriod: cohortPeriod, metric: cohortMetric };
      case 'correlation':
        return { method: 'pearson', variables: corrVariables ? corrVariables.split(',').map(s => s.trim()) : (selectedDataset?.columns || []) };
      case 'analytics':
        return { type: 'distribution' };
      default:
        return {};
    }
  }

  // Execute query with on-chain payment
  async function executeQuery() {
    if (!selectedDataset || !selectedQueryType) return;

    // Get wallet address at execution time
    let address = walletAddress;
    try {
      const { getAccount } = await import('wagmi/actions');
      const { getConfig } = await import('@/lib/get-wagmi-config');
      const account = getAccount(getConfig());
      if (account.isConnected && account.address) {
        address = account.address;
        setWalletAddress(address);
      }
    } catch {
      // wagmi not available
    }

    if (!address) {
      setError('Please connect your wallet first using the Connect Wallet button in the navbar.');
      return;
    }

    setExecuting(true);
    setError('');
    setQueryResult(null);

    const parameters = getQueryParameters();
    const dataset = selectedDataset;
    const cost = estimatedCost;

    try {
      // Check if on-chain payment is possible
      const { isContractConfigured, QUERY_MARKET_ADDRESS, queryMarketAbi } = await import('@/lib/contract-config');
      const canPayOnChain = isContractConfigured() && dataset.onChainId;

      let txHash = '';
      let onChainOrderId = '';

      if (canPayOnChain) {
        // Step 1: Sign transaction
        setPaymentStep('Signing transaction in your wallet...');

        const { parseEther, keccak256, toHex, decodeEventLog } = await import('viem');
        const { writeContract, getPublicClient, waitForTransactionReceipt } = await import('wagmi/actions');
        const { getConfig } = await import('@/lib/get-wagmi-config');
        const config = getConfig();

        const queryHash = keccak256(toHex(JSON.stringify(parameters)));

        const hash = await writeContract(config, {
          address: QUERY_MARKET_ADDRESS,
          abi: queryMarketAbi,
          functionName: 'createOrder',
          args: [BigInt(dataset.onChainId!), selectedQueryType, queryHash],
          value: parseEther(cost),
        });

        txHash = hash;

        // Step 2: Wait for confirmation
        setPaymentStep('Waiting for on-chain confirmation...');

        const receipt = await waitForTransactionReceipt(config, { hash });

        // Parse OrderCreated event to get on-chain order ID
        for (const log of receipt.logs) {
          try {
            const event = decodeEventLog({
              abi: queryMarketAbi,
              data: log.data,
              topics: log.topics,
            });
            if (event.eventName === 'OrderCreated') {
              onChainOrderId = String((event.args as { orderId: bigint }).orderId);
              break;
            }
          } catch {
            // Not our event
          }
        }
      }

      // Step 3: Submit query to backend
      setPaymentStep(canPayOnChain ? 'Running computation...' : 'Executing query...');

      const res = await fetch('/api/queries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          datasetId: dataset.id,
          queryType: selectedQueryType,
          parameters,
          buyer: address,
          price: cost,
          txHash,
          onChainOrderId,
        }),
      });

      const json = await res.json();
      if (!json.success) {
        throw new Error(json.error || 'Query failed');
      }

      // Poll for result
      const orderId = json.data.id;
      setPaymentStep('Waiting for results...');

      let attempts = 0;
      while (attempts < 15) {
        await new Promise(r => setTimeout(r, 1500));
        const pollRes = await fetch(`/api/queries?id=${orderId}`);
        const pollJson = await pollRes.json();
        if (pollJson.success && pollJson.data) {
          if (pollJson.data.status === 'completed') {
            setQueryResult(pollJson.data);
            break;
          }
          if (pollJson.data.status === 'failed') {
            throw new Error('Query execution failed');
          }
        }
        attempts++;
      }

      if (attempts >= 15 && !queryResult) {
        // Last check
        const finalRes = await fetch(`/api/queries?id=${orderId}`);
        const finalJson = await finalRes.json();
        if (finalJson.success) setQueryResult(finalJson.data);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Query execution failed';
      if (msg.includes('User rejected') || msg.includes('denied')) {
        setError('Transaction was rejected in your wallet.');
      } else {
        setError(msg);
      }
    } finally {
      setExecuting(false);
      setPaymentStep('');
    }
  }

  return (
    <div className="min-h-screen w-full bg-[#C4FEC2] relative text-black">
      <div className="relative z-10">
        <Navbar />

      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 bg-[#C4FEC2]">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-6 text-black">
            Access Premium Data <span className="text-black">Insights</span>
          </h1>
          <p className="text-xl text-black/70 mb-8 max-w-3xl mx-auto">
            Run privacy-preserving analytics on high-quality datasets without accessing raw data. Pay with tFIL via smart contract escrow.
          </p>
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 px-6 py-3 rounded-lg inline-block">
            Connect your wallet to execute queries and pay with tFIL
          </div>
        </div>
      </section>

      {/* Query Builder — white card like marketplace */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 border-t border-black/10 relative overflow-hidden">
        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="border border-black/20 rounded-xl p-8 bg-white shadow-sm">
            <h2 className="text-2xl font-bold mb-2 text-black">Query Builder</h2>
            <p className="text-black/70 mb-8">
              Build and execute privacy-preserving queries on encrypted datasets
            </p>

            <div className="space-y-6">
              {/* Step 1: Dataset Selection */}
              <div>
                <label className="block text-sm font-medium mb-2 text-black">Step 1: Select Dataset</label>
                {loading ? (
                  <div className="text-black/60">Loading datasets...</div>
                ) : datasets.length === 0 ? (
                  <div className="text-black/60">No datasets available. Sellers must upload data first.</div>
                ) : (
                  <select
                    value={selectedDataset?.id || ''}
                    onChange={(e) => {
                      const ds = datasets.find(d => d.id === e.target.value) || null;
                      setSelectedDataset(ds);
                      setSelectedQueryType('');
                      setQueryResult(null);
                      setError('');
                    }}
                    className="w-full border border-black/20 rounded-lg px-4 py-3 text-black bg-white placeholder-black/50 focus:border-black focus:outline-none"
                  >
                    <option value="">Choose a dataset...</option>
                    {datasets.map(ds => (
                      <option key={ds.id} value={ds.id}>
                        {ds.title} ({ds.records || 0} records) — {ds.price} tFIL/query
                        {ds.onChainId ? ' ✓ On-chain' : ''}
                      </option>
                    ))}
                  </select>
                )}

                {selectedDataset && (
                  <div className="mt-3 p-3 border border-black/10 rounded-lg bg-gray-50 text-sm text-black/80">
                    <div><strong>Category:</strong> {selectedDataset.category}</div>
                    <div><strong>Records:</strong> {selectedDataset.records || 0}</div>
                    <div><strong>Base price:</strong> {selectedDataset.price} tFIL</div>
                    {selectedDataset.columns && selectedDataset.columns.length > 0 && (
                      <div className="mt-2">
                        <strong>Columns:</strong>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {selectedDataset.columns.map(col => (
                            <span key={col} className="px-2 py-0.5 bg-black/5 border border-black/10 rounded text-xs font-mono">{col}</span>
                          ))}
                        </div>
                      </div>
                    )}
                    {selectedDataset.onChainId && (
                      <div className="text-green-700 mt-1">On-chain registered (ID: {selectedDataset.onChainId}) — tFIL payment via smart contract</div>
                    )}
                    {!selectedDataset.onChainId && (
                      <div className="text-amber-700 mt-1">Off-chain only — no tFIL deduction</div>
                    )}
                  </div>
                )}
              </div>

              {/* Step 2: Query Type */}
              {selectedDataset && (
                <div>
                  <label className="block text-sm font-medium mb-2 text-black">Step 2: Query Type</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {selectedDataset.allowedQueries.map(qt => (
                      <button
                        key={qt}
                        onClick={() => {
                          setSelectedQueryType(qt);
                          setQueryResult(null);
                          setError('');
                        }}
                        className={`px-4 py-3 rounded-lg border text-sm font-medium transition-all ${
                          selectedQueryType === qt
                            ? 'border-black bg-black text-white'
                            : 'border-black/20 text-black hover:border-black bg-white'
                        }`}
                      >
                        {QUERY_TYPE_LABELS[qt] || qt}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 3: Query Parameters */}
              {selectedQueryType && (
                <div className="border border-black/10 rounded-lg p-6 bg-gray-50">
                  <h3 className="font-semibold mb-4 text-black">Step 3: Configure Parameters</h3>

                  {selectedQueryType === 'aggregation' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2 text-black/80">Aggregation Function</label>
                        <select
                          value={aggFunction}
                          onChange={(e) => setAggFunction(e.target.value)}
                          className="w-full border border-black/20 rounded-lg px-4 py-2 text-black bg-white focus:border-black focus:outline-none"
                        >
                          <option value="sum">SUM</option>
                          <option value="avg">AVG</option>
                          <option value="count">COUNT</option>
                          <option value="min">MIN</option>
                          <option value="max">MAX</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2 text-black/80">Column</label>
                        {selectedDataset?.columns && selectedDataset.columns.length > 0 ? (
                          <select
                            value={aggColumn}
                            onChange={(e) => setAggColumn(e.target.value)}
                            className="w-full border border-black/20 rounded-lg px-4 py-2 text-black bg-white focus:border-black focus:outline-none"
                          >
                            <option value="">Select a column...</option>
                            {selectedDataset.columns.map(col => (
                              <option key={col} value={col}>{col}</option>
                            ))}
                          </select>
                        ) : (
                          <input
                            type="text"
                            value={aggColumn}
                            onChange={(e) => setAggColumn(e.target.value)}
                            placeholder="e.g., transaction_amount"
                            className="w-full border border-black/20 rounded-lg px-4 py-2 text-black placeholder-black/50 bg-white focus:border-black focus:outline-none"
                          />
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2 text-black/80">Group By (optional)</label>
                        {selectedDataset?.columns && selectedDataset.columns.length > 0 ? (
                          <select
                            value={aggGroupBy}
                            onChange={(e) => setAggGroupBy(e.target.value)}
                            className="w-full border border-black/20 rounded-lg px-4 py-2 text-black bg-white focus:border-black focus:outline-none"
                          >
                            <option value="">None</option>
                            {selectedDataset.columns.map(col => (
                              <option key={col} value={col}>{col}</option>
                            ))}
                          </select>
                        ) : (
                          <input
                            type="text"
                            value={aggGroupBy}
                            onChange={(e) => setAggGroupBy(e.target.value)}
                            placeholder="e.g., age_group, region"
                            className="w-full border border-black/20 rounded-lg px-4 py-2 text-black placeholder-black/50 bg-white focus:border-black focus:outline-none"
                          />
                        )}
                      </div>
                    </div>
                  )}

                  {selectedQueryType === 'ml_training' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2 text-black/80">Model Type</label>
                        <select
                          value={mlModel}
                          onChange={(e) => setMlModel(e.target.value)}
                          className="w-full border border-black/20 rounded-lg px-4 py-2 text-black bg-white focus:border-black focus:outline-none"
                        >
                          <option value="logistic">Logistic Regression</option>
                          <option value="linear">Linear Regression</option>
                          <option value="random-forest">Random Forest</option>
                          <option value="neural-network">Neural Network</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2 text-black/80">Target Variable</label>
                        {selectedDataset?.columns && selectedDataset.columns.length > 0 ? (
                          <select
                            value={mlTarget}
                            onChange={(e) => setMlTarget(e.target.value)}
                            className="w-full border border-black/20 rounded-lg px-4 py-2 text-black bg-white focus:border-black focus:outline-none"
                          >
                            <option value="">Select target column...</option>
                            {selectedDataset.columns.map(col => (
                              <option key={col} value={col}>{col}</option>
                            ))}
                          </select>
                        ) : (
                          <input
                            type="text"
                            value={mlTarget}
                            onChange={(e) => setMlTarget(e.target.value)}
                            placeholder="e.g., is_fraud, customer_value"
                            className="w-full border border-black/20 rounded-lg px-4 py-2 text-black placeholder-black/50 bg-white focus:border-black focus:outline-none"
                          />
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2 text-black/80">Feature Columns</label>
                        {selectedDataset?.columns && selectedDataset.columns.length > 0 ? (
                          <div className="space-y-2">
                            <div className="flex flex-wrap gap-2">
                              {selectedDataset.columns
                                .filter(col => col !== mlTarget)
                                .map(col => {
                                  const selected = mlFeatures.split(',').map(s => s.trim()).filter(Boolean).includes(col);
                                  return (
                                    <button
                                      key={col}
                                      type="button"
                                      onClick={() => {
                                        const current = mlFeatures.split(',').map(s => s.trim()).filter(Boolean);
                                        if (selected) {
                                          setMlFeatures(current.filter(c => c !== col).join(', '));
                                        } else {
                                          setMlFeatures([...current, col].join(', '));
                                        }
                                      }}
                                      className={`px-3 py-1 rounded-lg border text-xs font-mono transition-all ${
                                        selected
                                          ? 'border-black bg-black text-white'
                                          : 'border-black/20 text-black hover:border-black bg-white'
                                      }`}
                                    >
                                      {col}
                                    </button>
                                  );
                                })}
                            </div>
                            {mlFeatures && (
                              <p className="text-xs text-black/50">Selected: {mlFeatures}</p>
                            )}
                          </div>
                        ) : (
                          <textarea
                            rows={3}
                            value={mlFeatures}
                            onChange={(e) => setMlFeatures(e.target.value)}
                            placeholder="e.g., age, income, location, transaction_history"
                            className="w-full border border-black/20 rounded-lg px-4 py-2 text-black placeholder-black/50 bg-white focus:border-black focus:outline-none"
                          />
                        )}
                      </div>
                    </div>
                  )}

                  {selectedQueryType === 'cohort' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2 text-black/80">Cohort Definition</label>
                        <select
                          value={cohortDef}
                          onChange={(e) => setCohortDef(e.target.value)}
                          className="w-full border border-black/20 rounded-lg px-4 py-2 text-black bg-white focus:border-black focus:outline-none"
                        >
                          <option value="signup">Sign-up Date</option>
                          <option value="first-purchase">First Purchase Date</option>
                          <option value="custom">Custom Event</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2 text-black/80">Time Period</label>
                        <select
                          value={cohortPeriod}
                          onChange={(e) => setCohortPeriod(e.target.value)}
                          className="w-full border border-black/20 rounded-lg px-4 py-2 text-black bg-white focus:border-black focus:outline-none"
                        >
                          <option value="weekly">Weekly</option>
                          <option value="monthly">Monthly</option>
                          <option value="quarterly">Quarterly</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2 text-black/80">Metric</label>
                        <select
                          value={cohortMetric}
                          onChange={(e) => setCohortMetric(e.target.value)}
                          className="w-full border border-black/20 rounded-lg px-4 py-2 text-black bg-white focus:border-black focus:outline-none"
                        >
                          <option value="retention">Retention Rate</option>
                          <option value="revenue">Revenue per Cohort</option>
                          <option value="activity">Activity Rate</option>
                        </select>
                      </div>
                    </div>
                  )}

                  {selectedQueryType === 'correlation' && (
                    <div className="space-y-3">
                      <p className="text-black/70 text-sm">Select columns to compute pairwise correlations.</p>
                      {selectedDataset?.columns && selectedDataset.columns.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {selectedDataset.columns.map(col => {
                            const selected = corrVariables
                              ? corrVariables.split(',').map(s => s.trim()).includes(col)
                              : true; // default: all selected
                            return (
                              <button
                                key={col}
                                type="button"
                                onClick={() => {
                                  const allCols = selectedDataset.columns || [];
                                  // If corrVariables is empty, start from all columns
                                  const current = corrVariables
                                    ? corrVariables.split(',').map(s => s.trim()).filter(Boolean)
                                    : [...allCols];
                                  if (selected) {
                                    setCorrVariables(current.filter(c => c !== col).join(', '));
                                  } else {
                                    setCorrVariables([...current, col].join(', '));
                                  }
                                }}
                                className={`px-3 py-1 rounded-lg border text-xs font-mono transition-all ${
                                  selected
                                    ? 'border-black bg-black text-white'
                                    : 'border-black/20 text-black hover:border-black bg-white'
                                }`}
                              >
                                {col}
                              </button>
                            );
                          })}
                        </div>
                      ) : (
                        <p className="text-black/50 text-sm">Runs on all numeric columns automatically.</p>
                      )}
                    </div>
                  )}

                  {selectedQueryType === 'analytics' && (
                    <div className="text-black/70 text-sm">
                      Runs automatically on all numeric columns — returns mean, median, std dev, distribution, and time series.
                      {selectedDataset?.columns && selectedDataset.columns.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {selectedDataset.columns.map(col => (
                            <span key={col} className="px-2 py-0.5 bg-black/5 border border-black/10 rounded text-xs font-mono">{col}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Cost Estimate */}
              {selectedDataset && selectedQueryType && (
                <div className="border border-black/10 rounded-lg p-4 bg-gray-50">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-semibold text-black">Estimated Cost</h4>
                      <p className="text-sm text-black/60">Based on query complexity and dataset pricing</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-black">{estimatedCost} tFIL</div>
                      {selectedDataset.onChainId ? (
                        <p className="text-xs text-green-700">Paid via smart contract escrow</p>
                      ) : (
                        <p className="text-xs text-amber-700">Off-chain (no payment required)</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Payment progress */}
              {executing && paymentStep && (
                <div className="border border-[#EBF73F] rounded-lg p-4 bg-[#EBF73F]/10">
                  <div className="flex items-center gap-3">
                    <div className="animate-spin h-5 w-5 border-2 border-black/20 border-t-black rounded-full" />
                    <span className="text-black font-medium">{paymentStep}</span>
                  </div>
                </div>
              )}

              {/* Error */}
              {error && (
                <div className="border border-red-300 rounded-lg p-4 bg-red-50">
                  <p className="text-red-700">{error}</p>
                </div>
              )}

              {/* Query Result */}
              {queryResult && (
                <div className="border border-green-200 rounded-lg p-6 bg-green-50">
                  <h3 className="font-semibold text-green-800 mb-3">Query Result</h3>
                  <div className="text-sm text-black/80 space-y-2">
                    <div><strong>Status:</strong> <span className="text-green-700">{queryResult.status}</span></div>
                    <div><strong>Price:</strong> {queryResult.price} tFIL</div>
                    {queryResult.resultCid && (
                      <div><strong>Result CID:</strong> <span className="font-mono text-xs">{queryResult.resultCid}</span></div>
                    )}
                    {queryResult.result && (
                      <div className="mt-3">
                        <strong>Data:</strong>
                        <pre className="mt-2 p-3 bg-white border border-black/10 rounded-lg overflow-auto max-h-96 text-xs text-black">
                          {JSON.stringify(queryResult.result, null, 2)}
                        </pre>
                      </div>
                    )}
                    {queryResult.attestation && Object.keys(queryResult.attestation).length > 0 && (
                      <div className="mt-3">
                        <strong>Attestation:</strong>
                        <pre className="mt-2 p-3 bg-white border border-black/10 rounded-lg overflow-auto text-xs text-black">
                          {JSON.stringify(queryResult.attestation, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Execute Button */}
              <div className="flex justify-between items-center">
                <button
                  onClick={() => {
                    setSelectedDataset(null);
                    setSelectedQueryType('');
                    setQueryResult(null);
                    setError('');
                  }}
                  className="text-black/60 hover:text-black transition-colors"
                >
                  Reset
                </button>
                <div className="space-x-4">
                  <button
                    onClick={executeQuery}
                    disabled={!selectedDataset || !selectedQueryType || executing}
                    className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
                      !selectedDataset || !selectedQueryType || executing
                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        : 'bg-black hover:bg-gray-800 text-white'
                    }`}
                  >
                    {executing
                      ? 'Processing...'
                      : !selectedQueryType
                        ? 'Select a query type above'
                        : selectedDataset?.onChainId
                          ? `Pay ${estimatedCost} tFIL & Execute`
                          : 'Execute Query'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-[#C4FEC2]">
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-black">How It Works for Buyers</h2>
            <p className="text-xl text-black/80">Get insights without compromising data privacy</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-[#EBF73F] rounded-full flex items-center justify-center mx-auto mb-4 text-black font-bold">
                <span className="text-2xl">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-4 text-black">Select Dataset</h3>
              <p className="text-black/80 leading-relaxed">
                Browse real datasets uploaded by sellers. View metadata, record counts, and pricing before you commit.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-[#EBF73F] rounded-full flex items-center justify-center mx-auto mb-4 text-black font-bold">
                <span className="text-2xl">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-4 text-black">Pay with tFIL</h3>
              <p className="text-black/80 leading-relaxed">
                Your tFIL is escrowed in the QueryMarket smart contract. Funds are released to the dataset owner only after successful computation.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-[#EBF73F] rounded-full flex items-center justify-center mx-auto mb-4 text-black font-bold">
                <span className="text-2xl">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-4 text-black">Get Verified Results</h3>
              <p className="text-black/80 leading-relaxed">
                Receive results with cryptographic attestation. Results are stored on IPFS via Pinata for permanent verifiability.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 border-t border-black/10 bg-[#C4FEC2] relative overflow-hidden">
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6 text-black">Transparent Pricing</h2>
          <p className="text-xl text-black/80 mb-8">
            Pay only for successful query execution. tFIL is escrowed and refunded if computation fails.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border border-black/20 rounded-xl p-6 bg-white shadow-sm">
              <h3 className="text-lg font-semibold mb-2 text-black">Simple Queries</h3>
              <div className="text-3xl font-bold text-black mb-4">1x base</div>
              <ul className="text-sm text-black/70 space-y-2">
                <li>Statistical aggregations</li>
                <li>SUM, AVG, COUNT, MIN, MAX</li>
              </ul>
            </div>

            <div className="border border-black rounded-xl p-6 bg-white shadow-sm">
              <h3 className="text-lg font-semibold mb-2 text-black">Analytics</h3>
              <div className="text-3xl font-bold text-black mb-4">1.6-2.4x</div>
              <ul className="text-sm text-black/70 space-y-2">
                <li>Cohort & correlation analysis</li>
                <li>Distribution analytics</li>
              </ul>
            </div>

            <div className="border border-black/20 rounded-xl p-6 bg-white shadow-sm">
              <h3 className="text-lg font-semibold mb-2 text-black">ML Training</h3>
              <div className="text-3xl font-bold text-black mb-4">3x base</div>
              <ul className="text-sm text-black/70 space-y-2">
                <li>Model training</li>
                <li>Feature engineering</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      </div>
    </div>
  );
}
