'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="border-b border-gray-800 backdrop-blur-sm bg-black/80 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-blue-500 hover:text-blue-400 transition-colors">
              DataCloud
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link href="/marketplace" className="text-white hover:text-blue-400 transition-colors">
              Marketplace
            </Link>
            <Link href="/datasets" className="text-white hover:text-blue-400 transition-colors">
              Datasets
            </Link>
            <Link href="/sellers" className="text-white hover:text-blue-400 transition-colors">
              For Sellers
            </Link>
            <Link href="/buyers" className="text-white hover:text-blue-400 transition-colors">
              For Buyers
            </Link>
            <Link href="/docs" className="text-white hover:text-blue-400 transition-colors">
              Docs
            </Link>
          </nav>

          {/* Connect Wallet Button */}
          <div className="hidden md:flex items-center space-x-4">
            <button className="text-gray-300 hover:text-white transition-colors">
              Connect Wallet
            </button>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors">
              Launch App
            </button>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-white hover:text-blue-400 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-gray-800">
            <div className="flex flex-col space-y-4">
              <Link href="/marketplace" className="text-white hover:text-blue-400 transition-colors">
                Marketplace
              </Link>
              <Link href="/datasets" className="text-white hover:text-blue-400 transition-colors">
                Datasets
              </Link>
              <Link href="/sellers" className="text-white hover:text-blue-400 transition-colors">
                For Sellers
              </Link>
              <Link href="/buyers" className="text-white hover:text-blue-400 transition-colors">
                For Buyers
              </Link>
              <Link href="/docs" className="text-white hover:text-blue-400 transition-colors">
                Docs
              </Link>
              <div className="flex flex-col space-y-2 pt-4 border-t border-gray-800">
                <button className="text-gray-300 hover:text-white transition-colors text-left">
                  Connect Wallet
                </button>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors text-left">
                  Launch App
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
