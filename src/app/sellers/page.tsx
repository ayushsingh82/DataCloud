'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function SellersPage() {
  const [activeTab, setActiveTab] = useState('upload');

  return (
    <div className="min-h-screen w-full bg-[#C4FEC2] relative text-black">
      <div className="relative z-10">
        <Navbar />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 bg-[#C4FEC2]">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-6 text-black">
            Monetize Your Data <span className="text-black">Securely</span>
          </h1>
          <p className="text-xl text-black/70 mb-8 max-w-3xl mx-auto">
            Upload your datasets to Filecoin, set privacy-preserving query templates, and earn revenue without exposing raw data.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-black hover:bg-gray-800 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 hover:transform hover:-translate-y-1 hover:shadow-lg">
              Start Selling Data
            </button>
            <button className="border border-black/30 text-black hover:border-black hover:bg-white/50 bg-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300">
              View Documentation
            </button>
          </div>
        </div>
      </section>

      {/* Process Steps */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-black relative overflow-hidden">
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-white">How to Sell Your Data</h2>
            <p className="text-xl text-white/70">Simple steps to start earning from your datasets</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="text-center bg-white rounded-xl p-6">
              <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-4 text-black">Upload & Encrypt</h3>
              <p className="text-black/70 mb-6">
                Upload your dataset to Filecoin with automatic encryption. Your data is stored securely and remains private.
              </p>
              <div className="border border-transparent rounded-lg p-4 bg-[#C4FEC2] relative overflow-hidden">
                <div className="relative z-10">
                <h4 className="font-semibold mb-2 text-black">Features:</h4>
                <ul className="text-sm text-black/70 space-y-1">
                  <li>• End-to-end encryption</li>
                  <li>• Filecoin storage integration</li>
                  <li>• IPFS content addressing</li>
                  <li>• Automatic backup & replication</li>
                </ul>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="text-center bg-white rounded-xl p-6">
              <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-4 text-black">Define Query Templates</h3>
              <p className="text-black/70 mb-6">
                Set up allowed computations, pricing models, and access controls. Choose from pre-built templates or create custom ones.
              </p>
              <div className="border border-transparent rounded-lg p-4 bg-[#C4FEC2] relative overflow-hidden">
                <div className="relative z-10">
                <h4 className="font-semibold mb-2 text-black">Query Types:</h4>
                <ul className="text-sm text-black/70 space-y-1">
                  <li>• Statistical aggregations</li>
                  <li>• Machine learning training</li>
                  <li>• Cohort analysis</li>
                  <li>• Custom analytics</li>
                </ul>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="text-center bg-white rounded-xl p-6">
              <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-4 text-black">Earn Revenue</h3>
              <p className="text-black/70 mb-6">
                Start earning FIL tokens for each query execution. Automated payments with transparent pricing and usage analytics.
              </p>
              <div className="border border-transparent rounded-lg p-4 bg-[#C4FEC2] relative overflow-hidden">
                <div className="relative z-10">
                <h4 className="font-semibold mb-2 text-black">Benefits:</h4>
                <ul className="text-sm text-black/70 space-y-1">
                  <li>• Per-query payments</li>
                  <li>• Transparent pricing</li>
                  <li>• Usage analytics</li>
                  <li>• Automatic settlements</li>
                </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Data Upload Interface */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#C4FEC2] relative overflow-hidden">
        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="border border-transparent rounded-xl p-8 bg-white relative overflow-hidden shadow-lg">
            <div className="relative z-10">
            <h2 className="text-2xl font-bold mb-6 text-black">Upload Your Dataset</h2>
            
            {/* Tabs */}
            <div className="flex space-x-4 mb-8">
              <button
                onClick={() => setActiveTab('upload')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors border ${
                  activeTab === 'upload'
                    ? 'bg-[#EBF73F] text-black border-gray-700'
                    : 'border-gray-700 text-gray-400 hover:text-white bg-[#141414]'
                }`}
              >
                Upload Data
              </button>
              <button
                onClick={() => setActiveTab('configure')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors border ${
                  activeTab === 'configure'
                    ? 'bg-[#EBF73F] text-black border-gray-700'
                    : 'border-gray-700 text-gray-400 hover:text-white bg-[#141414]'
                }`}
              >
                Configure Queries
              </button>
              <button
                onClick={() => setActiveTab('pricing')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors border ${
                  activeTab === 'pricing'
                    ? 'bg-[#EBF73F] text-black border-gray-700'
                    : 'border-gray-700 text-gray-400 hover:text-white bg-[#141414]'
                }`}
              >
                Set Pricing
              </button>
            </div>

            {/* Upload Tab */}
            {activeTab === 'upload' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Dataset Name</label>
                  <input
                    type="text"
                    placeholder="Enter a descriptive name for your dataset"
                    className="w-full border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-400 bg-[#141414] focus:border-[#EBF73F] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea
                    rows={4}
                    placeholder="Describe your dataset, its contents, and potential use cases"
                    className="w-full border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-400 bg-[#141414] focus:border-[#EBF73F] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Category</label>
                  <select className="w-full bg-[#141414] border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-[#EBF73F] focus:outline-none">
                    <option value="">Select a category</option>
                    <option value="finance">Finance</option>
                    <option value="healthcare">Healthcare</option>
                    <option value="ecommerce">E-commerce</option>
                    <option value="environment">Environment</option>
                    <option value="social">Social Media</option>
                    <option value="logistics">Logistics</option>
                  </select>
                </div>

                <div className="border-2 border-dashed border-black/20 rounded-lg p-8 text-center hover:border-black transition-colors cursor-pointer bg-white relative overflow-hidden">
                  <div className="relative z-10">
                  <svg className="w-12 h-12 mx-auto mb-4 text-black/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                  </svg>
                  <h3 className="text-lg font-semibold mb-2 text-black">Drop your files here</h3>
                  <p className="text-black/70 mb-4">or click to browse</p>
                  <button className="bg-black hover:bg-gray-800 text-white px-6 py-2 rounded-lg transition-all duration-300 hover:transform hover:-translate-y-1 hover:shadow-lg font-semibold">
                    Choose Files
                  </button>
                  <p className="text-xs text-black/50 mt-2">
                    Supports CSV, JSON, Parquet files up to 10GB
                  </p>
                  </div>
                </div>
              </div>
            )}

            {/* Configure Tab */}
            {activeTab === 'configure' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Allowed Query Types</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { name: 'Statistical Aggregations', desc: 'SUM, AVG, COUNT, etc.' },
                      { name: 'Machine Learning', desc: 'Model training and inference' },
                      { name: 'Cohort Analysis', desc: 'User behavior over time' },
                      { name: 'Correlation Analysis', desc: 'Variable relationships' }
                    ].map((query, index) => (
                      <label key={index} className="flex items-start space-x-3 p-4 border border-gray-700 rounded-lg cursor-pointer hover:bg-gray-50 transition-opacity bg-[#141414] relative overflow-hidden">
                        <div className="relative z-10 flex items-start space-x-3 w-full">
                          <input type="checkbox" className="mt-1 text-[#EBF73F] border-gray-700 rounded focus:ring-[#EBF73F] bg-[#141414]" />
                        <div>
                          <div className="font-medium">{query.name}</div>
                            <div className="text-sm text-gray-400">{query.desc}</div>
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Data Privacy Level</label>
                  <select className="w-full bg-[#141414] border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-[#EBF73F] focus:outline-none">
                    <option value="high">High - Maximum privacy protection</option>
                    <option value="medium">Medium - Balanced privacy and utility</option>
                    <option value="low">Low - Minimal privacy constraints</option>
                  </select>
                </div>
              </div>
            )}

            {/* Pricing Tab */}
            {activeTab === 'pricing' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Base Price per Query</label>
                  <div className="flex">
                    <input
                      type="number"
                      step="0.01"
                      placeholder="0.05"
                      className="flex-1 bg-[#141414] border border-gray-700 rounded-l-lg px-4 py-3 text-white placeholder-gray-400 focus:border-[#EBF73F] focus:outline-none"
                    />
                    <span className="bg-gray-700 border border-gray-700 border-l-0 rounded-r-lg px-4 py-3 text-gray-300">
                      FIL
                    </span>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">Query Type Multipliers</h3>
                  <div className="space-y-3">
                    {[
                      { name: 'Simple Aggregations', multiplier: '1x' },
                      { name: 'Complex Analytics', multiplier: '3x' },
                      { name: 'ML Model Training', multiplier: '5x' },
                      { name: 'Custom Queries', multiplier: '10x' }
                    ].map((item, index) => (
                      <div key={index} className="flex justify-between items-center p-3 border border-gray-700 rounded-lg bg-[#141414] relative overflow-hidden">
                        <div className="relative z-10 flex justify-between items-center w-full">
                        <span>{item.name}</span>
                          <span className="text-[#EBF73F] font-semibold">{item.multiplier}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border border-gray-700 rounded-lg p-4 bg-[#141414] relative overflow-hidden">
                  <div className="relative z-10">
                  <h4 className="font-semibold mb-2 text-white">Revenue Estimate</h4>
                  <p className="text-sm text-gray-400 mb-2">
                    Based on similar datasets in your category:
                  </p>
                  <div className="text-2xl font-bold text-[#EBF73F]">
                    ~15-50 FIL/month
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    Actual revenue depends on demand and query complexity
                  </p>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-between mt-8">
              <button className="text-gray-400 hover:text-white transition-colors">
                Save as Draft
              </button>
              <div className="space-x-4">
                <button className="border border-gray-700 text-white hover:bg-gray-50 px-6 py-2 rounded-lg transition-opacity">
                  Preview
                </button>
                <button className="bg-[#EBF73F] hover:bg-[#EBF73F]/80 text-black px-6 py-2 rounded-lg transition-colors font-semibold">
                  Publish Dataset
                </button>
              </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#C4FEC2] relative overflow-hidden">
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-black">Why Sell on DataCloud?</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center bg-white rounded-xl p-6">
              <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="font-semibold mb-2 text-black">Complete Privacy</h3>
              <p className="text-black/70 text-sm">Your raw data never leaves the secure environment</p>
            </div>
            <div className="text-center bg-white rounded-xl p-6">
              <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-semibold mb-2 text-black">Fair Revenue</h3>
              <p className="text-black/70 text-sm">Transparent pricing with automatic payments</p>
            </div>
            <div className="text-center bg-white rounded-xl p-6">
              <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-semibold mb-2 text-black">Global Reach</h3>
              <p className="text-black/70 text-sm">Access buyers from around the world</p>
            </div>
            <div className="text-center bg-white rounded-xl p-6">
              <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="font-semibold mb-2 text-black">Usage Analytics</h3>
              <p className="text-black/70 text-sm">Detailed insights into data usage and revenue</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      </div>
    </div>
  );
}
