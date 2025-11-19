// ========================================
// TITIKBOLA - CONSTANTS
// ========================================

// API Configuration
export const API_CONFIG = {
  WORKERS: [
    process.env.NEXT_PUBLIC_WORKER_1_URL,
    process.env.NEXT_PUBLIC_WORKER_2_URL,
    process.env.NEXT_PUBLIC_WORKER_3_URL,
    process.env.NEXT_PUBLIC_WORKER_BACKUP_URL,
  ].filter(Boolean),
  
  TIMEOUT: 30000, // 30 seconds
  MAX_RETRIES: 3,
};

// Security Configuration
export const SECURITY_CONFIG = {
  TOKEN_SECRET_KEY: process.env.NEXT_PUBLIC_TOKEN_SECRET_KEY,
  TOKEN_VALIDITY_DURATION: parseInt(process.env.NEXT_PUBLIC_TOKEN_VALIDITY_DURATION) || 10800000, // 3 hours
  CLOCK_SKEW_TOLERANCE: 60000, // 60 seconds
};

// Player Configuration
export const PLAYER_CONFIG = {
  INITIAL_BUFFER_LENGTH: 15, // seconds
  MAX_BUFFER_LENGTH: 30,
  MAX_BUFFER_SIZE: 60 * 1000 * 1000, // 60 MB
  MAX_RETRIES: 3,
  AUTO_SWITCH_LIMIT: 2,
  MAX_FALLBACK_ATTEMPTS: 3,
  MAX_STALL_RECOVERIES: 3,
};

// P2P Configuration
export const P2P_CONFIG = {
  ENABLED: process.env.NEXT_PUBLIC_P2P_ENABLED === 'true',
  TRACKER_URLS: (process.env.NEXT_PUBLIC_P2P_TRACKER_URLS || 'wss://tracker.openwebtorrent.com,wss://tracker.btorrent.xyz').split(','),
  SEEDER_RATIO: 0.1, // 10% seeders
  SEGMENT_TIMEOUT: 3000, // 3 seconds
};

// Analytics Configuration
export const ANALYTICS_CONFIG = {
  ENABLED: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true',
  HEARTBEAT_INTERVAL: parseInt(process.env.NEXT_PUBLIC_ANALYTICS_INTERVAL) || 30000, // 30 seconds
  BATCH_SIZE: 10,
};

// Ad Configuration
export const ADS_CONFIG = {
  MONETAG: {
    ENABLED: process.env.NEXT_PUBLIC_MONETAG_ENABLED === 'true',
    ZONE_ID: process.env.NEXT_PUBLIC_MONETAG_ZONE_ID,
    SMARTLINK_ID: process.env.NEXT_PUBLIC_MONETAG_SMARTLINK_ID,
    INPAGE_ID: process.env.NEXT_PUBLIC_MONETAG_INPAGE_ID,
    VIGNETTE_ID: process.env.NEXT_PUBLIC_MONETAG_VIGNETTE_ID,
  },
  ADSTERRA: {
    ENABLED: process.env.NEXT_PUBLIC_ADSTERRA_ENABLED === 'true',
    PUB_ID: process.env.NEXT_PUBLIC_ADSTERRA_PUB_ID,
    BANNER_ID: process.env.NEXT_PUBLIC_ADSTERRA_BANNER_ID,
  },
  TIMING: {
    SMARTLINK_ON_LOAD: true,
    INTERSTITIAL_AT_HALFTIME: true,
    VIGNETTE_ALWAYS: true,
    INPAGE_PUSH_DELAY: 5000, // 5 seconds
  },
};

// Match Status
export const MATCH_STATUS = {
  UPCOMING: 'upcoming',
  LIVE: 'live',
  ENDED: 'ended',
};

// Stream Links
export const STREAM_LINKS = {
  LINK1: 'link1',
  LINK2: 'link2',
  LINK3: 'link3',
};

// Competition Leagues
export const COMPETITIONS = {
  PREMIER_LEAGUE: 'Liga Inggris',
  LA_LIGA: 'Liga Spanyol',
  SERIE_A: 'Liga Italia',
  BUNDESLIGA: 'Liga Jerman',
  LIGUE_1: 'Liga Prancis',
  CHAMPIONS_LEAGUE: 'Liga Champions',
  EUROPA_LEAGUE: 'Liga Europa',
  WORLD_CUP: 'Piala Dunia',
  COPA_AMERICA: 'Copa America',
  EURO: 'Euro',
};

// UI Configuration
export const UI_CONFIG = {
  MATCHES_PER_PAGE: 12,
  CAROUSEL_VISIBLE_ITEMS: 4,
  CAROUSEL_SCROLL_AMOUNT: 3,
  MOBILE_BREAKPOINT: 768,
  TABLET_BREAKPOINT: 1024,
};

// Error Messages
export const ERROR_MESSAGES = {
  MATCH_NOT_FOUND: 'Pertandingan tidak ditemukan',
  STREAM_UNAVAILABLE: 'Stream tidak tersedia',
  NETWORK_ERROR: 'Koneksi bermasalah. Coba lagi.',
  TOKEN_EXPIRED: 'Sesi telah berakhir. Refresh halaman.',
  SERVER_FULL: 'Server penuh. Coba link alternatif.',
  BUFFER_STALLED: 'Stream terhenti. Mengoptimalkan...',
  ALL_LINKS_FAILED: 'Semua link gagal. Coba lagi nanti.',
};

// Success Messages
export const SUCCESS_MESSAGES = {
  MATCH_LOADED: 'Pertandingan berhasil dimuat',
  STREAM_STARTED: 'Stream dimulai',
  LINK_SWITCHED: 'Beralih ke link alternatif',
};

// Local Storage Keys
export const STORAGE_KEYS = {
  LAST_WATCHED: 'titikbola_last_watched',
  PREFERRED_QUALITY: 'titikbola_quality',
  VOLUME_LEVEL: 'titikbola_volume',
  ANALYTICS_SESSION: 'titikbola_session',
};

// Admin Configuration
export const ADMIN_CONFIG = {
  SESSION_DURATION: 86400000, // 24 hours
  REFRESH_INTERVAL: 30000, // 30 seconds
};

// SEO Configuration
export const SEO_CONFIG = {
  SITE_NAME: 'TitikBola',
  SITE_DESCRIPTION: 'Streaming pertandingan sepak bola live dengan kualitas HD tanpa buffering. 100% GRATIS, tanpa registrasi.',
  SITE_KEYWORDS: 'streaming bola, live streaming, nonton bola gratis, sepak bola live, football streaming, liga champions, liga inggris',
  TWITTER_HANDLE: '@titikbola',
  OG_IMAGE: '/images/og-image.jpg',
};