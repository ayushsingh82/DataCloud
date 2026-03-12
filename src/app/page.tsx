'use client';

import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

/* -------------------------------------------------------------------------- */
/*  Network visualisation (kept from original, simplified)                     */
/* -------------------------------------------------------------------------- */

function NetworkViz() {
  return (
    <div className="relative w-72 h-72 sm:w-80 sm:h-80 lg:w-96 lg:h-96 mx-auto">
      {/* Central hub */}
      <div className="absolute inset-24 bg-black rounded-full flex flex-col items-center justify-center shadow-2xl shadow-black/20 z-10">
        <svg className="w-8 h-8 text-white mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
        </svg>
        <span className="text-white font-bold text-xs">DataCloud</span>
      </div>

      {/* Orbiting nodes */}
      <div className="absolute top-6 left-6 w-14 h-14 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center animate-bounce shadow-lg">
        <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      </div>
      <div className="absolute top-10 right-10 w-11 h-11 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center animate-bounce shadow-lg" style={{ animationDelay: '0.5s' }}>
        <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      </div>
      <div className="absolute bottom-6 left-10 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center animate-bounce shadow-lg" style={{ animationDelay: '1s' }}>
        <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      <div className="absolute bottom-10 right-6 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center animate-bounce shadow-lg" style={{ animationDelay: '1.5s' }}>
        <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      </div>

      {/* Connection lines */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 320 320">
        <defs>
          <linearGradient id="lg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#000" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#000" stopOpacity="0.08" />
          </linearGradient>
        </defs>
        <line x1="72" y1="72" x2="248" y2="248" stroke="url(#lg)" strokeWidth="1.5" className="animate-pulse" />
        <line x1="248" y1="72" x2="72" y2="248" stroke="url(#lg)" strokeWidth="1.5" className="animate-pulse" style={{ animationDelay: '0.5s' }} />
        <line x1="160" y1="36" x2="160" y2="284" stroke="url(#lg)" strokeWidth="1.5" className="animate-pulse" style={{ animationDelay: '1s' }} />
        <line x1="36" y1="160" x2="284" y2="160" stroke="url(#lg)" strokeWidth="1.5" className="animate-pulse" style={{ animationDelay: '1.5s' }} />
      </svg>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Page                                                                       */
/* -------------------------------------------------------------------------- */

export default function Home() {
  return (
    <div className="min-h-screen w-full relative text-black">
      <Navbar />

      {/* ------------------------------------------------------------------ */}
      {/*  1. Hero — compact so How It Works appears on first scroll           */}
      {/* ------------------------------------------------------------------ */}
      <section className="bg-[#C4FEC2] min-h-screen flex flex-col justify-center px-4 sm:px-6 lg:px-8 pt-20 pb-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-center w-full">
          <div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-3">
              The Decentralized
              <br />
              Data Marketplace
            </h1>
            <p className="text-base sm:text-lg text-black/70 mb-5 max-w-xl">
              Buy and sell data insights on Filecoin. Privacy-preserving queries,
              cryptographic proofs, tFIL payments.
            </p>
            <div className="flex flex-col sm:flex-row gap-2.5 mb-4">
              <Link
                href="/marketplace"
                className="bg-black text-white text-center px-5 py-2.5 rounded-lg font-semibold text-sm transition-all hover:-translate-y-0.5 hover:shadow-lg"
              >
                Explore Marketplace
              </Link>
              <Link
                href="/playground"
                className="bg-white text-black text-center border border-black/30 px-5 py-2.5 rounded-lg font-semibold text-sm transition-all hover:border-black"
              >
                Try Playground
              </Link>
            </div>
            <div className="flex flex-wrap gap-2 text-xs font-medium text-black/60">
              <span className="bg-white/70 px-2 py-1 rounded-full">Built on Filecoin</span>
              <span className="bg-white/70 px-2 py-1 rounded-full">IPFS Storage</span>
              <span className="bg-white/70 px-2 py-1 rounded-full">Smart Contract Escrow</span>
            </div>
          </div>
          <div className="flex justify-center lg:justify-end">
            <NetworkViz />
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/*  2. How It Works                                                    */}
      {/* ------------------------------------------------------------------ */}
      <section className="bg-[#0a0a0a] py-16 px-4 sm:px-6 lg:px-8" id="how-it-works">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-white text-center mb-10">
            How It Works
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Sellers */}
            <div className="bg-[#141414] border border-white/10 rounded-xl p-8">
              <div className="text-3xl mb-4">&#128200;</div>
              <h3 className="text-xl font-bold text-white mb-4">For Sellers</h3>
              <ul className="space-y-3 text-white/70 text-sm leading-relaxed">
                <li className="flex gap-2"><span className="text-[#EBF73F]">&#8226;</span> Upload datasets via Lighthouse + IPFS</li>
                <li className="flex gap-2"><span className="text-[#EBF73F]">&#8226;</span> Get paid in tFIL for every query</li>
                <li className="flex gap-2"><span className="text-[#EBF73F]">&#8226;</span> Raw data is never exposed to buyers</li>
              </ul>
              <Link href="/sellers" className="inline-block mt-6 text-[#EBF73F] text-sm font-medium hover:underline">
                Start selling &rarr;
              </Link>
            </div>

            {/* Buyers */}
            <div className="bg-[#141414] border border-white/10 rounded-xl p-8">
              <div className="text-3xl mb-4">&#128269;</div>
              <h3 className="text-xl font-bold text-white mb-4">For Buyers</h3>
              <ul className="space-y-3 text-white/70 text-sm leading-relaxed">
                <li className="flex gap-2"><span className="text-[#EBF73F]">&#8226;</span> Browse datasets by category and schema</li>
                <li className="flex gap-2"><span className="text-[#EBF73F]">&#8226;</span> Pay per query with tFIL</li>
                <li className="flex gap-2"><span className="text-[#EBF73F]">&#8226;</span> Get cryptographically verified results</li>
              </ul>
              <Link href="/buyers" className="inline-block mt-6 text-[#EBF73F] text-sm font-medium hover:underline">
                Start buying &rarr;
              </Link>
            </div>

            {/* Smart Contracts */}
            <div className="bg-[#141414] border border-white/10 rounded-xl p-8">
              <div className="text-3xl mb-4">&#128279;</div>
              <h3 className="text-xl font-bold text-white mb-4">Smart Contracts</h3>
              <ul className="space-y-3 text-white/70 text-sm leading-relaxed">
                <li className="flex gap-2"><span className="text-[#EBF73F]">&#8226;</span> Escrow payments on Filecoin Calibration</li>
                <li className="flex gap-2"><span className="text-[#EBF73F]">&#8226;</span> Automatic settlement on delivery</li>
                <li className="flex gap-2"><span className="text-[#EBF73F]">&#8226;</span> On-chain cryptographic proofs</li>
              </ul>
              <Link href="/marketplace" className="inline-block mt-6 text-[#EBF73F] text-sm font-medium hover:underline">
                View contracts &rarr;
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/*  3. Stats + Use Cases + Get Started — one combined section           */}
      {/* ------------------------------------------------------------------ */}
      <section className="bg-[#C4FEC2] py-14 px-4 sm:px-6 lg:px-8 border-t border-black/10">
        <div className="max-w-6xl mx-auto">
          {/* Use Cases */}
          <div className="mb-12">
            <h2 className="text-xl font-bold text-black/80 text-center mb-6 uppercase tracking-wide">
              Use Cases
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl p-8 min-h-[180px] shadow-sm border border-black/10 flex flex-col justify-center">
                <h3 className="text-lg font-bold text-black mb-3">Financial Analytics</h3>
                <p className="text-black/70 text-base leading-relaxed">
                  Run fraud detection models on transaction data without exposing PII.
                </p>
              </div>
              <div className="bg-white rounded-xl p-8 min-h-[180px] shadow-sm border border-black/10 flex flex-col justify-center">
                <h3 className="text-lg font-bold text-black mb-3">Healthcare Research</h3>
                <p className="text-black/70 text-base leading-relaxed">
                  Train ML models on clinical data while preserving patient privacy.
                </p>
              </div>
              <div className="bg-white rounded-xl p-8 min-h-[180px] shadow-sm border border-black/10 flex flex-col justify-center">
                <h3 className="text-lg font-bold text-black mb-3">Market Intelligence</h3>
                <p className="text-black/70 text-base leading-relaxed">
                  Analyze consumer behavior across datasets from multiple providers.
                </p>
              </div>
            </div>
          </div>

          {/* Start building + 3 CTAs */}
          <div>
            <h2 className="text-xl font-bold text-black text-center mb-6">
              Start building with DataCloud
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Link
                href="/sellers"
                className="group flex flex-col items-center text-center bg-white border-2 border-black/20 rounded-xl p-5 font-semibold text-black transition-all hover:border-black hover:shadow-lg hover:-translate-y-0.5"
              >
                <span className="text-2xl mb-2" aria-hidden>📤</span>
                <span className="text-sm sm:text-base">I want to sell data</span>
                <span className="text-xs font-normal text-black/60 mt-1">Upload datasets, get paid in tFIL</span>
              </Link>
              <Link
                href="/buyers"
                className="group flex flex-col items-center text-center bg-white border-2 border-black/20 rounded-xl p-5 font-semibold text-black transition-all hover:border-black hover:shadow-lg hover:-translate-y-0.5"
              >
                <span className="text-2xl mb-2" aria-hidden>🔍</span>
                <span className="text-sm sm:text-base">I want to buy insights</span>
                <span className="text-xs font-normal text-black/60 mt-1">Run queries, get results only</span>
              </Link>
              <Link
                href="/playground"
                className="group flex flex-col items-center text-center bg-black text-white border-2 border-black rounded-xl p-5 font-semibold transition-all hover:bg-gray-800 hover:shadow-lg hover:-translate-y-0.5"
              >
                <span className="text-2xl mb-2" aria-hidden>🧪</span>
                <span className="text-sm sm:text-base">Try the playground first</span>
                <span className="text-xs font-normal text-white/80 mt-1">Explore without a wallet</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
