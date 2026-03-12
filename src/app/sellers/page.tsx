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
  const [success, setSuccess] = useState<{ dataset: ApiDataset; upload: UploadResult } | null>(null);
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
      const formData = new FormData();
      formData.append('file', file);
      formData.append('title', title.trim());
      formData.append('description', description.trim());
      formData.append('category', category);
      formData.append('price', price);
      formData.append('owner', address);
      formData.append('allowedQueries', JSON.stringify(allowedQueries));

      const res = await fetch('/api/datasets', {
        method: 'POST',
        body: formData,
      });
      const json = await res.json();
      if (json.success) {
        setSuccess({ dataset: json.data, upload: json.upload });
        // Reset form
        setTitle('');
        setDescription('');
        setCategory('');
        setPrice('0.05');
        setAllowedQueries(['aggregation']);
        setFile(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
      } else {
        setError(json.error || 'Failed to publish dataset');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen w-full bg-[#0a0a0a] relative text-white">
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

      {/* Publish Dataset Form */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#0a0a0a]">
        <div className="max-w-4xl mx-auto">
          <div className="bg-[#141414] rounded-2xl p-8 sm:p-10 border border-white/10">
            <h2 className="text-2xl font-bold mb-2 text-white">Publish a Dataset</h2>
            <p className="text-white/50 mb-8">Upload a CSV or JSON file, set pricing, and publish to the DataCloud marketplace</p>

            {/* Success Banner */}
            {success && (
              <div className="mb-8 bg-[#C4FEC2]/10 border border-[#C4FEC2]/30 rounded-xl p-5">
                <h3 className="font-semibold text-[#C4FEC2] mb-3 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Dataset Published Successfully!
                </h3>
                <div className="grid grid-cols-2 gap-2 text-sm text-[#C4FEC2]/80">
                  <div><span className="font-medium text-[#C4FEC2]">ID:</span> {success.dataset.id}</div>
                  <div><span className="font-medium text-[#C4FEC2]">Title:</span> {success.dataset.title}</div>
                  <div><span className="font-medium text-[#C4FEC2]">IPFS CID:</span> <span className="font-mono text-xs">{success.upload.cid}</span></div>
                  <div><span className="font-medium text-[#C4FEC2]">Price:</span> {success.dataset.price} tFIL/query</div>
                  <div><span className="font-medium text-[#C4FEC2]">Rows Parsed:</span> {success.upload.rowsParsed.toLocaleString()}</div>
                  <div><span className="font-medium text-[#C4FEC2]">Columns:</span> {success.upload.columns.length}</div>
                </div>
                {success.upload.onChain && (
                  <div className="mt-2 text-xs text-[#C4FEC2]/60">
                    Registered on-chain — Tx: <span className="font-mono">{success.upload.txHash?.slice(0, 20)}...</span>
                  </div>
                )}
                <div className="mt-2 text-xs text-[#C4FEC2]/60">
                  Stored on IPFS via Lighthouse — Your data is on Filecoin decentralized storage.
                </div>
              </div>
            )}

            <div className="space-y-8">
              {/* File Upload - Large Drop Zone */}
              <div>
                <label className="block text-sm font-medium mb-3 text-white/80">Dataset File (CSV or JSON) *</label>
                <div
                  onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                  onDragLeave={() => setDragging(false)}
                  onDrop={handleFileDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-2xl py-16 px-8 text-center cursor-pointer transition-all duration-200 ${
                    dragging
                      ? 'border-[#C4FEC2] bg-[#C4FEC2]/5 scale-[1.01]'
                      : file
                        ? 'border-[#C4FEC2]/50 bg-[#C4FEC2]/5'
                        : 'border-white/20 hover:border-white/40 bg-white/[0.02] hover:bg-white/[0.04]'
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
                    <div className="text-[#C4FEC2]">
                      <div className="w-16 h-16 rounded-full bg-[#C4FEC2]/10 flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <p className="font-semibold text-lg">{file.name}</p>
                      <p className="text-sm text-[#C4FEC2]/70 mt-1">{formatBytes(file.size)}</p>
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); setFile(null); if (fileInputRef.current) fileInputRef.current.value = ''; }}
                        className="mt-4 text-sm underline text-white/40 hover:text-white/70 transition-colors"
                      >
                        Remove file
                      </button>
                    </div>
                  ) : (
                    <div className="text-white/40">
                      <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                      </div>
                      <p className="font-semibold text-lg text-white/60">Drop your CSV or JSON file here</p>
                      <p className="text-sm mt-2 text-white/30">or click anywhere to browse</p>
                      <div className="flex justify-center gap-4 mt-4 text-xs text-white/20">
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
                <label className="block text-sm font-medium mb-2 text-white/80">Dataset Name *</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Financial Transactions Dataset 2024"
                  className="w-full border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 bg-white/5 focus:border-[#C4FEC2]/50 focus:outline-none focus:ring-1 focus:ring-[#C4FEC2]/20 transition-colors"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium mb-2 text-white/80">Description *</label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your dataset, its contents, and potential use cases..."
                  className="w-full border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 bg-white/5 focus:border-[#C4FEC2]/50 focus:outline-none focus:ring-1 focus:ring-[#C4FEC2]/20 transition-colors"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium mb-2 text-white/80">Category *</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full border border-white/10 rounded-xl px-4 py-3 text-white bg-white/5 focus:border-[#C4FEC2]/50 focus:outline-none focus:ring-1 focus:ring-[#C4FEC2]/20 transition-colors"
                >
                  <option value="" className="bg-[#141414]">Select a category...</option>
                  <option value="Finance" className="bg-[#141414]">Finance</option>
                  <option value="Healthcare" className="bg-[#141414]">Healthcare</option>
                  <option value="E-commerce" className="bg-[#141414]">E-commerce</option>
                  <option value="Environment" className="bg-[#141414]">Environment</option>
                  <option value="Social" className="bg-[#141414]">Social Media</option>
                  <option value="Logistics" className="bg-[#141414]">Logistics</option>
                  <option value="Technology" className="bg-[#141414]">Technology</option>
                </select>
              </div>

              {/* Allowed Query Types */}
              <div>
                <label className="block text-sm font-medium mb-3 text-white/80">Allowed Query Types *</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {QUERY_TYPES.map((qt) => (
                    <label
                      key={qt.value}
                      className={`flex items-start space-x-3 p-4 border rounded-xl cursor-pointer transition-all duration-200 ${
                        allowedQueries.includes(qt.value)
                          ? 'border-[#C4FEC2]/40 bg-[#C4FEC2]/5'
                          : 'border-white/10 hover:border-white/20 bg-white/[0.02]'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={allowedQueries.includes(qt.value)}
                        onChange={() => toggleQueryType(qt.value)}
                        className="mt-1 rounded border-white/30 accent-[#C4FEC2]"
                      />
                      <div>
                        <div className="font-medium text-white">{qt.label}</div>
                        <div className="text-sm text-white/40">{qt.desc}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price */}
              <div>
                <label className="block text-sm font-medium mb-2 text-white/80">Base Price per Query *</label>
                <div className="flex">
                  <input
                    type="number"
                    step="0.01"
                    min="0.001"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="flex-1 border border-white/10 rounded-l-xl px-4 py-3 text-white bg-white/5 focus:border-[#C4FEC2]/50 focus:outline-none focus:ring-1 focus:ring-[#C4FEC2]/20 transition-colors"
                  />
                  <span className="bg-white/5 border border-white/10 border-l-0 rounded-r-xl px-4 py-3 text-white/50 font-medium">
                    tFIL
                  </span>
                </div>
                <p className="text-xs text-white/30 mt-1.5">Complex query types (ML, Cohort) will have multiplied pricing</p>
                <p className="text-xs text-[#C4FEC2]/70 mt-1">
                  ~{estimateEarnings(price)} tFIL/month based on average query volume
                </p>
              </div>

              {/* Error */}
              {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl p-4">{error}</div>
              )}

              {/* Publish Button */}
              <div className="flex justify-end pt-6 border-t border-white/10">
                <button
                  onClick={publishDataset}
                  disabled={submitting}
                  className={`px-8 py-3 rounded-xl font-semibold text-lg transition-all duration-300 ${
                    submitting
                      ? 'bg-white/10 text-white/30 cursor-not-allowed'
                      : 'bg-[#C4FEC2] hover:bg-[#b0f0ae] text-black hover:transform hover:-translate-y-1 hover:shadow-lg hover:shadow-[#C4FEC2]/20'
                  }`}
                >
                  {submitting ? 'Uploading to IPFS & Publishing...' : 'Publish Dataset'}
                </button>
              </div>
            </div>
          </div>

          {/* My Published Datasets */}
          <div className="mt-8 bg-[#141414] rounded-2xl p-8 sm:p-10 border border-white/10">
            <h3 className="text-xl font-bold text-white mb-4">Published Datasets</h3>
            {loadingDatasets ? (
              <p className="text-white/40">Loading...</p>
            ) : myDatasets.length === 0 ? (
              <p className="text-white/40">No datasets published yet. Upload your first CSV or JSON file above!</p>
            ) : (
              <div className="space-y-3">
                {myDatasets.map((ds) => (
                  <div key={ds.id} className="flex items-center justify-between p-4 border border-white/10 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] transition-colors">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-white">{ds.title}</span>
                        {ds.verified && (
                          <span className="text-xs px-1.5 py-0.5 rounded bg-[#C4FEC2]/10 text-[#C4FEC2] border border-[#C4FEC2]/20">Verified</span>
                        )}
                      </div>
                      <div className="text-sm text-white/40 mt-1">
                        {ds.category} &middot; {formatBytes(ds.size)} &middot; {ds.allowedQueries.length} query types &middot; {ds.totalQueries} queries executed
                      </div>
                      {ds.cid && (
                        <div className="text-xs text-white/20 mt-1 font-mono">CID: {ds.cid}</div>
                      )}
                    </div>
                    <div className="text-right ml-4">
                      <div className="font-bold text-[#C4FEC2]">{ds.price} tFIL</div>
                      <div className="text-xs text-white/40">per query</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#141414]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-white">How It Works</h2>
            <p className="text-xl text-white/50">Simple steps to start earning from your datasets</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center bg-white/5 border border-white/10 rounded-2xl p-8">
              <div className="w-16 h-16 bg-[#C4FEC2] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-black">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white">Upload & Publish</h3>
              <p className="text-white/50">Upload your CSV or JSON file. It gets stored on IPFS via Lighthouse and registered on Filecoin.</p>
            </div>
            <div className="text-center bg-white/5 border border-white/10 rounded-2xl p-8">
              <div className="w-16 h-16 bg-[#C4FEC2] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-black">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white">Buyers Query</h3>
              <p className="text-white/50">Buyers discover your dataset on the marketplace and run privacy-preserving queries on your data.</p>
            </div>
            <div className="text-center bg-white/5 border border-white/10 rounded-2xl p-8">
              <div className="w-16 h-16 bg-[#C4FEC2] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-black">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white">Earn tFIL</h3>
              <p className="text-white/50">Receive automatic tFIL payments for every query execution. Track revenue in real time.</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      </div>
    </div>
  );
}
