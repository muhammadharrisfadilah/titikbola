// ========================================
// MATCH INFO BAR COMPONENT
// Display match details above player
// ========================================

'use client';

import { MATCH_STATUS } from '@/lib/utils/constants';

export default function MatchInfo({ match }) {
  if (!match) return null;
  
  const isLive = match.status === MATCH_STATUS.LIVE;
  
  return (
    <div className="bg-background-card rounded-lg p-4 mb-4">
      <div className="flex items-center justify-between flex-wrap gap-4">
        {/* Teams and score */}
        <div className="flex items-center gap-4 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-3xl">{match.home_flag}</span>
            <span className="text-text-primary font-semibold text-lg">
              {match.home_team}
            </span>
          </div>
          
          <div className="text-accent-red font-bold text-2xl px-4">
            {match.home_score} - {match.away_score}
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-text-primary font-semibold text-lg">
              {match.away_team}
            </span>
            <span className="text-3xl">{match.away_flag}</span>
          </div>
        </div>
        
        {/* Competition and status */}
        <div className="flex items-center gap-4">
          <div className="text-text-secondary text-sm">
            🏆 {match.competition}
          </div>
          
          {isLive && (
            <div className="flex items-center gap-2 bg-status-live px-3 py-1 rounded-full animate-pulse">
              <span className="w-2 h-2 bg-white rounded-full" />
              <span className="text-white font-bold text-xs">LIVE</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}