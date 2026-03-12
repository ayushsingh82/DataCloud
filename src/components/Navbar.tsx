'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="border-b border-black/10 sticky top-0 z-50 bg-[#C4FEC2] relative overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="relative">
                <svg className="w-8 h-8 text-black group-hover:text-black/70 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
              </div>
              <span className="text-2xl font-bold text-black group-hover:text-black/70 transition-colors">DataCloud</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link href="/marketplace" className="text-black hover:text-black/70 transition-colors nav-link">
              Marketplace
            </Link>
            <Link href="/playground" className="text-black hover:text-black/70 transition-colors nav-link">
              Playground
            </Link>
            <Link href="/sellers" className="text-black hover:text-black/70 transition-colors nav-link">
              Sell Data
            </Link>
            <Link href="/buyers" className="text-black hover:text-black/70 transition-colors nav-link">
              Buy Data
            </Link>
            <Link href="/docs" className="text-black hover:text-black/70 transition-colors nav-link">
              Docs
            </Link>
          </nav>

          {/* Connect Wallet Button */}
          <div className="hidden md:flex items-center space-x-4">
            <ConnectButton />
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-black hover:text-black/70 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-black/10">
            <div className="flex flex-col space-y-4">
              <Link href="/marketplace" className="text-black hover:text-black/70 transition-colors nav-link">
                Marketplace
              </Link>
              <Link href="/playground" className="text-black hover:text-black/70 transition-colors nav-link">
                Playground
              </Link>
              <Link href="/sellers" className="text-black hover:text-black/70 transition-colors nav-link">
                Sell Data
              </Link>
              <Link href="/buyers" className="text-black hover:text-black/70 transition-colors nav-link">
                Buy Data
              </Link>
              <Link href="/docs" className="text-black hover:text-black/70 transition-colors nav-link">
                Docs
              </Link>
              <div className="pt-4 border-t border-black/10">
                <ConnectButton />
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
