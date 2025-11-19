// ========================================
// HERO SECTION COMPONENT
// Large featured match display (Netflix-style)
// ========================================

'use client';

import Link from 'next/link';
import { MATCH_STATUS } from '@/lib/utils/constants';

export default function HeroSection({ featuredMatch }) {
  if (!featuredMatch) {
    return (
      <div className="relative h-[50vh] min-h-[400px] bg-background-light flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">⚽</div>
          <h2 className="text-2xl text-text-primary font-bold mb-2">
            Belum Ada Pertandingan Live
          </h2>
          <p className="text-text-secondary">
            Segera hadir pertandingan menarik!
          </p>
        </div>
      </div>
    );
  }
  
  const isLive = featuredMatch.status === MATCH_STATUS.LIVE;
  const thumbnail = featuredMatch.thumbnail_url || '/images/hero-bg.jpg';
  
  return (
    <div className="relative h-[50vh] min-h-[400px] max-h-[600px] overflow-hidden">
      {/* Background image with overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${thumbnail})` }}
      >
        <div className="absolute inset-0 bg-gradient-dark" />
      </div>
      
      {/* Content */}
      <div className="relative h-full flex items-center">
        <div className="container-custom">
          <div className="max-w-2xl">
            {/* Live indicator */}
            {isLive && (
              <div className="inline-flex items-center gap-2 bg-status-live px-4 py-2 rounded-full mb-4 animate-pulse">
                <span className="w-3 h-3 bg-white rounded-full" />
                <span className="text-white font-bold text-sm">
                  LIVE SEKARANG
                </span>
              </div>
            )}
            
            {/* Competition badge */}
            <div className="text-accent-red font-semibold mb-2 text-lg">
              🏆 {featuredMatch.competition}
            </div>
            
            {/* Match title */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4 text-shadow">
              {featuredMatch.home_flag} {featuredMatch.home_team}
              <span className="text-accent-red mx-4">VS</span>
              {featuredMatch.away_team} {featuredMatch.away_flag}
            </h1>
            
            {/* Score (if live) */}
            {isLive && (
              <div className="text-3xl font-bold text-white mb-4 text-shadow">
                {featuredMatch.home_score} - {featuredMatch.away_score}
              </div>
            )}
            
            {/* Match info */}
            <div className="flex items-center gap-6 text-text-secondary mb-6 text-lg">
              <span className="flex items-center gap-2">
                📅 {featuredMatch.match_date}
              </span>
              <span className="flex items-center gap-2">
                🕐 {featuredMatch.match_time}
              </span>
              {isLive && (
                <span className="flex items-center gap-2 text-status-success">
                  👁️ 4,234 menonton
                </span>
              )}
            </div>
            
            {/* CTA Button */}
            <Link 
              href={`/match/${featuredMatch.id}`}
              className="inline-flex items-center gap-3 bg-accent-red hover:bg-accent-red-hover text-white font-bold px-8 py-4 rounded-lg text-lg transition-all duration-200 transform hover:scale-105 shadow-glow-red"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
              </svg>
              {isLive ? 'TONTON SEKARANG' : 'LIHAT DETAIL'}
            </Link>
          </div>
        </div>
      </div>
      
      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </div>
  );
}