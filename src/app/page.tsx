import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function Home() {
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
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Text Content */}
            <div className="text-left">
              <div className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-full text-[#0090FF] text-sm font-medium mb-6 bg-white">
                🔒 Powered by Filecoin Network
              </div>
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold mb-6 text-black">
                Privacy-Preserving{' '}
                <span className="text-[#0090FF]">Data Marketplace</span>
                <br />
                Powered by Filecoin
              </h1>
              <p className="text-xl sm:text-2xl text-gray-600 mb-8">
                Buy, sell, and deploy privacy-preserving queries on encrypted datasets. 
                Leverage Filecoin storage and Synapse SDK for secure data analytics.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="bg-[#0090FF] hover:bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors duration-200 flex items-center gap-2">
                  <span>🚀</span>
                  Start Selling Data
                </button>
                <button className="border border-gray-300 text-black hover:bg-gray-50 px-8 py-4 rounded-lg font-semibold text-lg transition-colors">
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
                  <div className="absolute inset-24 bg-gradient-to-br from-[#0090FF] to-blue-600 rounded-full flex items-center justify-center shadow-2xl shadow-[#0090FF]/50">
                    <div className="text-white font-bold text-xl text-center">
                      <div>💾</div>
                      <div>Data Hub</div>
                      <div>Filecoin</div>
                    </div>
                  </div>
                  
                  {/* Floating Data Nodes */}
                  <div className="absolute top-8 left-8 w-16 h-16 bg-[#0090FF]/80 rounded-full flex items-center justify-center animate-bounce">
                    <span className="text-white text-lg">🔐</span>
                  </div>
                  <div className="absolute top-12 right-12 w-12 h-12 bg-[#0090FF]/80 rounded-full flex items-center justify-center animate-bounce" style={{ animationDelay: '0.5s' }}>
                    <span className="text-white text-sm">📊</span>
                  </div>
                  <div className="absolute bottom-8 left-12 w-14 h-14 bg-[#0090FF]/80 rounded-full flex items-center justify-center animate-bounce" style={{ animationDelay: '1s' }}>
                    <span className="text-white text-lg">🔍</span>
                  </div>
                  <div className="absolute bottom-12 right-8 w-10 h-10 bg-[#0090FF]/80 rounded-full flex items-center justify-center animate-bounce" style={{ animationDelay: '1.5s' }}>
                    <span className="text-white text-sm">⚡</span>
                  </div>
                  
                  {/* Connection Lines */}
                  <svg className="absolute inset-0 w-full h-full" viewBox="0 0 320 320">
                    <defs>
                      <linearGradient id="dataGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#0090FF" stopOpacity="0.6"/>
                        <stop offset="100%" stopColor="#0090FF" stopOpacity="0.3"/>
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
      <section id="features" className="py-16 px-4 sm:px-6 lg:px-8 border-t border-gray-200">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-black">
              Why <span className="text-[#0090FF]">DataCloud</span>?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Privacy-first data monetization with cryptographic verification
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Privacy-Preserving */}
            <div className="border border-gray-200 rounded-xl p-8 hover:shadow-lg transition-shadow bg-white relative overflow-hidden">
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
                <div className="w-12 h-12 bg-[#0090FF] rounded-lg flex items-center justify-center mb-6">
                  <span className="text-2xl">🔐</span>
                </div>
                <h3 className="text-xl font-bold mb-4 text-black">Privacy-Preserving</h3>
                <p className="text-gray-600 mb-4">
                  Your raw data never leaves your control. Only query results are shared with cryptographic guarantees.
                </p>
                <div className="flex items-center text-[#0090FF] text-sm">
                  <span>Learn More</span>
                  <span className="ml-2">→</span>
                </div>
              </div>
            </div>

            {/* Cryptographically Verified */}
            <div className="border border-gray-200 rounded-xl p-8 hover:shadow-lg transition-shadow bg-white relative overflow-hidden">
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
                <div className="w-12 h-12 bg-[#0090FF] rounded-lg flex items-center justify-center mb-6">
                  <span className="text-2xl">✓</span>
                </div>
                <h3 className="text-xl font-bold mb-4 text-black">Cryptographically Verified</h3>
                <p className="text-gray-600 mb-4">
                  PDP proofs ensure your data exists and is stored as claimed with mathematical certainty.
                </p>
                <div className="flex items-center text-[#0090FF] text-sm">
                  <span>Learn More</span>
                  <span className="ml-2">→</span>
                </div>
              </div>
            </div>

            {/* Decentralized */}
            <div className="border border-gray-200 rounded-xl p-8 hover:shadow-lg transition-shadow bg-white relative overflow-hidden">
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
                <div className="w-12 h-12 bg-[#0090FF] rounded-lg flex items-center justify-center mb-6">
                  <span className="text-2xl">🌐</span>
                </div>
                <h3 className="text-xl font-bold mb-4 text-black">Decentralized</h3>
                <p className="text-gray-600 mb-4">
                  Built on Filecoin and IPFS for truly decentralized data storage and access.
                </p>
                <div className="flex items-center text-[#0090FF] text-sm">
                  <span>Learn More</span>
                  <span className="ml-2">→</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-black">
              How <span className="text-[#0090FF]">DataCloud</span> Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Simple steps to monetize your data securely
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* For Data Sellers */}
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
                <h3 className="text-2xl font-bold mb-6 text-center text-[#0090FF]">For Data Sellers</h3>
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-[#0090FF] text-white rounded-full flex items-center justify-center text-sm font-bold mr-4 mt-1">1</div>
                  <div>
                    <h4 className="font-semibold text-black mb-2">Upload & Encrypt</h4>
                    <p className="text-gray-600">Upload your dataset to Filecoin and IPFS with encryption</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-[#0090FF] text-white rounded-full flex items-center justify-center text-sm font-bold mr-4 mt-1">2</div>
                  <div>
                    <h4 className="font-semibold text-black mb-2">Define Queries</h4>
                    <p className="text-gray-600">Set up allowed computations and pricing for your data</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-[#0090FF] text-white rounded-full flex items-center justify-center text-sm font-bold mr-4 mt-1">3</div>
                  <div>
                    <h4 className="font-semibold text-black mb-2">Earn Revenue</h4>
                    <p className="text-gray-600">Get paid for each query while keeping your data private</p>
                  </div>
                </div>
              </div>
              </div>
            </div>

            {/* For Data Buyers */}
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
                <h3 className="text-2xl font-bold mb-6 text-center text-[#0090FF]">For Data Buyers</h3>
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-[#0090FF] text-white rounded-full flex items-center justify-center text-sm font-bold mr-4 mt-1">1</div>
                  <div>
                    <h4 className="font-semibold text-black mb-2">Discover Datasets</h4>
                    <p className="text-gray-600">Browse available datasets by metadata and schema</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-[#0090FF] text-white rounded-full flex items-center justify-center text-sm font-bold mr-4 mt-1">2</div>
                  <div>
                    <h4 className="font-semibold text-black mb-2">Submit Queries</h4>
                    <p className="text-gray-600">Configure and pay for specific analytics or ML queries</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-[#0090FF] text-white rounded-full flex items-center justify-center text-sm font-bold mr-4 mt-1">3</div>
                  <div>
                    <h4 className="font-semibold text-black mb-2">Get Results</h4>
                    <p className="text-gray-600">Receive verified results without accessing raw data</p>
                  </div>
                </div>
              </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technology Stack Section */}
      <section id="technology" className="py-16 px-4 sm:px-6 lg:px-8 border-t border-gray-200">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-black">
              Powered by <span className="text-[#0090FF]">Filecoin Technology</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Advanced storage, privacy compute, and blockchain infrastructure for secure data operations
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-[#0090FF] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💾</span>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-black">Filecoin Storage</h3>
              <p className="text-gray-600">Decentralized storage with PDP proofs for data integrity verification</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-[#0090FF] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔐</span>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-black">Synapse SDK</h3>
              <p className="text-gray-600">Privacy-preserving compute with encrypted query execution</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-[#0090FF] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🌐</span>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-black">IPFS Network</h3>
              <p className="text-gray-600">Distributed content addressing for global data discovery</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section id="stats" className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-[#0090FF] mb-2">500+</div>
              <p className="text-gray-600">Active Users</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-[#0090FF] mb-2">1,200+</div>
              <p className="text-gray-600">Datasets Available</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-[#0090FF] mb-2">50+</div>
              <p className="text-gray-600">Verified Providers</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-[#0090FF] mb-2">$2.5M+</div>
              <p className="text-gray-600">FIL Tokens Traded</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="get-started" className="py-16 px-4 sm:px-6 lg:px-8 border-t border-gray-200">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-black">
            Ready to Start <span className="text-[#0090FF]">Data Trading</span>?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join the privacy-preserving data marketplace powered by Filecoin
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-[#0090FF] hover:bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors duration-200">
              Start Selling Data
            </button>
            <button className="border border-gray-300 text-black hover:bg-gray-50 px-8 py-4 rounded-lg font-semibold text-lg transition-colors">
              Browse Marketplace
            </button>
          </div>
        </div>
      </section>

      <Footer />
      </div>
    </div>
  );
}
