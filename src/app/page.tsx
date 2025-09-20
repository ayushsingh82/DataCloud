import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Text Content */}
            <div className="text-left">
              <div className="inline-flex items-center px-4 py-2 bg-blue-600/20 border border-blue-500/30 rounded-full text-blue-400 text-sm font-medium mb-6">
                🔒 Powered by Filecoin Network
              </div>
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold mb-6">
                Privacy-Preserving{' '}
                <span className="text-blue-500">Data Marketplace</span>
                <br />
                Powered by Filecoin
              </h1>
              <p className="text-xl sm:text-2xl text-gray-300 mb-8">
                Buy, sell, and deploy privacy-preserving queries on encrypted datasets. 
                Leverage Filecoin storage and Synapse SDK for secure data analytics.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors duration-200 flex items-center gap-2">
                  <span>🚀</span>
                  Start Selling Data
                </button>
                <button className="border border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors duration-200">
                  Browse Datasets
                </button>
              </div>
            </div>

            {/* Right Column - Data Network Visualization */}
            <div className="relative flex justify-center lg:justify-end">
              <div className="relative w-80 h-80 lg:w-96 lg:h-96">
                {/* Data Network Nodes */}
                <div className="absolute inset-0">
                  {/* Central Data Hub */}
                  <div className="absolute inset-24 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center shadow-2xl shadow-blue-500/50">
                    <div className="text-white font-bold text-xl text-center">
                      <div>💾</div>
                      <div>Data Hub</div>
                      <div>Filecoin</div>
                    </div>
                  </div>
                  
                  {/* Floating Data Nodes */}
                  <div className="absolute top-8 left-8 w-16 h-16 bg-green-500/80 rounded-full flex items-center justify-center animate-bounce">
                    <span className="text-white text-lg">🔐</span>
                  </div>
                  <div className="absolute top-12 right-12 w-12 h-12 bg-purple-500/80 rounded-full flex items-center justify-center animate-bounce" style={{ animationDelay: '0.5s' }}>
                    <span className="text-white text-sm">📊</span>
                  </div>
                  <div className="absolute bottom-8 left-12 w-14 h-14 bg-orange-500/80 rounded-full flex items-center justify-center animate-bounce" style={{ animationDelay: '1s' }}>
                    <span className="text-white text-lg">🔍</span>
                  </div>
                  <div className="absolute bottom-12 right-8 w-10 h-10 bg-red-500/80 rounded-full flex items-center justify-center animate-bounce" style={{ animationDelay: '1.5s' }}>
                    <span className="text-white text-sm">⚡</span>
                  </div>
                  
                  {/* Connection Lines */}
                  <svg className="absolute inset-0 w-full h-full" viewBox="0 0 320 320">
                    <defs>
                      <linearGradient id="dataGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.6"/>
                        <stop offset="100%" stopColor="#06B6D4" stopOpacity="0.3"/>
                      </linearGradient>
                    </defs>
                    <line x1="80" y1="80" x2="240" y2="240" stroke="url(#dataGradient)" strokeWidth="2" className="animate-pulse"/>
                    <line x1="240" y1="80" x2="80" y2="240" stroke="url(#dataGradient)" strokeWidth="2" className="animate-pulse" style={{ animationDelay: '0.5s' }}/>
                    <line x1="160" y1="40" x2="160" y2="280" stroke="url(#dataGradient)" strokeWidth="2" className="animate-pulse" style={{ animationDelay: '1s' }}/>
                    <line x1="40" y1="160" x2="280" y2="160" stroke="url(#dataGradient)" strokeWidth="2" className="animate-pulse" style={{ animationDelay: '1.5s' }}/>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Why <span className="text-blue-500">DataCloud</span>?
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Privacy-first data monetization with cryptographic verification
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Privacy-Preserving */}
            <div className="bg-black/50 border border-gray-800 rounded-xl p-8 hover:border-blue-500/50 transition-all duration-300 hover:transform hover:scale-105">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-6">
                <span className="text-2xl">🔐</span>
              </div>
              <h3 className="text-xl font-bold mb-4">Privacy-Preserving</h3>
              <p className="text-gray-300 mb-4">
                Your raw data never leaves your control. Only query results are shared with cryptographic guarantees.
              </p>
              <div className="flex items-center text-blue-400 text-sm">
                <span>Learn More</span>
                <span className="ml-2">→</span>
              </div>
            </div>

            {/* Cryptographically Verified */}
            <div className="bg-black/50 border border-gray-800 rounded-xl p-8 hover:border-green-500/50 transition-all duration-300 hover:transform hover:scale-105">
              <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mb-6">
                <span className="text-2xl">✓</span>
              </div>
              <h3 className="text-xl font-bold mb-4">Cryptographically Verified</h3>
              <p className="text-gray-300 mb-4">
                PDP proofs ensure your data exists and is stored as claimed with mathematical certainty.
              </p>
              <div className="flex items-center text-green-400 text-sm">
                <span>Learn More</span>
                <span className="ml-2">→</span>
              </div>
            </div>

            {/* Decentralized */}
            <div className="bg-black/50 border border-gray-800 rounded-xl p-8 hover:border-purple-500/50 transition-all duration-300 hover:transform hover:scale-105">
              <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mb-6">
                <span className="text-2xl">🌐</span>
              </div>
              <h3 className="text-xl font-bold mb-4">Decentralized</h3>
              <p className="text-gray-300 mb-4">
                Built on Filecoin and IPFS for truly decentralized data storage and access.
              </p>
              <div className="flex items-center text-purple-400 text-sm">
                <span>Learn More</span>
                <span className="ml-2">→</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              How <span className="text-blue-500">DataCloud</span> Works
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Simple steps to monetize your data securely
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* For Data Sellers */}
            <div className="bg-black/50 border border-gray-800 rounded-xl p-8">
              <h3 className="text-2xl font-bold mb-6 text-center text-blue-400">For Data Sellers</h3>
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-4 mt-1">1</div>
                  <div>
                    <h4 className="font-semibold text-white mb-2">Upload & Encrypt</h4>
                    <p className="text-gray-300">Upload your dataset to Filecoin and IPFS with encryption</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-4 mt-1">2</div>
                  <div>
                    <h4 className="font-semibold text-white mb-2">Define Queries</h4>
                    <p className="text-gray-300">Set up allowed computations and pricing for your data</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-4 mt-1">3</div>
                  <div>
                    <h4 className="font-semibold text-white mb-2">Earn Revenue</h4>
                    <p className="text-gray-300">Get paid for each query while keeping your data private</p>
                  </div>
                </div>
              </div>
            </div>

            {/* For Data Buyers */}
            <div className="bg-black/50 border border-gray-800 rounded-xl p-8">
              <h3 className="text-2xl font-bold mb-6 text-center text-green-400">For Data Buyers</h3>
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-4 mt-1">1</div>
                  <div>
                    <h4 className="font-semibold text-white mb-2">Discover Datasets</h4>
                    <p className="text-gray-300">Browse available datasets by metadata and schema</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-4 mt-1">2</div>
                  <div>
                    <h4 className="font-semibold text-white mb-2">Submit Queries</h4>
                    <p className="text-gray-300">Configure and pay for specific analytics or ML queries</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-4 mt-1">3</div>
                  <div>
                    <h4 className="font-semibold text-white mb-2">Get Results</h4>
                    <p className="text-gray-300">Receive verified results without accessing raw data</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technology Stack Section */}
      <section id="technology" className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Powered by <span className="text-blue-500">Filecoin Technology</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Advanced storage, privacy compute, and blockchain infrastructure for secure data operations
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💾</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Filecoin Storage</h3>
              <p className="text-gray-300">Decentralized storage with PDP proofs for data integrity verification</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔐</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Synapse SDK</h3>
              <p className="text-gray-300">Privacy-preserving compute with encrypted query execution</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🌐</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">IPFS Network</h3>
              <p className="text-gray-300">Distributed content addressing for global data discovery</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section id="stats" className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-500 mb-2">500+</div>
              <p className="text-gray-300">Active Users</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-500 mb-2">1,200+</div>
              <p className="text-gray-300">Datasets Available</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-500 mb-2">50+</div>
              <p className="text-gray-300">Verified Providers</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-orange-500 mb-2">$2.5M+</div>
              <p className="text-gray-300">FIL Tokens Traded</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="get-started" className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            Ready to Start <span className="text-blue-500">Data Trading</span>?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join the privacy-preserving data marketplace powered by Filecoin
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors duration-200">
              Start Selling Data
            </button>
            <button className="border border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors duration-200">
              Browse Marketplace
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black border-t border-gray-800 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <h3 className="text-xl font-bold text-blue-500">
                DataCloud
              </h3>
            </div>
            <div className="flex space-x-6 text-sm">
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">Features</a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">Docs</a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">Community</a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">GitHub</a>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-6 pt-6 text-center">
            <p className="text-gray-500 text-sm">&copy; 2024 DataCloud. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
