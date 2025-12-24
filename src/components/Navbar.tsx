'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="border-b border-white/20 sticky top-0 z-50" style={{ backgroundColor: '#000000' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-white hover:text-[#20D55A] transition-colors">
              DataCloud
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link href="/marketplace" className="text-white hover:text-[#20D55A] transition-colors">
              Marketplace
            </Link>
            <Link href="/datasets" className="text-white hover:text-[#20D55A] transition-colors">
              Datasets
            </Link>
            <Link href="/sellers" className="text-white hover:text-[#20D55A] transition-colors">
              For Sellers
            </Link>
            <Link href="/buyers" className="text-white hover:text-[#20D55A] transition-colors">
              For Buyers
            </Link>
          </nav>

          {/* Connect Wallet Button */}
          <div className="hidden md:flex items-center space-x-4">
            <button className="bg-[#20D55A] hover:bg-green-400 text-black px-6 py-2 rounded-lg transition-colors font-semibold">
              Connect Wallet
            </button>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-white hover:text-[#20D55A] transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-white/20">
            <div className="flex flex-col space-y-4">
              <Link href="/marketplace" className="text-white hover:text-[#20D55A] transition-colors">
                Marketplace
              </Link>
              <Link href="/datasets" className="text-white hover:text-[#20D55A] transition-colors">
                Datasets
              </Link>
              <Link href="/sellers" className="text-white hover:text-[#20D55A] transition-colors">
                For Sellers
              </Link>
              <Link href="/buyers" className="text-white hover:text-[#20D55A] transition-colors">
                For Buyers
              </Link>
              <div className="pt-4 border-t border-white/20">
                <button className="bg-[#20D55A] hover:bg-green-400 text-black px-6 py-2 rounded-lg transition-colors text-left w-full font-semibold">
                  Connect Wallet
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
