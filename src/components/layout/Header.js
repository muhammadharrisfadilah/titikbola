// ========================================
// HEADER COMPONENT
// Netflix-style header with scroll effect
// ========================================

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-background shadow-lg' : 'bg-transparent'
      }`}
    >
      <div className="container-custom">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="text-3xl sm:text-4xl group-hover:scale-110 transition-transform duration-300">
              ⚽
            </div>
            <span className="text-accent-red text-xl sm:text-2xl font-bold">
              TitikBola
            </span>
          </Link>
          
          {/* Navigation */}
          <nav className="hidden sm:flex items-center gap-6">
            <Link 
              href="/"
              className="text-text-primary hover:text-accent-red transition-colors duration-200 font-medium"
            >
              Beranda
            </Link>
            <Link 
              href="/#jadwal"
              className="text-text-primary hover:text-accent-red transition-colors duration-200 font-medium"
            >
              Jadwal
            </Link>
          </nav>
          
          {/* Admin link (hidden on mobile) */}
          <Link
            href="/admin/login"
            className="hidden sm:flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors duration-200"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="text-sm">Admin</span>
          </Link>
        </div>
      </div>
    </header>
  );
}