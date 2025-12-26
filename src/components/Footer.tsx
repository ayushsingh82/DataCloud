import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 py-12 relative overflow-hidden">
      {/* Light Sky Blue Glow */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none" 
        style={{
          backgroundImage: `
            radial-gradient(circle at center, #93c5fd, transparent)
          `,
        }} 
      />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <h3 className="text-xl font-bold text-[#0090FF] mb-4">DataCloud</h3>
            <p className="text-gray-600 text-sm">
              Privacy-preserving decentralized data marketplace powered by Filecoin and Synapse SDK.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-semibold text-black mb-4">Product</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/marketplace" className="text-gray-600 hover:text-[#0090FF] transition-colors">
                  Marketplace
                </Link>
              </li>
              <li>
                <Link href="/datasets" className="text-gray-600 hover:text-[#0090FF] transition-colors">
                  Browse Datasets
                </Link>
              </li>
              <li>
                <Link href="/sellers" className="text-gray-600 hover:text-[#0090FF] transition-colors">
                  Sell Data
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-gray-600 hover:text-[#0090FF] transition-colors">
                  Pricing
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold text-black mb-4">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/docs" className="text-gray-600 hover:text-[#0090FF] transition-colors">
                  Documentation
                </Link>
              </li>
              <li>
                <Link href="/api" className="text-gray-600 hover:text-[#0090FF] transition-colors">
                  API Reference
                </Link>
              </li>
              <li>
                <Link href="/tutorials" className="text-gray-600 hover:text-[#0090FF] transition-colors">
                  Tutorials
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-600 hover:text-[#0090FF] transition-colors">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="font-semibold text-black mb-4">Connect</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="https://twitter.com/datacloud" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-[#0090FF] transition-colors">
                  Twitter
                </a>
              </li>
              <li>
                <a href="https://discord.gg/datacloud" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-[#0090FF] transition-colors">
                  Discord
                </a>
              </li>
              <li>
                <a href="https://github.com/datacloud" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-[#0090FF] transition-colors">
                  GitHub
                </a>
              </li>
              <li>
                <Link href="/contact" className="text-gray-600 hover:text-[#0090FF] transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-200 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-600 text-sm">
            &copy; 2024 DataCloud. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="/privacy" className="text-gray-600 hover:text-gray-800 text-sm transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-gray-600 hover:text-gray-800 text-sm transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
