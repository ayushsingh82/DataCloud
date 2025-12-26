'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="border-b border-gray-200 sticky top-0 z-50 bg-white relative overflow-hidden">
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
        <div className="flex justify-between items-center py-6">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-black hover:text-[#0090FF] transition-colors">
              DataCloud
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link href="/marketplace" className="text-black hover:text-[#0090FF] transition-colors">
              Marketplace
            </Link>
            <Link href="/datasets" className="text-black hover:text-[#0090FF] transition-colors">
              Datasets
            </Link>
            <Link href="/sellers" className="text-black hover:text-[#0090FF] transition-colors">
              For Sellers
            </Link>
            <Link href="/buyers" className="text-black hover:text-[#0090FF] transition-colors">
              For Buyers
            </Link>
          </nav>

          {/* Connect Wallet Button */}
          <div className="hidden md:flex items-center space-x-4">
            <button className="bg-[#0090FF] hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors font-semibold">
              Connect Wallet
            </button>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-black hover:text-[#0090FF] transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-4">
              <Link href="/marketplace" className="text-black hover:text-[#0090FF] transition-colors">
                Marketplace
              </Link>
              <Link href="/datasets" className="text-black hover:text-[#0090FF] transition-colors">
                Datasets
              </Link>
              <Link href="/sellers" className="text-black hover:text-[#0090FF] transition-colors">
                For Sellers
              </Link>
              <Link href="/buyers" className="text-black hover:text-[#0090FF] transition-colors">
                For Buyers
              </Link>
              <div className="pt-4 border-t border-gray-200">
                <button className="bg-[#0090FF] hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors text-left w-full font-semibold">
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
