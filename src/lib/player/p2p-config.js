// ========================================
// P2P CONFIGURATION
// Setup for p2p-media-loader
// ========================================

import { P2P_CONFIG } from '@/lib/utils/constants';

/**
 * Get P2P configuration for p2p-media-loader
 */
export function getP2PConfig(matchId, linkId) {
  if (!P2P_CONFIG.ENABLED) {
    return null;
  }
  
  return {
    segments: {
      swarmId: `titikbola-${matchId}-${linkId}`,
      forwardSegmentCount: 20, // How many segments to prefetch
    },
    loader: {
      trackerAnnounce: P2P_CONFIG.TRACKER_URLS,
      
      // STUN/TURN servers for WebRTC
      rtcConfig: {
        iceServers: [
          {
            urls: 'stun:stun.l.google.com:19302',
          },
          {
            urls: 'stun:stun1.l.google.com:19302',
          },
          {
            urls: 'stun:stun2.l.google.com:19302',
          },
        ],
      },
      
      // P2P segments download timeout
      segmentDownloadTimeout: P2P_CONFIG.SEGMENT_TIMEOUT,
      
      // Segments validation
      segmentValidator: (segment, method) => {
        // Validate segment data
        if (!segment || !segment.data) return false;
        
        // Check if data is valid
        if (segment.data.byteLength === 0) return false;
        
        return true;
      },
      
      // HTTP download strategy when P2P fails
      xhrSetup: (xhr, url) => {
        // Add headers if needed
        xhr.withCredentials = false;
      },
      
      // WebRTC max connections
      webRtcMaxMessageSize: 64 * 1024, // 64KB
      
      // Simultaneous P2P downloads
      simultaneousP2PDownloads: 3,
      
      // Simultaneous HTTP downloads (fallback)
      simultaneousHttpDownloads: 2,
      
      // HTTP download probability (0 = always try P2P first)
      httpDownloadProbability: 0,
      
      // HTTP download probability on P2P fail
      httpDownloadProbabilityOnP2pFail: 0.2,
      
      // P2P download probability
      p2pDownloadProbability: 0.8,
      
      // Max peer connections
      requiredSegmentsPriority: 5,
    },
  };
}

/**
 * Initialize P2P engine with HLS.js
 */
export async function initP2PEngine(hls, matchId, linkId) {
  if (!P2P_CONFIG.ENABLED) {
    console.log('[P2P] Disabled');
    return null;
  }
  
  try {
    // Dynamically import p2p-media-loader
    const { Engine } = await import('p2p-media-loader-core');
    const { initHlsJsPlayer } = await import('p2p-media-loader-hlsjs');
    
    const config = getP2PConfig(matchId, linkId);
    
    console.log('[P2P] Initializing engine...', {
      matchId,
      linkId,
      swarmId: config.segments.swarmId,
    });
    
    // Create P2P engine
    const engine = new Engine(config);
    
    // Initialize with HLS.js
    initHlsJsPlayer(hls, { engine });
    
    // Event listeners
    engine.on('peer_connect', (peer) => {
      console.log('[P2P] Peer connected:', peer.id);
    });
    
    engine.on('peer_close', (peerId) => {
      console.log('[P2P] Peer disconnected:', peerId);
    });
    
    engine.on('segment_loaded', (segment, peerId) => {
      if (peerId) {
        console.log('[P2P] Segment loaded from peer:', segment.id);
      } else {
        console.log('[P2P] Segment loaded from HTTP:', segment.id);
      }
    });
    
    engine.on('segment_error', (segment, error) => {
      console.error('[P2P] Segment error:', segment.id, error);
    });
    
    return engine;
    
  } catch (error) {
    console.error('[P2P] Initialization failed:', error);
    return null;
  }
}

/**
 * Get P2P statistics
 */
export function getP2PStats(engine) {
  if (!engine) {
    return {
      enabled: false,
      peers: 0,
      p2pDownloaded: 0,
      httpDownloaded: 0,
      p2pRatio: 0,
    };
  }
  
  try {
    const stats = engine.getStats();
    
    return {
      enabled: true,
      peers: stats.peers || 0,
      p2pDownloaded: stats.p2pDownloaded || 0,
      httpDownloaded: stats.httpDownloaded || 0,
      p2pRatio: stats.p2pDownloaded > 0 
        ? (stats.p2pDownloaded / (stats.p2pDownloaded + stats.httpDownloaded)) * 100 
        : 0,
    };
  } catch (error) {
    console.error('[P2P] Failed to get stats:', error);
    return {
      enabled: true,
      peers: 0,
      p2pDownloaded: 0,
      httpDownloaded: 0,
      p2pRatio: 0,
    };
  }
}