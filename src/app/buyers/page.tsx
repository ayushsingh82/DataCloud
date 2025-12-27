'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function BuyersPage() {
  const [selectedDataset, setSelectedDataset] = useState('');
  const [selectedQuery, setSelectedQuery] = useState('');

  return (
    <div className="min-h-screen w-full bg-[#fafafa] relative text-gray-900">
      {/* Diagonal Grid with Blue */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: `
            repeating-linear-gradient(45deg, rgba(0, 144, 255, 0.1) 0, rgba(0, 144, 255, 0.1) 1px, transparent 1px, transparent 20px),
            repeating-linear-gradient(-45deg, rgba(0, 144, 255, 0.1) 0, rgba(0, 144, 255, 0.1) 1px, transparent 1px, transparent 20px)
          `,
          backgroundSize: "40px 40px",
        }}
      />
      <div className="relative z-10">
        <Navbar />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-6 text-black">
            Access Premium Data <span className="text-[#0090FF]">Insights</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Run privacy-preserving analytics on high-quality datasets without accessing raw data. Get verified results with cryptographic proofs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-[#0090FF] hover:bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors">
              Browse Datasets
            </button>
            <button className="border border-gray-200 text-black hover:bg-gray-50 px-8 py-4 rounded-lg font-semibold text-lg transition-opacity">
              Try Sample Query
            </button>
          </div>
        </div>
      </section>

      {/* Query Builder */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 border-t border-gray-200 relative overflow-hidden">
        {/* Diagonal Grid with Blue */}
        <div 
          className="absolute inset-0 z-0 pointer-events-none" 
          style={{
            backgroundImage: `
              repeating-linear-gradient(45deg, rgba(0, 144, 255, 0.1) 0, rgba(0, 144, 255, 0.1) 1px, transparent 1px, transparent 20px),
              repeating-linear-gradient(-45deg, rgba(0, 144, 255, 0.1) 0, rgba(0, 144, 255, 0.1) 1px, transparent 1px, transparent 20px)
            `,
            backgroundSize: "40px 40px",
          }} 
        />
        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="border border-gray-200 rounded-xl p-8 bg-white relative overflow-hidden">
            {/* Diagonal Grid with Blue */}
            <div
              className="absolute inset-0 z-0 pointer-events-none"
              style={{
                backgroundImage: `
                  repeating-linear-gradient(45deg, rgba(0, 144, 255, 0.1) 0, rgba(0, 144, 255, 0.1) 1px, transparent 1px, transparent 20px),
                  repeating-linear-gradient(-45deg, rgba(0, 144, 255, 0.1) 0, rgba(0, 144, 255, 0.1) 1px, transparent 1px, transparent 20px)
                `,
                backgroundSize: "40px 40px",
              }}
            />
            <div className="relative z-10">
            <h2 className="text-2xl font-bold mb-6 text-black">Query Builder</h2>
            <p className="text-gray-600 mb-8">
              Build and execute privacy-preserving queries on encrypted datasets
            </p>

            <div className="space-y-6">
              {/* Dataset Selection */}
              <div>
                <label className="block text-sm font-medium mb-2">Select Dataset</label>
                <select 
                  value={selectedDataset}
                  onChange={(e) => setSelectedDataset(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 text-black bg-white focus:border-[#0090FF] focus:outline-none"
                >
                  <option value="">Choose a dataset...</option>
                  <option value="financial">Financial Transactions Dataset (2.3 GB)</option>
                  <option value="healthcare">Healthcare Research Data (5.7 GB)</option>
                  <option value="ecommerce">E-commerce Behavior Analytics (1.8 GB)</option>
                  <option value="climate">Climate & Weather Patterns (4.2 GB)</option>
                </select>
              </div>

              {/* Query Type */}
              <div>
                <label className="block text-sm font-medium mb-2">Query Type</label>
                <select 
                  value={selectedQuery}
                  onChange={(e) => setSelectedQuery(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 text-black bg-white focus:border-[#0090FF] focus:outline-none"
                >
                  <option value="">Choose query type...</option>
                  <option value="aggregation">Statistical Aggregation</option>
                  <option value="ml">Machine Learning Training</option>
                  <option value="cohort">Cohort Analysis</option>
                  <option value="correlation">Correlation Analysis</option>
                </select>
              </div>

              {/* Query Parameters */}
              {selectedQuery && (
                <div className="border border-gray-200 rounded-lg p-6 bg-white relative overflow-hidden">
                  {/* Diagonal Grid with Blue */}
                  <div
                    className="absolute inset-0 z-0 pointer-events-none"
                    style={{
                      backgroundImage: `
                        repeating-linear-gradient(45deg, rgba(0, 144, 255, 0.1) 0, rgba(0, 144, 255, 0.1) 1px, transparent 1px, transparent 20px),
                        repeating-linear-gradient(-45deg, rgba(0, 144, 255, 0.1) 0, rgba(0, 144, 255, 0.1) 1px, transparent 1px, transparent 20px)
                      `,
                      backgroundSize: "40px 40px",
                    }}
                  />
                  <div className="relative z-10">
                  <h3 className="font-semibold mb-4">Query Parameters</h3>
                  
                  {selectedQuery === 'aggregation' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Aggregation Function</label>
                        <select className="w-full border border-gray-200 rounded-lg px-4 py-2 text-black bg-white">
                          <option value="sum">SUM</option>
                          <option value="avg">AVG</option>
                          <option value="count">COUNT</option>
                          <option value="min">MIN</option>
                          <option value="max">MAX</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Column</label>
                        <input 
                          type="text" 
                          placeholder="e.g., transaction_amount"
                          className="w-full border border-gray-200 rounded-lg px-4 py-2 text-black placeholder-gray-400 bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Group By (optional)</label>
                        <input 
                          type="text" 
                          placeholder="e.g., age_group, region"
                          className="w-full border border-gray-200 rounded-lg px-4 py-2 text-black placeholder-gray-400 bg-white"
                        />
                      </div>
                    </div>
                  )}

                  {selectedQuery === 'ml' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Model Type</label>
                        <select className="w-full border border-gray-200 rounded-lg px-4 py-2 text-black bg-white">
                          <option value="logistic">Logistic Regression</option>
                          <option value="linear">Linear Regression</option>
                          <option value="random-forest">Random Forest</option>
                          <option value="neural-network">Neural Network</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Target Variable</label>
                        <input 
                          type="text" 
                          placeholder="e.g., is_fraud, customer_value"
                          className="w-full border border-gray-200 rounded-lg px-4 py-2 text-black placeholder-gray-400 bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Feature Columns</label>
                        <textarea 
                          rows={3}
                          placeholder="e.g., age, income, location, transaction_history"
                          className="w-full border border-gray-200 rounded-lg px-4 py-2 text-black placeholder-gray-400 bg-white"
                        />
                      </div>
                    </div>
                  )}

                  {selectedQuery === 'cohort' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Cohort Definition</label>
                        <select className="w-full border border-gray-200 rounded-lg px-4 py-2 text-black bg-white">
                          <option value="signup">Sign-up Date</option>
                          <option value="first-purchase">First Purchase Date</option>
                          <option value="custom">Custom Event</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Time Period</label>
                        <select className="w-full border border-gray-200 rounded-lg px-4 py-2 text-black bg-white">
                          <option value="weekly">Weekly</option>
                          <option value="monthly">Monthly</option>
                          <option value="quarterly">Quarterly</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Metric</label>
                        <select className="w-full border border-gray-200 rounded-lg px-4 py-2 text-black bg-white">
                          <option value="retention">Retention Rate</option>
                          <option value="revenue">Revenue per Cohort</option>
                          <option value="activity">Activity Rate</option>
                        </select>
                      </div>
                    </div>
                  )}
                  </div>
                </div>
              )}

              {/* Cost Estimate */}
              {selectedDataset && selectedQuery && (
                <div className="border border-gray-200 rounded-lg p-4 bg-white relative overflow-hidden">
                  {/* Diagonal Grid with Blue */}
                  <div
                    className="absolute inset-0 z-0 pointer-events-none"
                    style={{
                      backgroundImage: `
                        repeating-linear-gradient(45deg, rgba(0, 144, 255, 0.1) 0, rgba(0, 144, 255, 0.1) 1px, transparent 1px, transparent 20px),
                        repeating-linear-gradient(-45deg, rgba(0, 144, 255, 0.1) 0, rgba(0, 144, 255, 0.1) 1px, transparent 1px, transparent 20px)
                      `,
                      backgroundSize: "40px 40px",
                    }}
                  />
                  <div className="relative z-10">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-semibold">Estimated Cost</h4>
                      <p className="text-sm text-gray-600">Based on query complexity and dataset size</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-[#0090FF]">0.08 FIL</div>
                      <p className="text-xs text-gray-600">~$2.40 USD</p>
                    </div>
                  </div>
                  </div>
                </div>
              )}

              {/* Execute Button */}
              <div className="flex justify-between items-center">
                <button className="text-gray-600 hover:text-black transition-colors">
                  Save Query Template
                </button>
                <div className="space-x-4">
                  <button className="border border-gray-200 text-black hover:bg-gray-50 px-6 py-2 rounded-lg transition-opacity">
                    Preview Results
                  </button>
                  <button className="bg-[#0090FF] hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors font-semibold">
                    Execute Query
                  </button>
                </div>
              </div>
            </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Diagonal Grid with Blue */}
        <div 
          className="absolute inset-0 z-0 pointer-events-none" 
          style={{
            backgroundImage: `
              repeating-linear-gradient(45deg, rgba(0, 144, 255, 0.1) 0, rgba(0, 144, 255, 0.1) 1px, transparent 1px, transparent 20px),
              repeating-linear-gradient(-45deg, rgba(0, 144, 255, 0.1) 0, rgba(0, 144, 255, 0.1) 1px, transparent 1px, transparent 20px)
            `,
            backgroundSize: "40px 40px",
          }} 
        />
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-black">How It Works for Buyers</h2>
            <p className="text-xl text-gray-600">Get insights without compromising data privacy</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-[#0090FF] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔍</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">Discover Datasets</h3>
              <p className="text-gray-600 mb-6">
                Browse our marketplace of verified datasets with detailed metadata, schema information, and sample statistics.
              </p>
              <div className="border border-gray-200 rounded-lg p-4 bg-white relative overflow-hidden">
                {/* Diagonal Grid with Blue */}
                <div
                  className="absolute inset-0 z-0 pointer-events-none"
                  style={{
                    backgroundImage: `
                      repeating-linear-gradient(45deg, rgba(0, 144, 255, 0.1) 0, rgba(0, 144, 255, 0.1) 1px, transparent 1px, transparent 20px),
                      repeating-linear-gradient(-45deg, rgba(0, 144, 255, 0.1) 0, rgba(0, 144, 255, 0.1) 1px, transparent 1px, transparent 20px)
                    `,
                    backgroundSize: "40px 40px",
                  }}
                />
                <div className="relative z-10">
                <h4 className="font-semibold mb-2">What you get:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Dataset schema & size</li>
                  <li>• Quality metrics</li>
                  <li>• Usage statistics</li>
                  <li>• Provider verification</li>
                </ul>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-[#0090FF] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⚙️</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">Configure Query</h3>
              <p className="text-gray-600 mb-6">
                Use our query builder to create custom analytics, ML training jobs, or statistical analyses with transparent pricing.
              </p>
              <div className="border border-gray-200 rounded-lg p-4 bg-white relative overflow-hidden">
                {/* Diagonal Grid with Blue */}
                <div
                  className="absolute inset-0 z-0 pointer-events-none"
                  style={{
                    backgroundImage: `
                      repeating-linear-gradient(45deg, rgba(0, 144, 255, 0.1) 0, rgba(0, 144, 255, 0.1) 1px, transparent 1px, transparent 20px),
                      repeating-linear-gradient(-45deg, rgba(0, 144, 255, 0.1) 0, rgba(0, 144, 255, 0.1) 1px, transparent 1px, transparent 20px)
                    `,
                    backgroundSize: "40px 40px",
                  }}
                />
                <div className="relative z-10">
                <h4 className="font-semibold mb-2">Query Types:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Statistical aggregations</li>
                  <li>• ML model training</li>
                  <li>• Cohort analysis</li>
                  <li>• Custom analytics</li>
                </ul>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-[#0090FF] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📊</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">Get Verified Results</h3>
              <p className="text-gray-600 mb-6">
                Receive cryptographically verified results with proof of execution. Download reports or integrate via API.
              </p>
              <div className="border border-gray-200 rounded-lg p-4 bg-white relative overflow-hidden">
                {/* Diagonal Grid with Blue */}
                <div
                  className="absolute inset-0 z-0 pointer-events-none"
                  style={{
                    backgroundImage: `
                      repeating-linear-gradient(45deg, rgba(0, 144, 255, 0.1) 0, rgba(0, 144, 255, 0.1) 1px, transparent 1px, transparent 20px),
                      repeating-linear-gradient(-45deg, rgba(0, 144, 255, 0.1) 0, rgba(0, 144, 255, 0.1) 1px, transparent 1px, transparent 20px)
                    `,
                    backgroundSize: "40px 40px",
                  }}
                />
                <div className="relative z-10">
                <h4 className="font-semibold mb-2">Guarantees:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Proof of execution</li>
                  <li>• Data integrity verification</li>
                  <li>• Result authenticity</li>
                  <li>• Query audit trail</li>
                </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 border-t border-gray-200 relative overflow-hidden">
        {/* Diagonal Grid with Blue */}
        <div 
          className="absolute inset-0 z-0 pointer-events-none" 
          style={{
            backgroundImage: `
              repeating-linear-gradient(45deg, rgba(0, 144, 255, 0.1) 0, rgba(0, 144, 255, 0.1) 1px, transparent 1px, transparent 20px),
              repeating-linear-gradient(-45deg, rgba(0, 144, 255, 0.1) 0, rgba(0, 144, 255, 0.1) 1px, transparent 1px, transparent 20px)
            `,
            backgroundSize: "40px 40px",
          }} 
        />
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-black">Popular Use Cases</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: '🏦',
                title: 'Financial Analytics',
                description: 'Risk assessment, fraud detection, and market analysis without exposing sensitive transaction data.'
              },
              {
                icon: '🏥',
                title: 'Healthcare Research',
                description: 'Drug discovery, treatment analysis, and epidemiological studies with patient privacy protection.'
              },
              {
                icon: '🛒',
                title: 'Market Research',
                description: 'Consumer behavior analysis, demand forecasting, and competitive intelligence.'
              },
              {
                icon: '🌍',
                title: 'Climate Studies',
                description: 'Environmental monitoring, climate modeling, and sustainability impact analysis.'
              },
              {
                icon: '📱',
                title: 'Product Analytics',
                description: 'User engagement analysis, A/B testing, and feature optimization insights.'
              },
              {
                icon: '🚚',
                title: 'Supply Chain',
                description: 'Logistics optimization, demand planning, and supply chain risk assessment.'
              }
            ].map((useCase, index) => (
              <div key={index} className="border border-gray-200 rounded-xl p-6 hover:bg-gray-50 transition-opacity bg-white relative overflow-hidden">
                {/* Diagonal Grid with Blue */}
                <div
                  className="absolute inset-0 z-0 pointer-events-none"
                  style={{
                    backgroundImage: `
                      repeating-linear-gradient(45deg, rgba(0, 144, 255, 0.1) 0, rgba(0, 144, 255, 0.1) 1px, transparent 1px, transparent 20px),
                      repeating-linear-gradient(-45deg, rgba(0, 144, 255, 0.1) 0, rgba(0, 144, 255, 0.1) 1px, transparent 1px, transparent 20px)
                    `,
                    backgroundSize: "40px 40px",
                  }}
                />
                <div className="relative z-10">
                <div className="text-4xl mb-4">{useCase.icon}</div>
                <h3 className="text-xl font-semibold mb-3">{useCase.title}</h3>
                <p className="text-gray-600">{useCase.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Diagonal Grid with Blue */}
        <div 
          className="absolute inset-0 z-0 pointer-events-none" 
          style={{
            backgroundImage: `
              repeating-linear-gradient(45deg, rgba(0, 144, 255, 0.1) 0, rgba(0, 144, 255, 0.1) 1px, transparent 1px, transparent 20px),
              repeating-linear-gradient(-45deg, rgba(0, 144, 255, 0.1) 0, rgba(0, 144, 255, 0.1) 1px, transparent 1px, transparent 20px)
            `,
            backgroundSize: "40px 40px",
          }} 
        />
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6 text-black">Transparent Pricing</h2>
          <p className="text-xl text-gray-600 mb-8">
            Pay only for successful query execution. No hidden fees or minimum commitments.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border border-gray-200 rounded-xl p-6 bg-white relative overflow-hidden">
              {/* Diagonal Grid with Blue */}
              <div
                className="absolute inset-0 z-0 pointer-events-none"
                style={{
                  backgroundImage: `
                    repeating-linear-gradient(45deg, rgba(0, 144, 255, 0.1) 0, rgba(0, 144, 255, 0.1) 1px, transparent 1px, transparent 20px),
                    repeating-linear-gradient(-45deg, rgba(0, 144, 255, 0.1) 0, rgba(0, 144, 255, 0.1) 1px, transparent 1px, transparent 20px)
                  `,
                  backgroundSize: "40px 40px",
                }}
              />
              <div className="relative z-10">
              <h3 className="text-lg font-semibold mb-2 text-black">Simple Queries</h3>
              <div className="text-3xl font-bold text-[#0090FF] mb-4">0.01-0.05 FIL</div>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Basic aggregations</li>
                <li>• Statistical summaries</li>
                <li>• Count operations</li>
              </ul>
              </div>
            </div>

            <div className="border border-[#0090FF] rounded-xl p-6 relative bg-white overflow-hidden">
              {/* Diagonal Grid with Blue */}
              <div
                className="absolute inset-0 z-0 pointer-events-none"
                style={{
                  backgroundImage: `
                    repeating-linear-gradient(45deg, rgba(0, 144, 255, 0.1) 0, rgba(0, 144, 255, 0.1) 1px, transparent 1px, transparent 20px),
                    repeating-linear-gradient(-45deg, rgba(0, 144, 255, 0.1) 0, rgba(0, 144, 255, 0.1) 1px, transparent 1px, transparent 20px)
                  `,
                  backgroundSize: "40px 40px",
                }}
              />
              <div className="relative z-10">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-[#0090FF] text-white px-3 py-1 rounded-full text-xs font-medium">
                  Most Popular
                </div>
                <h3 className="text-lg font-semibold mb-2 text-black">Analytics</h3>
              <div className="text-3xl font-bold text-[#0090FF] mb-4">0.05-0.15 FIL</div>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Cohort analysis</li>
                <li>• Correlation studies</li>
                <li>• Complex aggregations</li>
              </ul>
              </div>
            </div>

            <div className="border border-gray-200 rounded-xl p-6 bg-white relative overflow-hidden">
              {/* Diagonal Grid with Blue */}
              <div
                className="absolute inset-0 z-0 pointer-events-none"
                style={{
                  backgroundImage: `
                    repeating-linear-gradient(45deg, rgba(0, 144, 255, 0.1) 0, rgba(0, 144, 255, 0.1) 1px, transparent 1px, transparent 20px),
                    repeating-linear-gradient(-45deg, rgba(0, 144, 255, 0.1) 0, rgba(0, 144, 255, 0.1) 1px, transparent 1px, transparent 20px)
                  `,
                  backgroundSize: "40px 40px",
                }}
              />
              <div className="relative z-10">
              <h3 className="text-lg font-semibold mb-2 text-black">ML Training</h3>
              <div className="text-3xl font-bold text-[#0090FF] mb-4">0.15-0.50 FIL</div>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Model training</li>
                <li>• Feature engineering</li>
                <li>• Cross-validation</li>
              </ul>
              </div>
            </div>
          </div>

          <div className="mt-8 text-sm text-gray-600">
            <p>Prices vary based on dataset size, query complexity, and computational requirements.</p>
          </div>
        </div>
      </section>

      <Footer />
      </div>
    </div>
  );
}
