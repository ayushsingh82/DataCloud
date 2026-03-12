import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-black border-t border-transparent py-12 relative overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2.5 mb-4 group">
              <svg className="w-7 h-7 text-white group-hover:text-white/70 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                {/* Cloud shape */}
                <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/>
                {/* Data nodes inside cloud */}
                <circle cx="12" cy="14" r="1.5" fill="currentColor"/>
                <circle cx="9" cy="12" r="1.5" fill="currentColor"/>
                <circle cx="15" cy="12" r="1.5" fill="currentColor"/>
                <circle cx="10.5" cy="16" r="1.5" fill="currentColor"/>
                <circle cx="13.5" cy="16" r="1.5" fill="currentColor"/>
                {/* Connection lines */}
                <line x1="12" y1="14" x2="9" y2="12" stroke="currentColor" strokeWidth="1" opacity="0.3"/>
                <line x1="12" y1="14" x2="15" y2="12" stroke="currentColor" strokeWidth="1" opacity="0.3"/>
                <line x1="12" y1="14" x2="10.5" y2="16" stroke="currentColor" strokeWidth="1" opacity="0.3"/>
                <line x1="12" y1="14" x2="13.5" y2="16" stroke="currentColor" strokeWidth="1" opacity="0.3"/>
              </svg>
              <h3 className="text-xl font-bold text-white group-hover:text-white/70 transition-colors">DataCloud</h3>
            </Link>
            <p className="text-white/70 text-sm">
              Privacy-preserving decentralized data marketplace powered by Filecoin.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-semibold text-white mb-4">Product</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/marketplace" className="text-white/70 hover:text-white transition-colors">
                  Marketplace
                </Link>
              </li>
              <li>
                <Link href="/playground" className="text-white/70 hover:text-white transition-colors">
                  Playground
                </Link>
              </li>
              <li>
                <Link href="/sellers" className="text-white/70 hover:text-white transition-colors">
                  Sell Data
                </Link>
              </li>
              <li>
                <Link href="/buyers" className="text-white/70 hover:text-white transition-colors">
                  Buy Data
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold text-white mb-4">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/docs" className="text-white/70 hover:text-white transition-colors">
                  Documentation
                </Link>
              </li>
              <li>
                <Link href="/docs" className="text-white/70 hover:text-white transition-colors">
                  API Docs
                </Link>
              </li>
              <li>
                <a href="#" target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-white transition-colors">
                  GitHub
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-white/10 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-white/70 text-sm">
            &copy; 2024 DataCloud. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="/privacy" className="text-white/70 hover:text-white text-sm transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-white/70 hover:text-white text-sm transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
