'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import QueryCard from '@/components/QueryCard';

// Mock data for available queries
const mockQueries = [
  {
    id: '1',
    name: 'Statistical Aggregation',
    description: 'Compute SUM, AVG, COUNT, MIN, MAX operations with optional GROUP BY clauses on your dataset.',
    type: 'aggregation' as const,
    price: '0.01 FIL',
    executionTime: '< 30s',
    complexity: 'low' as const,
    supportedDataTypes: ['numerical', 'categorical', 'timestamps']
  },
  {
    id: '2',
    name: 'Logistic Regression Training',
    description: 'Train a logistic regression model on your dataset with customizable features and hyperparameters.',
    type: 'ml' as const,
    price: '0.15 FIL',
    executionTime: '2-5 min',
    complexity: 'medium' as const,
    supportedDataTypes: ['numerical', 'categorical']
  },
  {
    id: '3',
    name: 'Cohort Analysis',
    description: 'Analyze user behavior patterns over time, retention rates, and segment performance metrics.',
    type: 'analytics' as const,
    price: '0.08 FIL',
    executionTime: '1-3 min',
    complexity: 'medium' as const,
    supportedDataTypes: ['timestamps', 'categorical', 'numerical']
  },
  {
    id: '4',
    name: 'Correlation Matrix',
    description: 'Generate correlation matrices between numerical variables with statistical significance testing.',
    type: 'analytics' as const,
    price: '0.03 FIL',
    executionTime: '< 1 min',
    complexity: 'low' as const,
    supportedDataTypes: ['numerical']
  },
  {
    id: '5',
    name: 'Random Forest Training',
    description: 'Train ensemble random forest models with feature importance analysis and cross-validation.',
    type: 'ml' as const,
    price: '0.25 FIL',
    executionTime: '5-15 min',
    complexity: 'high' as const,
    supportedDataTypes: ['numerical', 'categorical', 'text']
  },
  {
    id: '6',
    name: 'Time Series Forecasting',
    description: 'Generate forecasts using ARIMA, exponential smoothing, or neural network approaches.',
    type: 'ml' as const,
    price: '0.20 FIL',
    executionTime: '3-10 min',
    complexity: 'high' as const,
    supportedDataTypes: ['timestamps', 'numerical']
  }
];

const queryTypes = ['All', 'Aggregation', 'ML', 'Analytics'];
const complexityLevels = ['All', 'Low', 'Medium', 'High'];

export default function DatasetsPage() {
  const [selectedType, setSelectedType] = useState('All');
  const [selectedComplexity, setSelectedComplexity] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredQueries = mockQueries.filter(query => {
    const matchesType = selectedType === 'All' || query.type === selectedType.toLowerCase();
    const matchesComplexity = selectedComplexity === 'All' || query.complexity === selectedComplexity.toLowerCase();
    const matchesSearch = query.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         query.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesComplexity && matchesSearch;
  });

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#000000' }}>
      <Navbar />
      
      {/* Hero Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: '#000000' }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold mb-6 text-white">
              Available <span className="text-[#20D55A]">Query Templates</span>
            </h1>
            <p className="text-xl text-white/40 mb-8 max-w-3xl mx-auto">
              Run privacy-preserving queries on encrypted datasets. Choose from pre-built templates or create custom queries.
            </p>
          </div>

          {/* Query Builder CTA */}
          <div className="border border-white/20 rounded-xl p-8 mb-12" style={{ backgroundColor: '#000000' }}>
            <div className="flex flex-col lg:flex-row items-center justify-between">
              <div className="mb-6 lg:mb-0">
                <h3 className="text-2xl font-bold mb-2 text-white">Custom Query Builder</h3>
                <p className="text-white/40">
                  Need a specific analysis? Use our query builder to create custom computations.
                </p>
              </div>
              <button className="bg-[#20D55A] hover:bg-green-400 text-black px-8 py-3 rounded-lg font-semibold transition-colors">
                Launch Query Builder
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 border-t border-white/10" style={{ backgroundColor: '#000000' }}>
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-6 items-center mb-6">
            {/* Search */}
            <div className="flex-1 w-full lg:w-auto">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search query templates..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full border border-white/20 rounded-lg px-4 py-3 pl-10 text-white placeholder-white/40 focus:border-[#20D55A] focus:outline-none"
                  style={{ backgroundColor: '#000000' }}
                />
                <svg className="absolute left-3 top-3.5 w-5 h-5 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-6">
            {/* Query Type */}
            <div>
              <span className="text-gray-400 text-sm block mb-2">Query Type:</span>
              <div className="flex flex-wrap gap-2">
                {queryTypes.map((type) => (
                  <button
                    key={type}
                    onClick={() => setSelectedType(type)}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors border ${
                      selectedType === type
                        ? 'bg-[#20D55A] text-black border-white/20'
                        : 'border-white/20 text-white/40 hover:text-white'
                    }`}
                    style={{ backgroundColor: selectedType === type ? '#20D55A' : '#000000' }}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Complexity */}
            <div>
              <span className="text-gray-400 text-sm block mb-2">Complexity:</span>
              <div className="flex flex-wrap gap-2">
                {complexityLevels.map((complexity) => (
                  <button
                    key={complexity}
                    onClick={() => setSelectedComplexity(complexity)}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors border ${
                      selectedComplexity === complexity
                        ? 'bg-[#20D55A] text-black border-white/20'
                        : 'border-white/20 text-white/40 hover:text-white'
                    }`}
                    style={{ backgroundColor: selectedComplexity === complexity ? '#20D55A' : '#000000' }}
                  >
                    {complexity}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Query Templates */}
      <section className="py-8 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: '#000000' }}>
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">
              {filteredQueries.length} Query Template{filteredQueries.length !== 1 ? 's' : ''}
            </h2>
          </div>

          {/* Query Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredQueries.map((query) => (
              <QueryCard key={query.id} query={query} />
            ))}
          </div>

          {/* Empty State */}
          {filteredQueries.length === 0 && (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold mb-2 text-white">No query templates found</h3>
              <p className="text-white/40 mb-6">
                Try adjusting your search terms or filters
              </p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedType('All');
                  setSelectedComplexity('All');
                }}
                className="bg-[#20D55A] hover:bg-green-400 text-black px-6 py-2 rounded-lg transition-colors font-semibold"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 border-t border-white/10" style={{ backgroundColor: '#000000' }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-white">How Privacy-Preserving Queries Work</h2>
            <p className="text-xl text-white/40">Your data stays encrypted. Only results are revealed.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-[#20D55A] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔐</span>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-white">Encrypted Execution</h3>
              <p className="text-white/40">
                Queries run inside secure enclaves using Synapse SDK. Raw data never leaves the secure environment.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-[#20D55A] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">✅</span>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-white">Verified Results</h3>
              <p className="text-white/40">
                All computations are cryptographically attested with proof of execution and data integrity.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-[#20D55A] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💰</span>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-white">Fair Payment</h3>
              <p className="text-white/40">
                Pay only for successful query execution. Automatic refunds for failed computations.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
