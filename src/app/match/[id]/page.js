// ========================================
// PLAYER PAGE
// Dynamic match streaming page
// ========================================

'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import VideoPlayer from '@/components/player/VideoPlayer';
import MatchInfo from '@/components/player/MatchInfo';
import { getProxyBalancer } from '@/lib/cloudflare/proxy-balancer';
import { MATCH_STATUS } from '@/lib/utils/constants';

export default function PlayerPage() {
  const params = useParams();
  const router = useRouter();
  const matchId = params.id;
  
  const [match, setMatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const balancer = getProxyBalancer();
  
  // Fetch match data
  useEffect(() => {
    const fetchMatch = async () => {
      try {
        setLoading(true);
        
        const worker = balancer.selectWorker();
        const response = await fetch(`${worker.url}/api/matches/${matchId}`);
        
        if (!response.ok) {
          throw new Error('Match not found');
        }
        
        const data = await response.json();
        
        if (data.error) {
          throw new Error(data.error);
        }
        
        setMatch(data.match);
        
        // Check if match is available
        if (data.match.status === MATCH_STATUS.UPCOMING) {
          setError(`Pertandingan ini belum dimulai.\nJadwal: ${data.match.match_date} ${data.match.match_time}`);
        } else if (data.match.status === MATCH_STATUS.ENDED) {
          setError(`Pertandingan telah selesai.\nSkor Akhir: ${data.match.home_score} - ${data.match.away_score}`);
        }
        
        setLoading(false);
        
      } catch (err) {
        console.error('Fetch match error:', err);
        setError(err.message || 'Gagal memuat data pertandingan');
        setLoading(false);
      }
    };
    
    if (matchId) {
      fetchMatch();
    }
  }, [matchId]);
  
  // Update page title
  useEffect(() => {
    if (match) {
      document.title = `${match.home_team} vs ${match.away_team} - TitikBola`;
    }
  }, [match]);
  
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="spinner mb-4" />
          <p className="text-text-primary">Memuat pertandingan...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <svg className="w-16 h-16 text-accent-red mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" strokeWidth={2} />
            <path d="M12 6v6m0 4h.01" strokeWidth={2} strokeLinecap="round" />
          </svg>
          <h1 className="text-2xl font-bold text-text-primary mb-2">
            Oops!
          </h1>
          <p className="text-text-secondary mb-6 whitespace-pre-line">
            {error}
          </p>
          <Link href="/" className="btn-primary">
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-background-light border-b border-background-hover">
        <div className="container-custom py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 group">
              <svg className="w-6 h-6 text-accent-red group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="text-text-primary font-medium">Kembali</span>
            </Link>
            
            <div className="flex items-center gap-2">
              <span className="text-3xl">⚽</span>
              <span className="text-accent-red text-xl font-bold">TitikBola</span>
            </div>
          </div>
        </div>
      </header>
      
      {/* Main content */}
      <main className="container-custom py-6">
        {/* Match info */}
        <MatchInfo match={match} />
        
        {/* Video player */}
        {match && match.status === MATCH_STATUS.LIVE && (
          <div className="mb-6">
            <VideoPlayer 
              matchId={matchId}
              matchData={match}
              onError={(type, data) => {
                console.error('Player error:', type, data);
              }}
              onSuccess={(linkId) => {
                console.log('Player started successfully:', linkId);
              }}
            />
          </div>
        )}
        
        {/* Telegram CTA */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-500 rounded-lg p-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/>
            </svg>
            <span className="text-white text-xl font-bold">
              JANGAN SAMPAI KETINGGALAN!
            </span>
          </div>
          <p className="text-white/90 mb-4">
            Gabung Channel Telegram Kami. Link & Jadwal Cepat!
          </p>
          <a 
            href="https://t.me/titikbola_livesport"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-white text-blue-600 font-bold px-8 py-3 rounded-lg hover:bg-blue-50 transition-colors duration-200"
          >
            Gabung Sekarang
          </a>
        </div>
        
        {/* Footer disclaimer */}
        <div className="mt-6 text-center text-text-muted text-sm">
          <p>100% Gratis untuk ditonton</p>
          <p className="mt-1">Nikmati streaming berkualitas tinggi tanpa biaya</p>
        </div>
      </main>
    </div>
  );
}