// ========================================
// ANALYTICS TRACKER
// Client-side analytics tracking
// ========================================

import { ANALYTICS_CONFIG } from '@/lib/utils/constants';

class AnalyticsTracker {
  constructor() {
    this.sessionId = this.generateSessionId();
    this.heartbeatInterval = null;
    this.currentMatch = null;
    this.startTime = null;
    this.lastHeartbeat = null;
  }
  
  /**
   * Generate unique session ID
   */
  generateSessionId() {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
  
  /**
   * Start tracking a match
   */
  startTracking(matchId, linkId) {
    if (!ANALYTICS_CONFIG.ENABLED) {
      console.log('[Analytics] Disabled');
      return;
    }
    
    this.currentMatch = matchId;
    this.currentLink = linkId;
    this.startTime = Date.now();
    this.lastHeartbeat = Date.now();
    
    console.log('[Analytics] Started tracking:', {
      matchId,
      linkId,
      sessionId: this.sessionId,
    });
    
    // Send initial event
    this.sendEvent('watch_start', {
      matchId,
      linkId,
    });
    
    // Start heartbeat
    this.startHeartbeat();
  }
  
  /**
   * Stop tracking
   */
  stopTracking() {
    if (!this.currentMatch) return;
    
    const watchDuration = Date.now() - this.startTime;
    
    this.sendEvent('watch_end', {
      matchId: this.currentMatch,
      linkId: this.currentLink,
      duration: watchDuration,
    });
    
    this.stopHeartbeat();
    
    this.currentMatch = null;
    this.currentLink = null;
    this.startTime = null;
    
    console.log('[Analytics] Stopped tracking');
  }
  
  /**
   * Start heartbeat interval
   */
  startHeartbeat() {
    if (this.heartbeatInterval) {
      return;
    }
    
    this.heartbeatInterval = setInterval(() => {
      this.sendHeartbeat();
    }, ANALYTICS_CONFIG.HEARTBEAT_INTERVAL);
    
    console.log('[Analytics] Heartbeat started');
  }
  
  /**
   * Stop heartbeat
   */
  stopHeartbeat() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
      console.log('[Analytics] Heartbeat stopped');
    }
  }
  
  /**
   * Send heartbeat
   */
  async sendHeartbeat() {
    if (!this.currentMatch) return;
    
    const now = Date.now();
    const timeSinceLastHeartbeat = now - this.lastHeartbeat;
    
    try {
      await this.sendEvent('heartbeat', {
        matchId: this.currentMatch,
        linkId: this.currentLink,
        watchDuration: now - this.startTime,
        timeSinceLastHeartbeat,
      });
      
      this.lastHeartbeat = now;
      
    } catch (error) {
      console.error('[Analytics] Heartbeat failed:', error);
    }
  }
  
  /**
   * Track buffer event
   */
  trackBuffer(duration) {
    this.sendEvent('buffer', {
      matchId: this.currentMatch,
      linkId: this.currentLink,
      duration,
    });
  }
  
  /**
   * Track error
   */
  trackError(errorType, errorMessage) {
    this.sendEvent('error', {
      matchId: this.currentMatch,
      linkId: this.currentLink,
      errorType,
      errorMessage,
    });
  }
  
  /**
   * Track link switch
   */
  trackLinkSwitch(fromLink, toLink) {
    this.currentLink = toLink;
    
    this.sendEvent('link_switch', {
      matchId: this.currentMatch,
      fromLink,
      toLink,
    });
  }
  
  /**
   * Track P2P stats
   */
  trackP2PStats(stats) {
    this.sendEvent('p2p_stats', {
      matchId: this.currentMatch,
      linkId: this.currentLink,
      ...stats,
    });
  }
  
  /**
   * Send event to backend
   */
  async sendEvent(eventType, data) {
    if (!ANALYTICS_CONFIG.ENABLED) return;
    
    const payload = {
      sessionId: this.sessionId,
      eventType,
      timestamp: Date.now(),
      data,
      userAgent: navigator.userAgent,
      screenResolution: `${window.screen.width}x${window.screen.height}`,
      viewport: `${window.innerWidth}x${window.innerHeight}`,
    };
    
    try {
      // Use sendBeacon for reliability (works even on page unload)
      if (navigator.sendBeacon) {
        const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
        navigator.sendBeacon('/api/analytics/track', blob);
      } else {
        // Fallback to fetch
        fetch('/api/analytics/track', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
          keepalive: true, // Keep connection alive for page unload
        }).catch(err => console.error('[Analytics] Send failed:', err));
      }
      
    } catch (error) {
      console.error('[Analytics] Failed to send event:', error);
    }
  }
}

// Singleton instance
let trackerInstance = null;

export function getAnalyticsTracker() {
  if (!trackerInstance) {
    trackerInstance = new AnalyticsTracker();
  }
  return trackerInstance;
}

export default AnalyticsTracker;