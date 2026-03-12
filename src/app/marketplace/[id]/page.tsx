'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface DatasetDetail {
  id: string;
  title: string;
  description: string;
  category: string;
  price: string;
  size: number;
  cid: string;
  verified: boolean;
  totalQueries: number;
  revenue: string;
  createdAt: number;
  allowedQueries: string[];
  records: number;
  format: string;
  encryption: string;
  pdpEnabled: boolean;
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

export default function DatasetDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [dataset, setDataset] = useState<DatasetDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedQuery, setSelectedQuery] = useState('');

  useEffect(() => {
    async function fetchDataset() {
      try {
        const res = await fetch(`/api/datasets?id=${params.id}`);
        const json = await res.json();
        if (json.success) {
          setDataset(json.data);
        } else {
          setError(json.error || 'Dataset not found');
        }
      } catch {
        setError('Failed to load dataset');
      } finally {
        setLoading(false);
      }
    }
    if (params.id) fetchDataset();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-[#C4FEC2] relative text-black">
        <div className="relative z-10">
          <Navbar />
          <div className="pt-24 pb-16 px-4 text-center">
            <div className="inline-block w-8 h-8 border-4 border-black/20 border-t-black rounded-full animate-spin"></div>
            <p className="mt-4 text-black/70">Loading dataset...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !dataset) {
    return (
      <div className="min-h-screen w-full bg-[#C4FEC2] relative text-black">
        <div className="relative z-10">
          <Navbar />
          <div className="pt-24 pb-16 px-4 text-center">
            <h2 className="text-2xl font-bold mb-4 text-black">Dataset Not Found</h2>
            <p className="text-black/70 mb-6">{error || 'This dataset does not exist.'}</p>
            <button
              onClick={() => router.push('/marketplace')}
              className="bg-black hover:bg-gray-800 text-white px-6 py-3 rounded-lg font-semibold"
            >
              Back to Marketplace
            </button>
          </div>
          <Footer />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#C4FEC2] relative text-black">
      <div className="relative z-10">
        <Navbar />

        {/* Header */}
        <section className="pt-24 pb-8 px-4 sm:px-6 lg:px-8 bg-[#C4FEC2]">
          <div className="max-w-5xl mx-auto">
            <button
              onClick={() => router.push('/marketplace')}
              className="text-black/70 hover:text-black mb-6 inline-flex items-center gap-2 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Marketplace
            </button>

            <div className="flex items-start justify-between flex-wrap gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl sm:text-4xl font-bold text-black">{dataset.title}</h1>
                  {dataset.verified && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-black text-white">
                      <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Verified
                    </span>
                  )}
                </div>
                <p className="text-black/70 text-lg">{dataset.description}</p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-black">{dataset.price} tFIL</div>
                <p className="text-black/60 text-sm">per query</p>
              </div>
            </div>
          </div>
        </section>

        {/* Details Grid */}
        <section className="py-8 px-4 sm:px-6 lg:px-8 bg-[#C4FEC2]">
          <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Info */}
            <div className="lg:col-span-2 space-y-6">
              {/* Stats */}
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold mb-4 text-black">Dataset Information</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <div>
                    <span className="text-black/60 text-sm block">Category</span>
                    <span className="text-black font-medium">{dataset.category}</span>
                  </div>
                  <div>
                    <span className="text-black/60 text-sm block">Size</span>
                    <span className="text-black font-medium">{formatBytes(dataset.size)}</span>
                  </div>
                  <div>
                    <span className="text-black/60 text-sm block">Records</span>
                    <span className="text-black font-medium">{dataset.records?.toLocaleString() || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-black/60 text-sm block">Format</span>
                    <span className="text-black font-medium">{dataset.format || 'CSV'}</span>
                  </div>
                  <div>
                    <span className="text-black/60 text-sm block">Total Queries</span>
                    <span className="text-black font-medium">{dataset.totalQueries}</span>
                  </div>
                  <div>
                    <span className="text-black/60 text-sm block">Revenue</span>
                    <span className="text-black font-medium">{dataset.revenue} tFIL</span>
                  </div>
                </div>
              </div>

              {/* Allowed Queries */}
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold mb-4 text-black">Available Query Types</h3>
                <div className="flex flex-wrap gap-2">
                  {dataset.allowedQueries.map((q, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium border border-black/20 text-black bg-[#C4FEC2]/50"
                    >
                      {q.replace(/_/g, ' ')}
                    </span>
                  ))}
                </div>
              </div>

              {/* Storage Info */}
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold mb-4 text-black">Storage & Security</h3>
                <div className="space-y-3">
                  {dataset.cid && (
                    <div className="flex items-center justify-between">
                      <span className="text-black/60">IPFS CID</span>
                      <span className="text-black font-mono text-sm">{dataset.cid.slice(0, 20)}...</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-black/60">Encryption</span>
                    <span className="text-black font-medium">{dataset.encryption || 'AES-256'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-black/60">PDP Verification</span>
                    <span className={`font-medium ${dataset.pdpEnabled ? 'text-green-700' : 'text-black/50'}`}>
                      {dataset.pdpEnabled ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar - Query Panel */}
            <div className="space-y-6">
              <div className="bg-white rounded-xl p-6 shadow-sm sticky top-28">
                <h3 className="text-lg font-semibold mb-4 text-black">Run a Query</h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-black">Query Type</label>
                    <select
                      value={selectedQuery}
                      onChange={(e) => setSelectedQuery(e.target.value)}
                      className="w-full border border-black/20 rounded-lg px-4 py-3 text-black bg-white focus:border-black focus:outline-none"
                    >
                      <option value="">Select query type...</option>
                      {dataset.allowedQueries.map((q, i) => (
                        <option key={i} value={q}>{q.replace(/_/g, ' ')}</option>
                      ))}
                    </select>
                  </div>

                  {selectedQuery && (
                    <div className="border border-black/10 rounded-lg p-4 bg-[#C4FEC2]/30">
                      <div className="flex justify-between items-center">
                        <span className="text-black/70 text-sm">Estimated Cost</span>
                        <span className="text-black font-bold text-lg">{dataset.price} tFIL</span>
                      </div>
                    </div>
                  )}

                  <button
                    disabled={!selectedQuery}
                    className={`w-full py-3 rounded-lg font-semibold transition-all duration-300 ${
                      selectedQuery
                        ? 'bg-black hover:bg-gray-800 text-white hover:transform hover:-translate-y-1 hover:shadow-lg'
                        : 'bg-black/20 text-black/40 cursor-not-allowed'
                    }`}
                  >
                    Execute Query
                  </button>
                </div>

                <div className="mt-6 pt-4 border-t border-black/10">
                  <div className="text-sm text-black/60 space-y-2">
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Privacy-preserving execution
                    </div>
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Cryptographic proof of results
                    </div>
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Stored on Filecoin
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </div>
  );
}
