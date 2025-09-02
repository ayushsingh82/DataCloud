export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-purple-50 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-[#0090FF]/10 to-[#8B5CF6]/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-[#EC4899]/10 to-[#F59E0B]/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-[#8B5CF6]/5 to-[#0090FF]/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      {/* Header */}
      <header className="border-b border-gray-200/50 backdrop-blur-sm bg-white/80 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-[#0090FF] to-[#8B5CF6] bg-clip-text text-transparent">
                DataCloud
              </h1>
            </div>
            <nav className="hidden md:flex space-x-8">

            </nav>
            <button className="bg-gradient-to-r from-[#0090FF] to-[#8B5CF6] text-white px-6 py-2 rounded-full hover:shadow-lg hover:scale-105 transition-all duration-300">
              Get Started
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-100/30 to-purple-100/30 rounded-full blur-3xl"></div>
        <div className="max-w-7xl mx-auto text-center relative z-10">
          {/* Floating elements */}
          <div className="absolute top-10 left-20 w-4 h-4 bg-[#0090FF] rounded-full animate-bounce delay-300"></div>
          <div className="absolute top-32 right-32 w-6 h-6 bg-[#8B5CF6] rounded-full animate-bounce delay-700"></div>
          <div className="absolute bottom-20 left-1/4 w-3 h-3 bg-[#EC4899] rounded-full animate-bounce delay-1000"></div>
          
          <h1 className="text-5xl md:text-7xl font-black text-black mb-6 tracking-tight">
            <span className="bg-gradient-to-r from-[#0090FF] via-purple-600 to-pink-600 bg-clip-text text-transparent animate-pulse">
              DECENTRALIZED
            </span>
            <br />
            <span className="text-black font-black" style={{ 
              fontFamily: 'monospace',
              textShadow: '2px 2px 0px #0090FF, 4px 4px 0px #8B5CF6',
              letterSpacing: '0.1em'
            }}>
              DATA MARKETPLACE
            </span>
          </h1>
          <p className="text-xl text-[#0090FF] mb-8 max-w-3xl mx-auto font-medium">
            Privacy-preserving queries on encrypted datasets. Sell insights, not raw data.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <button className="bg-gradient-to-r from-[#0090FF] to-[#8B5CF6] text-white px-10 py-4 rounded-full text-lg font-bold hover:shadow-2xl hover:scale-110 transition-all duration-300 transform relative overflow-hidden group">
              <span className="relative z-10">🚀 Start Selling Data</span>
              <div className="absolute inset-0 bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
            <button className="border-2 border-[#0090FF] text-[#0090FF] px-10 py-4 rounded-full text-lg font-bold hover:bg-[#0090FF] hover:text-white hover:scale-110 transition-all duration-300 transform relative overflow-hidden group">
              <span className="relative z-10">🔍 Browse Datasets</span>
              <div className="absolute inset-0 bg-[#0090FF] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 relative">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%230090FF%22%20fill-opacity%3D%220.05%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-black text-black mb-4" style={{ 
              fontFamily: 'monospace',
              textShadow: '3px 3px 0px #0090FF, 6px 6px 0px #8B5CF6',
              letterSpacing: '0.05em'
            }}>
              WHY DATACLOUD?
            </h2>
            <p className="text-xl bg-gradient-to-r from-[#0090FF] to-[#8B5CF6] bg-clip-text text-transparent font-bold">Privacy-first data monetization</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-white to-blue-50 p-8 rounded-3xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-500 border border-blue-100/50 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-[#0090FF]/20 to-[#8B5CF6]/20 rounded-full blur-xl"></div>
              <div className="w-16 h-16 bg-gradient-to-br from-[#0090FF] to-[#8B5CF6] rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:rotate-12 transition-transform duration-300">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-black mb-4" style={{ 
                fontFamily: 'monospace',
                textShadow: '1px 1px 0px #0090FF',
                letterSpacing: '0.05em'
              }}>
                PRIVACY-PRESERVING
              </h3>
              <p className="text-gray-600 text-lg">Your raw data never leaves your control. Only query results are shared.</p>
            </div>

            <div className="bg-gradient-to-br from-white to-purple-50 p-8 rounded-3xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-500 border border-purple-100/50 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-[#8B5CF6]/20 to-[#EC4899]/20 rounded-full blur-xl"></div>
              <div className="w-16 h-16 bg-gradient-to-br from-[#8B5CF6] to-[#EC4899] rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:rotate-12 transition-transform duration-300">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-black mb-4" style={{ 
                fontFamily: 'monospace',
                textShadow: '1px 1px 0px #8B5CF6',
                letterSpacing: '0.05em'
              }}>
                CRYPTO VERIFIED
              </h3>
              <p className="text-gray-600 text-lg">PDP proofs ensure your data exists and is stored as claimed.</p>
            </div>

            <div className="bg-gradient-to-br from-white to-pink-50 p-8 rounded-3xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-500 border border-pink-100/50 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-[#EC4899]/20 to-[#F59E0B]/20 rounded-full blur-xl"></div>
              <div className="w-16 h-16 bg-gradient-to-br from-[#EC4899] to-[#F59E0B] rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:rotate-12 transition-transform duration-300">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-black mb-4" style={{ 
                fontFamily: 'monospace',
                textShadow: '1px 1px 0px #EC4899',
                letterSpacing: '0.05em'
              }}>
                DECENTRALIZED
              </h3>
              <p className="text-gray-600 text-lg">Built on Filecoin and IPFS for truly decentralized data storage.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-gradient-to-br from-white via-purple-50 to-blue-50 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2240%22%20height%3D%2240%22%20viewBox%3D%220%200%2040%2040%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22%238B5CF6%22%20fill-opacity%3D%220.03%22%3E%3Cpath%20d%3D%22M20%2020c0-11.046-8.954-20-20-20v20h20z%22/%3E%3C/g%3E%3C/svg%3E')] opacity-60"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-black text-black mb-4" style={{ 
              fontFamily: 'monospace',
              textShadow: '3px 3px 0px #8B5CF6, 6px 6px 0px #EC4899',
              letterSpacing: '0.05em'
            }}>
              HOW IT WORKS
            </h2>
            <p className="text-xl bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] bg-clip-text text-transparent font-bold">Simple steps to monetize your data</p>
          </div>

          <div className="grid md:grid-cols-2 gap-16 items-start">
            <div className="bg-gradient-to-br from-white to-blue-50 p-8 rounded-3xl shadow-2xl border border-blue-100/50">
              <h3 className="text-3xl font-bold text-black mb-8 text-center" style={{ 
                fontFamily: 'monospace',
                textShadow: '2px 2px 0px #0090FF',
                letterSpacing: '0.05em'
              }}>
                FOR DATA SELLERS
              </h3>
              <div className="space-y-8">
                <div className="flex items-start group">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#0090FF] to-[#8B5CF6] text-white rounded-2xl flex items-center justify-center text-lg font-bold mr-6 mt-1 shadow-lg group-hover:scale-110 transition-transform duration-300">1</div>
                  <div className="bg-white/50 p-4 rounded-2xl flex-1">
                    <h4 className="font-bold text-black mb-2 text-lg">Upload & Encrypt</h4>
                    <p className="text-gray-600">Upload your dataset to Filecoin and IPFS with encryption</p>
                  </div>
                </div>
                <div className="flex items-start group">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#8B5CF6] to-[#EC4899] text-white rounded-2xl flex items-center justify-center text-lg font-bold mr-6 mt-1 shadow-lg group-hover:scale-110 transition-transform duration-300">2</div>
                  <div className="bg-white/50 p-4 rounded-2xl flex-1">
                    <h4 className="font-bold text-black mb-2 text-lg">Define Queries</h4>
                    <p className="text-gray-600">Set up allowed computations and pricing for your data</p>
                  </div>
                </div>
                <div className="flex items-start group">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#EC4899] to-[#F59E0B] text-white rounded-2xl flex items-center justify-center text-lg font-bold mr-6 mt-1 shadow-lg group-hover:scale-110 transition-transform duration-300">3</div>
                  <div className="bg-white/50 p-4 rounded-2xl flex-1">
                    <h4 className="font-bold text-black mb-2 text-lg">Earn Revenue</h4>
                    <p className="text-gray-600">Get paid for each query while keeping your data private</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-white to-purple-50 p-8 rounded-3xl shadow-2xl border border-purple-100/50">
              <h3 className="text-3xl font-bold text-black mb-8 text-center" style={{ 
                fontFamily: 'monospace',
                textShadow: '2px 2px 0px #8B5CF6',
                letterSpacing: '0.05em'
              }}>
                FOR DATA BUYERS
              </h3>
              <div className="space-y-8">
                <div className="flex items-start group">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#0090FF] to-[#8B5CF6] text-white rounded-2xl flex items-center justify-center text-lg font-bold mr-6 mt-1 shadow-lg group-hover:scale-110 transition-transform duration-300">1</div>
                  <div className="bg-white/50 p-4 rounded-2xl flex-1">
                    <h4 className="font-bold text-black mb-2 text-lg">Discover Datasets</h4>
                    <p className="text-gray-600">Browse available datasets by metadata and schema</p>
                  </div>
                </div>
                <div className="flex items-start group">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#8B5CF6] to-[#EC4899] text-white rounded-2xl flex items-center justify-center text-lg font-bold mr-6 mt-1 shadow-lg group-hover:scale-110 transition-transform duration-300">2</div>
                  <div className="bg-white/50 p-4 rounded-2xl flex-1">
                    <h4 className="font-bold text-black mb-2 text-lg">Submit Queries</h4>
                    <p className="text-gray-600">Configure and pay for specific analytics or ML queries</p>
                  </div>
                </div>
                <div className="flex items-start group">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#EC4899] to-[#F59E0B] text-white rounded-2xl flex items-center justify-center text-lg font-bold mr-6 mt-1 shadow-lg group-hover:scale-110 transition-transform duration-300">3</div>
                  <div className="bg-white/50 p-4 rounded-2xl flex-1">
                    <h4 className="font-bold text-black mb-2 text-lg">Get Results</h4>
                    <p className="text-gray-600">Receive verified results without accessing raw data</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-[#0090FF] via-[#8B5CF6] to-[#EC4899] relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22white%22%20fill-opacity%3D%220.1%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%224%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50"></div>
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8 relative z-10">
          <h2 className="text-5xl font-black text-white mb-6" style={{ 
            fontFamily: 'monospace',
            textShadow: '3px 3px 0px rgba(0,0,0,0.3), 6px 6px 0px rgba(0,0,0,0.2)',
            letterSpacing: '0.05em'
          }}>
            READY TO GET STARTED?
          </h2>
          <p className="text-xl text-white mb-8 opacity-90 font-medium">
            Join the future of privacy-preserving data marketplaces
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <button className="bg-white text-[#0090FF] px-10 py-4 rounded-full text-lg font-bold hover:bg-gray-100 hover:scale-110 transition-all duration-300 transform shadow-2xl">
              🚀 Start Building
            </button>
            <button className="border-2 border-white text-white px-10 py-4 rounded-full text-lg font-bold hover:bg-white hover:text-[#0090FF] hover:scale-110 transition-all duration-300 transform">
              📚 View Documentation
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <h3 className="text-xl font-bold bg-gradient-to-r from-[#0090FF] to-[#8B5CF6] bg-clip-text text-transparent">
                DataCloud
              </h3>
            </div>
            <div className="flex space-x-6 text-sm">
              <a href="#" className="text-gray-600 hover:text-[#0090FF] transition-colors">Features</a>
              <a href="#" className="text-gray-600 hover:text-[#0090FF] transition-colors">Docs</a>
              <a href="#" className="text-gray-600 hover:text-[#0090FF] transition-colors">Community</a>
              <a href="#" className="text-gray-600 hover:text-[#0090FF] transition-colors">GitHub</a>
            </div>
          </div>
          <div className="border-t border-gray-100 mt-6 pt-6 text-center">
            <p className="text-gray-500 text-sm">&copy; 2024 DataCloud. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
