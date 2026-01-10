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
    <div className="min-h-screen w-full bg-[#C4FEC2] relative text-black">
      <div className="relative z-10">
        <Navbar />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 bg-[#C4FEC2]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold mb-6 text-black">
              Available <span className="text-black">Query Templates</span>
            </h1>
            <p className="text-xl text-black/70 mb-8 max-w-3xl mx-auto">
              Run privacy-preserving queries on encrypted datasets. Choose from pre-built templates or create custom queries.
            </p>
          </div>

          {/* Query Builder CTA */}
          <div className="border border-transparent rounded-xl p-8 mb-12 bg-white relative overflow-hidden shadow-lg">
            <div className="relative z-10">
            <div className="flex flex-col lg:flex-row items-center justify-between">
              <div className="mb-6 lg:mb-0">
                <h3 className="text-2xl font-bold mb-2 text-black">Custom Query Builder</h3>
                <p className="text-black/70">
                  Need a specific analysis? Use our query builder to create custom computations.
                </p>
              </div>
              <button className="bg-black hover:bg-gray-800 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 hover:transform hover:-translate-y-1 hover:shadow-lg">
                Launch Query Builder
              </button>
            </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 bg-[#C4FEC2] relative overflow-hidden">
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-6 items-center mb-6">
            {/* Search */}
            <div className="flex-1 w-full lg:w-auto">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search query templates..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full border border-black/20 rounded-lg px-4 py-3 pl-10 text-black placeholder-black/50 bg-white focus:border-black focus:outline-none"
                />
                <svg className="absolute left-3 top-3.5 w-5 h-5 text-black/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-6">
            {/* Query Type */}
            <div>
              <span className="text-black/70 text-sm block mb-2">Query Type:</span>
              <div className="flex flex-wrap gap-2">
                {queryTypes.map((type) => (
                  <button
                    key={type}
                    onClick={() => setSelectedType(type)}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors border ${
                      selectedType === type
                        ? 'bg-black text-white border-transparent'
                        : 'border-black/20 text-black hover:border-black bg-white'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Complexity */}
            <div>
              <span className="text-black/70 text-sm block mb-2">Complexity:</span>
              <div className="flex flex-wrap gap-2">
                {complexityLevels.map((complexity) => (
                  <button
                    key={complexity}
                    onClick={() => setSelectedComplexity(complexity)}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors border ${
                      selectedComplexity === complexity
                        ? 'bg-black text-white border-transparent'
                        : 'border-black/20 text-black hover:border-black bg-white'
                    }`}
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
      <section className="py-8 px-4 sm:px-6 lg:px-8 bg-[#C4FEC2] relative overflow-hidden">
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-black">
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
              <svg className="w-16 h-16 mx-auto mb-4 text-black/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <h3 className="text-xl font-semibold mb-2 text-black">No query templates found</h3>
              <p className="text-black/70 mb-6">
                Try adjusting your search terms or filters
              </p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedType('All');
                  setSelectedComplexity('All');
                }}
                className="bg-black hover:bg-gray-800 text-white px-6 py-2 rounded-lg transition-all duration-300 hover:transform hover:-translate-y-1 hover:shadow-lg font-semibold"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-black relative overflow-hidden">
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-white">How Privacy-Preserving Queries Work</h2>
            <p className="text-xl text-white/70">Your data stays encrypted. Only results are revealed.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center bg-white rounded-xl p-6">
              <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-black">Encrypted Execution</h3>
              <p className="text-black/70">
                Queries run inside secure enclaves using Synapse SDK. Raw data never leaves the secure environment.
              </p>
            </div>
            <div className="text-center bg-white rounded-xl p-6">
              <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-black">Verified Results</h3>
              <p className="text-black/70">
                All computations are cryptographically attested with proof of execution and data integrity.
              </p>
            </div>
            <div className="text-center bg-white rounded-xl p-6">
              <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-black">Fair Payment</h3>
              <p className="text-black/70">
                Pay only for successful query execution. Automatic refunds for failed computations.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      </div>
    </div>
  );
}
