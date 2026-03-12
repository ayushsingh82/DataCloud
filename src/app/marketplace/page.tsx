'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import DatasetCard from '@/components/DatasetCard';

interface ApiDataset {
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
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

function timeAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} day${days !== 1 ? 's' : ''} ago`;
  const weeks = Math.floor(days / 7);
  return `${weeks} week${weeks !== 1 ? 's' : ''} ago`;
}

const categories = ['All', 'Finance', 'Healthcare', 'E-commerce', 'Environment', 'Social Media', 'Logistics'];

export default function MarketplacePage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('recent');
  const [datasets, setDatasets] = useState<ApiDataset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchDatasets() {
      setLoading(true);
      setError('');
      try {
        const params = new URLSearchParams({ limit: '100', offset: '0' });
        if (selectedCategory !== 'All') params.set('category', selectedCategory);
        if (searchTerm) params.set('search', searchTerm);

        const res = await fetch(`/api/datasets?${params.toString()}`);
        const json = await res.json();
        if (json.success) {
          setDatasets(json.data);
        } else {
          setError(json.error || 'Failed to fetch datasets');
        }
      } catch {
        setError('Failed to fetch datasets');
      } finally {
        setLoading(false);
      }
    }
    fetchDatasets();
  }, [selectedCategory, searchTerm]);

  // Map API datasets to DatasetCard format
  const cardDatasets = datasets.map((d) => ({
    id: d.id,
    title: d.title,
    description: d.description,
    category: d.category,
    price: `${d.price} tFIL`,
    size: formatBytes(d.size),
    queries: d.totalQueries,
    verified: d.verified,
    tags: d.allowedQueries.map((q: string) => q.replace('_', '-')),
    lastUpdated: timeAgo(d.createdAt),
  }));

  const sortedDatasets = [...cardDatasets].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return parseFloat(a.price) - parseFloat(b.price);
      case 'price-high':
        return parseFloat(b.price) - parseFloat(a.price);
      case 'queries':
        return b.queries - a.queries;
      case 'size':
        return parseFloat(b.size) - parseFloat(a.size);
      default:
        return 0; // recent (default order from API)
    }
  });

  return (
    <div className="min-h-screen w-full bg-[#0a0a0a] relative text-black">
      <div className="relative z-10">
        <Navbar />

      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 bg-[#C4FEC2]">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-6 text-black">
            Data Marketplace
          </h1>
          <p className="text-xl text-black/70 mb-8 max-w-3xl mx-auto">
            Discover privacy-preserving datasets and run secure queries without accessing raw data
          </p>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 bg-[#C4FEC2]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-6 items-center">
            {/* Search */}
            <div className="flex-1 w-full lg:w-auto">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search datasets, categories, or tags..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full border border-black/20 rounded-lg px-4 py-3 pl-10 text-black placeholder-black/50 focus:border-black focus:outline-none bg-white"
                />
                <svg className="absolute left-3 top-3.5 w-5 h-5 text-black/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {/* Sort */}
            <div className="flex items-center space-x-4">
              <span className="text-black/70 text-sm">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-black/20 rounded-lg px-3 py-2 text-black focus:border-black focus:outline-none bg-white"
              >
                <option value="recent">Most Recent</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="queries">Most Queries</option>
                <option value="size">Largest Size</option>
              </select>
            </div>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-2 mt-6">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors border ${
                  selectedCategory === category
                    ? 'bg-black text-white border-transparent'
                    : 'border-black/20 text-black hover:border-black bg-white'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-white">
              {loading ? 'Loading...' : `${sortedDatasets.length} Dataset${sortedDatasets.length !== 1 ? 's' : ''} Found`}
            </h2>
            {!loading && (
              <div className="text-sm text-white/50">
                Showing {sortedDatasets.length} dataset{sortedDatasets.length !== 1 ? 's' : ''}
              </div>
            )}
          </div>

          {/* Error State */}
          {error && (
            <div className="text-center py-8">
              <p className="text-red-400 font-medium">{error}</p>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="text-center py-16">
              <div className="inline-block w-8 h-8 border-4 border-white/20 border-t-[#C4FEC2] rounded-full animate-spin"></div>
              <p className="mt-4 text-white/50">Loading datasets...</p>
            </div>
          )}

          {/* Dataset Grid */}
          {!loading && !error && sortedDatasets.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedDatasets.map((dataset) => (
                <DatasetCard key={dataset.id} dataset={dataset} />
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && sortedDatasets.length === 0 && (
            <div className="text-center py-16">
              <svg className="w-16 h-16 mx-auto mb-4 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <h3 className="text-xl font-semibold mb-2 text-white">No datasets found</h3>
              <p className="text-white/50 mb-6">
                Try adjusting your search terms or category filters
              </p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('All');
                }}
                className="bg-[#C4FEC2] hover:bg-[#b0f0ae] text-black px-6 py-2 rounded-lg transition-all duration-300 hover:transform hover:-translate-y-1 hover:shadow-lg font-semibold"
              >
                Clear Filters
              </button>
            </div>
          )}

          {/* Playground CTA */}
          {!loading && (
            <div className="text-center mt-12 pt-8 border-t border-white/10">
              <Link
                href="/playground"
                className="inline-flex items-center gap-2 text-[#C4FEC2] hover:text-[#b0f0ae] font-medium transition-colors"
              >
                Don&apos;t see what you need? Try the Playground
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </div>
          )}
        </div>
      </section>

      <Footer />
      </div>
    </div>
  );
}
