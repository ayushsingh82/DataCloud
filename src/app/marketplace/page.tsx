'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import DatasetCard from '@/components/DatasetCard';

// Mock data for datasets
const mockDatasets = [
  {
    id: '1',
    title: 'Financial Transactions Dataset',
    description: 'Anonymized financial transaction data with demographic insights. Perfect for fraud detection and spending pattern analysis.',
    category: 'Finance',
    price: '0.05 FIL',
    size: '2.3 GB',
    queries: 1247,
    verified: true,
    tags: ['transactions', 'demographics', 'fraud-detection', 'anonymized'],
    lastUpdated: '2 days ago'
  },
  {
    id: '2',
    title: 'Healthcare Research Data',
    description: 'De-identified patient data for medical research and drug discovery. Includes lab results, treatment outcomes, and demographic data.',
    category: 'Healthcare',
    price: '0.12 FIL',
    size: '5.7 GB',
    queries: 892,
    verified: true,
    tags: ['medical', 'research', 'de-identified', 'lab-results'],
    lastUpdated: '1 week ago'
  },
  {
    id: '3',
    title: 'E-commerce Behavior Analytics',
    description: 'Customer behavior patterns, purchase history, and recommendation engine training data from major e-commerce platforms.',
    category: 'E-commerce',
    price: '0.08 FIL',
    size: '1.8 GB',
    queries: 2156,
    verified: false,
    tags: ['behavior', 'e-commerce', 'recommendations', 'purchasing'],
    lastUpdated: '3 days ago'
  },
  {
    id: '4',
    title: 'Climate & Weather Patterns',
    description: 'Historical weather data, climate patterns, and environmental sensor readings from global monitoring stations.',
    category: 'Environment',
    price: '0.03 FIL',
    size: '4.2 GB',
    queries: 567,
    verified: true,
    tags: ['climate', 'weather', 'environmental', 'sensors'],
    lastUpdated: '5 days ago'
  },
  {
    id: '5',
    title: 'Social Media Sentiment Analysis',
    description: 'Anonymized social media posts and engagement data for sentiment analysis and trend prediction models.',
    category: 'Social Media',
    price: '0.06 FIL',
    size: '3.1 GB',
    queries: 1834,
    verified: true,
    tags: ['sentiment', 'social-media', 'trends', 'engagement'],
    lastUpdated: '1 day ago'
  },
  {
    id: '6',
    title: 'Supply Chain Logistics',
    description: 'Global supply chain data including shipping routes, delivery times, and inventory management metrics.',
    category: 'Logistics',
    price: '0.10 FIL',
    size: '2.9 GB',
    queries: 743,
    verified: true,
    tags: ['supply-chain', 'logistics', 'shipping', 'inventory'],
    lastUpdated: '4 days ago'
  }
];

const categories = ['All', 'Finance', 'Healthcare', 'E-commerce', 'Environment', 'Social Media', 'Logistics'];

export default function MarketplacePage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('recent');

  const filteredDatasets = mockDatasets.filter(dataset => {
    const matchesCategory = selectedCategory === 'All' || dataset.category === selectedCategory;
    const matchesSearch = dataset.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         dataset.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         dataset.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const sortedDatasets = [...filteredDatasets].sort((a, b) => {
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
        return 0; // recent (default order)
    }
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-6">
            Data <span className="text-blue-500">Marketplace</span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Discover privacy-preserving datasets and run secure queries without accessing raw data
          </p>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 bg-gray-900/50">
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
                  className="w-full bg-black/50 border border-gray-700 rounded-lg px-4 py-3 pl-10 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                />
                <svg className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {/* Sort */}
            <div className="flex items-center space-x-4">
              <span className="text-gray-400 text-sm">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-black/50 border border-gray-700 rounded-lg px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
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
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">
              {filteredDatasets.length} Dataset{filteredDatasets.length !== 1 ? 's' : ''} Found
            </h2>
            <div className="text-sm text-gray-400">
              Showing {sortedDatasets.length} of {mockDatasets.length} datasets
            </div>
          </div>

          {/* Dataset Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedDatasets.map((dataset) => (
              <DatasetCard key={dataset.id} dataset={dataset} />
            ))}
          </div>

          {/* Empty State */}
          {sortedDatasets.length === 0 && (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold mb-2">No datasets found</h3>
              <p className="text-gray-400 mb-6">
                Try adjusting your search terms or category filters
              </p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('All');
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
