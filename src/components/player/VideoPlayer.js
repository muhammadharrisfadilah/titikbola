// ========================================
// VIDEO PLAYER COMPONENT
// HLS.js + P2P integration
// ========================================

'use client';

import { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';
import { createSecureStreamUrl } from '@/lib/player/token-generator';
import { getProxyBalancer } from '@/lib/cloudflare/proxy-balancer';
import { PLAYER_CONFIG } from '@/lib/utils/constants';

export default function VideoPlayer({ matchId, matchData, onError, onSuccess }) {
  const videoRef = useRef(null);
  const hlsRef = useRef(null);
  const [currentLink, setCurrentLink] = useState('link1');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const [stallRecoveryCount, setStallRecoveryCount] = useState(0);
  
  const balancer = getProxyBalancer();
  
  // Cleanup function
  const cleanup = () => {
    if (hlsRef.current) {
      try {
        hlsRef.current.destroy();
        hlsRef.current = null;
      } catch (e) {
        console.warn('HLS cleanup error:', e);
      }
    }
  };
  
  // Initialize HLS player
  const initPlayer = async (linkId) => {
    try {
      setLoading(true);
      setError(null);
      setCurrentLink(linkId);
      
      cleanup();
      
      const linkNum = linkId.slice(-1);
      const streamUrl = matchData[`stream_url${linkNum}`];
      
      if (!streamUrl) {
        throw new Error('Stream URL not available');
      }
      
      console.log('🎬 Initializing player for', linkId);
      
      // Get best worker
      const worker = balancer.selectWorker();
      
      // Create secure manifest URL
      const manifestUrl = await createSecureStreamUrl(
        worker.url,
        '/api/stream/manifest',
        matchId,
        linkId
      );
      
      if (Hls.isSupported()) {
        const hls = new Hls({
          debug: false,
          enableWorker: true,
          lowLatencyMode: false,
          backBufferLength: 30,
          maxBufferLength: PLAYER_CONFIG.MAX_BUFFER_LENGTH,
          maxMaxBufferLength: 90,
          maxBufferSize: PLAYER_CONFIG.MAX_BUFFER_SIZE,
          maxBufferHole: 0.5,
          manifestLoadingTimeOut: 15000,
          manifestLoadingMaxRetry: 3,
          levelLoadingTimeOut: 15000,
          fragLoadingTimeOut: 20000,
          fragLoadingMaxRetry: 4,
          capLevelToPlayerSize: true,
          autoStartLoad: true,
          startLevel: -1,
          abrEwmaDefaultEstimate: 500000,
          abrEwmaSlowLive: 9.0,
          abrEwmaFastLive: 3.0,
        });
        
        hlsRef.current = hls;
        
        hls.loadSource(manifestUrl);
        hls.attachMedia(videoRef.current);
        
        // Attempt autoplay
        videoRef.current.play().catch(e => {
          console.log('Autoplay prevented:', e.message);
        });
        
        // Manifest parsed
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          console.log('✅ Manifest loaded');
          
          // Set initial quality
          if (hls.levels.length > 0) {
            const midLevel = Math.floor(hls.levels.length / 2);
            hls.startLevel = Math.max(0, midLevel - 1);
          }
          
          setStallRecoveryCount(0);
          setRetryCount(0);
          setLoading(false);
          
          videoRef.current.play().catch(e => {
            console.log('Play after manifest:', e.message);
          });
          
          if (onSuccess) onSuccess(linkId);
        });
        
        // Error handling
        hls.on(Hls.Events.ERROR, (event, data) => {
          console.error('❌ HLS Error:', data.type, data.details);
          
          // Token rejected
          if (data.response && data.response.code === 403) {
            setError('Token keamanan ditolak. Refresh halaman.');
            if (onError) onError('Token rejected', data);
            return;
          }
          
          // Server full
          if (data.response && data.response.code === 503) {
            setError('Server penuh. Coba link alternatif.');
            if (onError) onError('Server full', data);
            return;
          }
          
          // Buffer stall
          if (data.details === Hls.ErrorDetails.BUFFER_STALLED_ERROR) {
            setStallRecoveryCount(prev => prev + 1);
            
            const video = videoRef.current;
            const buffered = video.buffered;
            let bufferLength = 0;
            
            for (let i = 0; i < buffered.length; i++) {
              if (video.currentTime >= buffered.start(i) && video.currentTime < buffered.end(i)) {
                bufferLength = buffered.end(i) - video.currentTime;
                break;
              }
            }
            
            console.warn(`⚠️ Buffer stall #${stallRecoveryCount + 1}/${PLAYER_CONFIG.MAX_STALL_RECOVERIES}`);
            
            if (bufferLength < 0.1 && stallRecoveryCount >= PLAYER_CONFIG.MAX_STALL_RECOVERIES - 1) {
              console.error('🔄 Persistent stall, switching link...');
              setError('Stream tidak stabil. Beralih ke link alternatif...');
              setTimeout(() => tryAlternativeLink(), 2000);
              return;
            }
            
            // Try recovery
            if (hls.currentLevel > 0) {
              hls.currentLevel = 0;
            }
            hls.startLoad(Math.max(0, video.currentTime - 2));
            
            setTimeout(() => {
              if (video.paused) {
                video.play().catch(e => console.log('Play after stall:', e.message));
              }
            }, 2000);
            
            return;
          }
          
          // Media error recovery
          if (data.type === Hls.ErrorTypes.MEDIA_ERROR) {
            console.warn('🔧 Media error, attempting recovery...');
            setLoading(true);
            hls.recoverMediaError();
            return;
          }
          
          // Fatal errors
          if (data.fatal) {
            if (data.type === Hls.ErrorTypes.NETWORK_ERROR) {
              if (retryCount < PLAYER_CONFIG.MAX_RETRIES) {
                console.log(`🔄 Retry ${retryCount + 1}/${PLAYER_CONFIG.MAX_RETRIES}`);
                setRetryCount(prev => prev + 1);
                setTimeout(() => hls.startLoad(), 2000);
              } else {
                setError('Koneksi gagal. Coba link alternatif.');
                setTimeout(() => tryAlternativeLink(), 3000);
              }
            } else {
              setError('Stream error. Coba link alternatif.');
              setTimeout(() => tryAlternativeLink(), 3000);
            }
          }
        });
        
      } else if (videoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
        // Native HLS (Safari)
        videoRef.current.src = manifestUrl;
        videoRef.current.play().catch(e => console.log('Autoplay:', e.message));
        
        videoRef.current.addEventListener('loadedmetadata', () => {
          setLoading(false);
          if (onSuccess) onSuccess(linkId);
        });
        
        videoRef.current.addEventListener('error', () => {
          setError('Stream gagal. Coba link alternatif.');
          setTimeout(() => tryAlternativeLink(), 3000);
        });
      } else {
        setError('Browser tidak support HLS streaming');
      }
      
    } catch (err) {
      console.error('Player init error:', err);
      setError(err.message || 'Gagal memulai player');
      setLoading(false);
      if (onError) onError('Init error', err);
    }
  };
  
  // Try alternative link
  const tryAlternativeLink = () => {
    const links = ['link1', 'link2', 'link3'];
    const currentIndex = links.indexOf(currentLink);
    
    for (let i = 1; i <= links.length; i++) {
      const nextIndex = (currentIndex + i) % links.length;
      const nextLink = links[nextIndex];
      const linkNum = nextLink.slice(-1);
      const streamUrl = matchData[`stream_url${linkNum}`];
      
      if (streamUrl && nextLink !== currentLink) {
        console.log('🔄 Switching to', nextLink);
        setRetryCount(0);
        setStallRecoveryCount(0);
        initPlayer(nextLink);
        return;
      }
    }
    
    setError('Semua link gagal. Refresh halaman.');
  };
  
  // Initialize on mount
  useEffect(() => {
    if (matchData && matchId) {
      // Start health checking
      balancer.startHealthCheck();
      
      // Init player
      initPlayer(currentLink);
    }
    
    return () => {
      cleanup();
      balancer.stopHealthCheck();
    };
  }, [matchId]);
  
  // Video event handlers
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    
    const handleWaiting = () => {
      console.log('⏳ Buffering...');
      setLoading(true);
    };
    
    const handlePlaying = () => {
      console.log('▶️ Playing');
      setLoading(false);
    };
    
    const handlePause = () => {
      console.log('⏸️ Paused');
    };
    
    const handleContextMenu = (e) => {
      e.preventDefault();
    };
    
    video.addEventListener('waiting', handleWaiting);
    video.addEventListener('playing', handlePlaying);
    video.addEventListener('pause', handlePause);
    video.addEventListener('contextmenu', handleContextMenu);
    
    return () => {
      video.removeEventListener('waiting', handleWaiting);
      video.removeEventListener('playing', handlePlaying);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('contextmenu', handleContextMenu);
    };
  }, []);
  
  // Manual link switch
  const switchLink = (linkId) => {
    if (linkId !== currentLink) {
      setRetryCount(0);
      setStallRecoveryCount(0);
      initPlayer(linkId);
    }
  };
  
  return (
    <div className="relative bg-black rounded-lg overflow-hidden shadow-player">
      {/* Video element */}
      <video
        ref={videoRef}
        className="w-full aspect-video"
        controls
        autoPlay
        playsInline
        muted
      />
      
      {/* Loading overlay */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/70">
          <div className="text-center">
            <div className="spinner mb-4" />
            <p className="text-white">Memuat streaming...</p>
          </div>
        </div>
      )}
      
      {/* Error overlay */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/90">
          <div className="text-center max-w-md p-6">
            <svg className="w-16 h-16 text-accent-red mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" strokeWidth={2} />
              <line x1="15" y1="9" x2="9" y2="15" strokeWidth={2} />
              <line x1="9" y1="9" x2="15" y2="15" strokeWidth={2} />
            </svg>
            <h3 className="text-white text-xl font-bold mb-2">Stream Error</h3>
            <p className="text-text-secondary mb-4">{error}</p>
            <button
              onClick={() => initPlayer(currentLink)}
              className="btn-primary"
            >
              Coba Lagi
            </button>
          </div>
        </div>
      )}
      
      {/* Link switcher */}
      <div className="absolute bottom-4 left-4 right-4 flex gap-2 justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
        {['link1', 'link2', 'link3'].map(linkId => {
          const linkNum = linkId.slice(-1);
          const streamUrl = matchData?.[`stream_url${linkNum}`];
          
          if (!streamUrl) return null;
          
          return (
            <button
              key={linkId}
              onClick={() => switchLink(linkId)}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                currentLink === linkId
                  ? 'bg-accent-red text-white'
                  : 'bg-black/70 text-white hover:bg-black/90'
              }`}
            >
              Link {linkNum}
            </button>
          );
        })}
      </div>
    </div>
  );
}