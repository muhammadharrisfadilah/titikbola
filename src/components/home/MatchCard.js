// ========================================
// MATCH CARD COMPONENT
// Netflix-style match card with hover effects
// ========================================

'use client';

import Link from 'next/link';
import { MATCH_STATUS } from '@/lib/utils/constants';

export default function MatchCard({ match }) {
  const isLive = match.status === MATCH_STATUS.LIVE;
  const isUpcoming = match.status === MATCH_STATUS.UPCOMING;
  const isEnded = match.status === MATCH_STATUS.ENDED;
  
  const thumbnail = match.thumbnail_url || '/images/placeholder-match.jpg';
  const score = (isLive || isEnded) ? `${match.home_score} - ${match.away_score}` : 'VS';
  
  // Status badge styling
  let statusClass = '';
  let statusText = '';
  
  if (isLive) {
    statusClass = 'bg-status-live text-white';
    statusText = '🔴 LIVE';
  } else if (isUpcoming) {
    statusClass = 'bg-status-warning text-white';
    statusText = '🔜 Upcoming';
  } else if (isEnded) {
    statusClass = 'bg-text-muted text-white';
    statusText = '⚫ Ended';
  }
  
  // Disable link if ended
  const CardWrapper = isEnded ? 'div' : Link;
  const cardProps = isEnded ? {} : { href: `/match/${match.id}` };
  
  return (
    <CardWrapper {...cardProps} className={`match-card group ${isEnded ? 'cursor-not-allowed opacity-60' : ''}`}>
      {/* Thumbnail with overlay */}
      <div className="relative aspect-video-16-9 bg-background-card rounded-t-lg overflow-hidden">
        <img 
          src={thumbnail}
          alt={`${match.home_team} vs ${match.away_team}`}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        
        {/* Status badge */}
        {statusText && (
          <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold ${statusClass} ${isLive ? 'animate-pulse' : ''}`}>
            {statusText}
          </div>
        )}
        
        {/* Teams overlay */}
        <div className="absolute inset-0 flex items-center justify-center p-4">
          <div className="text-center w-full">
            {/* Home Team */}
            <div className="flex flex-col items-center mb-2">
              <span className="text-4xl mb-1">{match.home_flag}</span>
              <span className="text-white font-semibold text-shadow text-sm sm:text-base">
                {match.home_team}
              </span>
            </div>
            
            {/* Score */}
            <div className="text-accent-red font-bold text-2xl sm:text-3xl my-2 text-shadow">
              {score}
            </div>
            
            {/* Away Team */}
            <div className="flex flex-col items-center mt-2">
              <span className="text-4xl mb-1">{match.away_flag}</span>
              <span className="text-white font-semibold text-shadow text-sm sm:text-base">
                {match.away_team}
              </span>
            </div>
          </div>
        </div>
        
        {/* Play button on hover (if not ended) */}
        {!isEnded && (
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="bg-accent-red rounded-full p-4 transform scale-90 group-hover:scale-100 transition-transform duration-300">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
              </svg>
            </div>
          </div>
        )}
      </div>
      
      {/* Info section */}
      <div className="p-4 bg-background-card rounded-b-lg">
        <div className="text-text-primary font-medium mb-2 line-clamp-1">
          {match.competition}
        </div>
        <div className="flex items-center justify-between text-sm text-text-secondary">
          <span className="flex items-center">
            📅 {match.match_date}
          </span>
          <span>
            🕐 {match.match_time}
          </span>
        </div>
      </div>
    </CardWrapper>
  );
}