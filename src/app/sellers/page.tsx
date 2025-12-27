'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function SellersPage() {
  const [activeTab, setActiveTab] = useState('upload');

  return (
    <div className="min-h-screen w-full bg-black relative text-white">
      <div className="relative z-10">
        <Navbar />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-6 text-white">
            Monetize Your Data <span className="text-[#EBF73F]">Securely</span>
          </h1>
          <p className="text-xl text-gray-400 mb-8 max-w-3xl mx-auto">
            Upload your datasets to Filecoin, set privacy-preserving query templates, and earn revenue without exposing raw data.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-[#EBF73F] hover:bg-[#EBF73F]/80 text-black px-8 py-4 rounded-lg font-semibold text-lg transition-colors">
              Start Selling Data
            </button>
            <button className="border border-gray-700 text-white hover:bg-gray-50 px-8 py-4 rounded-lg font-semibold text-lg transition-opacity">
              View Documentation
            </button>
          </div>
        </div>
      </section>

      {/* Process Steps */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 border-t border-gray-700 relative overflow-hidden">
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">How to Sell Your Data</h2>
            <p className="text-xl text-gray-400">Simple steps to start earning from your datasets</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-[#EBF73F] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-black">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">Upload & Encrypt</h3>
              <p className="text-gray-400 mb-6">
                Upload your dataset to Filecoin with automatic encryption. Your data is stored securely and remains private.
              </p>
              <div className="border border-gray-700 rounded-lg p-4 bg-[#141414] relative overflow-hidden">
                <div className="relative z-10">
                <h4 className="font-semibold mb-2">Features:</h4>
                <ul className="text-sm text-gray-400 space-y-1">
                  <li>• End-to-end encryption</li>
                  <li>• Filecoin storage integration</li>
                  <li>• IPFS content addressing</li>
                  <li>• Automatic backup & replication</li>
                </ul>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-[#EBF73F] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-black">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">Define Query Templates</h3>
              <p className="text-gray-400 mb-6">
                Set up allowed computations, pricing models, and access controls. Choose from pre-built templates or create custom ones.
              </p>
              <div className="border border-gray-700 rounded-lg p-4 bg-[#141414] relative overflow-hidden">
                <div className="relative z-10">
                <h4 className="font-semibold mb-2">Query Types:</h4>
                <ul className="text-sm text-gray-400 space-y-1">
                  <li>• Statistical aggregations</li>
                  <li>• Machine learning training</li>
                  <li>• Cohort analysis</li>
                  <li>• Custom analytics</li>
                </ul>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-[#EBF73F] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-black">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">Earn Revenue</h3>
              <p className="text-gray-400 mb-6">
                Start earning FIL tokens for each query execution. Automated payments with transparent pricing and usage analytics.
              </p>
              <div className="border border-gray-700 rounded-lg p-4 bg-[#141414] relative overflow-hidden">
                <div className="relative z-10">
                <h4 className="font-semibold mb-2">Benefits:</h4>
                <ul className="text-sm text-gray-400 space-y-1">
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
      <section className="py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="border border-gray-700 rounded-xl p-8 bg-[#141414] relative overflow-hidden">
            <div className="relative z-10">
            <h2 className="text-2xl font-bold mb-6">Upload Your Dataset</h2>
            
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

                <div className="border-2 border-dashed border-gray-700 rounded-lg p-8 text-center hover:border-[#EBF73F] transition-colors cursor-pointer bg-[#141414] relative overflow-hidden">
                  <div className="relative z-10">
                  <div className="text-4xl mb-4">📁</div>
                  <h3 className="text-lg font-semibold mb-2">Drop your files here</h3>
                  <p className="text-gray-400 mb-4">or click to browse</p>
                  <button className="bg-[#EBF73F] hover:bg-[#EBF73F]/80 text-black px-6 py-2 rounded-lg transition-colors font-semibold">
                    Choose Files
                  </button>
                  <p className="text-xs text-gray-400 mt-2">
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
      <section className="py-16 px-4 sm:px-6 lg:px-8 border-t border-gray-700 relative overflow-hidden">
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-white">Why Sell on DataCloud?</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-4xl mb-4">🔐</div>
              <h3 className="font-semibold mb-2 text-white">Complete Privacy</h3>
              <p className="text-gray-400 text-sm">Your raw data never leaves the secure environment</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">💰</div>
              <h3 className="font-semibold mb-2 text-white">Fair Revenue</h3>
              <p className="text-gray-400 text-sm">Transparent pricing with automatic payments</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">🌐</div>
              <h3 className="font-semibold mb-2 text-white">Global Reach</h3>
              <p className="text-gray-400 text-sm">Access buyers from around the world</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="font-semibold mb-2 text-white">Usage Analytics</h3>
              <p className="text-gray-400 text-sm">Detailed insights into data usage and revenue</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      </div>
    </div>
  );
}
