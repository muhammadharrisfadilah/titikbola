// ========================================
// HOMEPAGE
// Main landing page with match carousels
// ========================================

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/home/HeroSection';
import MatchCarousel from '@/components/home/MatchCarousel';
import FeaturesGrid from '@/components/home/FeaturesGrid';
import { API_CONFIG } from '@/lib/utils/constants';

async function getMatches() {
  try {
    // Fetch from first available worker
    const workerUrl = API_CONFIG.WORKERS[0];
    const response = await fetch(`${workerUrl}/api/matches`, {
      next: { revalidate: 30 }, // Revalidate every 30 seconds
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch matches');
    }
    
    const data = await response.json();
    return data.matches || [];
  } catch (error) {
    console.error('Error fetching matches:', error);
    return [];
  }
}

export default async function HomePage() {
  const matches = await getMatches();
  
  // Categorize matches
  const liveMatches = matches.filter(m => m.status === 'live');
  const upcomingMatches = matches.filter(m => m.status === 'upcoming');
  
  // Featured match (first live or first upcoming)
  const featuredMatch = liveMatches[0] || upcomingMatches[0] || null;
  
  // Sort upcoming by date
  upcomingMatches.sort((a, b) => {
    const dateA = new Date(`${a.match_date} ${a.match_time}`);
    const dateB = new Date(`${b.match_date} ${b.match_time}`);
    return dateA - dateB;
  });
  
  // Separate today and later
  const today = new Date().toISOString().split('T')[0];
  const todayMatches = upcomingMatches.filter(m => m.match_date === today);
  const laterMatches = upcomingMatches.filter(m => m.match_date > today);
  
  return (
    <>
      <Header />
      
      <main className="min-h-screen bg-background pt-16 sm:pt-20">
        {/* Hero Section */}
        <HeroSection featuredMatch={featuredMatch} />
        
        {/* Live Matches */}
        {liveMatches.length > 0 && (
          <section className="py-8">
            <MatchCarousel 
              title="🔴 Live Sekarang" 
              matches={liveMatches}
            />
          </section>
        )}
        
        {/* Today's Matches */}
        {todayMatches.length > 0 && (
          <section className="py-8">
            <MatchCarousel 
              title="📅 Pertandingan Hari Ini" 
              matches={todayMatches}
            />
          </section>
        )}
        
        {/* Upcoming Matches */}
        {laterMatches.length > 0 && (
          <section className="py-8">
            <MatchCarousel 
              title="🔜 Segera Hadir" 
              matches={laterMatches}
            />
          </section>
        )}
        
        {/* No matches message */}
        {matches.length === 0 && (
          <section className="py-16">
            <div className="container-custom text-center">
              <div className="text-6xl mb-4">⚽</div>
              <h2 className="text-2xl font-bold text-text-primary mb-2">
                Belum Ada Pertandingan Tersedia
              </h2>
              <p className="text-text-secondary">
                Segera hadir pertandingan menarik! Pantau terus TitikBola.
              </p>
            </div>
          </section>
        )}
        
        {/* Features Section */}
        <FeaturesGrid />
        
        {/* CTA Section */}
        <section className="py-16 bg-background-light">
          <div className="container-custom text-center">
            <h2 className="text-3xl font-bold text-text-primary mb-4">
              Jangan Sampai Ketinggalan!
            </h2>
            <p className="text-text-secondary mb-8 max-w-2xl mx-auto">
              Gabung channel Telegram kami untuk mendapatkan notifikasi pertandingan dan link streaming terbaru
            </p>
            <a 
              href="https://t.me/titikbola_livesport"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-accent-red hover:bg-accent-red-hover text-white font-bold px-8 py-4 rounded-lg text-lg transition-all duration-200 transform hover:scale-105"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/>
              </svg>
              Gabung Telegram
            </a>
          </div>
        </section>
      </main>
      
      <Footer />
    </>
  );
}