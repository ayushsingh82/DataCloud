'use client';

import { useState, useEffect, useRef } from 'react';
import { useAccount } from 'wagmi';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface ApiDataset {
  id: string;
  title: string;
  description: string;
  category: string;
  price: string;
  size: number;
  verified: boolean;
  totalQueries: number;
  totalRevenue: string;
  allowedQueries: string[];
  cid: string;
  createdAt: number;
}

interface UploadResult {
  cid: string;
  lighthouse: boolean;
  onChain: boolean;
  txHash?: string;
  onChainId?: string;
  rowsParsed: number;
  columns: string[];
}

const QUERY_TYPES = [
  { value: 'aggregation', label: 'Statistical Aggregation', desc: 'SUM, AVG, COUNT, etc.' },
  { value: 'ml_training', label: 'ML Model Training', desc: 'Model training and inference' },
  { value: 'analytics', label: 'Analytics', desc: 'Comprehensive data analysis' },
  { value: 'cohort', label: 'Cohort Analysis', desc: 'User behavior over time' },
  { value: 'correlation', label: 'Correlation Analysis', desc: 'Variable relationships' },
];

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

function estimateEarnings(priceStr: string): string {
  const price = parseFloat(priceStr);
  if (isNaN(price) || price <= 0) return '0';
  // Assume average ~120 queries/month for a listed dataset
  const monthly = price * 120;
  return monthly.toFixed(2);
}

export default function SellersPage() {
  const { address, isConnected } = useAccount();
  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('0.05');
  const [allowedQueries, setAllowedQueries] = useState<string[]>(['aggregation']);
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Submission state
  const [submitting, setSubmitting] = useState(false);
  const [submitStep, setSubmitStep] = useState('');
  const [success, setSuccess] = useState<{ dataset: ApiDataset & { txHash?: string; onChainId?: string }; upload: UploadResult } | null>(null);
  const [error, setError] = useState('');

  // Existing datasets
  const [myDatasets, setMyDatasets] = useState<ApiDataset[]>([]);
  const [loadingDatasets, setLoadingDatasets] = useState(true);

  // Drag and drop state
  const [dragging, setDragging] = useState(false);

  // Fetch existing datasets
  useEffect(() => {
    fetch('/api/datasets?limit=100')
      .then((r) => r.json())
      .then((json) => {
        if (json.success) setMyDatasets(json.data);
      })
      .catch(() => {})
      .finally(() => setLoadingDatasets(false));
  }, [success]);

  function toggleQueryType(qt: string) {
    setAllowedQueries((prev) =>
      prev.includes(qt) ? prev.filter((q) => q !== qt) : [...prev, qt]
    );
  }

  function handleFileDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      const name = droppedFile.name.toLowerCase();
      if (name.endsWith('.csv') || name.endsWith('.json')) {
        setFile(droppedFile);
        setError('');
      } else {
        setError('Only CSV and JSON files are supported.');
      }
    }
  }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError('');
    }
  }

  async function publishDataset() {
    if (!isConnected || !address) {
      setError('Please connect your wallet first using the Connect button in the navigation bar.');
      return;
    }
    if (!file) {
      setError('Please upload a dataset file (CSV or JSON).');
      return;
    }
    if (!title.trim() || !description.trim() || !category || !price) {
      setError('Please fill in all required fields.');
      return;
    }
    if (allowedQueries.length === 0) {
      setError('Select at least one query type.');
      return;
    }

    setError('');
    setSubmitting(true);
    setSuccess(null);

    try {
      // Step 1: Register on-chain FIRST — pay gas as base fee
      let onChainTxHash = '';
      let onChainId = '';

      const { isRegistryConfigured, DATASET_REGISTRY_ADDRESS, datasetRegistryAbi } = await import('@/lib/contract-config');

      if (!isRegistryConfigured()) {
        setError('Smart contracts are not configured. Cannot register dataset.');
        return;
      }

      setSubmitStep('Sign transaction to register on Filecoin (gas = base fee)...');

      const { parseEther, keccak256, toHex, decodeEventLog } = await import('viem');
      const { writeContract, waitForTransactionReceipt } = await import('wagmi/actions');
      const { getConfig } = await import('@/lib/get-wagmi-config');
      const config = getConfig();

      const schemaHash = keccak256(toHex(`${file.name}-${file.size}`));
      const priceWei = parseEther(price);
      // Use a placeholder CID — will be updated after IPFS upload
      const placeholderCid = `pending-${Date.now()}`;

      const hash = await writeContract(config, {
        address: DATASET_REGISTRY_ADDRESS,
        abi: datasetRegistryAbi,
        functionName: 'registerDataset',
        args: [placeholderCid, title.trim(), category, priceWei, schemaHash],
      });

      onChainTxHash = hash;

      setSubmitStep('Confirming on-chain registration...');
      const receipt = await waitForTransactionReceipt(config, { hash });

      // Parse DatasetRegistered event
      for (const log of receipt.logs) {
        try {
          const event = decodeEventLog({
            abi: datasetRegistryAbi,
            data: log.data,
            topics: log.topics,
          });
          if (event.eventName === 'DatasetRegistered') {
            onChainId = String((event.args as { datasetId: bigint }).datasetId);
            break;
          }
        } catch {
          // Not our event
        }
      }

      // Step 2: Only after on-chain payment, upload to IPFS + backend
      setSubmitStep('Uploading to IPFS...');
      const formData = new FormData();
      formData.append('file', file);
      formData.append('title', title.trim());
      formData.append('description', description.trim());
      formData.append('category', category);
      formData.append('price', price);
      formData.append('owner', address);
      formData.append('allowedQueries', JSON.stringify(allowedQueries));
      formData.append('txHash', onChainTxHash);
      formData.append('onChainId', onChainId);

      const res = await fetch('/api/datasets', {
        method: 'POST',
        body: formData,
      });
      const json = await res.json();
      if (!json.success) {
        setError(json.error || 'Failed to publish dataset');
        return;
      }

      setSuccess({
        dataset: { ...json.data, txHash: onChainTxHash, onChainId },
        upload: { ...json.upload, onChain: true, txHash: onChainTxHash, onChainId },
      });

      // Reset form
      setTitle('');
      setDescription('');
      setCategory('');
      setPrice('0.05');
      setAllowedQueries(['aggregation']);
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed';
      if (msg.includes('User rejected') || msg.includes('denied')) {
        setError('Transaction rejected. You must sign the on-chain registration to publish.');
      } else {
        setError(msg);
      }
    } finally {
      setSubmitting(false);
      setSubmitStep('');
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
            Monetize Your Data Securely
          </h1>
          <p className="text-xl text-black/70 mb-4 max-w-3xl mx-auto">
            Upload your datasets to Filecoin via IPFS, set privacy-preserving query templates, and earn tFIL without exposing raw data.
          </p>
          <div className="flex justify-center gap-6 mt-8">
            <div className="flex items-center gap-2 text-black/60 text-sm">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              IPFS + Filecoin storage
            </div>
            <div className="flex items-center gap-2 text-black/60 text-sm">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Privacy-preserving queries
            </div>
            <div className="flex items-center gap-2 text-black/60 text-sm">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Automatic tFIL payments
            </div>
          </div>
        </div>
      </section>

      {/* Publish Dataset Form — white card like marketplace */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 border-t border-black/10 relative overflow-hidden">
        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="border border-black/20 rounded-xl p-8 bg-white shadow-sm">
            <h2 className="text-2xl font-bold mb-2 text-black">Publish a Dataset</h2>
            <p className="text-black/70 mb-8">Upload a CSV or JSON file, set pricing, and publish to the DataCloud marketplace</p>

            {/* Success Banner */}
            {success && (
              <div className="mb-8 bg-green-50 border border-green-200 rounded-xl p-5">
                <h3 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Dataset Published Successfully!
                </h3>
                <div className="grid grid-cols-2 gap-2 text-sm text-green-800">
                  <div><span className="font-medium">ID:</span> {success.dataset.id}</div>
                  <div><span className="font-medium">Title:</span> {success.dataset.title}</div>
                  <div><span className="font-medium">IPFS CID:</span> <span className="font-mono text-xs">{success.upload.cid}</span></div>
                  <div><span className="font-medium">Price:</span> {success.dataset.price} tFIL/query</div>
                  <div><span className="font-medium">Rows Parsed:</span> {success.upload.rowsParsed.toLocaleString()}</div>
                  <div><span className="font-medium">Columns:</span> {success.upload.columns.length}</div>
                </div>
                {success.upload.onChain && (
                  <div className="mt-2 text-xs text-black/60">
                    Registered on-chain — Tx: <span className="font-mono">{success.upload.txHash?.slice(0, 20)}...</span>
                  </div>
                )}
                <div className="mt-2 text-xs text-black/60">
                  Stored on IPFS via Pinata — Your data is on decentralized storage.
                </div>
              </div>
            )}

            <div className="space-y-8">
              {/* File Upload - Large Drop Zone */}
              <div>
                <label className="block text-sm font-medium mb-3 text-black">Dataset File (CSV or JSON) *</label>
                <div
                  onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                  onDragLeave={() => setDragging(false)}
                  onDrop={handleFileDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-xl py-12 px-6 text-center cursor-pointer transition-all duration-200 ${
                    dragging
                      ? 'border-black bg-gray-50 scale-[1.01]'
                      : file
                        ? 'border-green-500 bg-green-50/50'
                        : 'border-black/20 hover:border-black/40 bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv,.json"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  {file ? (
                    <div className="text-green-800">
                      <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <p className="font-semibold text-lg text-black">{file.name}</p>
                      <p className="text-sm text-black/60 mt-1">{formatBytes(file.size)}</p>
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); setFile(null); if (fileInputRef.current) fileInputRef.current.value = ''; }}
                        className="mt-4 text-sm underline text-black/60 hover:text-black transition-colors"
                      >
                        Remove file
                      </button>
                    </div>
                  ) : (
                    <div className="text-black/60">
                      <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                      </div>
                      <p className="font-semibold text-lg text-black">Drop your CSV or JSON file here</p>
                      <p className="text-sm mt-2 text-black/50">or click anywhere to browse</p>
                      <div className="flex justify-center gap-4 mt-4 text-xs text-black/40">
                        <span>Supports .csv and .json</span>
                        <span>|</span>
                        <span>Max 100MB</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Dataset Name */}
              <div>
                <label className="block text-sm font-medium mb-2 text-black">Dataset Name *</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Financial Transactions Dataset 2024"
                  className="w-full border border-black/20 rounded-lg px-4 py-3 text-black placeholder-black/50 bg-white focus:border-black focus:outline-none"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium mb-2 text-black">Description *</label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your dataset, its contents, and potential use cases..."
                  className="w-full border border-black/20 rounded-lg px-4 py-3 text-black placeholder-black/50 bg-white focus:border-black focus:outline-none"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium mb-2 text-black">Category *</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full border border-black/20 rounded-lg px-4 py-3 text-black bg-white focus:border-black focus:outline-none"
                >
                  <option value="">Select a category...</option>
                  <option value="Finance">Finance</option>
                  <option value="Healthcare">Healthcare</option>
                  <option value="E-commerce">E-commerce</option>
                  <option value="Environment">Environment</option>
                  <option value="Social">Social Media</option>
                  <option value="Logistics">Logistics</option>
                  <option value="Technology">Technology</option>
                </select>
              </div>

              {/* Allowed Query Types */}
              <div>
                <label className="block text-sm font-medium mb-3 text-black">Allowed Query Types *</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {QUERY_TYPES.map((qt) => (
                    <label
                      key={qt.value}
                      className={`flex items-start space-x-3 p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                        allowedQueries.includes(qt.value)
                          ? 'border-black bg-black/5'
                          : 'border-black/20 hover:border-black/40 bg-white'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={allowedQueries.includes(qt.value)}
                        onChange={() => toggleQueryType(qt.value)}
                        className="mt-1 rounded border-black/30 accent-black"
                      />
                      <div>
                        <div className="font-medium text-black">{qt.label}</div>
                        <div className="text-sm text-black/60">{qt.desc}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price */}
              <div>
                <label className="block text-sm font-medium mb-2 text-black">Base Price per Query *</label>
                <div className="flex">
                  <input
                    type="number"
                    step="0.01"
                    min="0.001"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="flex-1 border border-black/20 rounded-l-lg px-4 py-3 text-black bg-white focus:border-black focus:outline-none"
                  />
                  <span className="bg-gray-100 border border-black/20 border-l-0 rounded-r-lg px-4 py-3 text-black/70 font-medium">
                    tFIL
                  </span>
                </div>
                <p className="text-xs text-black/60 mt-1.5">Complex query types (ML, Cohort) will have multiplied pricing</p>
                <p className="text-xs text-black/70 mt-1">
                  ~{estimateEarnings(price)} tFIL/month based on average query volume
                </p>
              </div>

              {/* Error */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4">{error}</div>
              )}

              {/* Publish Button */}
              <div className="flex justify-end pt-6 border-t border-black/10">
                <button
                  onClick={publishDataset}
                  disabled={submitting}
                  className={`px-8 py-3 rounded-lg font-semibold transition-all ${
                    submitting
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      : 'bg-black hover:bg-gray-800 text-white hover:-translate-y-0.5 hover:shadow-lg'
                  }`}
                >
                  {submitting ? (submitStep || 'Publishing...') : 'Publish Dataset (costs gas in tFIL)'}
                </button>
              </div>
            </div>
          </div>

          {/* My Published Datasets — white card */}
          <div className="mt-8 border border-black/20 rounded-xl p-8 bg-white shadow-sm">
            <h3 className="text-xl font-bold text-black mb-4">Published Datasets</h3>
            {loadingDatasets ? (
              <p className="text-black/60">Loading...</p>
            ) : myDatasets.length === 0 ? (
              <p className="text-black/60">No datasets published yet. Upload your first CSV or JSON file above!</p>
            ) : (
              <div className="space-y-3">
                {myDatasets.map((ds) => (
                  <div key={ds.id} className="flex items-center justify-between p-4 border border-black/10 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-black">{ds.title}</span>
                        {ds.verified && (
                          <span className="text-xs px-1.5 py-0.5 rounded bg-green-100 text-green-800 border border-green-200">Verified</span>
                        )}
                      </div>
                      <div className="text-sm text-black/60 mt-1">
                        {ds.category} &middot; {formatBytes(ds.size)} &middot; {ds.allowedQueries.length} query types &middot; {ds.totalQueries} queries executed
                      </div>
                      {ds.cid && (
                        <div className="text-xs text-black/50 mt-1 font-mono">CID: {ds.cid}</div>
                      )}
                    </div>
                    <div className="text-right ml-4">
                      <div className="font-bold text-black">{ds.price} tFIL</div>
                      <div className="text-xs text-black/60">per query</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* How It Works — light section like buyers */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#C4FEC2]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-black">How It Works</h2>
            <p className="text-xl text-black/80">Simple steps to start earning from your datasets</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-[#EBF73F] rounded-full flex items-center justify-center mx-auto mb-4 text-black font-bold">
                <span className="text-2xl">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-black">Upload & Publish</h3>
              <p className="text-black/80 leading-relaxed">Upload your CSV or JSON file. It gets stored on IPFS via Pinata and registered on Filecoin.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-[#EBF73F] rounded-full flex items-center justify-center mx-auto mb-4 text-black font-bold">
                <span className="text-2xl">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-black">Buyers Query</h3>
              <p className="text-black/80 leading-relaxed">Buyers discover your dataset on the marketplace and run privacy-preserving queries on your data.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-[#EBF73F] rounded-full flex items-center justify-center mx-auto mb-4 text-black font-bold">
                <span className="text-2xl">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-black">Earn tFIL</h3>
              <p className="text-black/80 leading-relaxed">Receive automatic tFIL payments for every query execution. Track revenue in real time.</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      </div>
    </div>
  );
}
