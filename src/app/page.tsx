import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen w-full bg-[#C4FEC2] relative text-black">
      <div className="relative z-10">
        <Navbar />

      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Text Content */}
            <div className="text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 border border-black/20 rounded-full text-black text-sm font-medium mb-6 bg-white">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Powered by Filecoin Network
              </div>
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold mb-6 text-black">
                Privacy-Preserving{' '}
                <span className="text-black">Data Marketplace</span>
                <br />
                Powered by Filecoin
              </h1>
              <p className="text-xl sm:text-2xl text-black/70 mb-8">
                Buy, sell, and deploy privacy-preserving queries on encrypted datasets. 
                Leverage Filecoin storage and Synapse SDK for secure data analytics.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="bg-black hover:bg-gray-800 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 hover:transform hover:-translate-y-1 hover:shadow-lg flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                  Start Selling Data
                </button>
                <button className="border border-black/30 text-black hover:border-black hover:bg-white/50 bg-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300">
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
                  <div className="absolute inset-24 bg-black rounded-full flex flex-col items-center justify-center shadow-2xl shadow-black/20">
                    <svg className="w-8 h-8 text-white mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
                    </svg>
                    <div className="text-white font-bold text-sm text-center">
                      <div>Data Hub</div>
                      <div className="text-xs">Filecoin</div>
                    </div>
                  </div>
                  
                  {/* Floating Data Nodes */}
                  <div className="absolute top-8 left-8 w-16 h-16 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center animate-bounce shadow-lg border border-transparent">
                    <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <div className="absolute top-12 right-12 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center animate-bounce shadow-lg border border-transparent" style={{ animationDelay: '0.5s' }}>
                    <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <div className="absolute bottom-8 left-12 w-14 h-14 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center animate-bounce shadow-lg border border-transparent" style={{ animationDelay: '1s' }}>
                    <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <div className="absolute bottom-12 right-8 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center animate-bounce shadow-lg border border-transparent" style={{ animationDelay: '1.5s' }}>
                    <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  
                  {/* Connection Lines */}
                  <svg className="absolute inset-0 w-full h-full" viewBox="0 0 320 320">
                    <defs>
                      <linearGradient id="dataGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#000000" stopOpacity="0.3"/>
                        <stop offset="100%" stopColor="#000000" stopOpacity="0.1"/>
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
      <section id="features" className="py-16 px-4 sm:px-6 lg:px-8 bg-[#C4FEC2]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-black">
              Why <span className="text-black">DataCloud</span>?
            </h2>
            <p className="text-xl text-black/70 max-w-3xl mx-auto">
              Privacy-first data monetization with cryptographic verification
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Privacy-Preserving */}
            <div className="border border-transparent rounded-xl p-8 hover:shadow-lg transition-shadow bg-white relative overflow-hidden">
              <div className="relative z-10">
                <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center mb-6">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-4 text-black">Privacy-Preserving</h3>
                <p className="text-black/70 mb-4">
                  Your raw data never leaves your control. Only query results are shared with cryptographic guarantees.
                </p>
                <div className="flex items-center text-black text-sm font-medium">
                  <span>Learn More</span>
                  <span className="ml-2">→</span>
                </div>
              </div>
            </div>

            {/* Cryptographically Verified */}
            <div className="border border-transparent rounded-xl p-8 hover:shadow-lg transition-shadow bg-white relative overflow-hidden">
              <div className="relative z-10">
                <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center mb-6">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-4 text-black">Cryptographically Verified</h3>
                <p className="text-black/70 mb-4">
                  PDP proofs ensure your data exists and is stored as claimed with mathematical certainty.
                </p>
                <div className="flex items-center text-black text-sm font-medium">
                  <span>Learn More</span>
                  <span className="ml-2">→</span>
                </div>
              </div>
            </div>

            {/* Decentralized */}
            <div className="border border-transparent rounded-xl p-8 hover:shadow-lg transition-shadow bg-white relative overflow-hidden">
              <div className="relative z-10">
                <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center mb-6">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-4 text-black">Decentralized</h3>
                <p className="text-black/70 mb-4">
                  Built on Filecoin and IPFS for truly decentralized data storage and access.
                </p>
                <div className="flex items-center text-black text-sm font-medium">
                  <span>Learn More</span>
                  <span className="ml-2">→</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-16 px-4 sm:px-6 lg:px-8 bg-black">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-white">
              How <span className="text-white">DataCloud</span> Works
            </h2>
            <p className="text-xl text-white/70 max-w-3xl mx-auto">
              Simple steps to monetize your data securely
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* For Data Sellers */}
            <div className="border border-transparent rounded-xl p-8 bg-white relative overflow-hidden">
              <div className="relative z-10">
                <h3 className="text-2xl font-bold mb-6 text-center text-black">For Data Sellers</h3>
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-sm font-bold mr-4 mt-1">1</div>
                  <div>
                    <h4 className="font-semibold text-black mb-2">Upload & Encrypt</h4>
                    <p className="text-black/70">Upload your dataset to Filecoin and IPFS with encryption</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-sm font-bold mr-4 mt-1">2</div>
                  <div>
                    <h4 className="font-semibold text-black mb-2">Define Queries</h4>
                    <p className="text-black/70">Set up allowed computations and pricing for your data</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-sm font-bold mr-4 mt-1">3</div>
                  <div>
                    <h4 className="font-semibold text-black mb-2">Earn Revenue</h4>
                    <p className="text-black/70">Get paid for each query while keeping your data private</p>
                  </div>
                </div>
              </div>
              </div>
            </div>

            {/* For Data Buyers */}
            <div className="border border-transparent rounded-xl p-8 bg-white relative overflow-hidden">
              <div className="relative z-10">
                <h3 className="text-2xl font-bold mb-6 text-center text-black">For Data Buyers</h3>
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-sm font-bold mr-4 mt-1">1</div>
                  <div>
                    <h4 className="font-semibold text-black mb-2">Discover Datasets</h4>
                    <p className="text-black/70">Browse available datasets by metadata and schema</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-sm font-bold mr-4 mt-1">2</div>
                  <div>
                    <h4 className="font-semibold text-black mb-2">Submit Queries</h4>
                    <p className="text-black/70">Configure and pay for specific analytics or ML queries</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-sm font-bold mr-4 mt-1">3</div>
                  <div>
                    <h4 className="font-semibold text-black mb-2">Get Results</h4>
                    <p className="text-black/70">Receive verified results without accessing raw data</p>
                  </div>
                </div>
              </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technology Stack Section */}
      <section id="technology" className="py-16 px-4 sm:px-6 lg:px-8 bg-[#C4FEC2]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-black">
              Powered by <span className="text-black">Filecoin Technology</span>
            </h2>
            <p className="text-xl text-black/70 max-w-3xl mx-auto">
              Advanced storage, privacy compute, and blockchain infrastructure for secure data operations
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center bg-white rounded-xl p-6">
              <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-black">Filecoin Storage</h3>
              <p className="text-black/70">Decentralized storage with PDP proofs for data integrity verification</p>
            </div>
            <div className="text-center bg-white rounded-xl p-6">
              <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-black">Synapse SDK</h3>
              <p className="text-black/70">Privacy-preserving compute with encrypted query execution</p>
            </div>
            <div className="text-center bg-white rounded-xl p-6">
              <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-black">IPFS Network</h3>
              <p className="text-black/70">Distributed content addressing for global data discovery</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section id="stats" className="py-16 px-4 sm:px-6 lg:px-8 bg-black">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center bg-white rounded-lg p-5">
              <div className="text-4xl font-bold text-black mb-2">500+</div>
              <p className="text-black/70 text-sm">Active Users</p>
            </div>
            <div className="text-center bg-white rounded-lg p-5">
              <div className="text-4xl font-bold text-black mb-2">1,200+</div>
              <p className="text-black/70 text-sm">Datasets Available</p>
            </div>
            <div className="text-center bg-white rounded-lg p-5">
              <div className="text-4xl font-bold text-black mb-2">50+</div>
              <p className="text-black/70 text-sm">Verified Providers</p>
            </div>
            <div className="text-center bg-white rounded-lg p-5">
              <div className="text-4xl font-bold text-black mb-2">$2.5M+</div>
              <p className="text-black/70 text-sm">FIL Tokens Traded</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="get-started" className="py-16 px-4 sm:px-6 lg:px-8 bg-[#C4FEC2]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-black">
            Ready to Start <span className="text-black">Data Trading</span>?
          </h2>
          <p className="text-xl text-black/70 mb-8">
            Join the privacy-preserving data marketplace powered by Filecoin
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-black hover:bg-gray-800 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 hover:transform hover:-translate-y-1 hover:shadow-lg">
              Start Selling Data
            </button>
            <button className="border border-black/30 text-black hover:border-black hover:bg-white/50 bg-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300">
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
