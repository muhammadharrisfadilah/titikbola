// ========================================
// TOKEN GENERATOR (Client-side)
// HMAC-SHA256 token generation
// MUST match worker implementation
// ========================================

import { SECURITY_CONFIG } from '@/lib/utils/constants';

/**
 * Import crypto key for HMAC
 */
async function getCryptoKey(secret) {
  const enc = new TextEncoder();
  const keyData = enc.encode(secret);
  return crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  );
}

/**
 * Sign data with HMAC-SHA256
 */
async function sign(key, data) {
  const enc = new TextEncoder();
  const signature = await crypto.subtle.sign('HMAC', key, enc.encode(data));
  return Array.from(new Uint8Array(signature))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Generate secure token for stream URL
 * @param {string} matchId - Match ID
 * @param {string} linkId - Link ID (link1, link2, link3)
 * @returns {Promise<{token: string, timestamp: string}>}
 */
export async function generateStreamToken(matchId, linkId) {
  try {
    const timestamp = Date.now().toString();
    const dataToSign = `${matchId}:${linkId}:${timestamp}`;
    
    const key = await getCryptoKey(SECURITY_CONFIG.TOKEN_SECRET_KEY);
    const token = await sign(key, dataToSign);
    
    console.log('[TOKEN] Generated:', {
      matchId,
      linkId,
      timestamp,
      dataToSign,
      tokenPreview: token.substring(0, 16) + '...'
    });
    
    return { token, timestamp };
    
  } catch (error) {
    console.error('[TOKEN] Generation failed:', error);
    throw new Error('Failed to generate security token. Please ensure HTTPS is enabled.');
  }
}

/**
 * Create secure stream URL with token
 * @param {string} workerUrl - Worker base URL
 * @param {string} endpoint - Endpoint path (e.g., '/api/stream/manifest')
 * @param {string} matchId - Match ID
 * @param {string} linkId - Link ID
 * @returns {Promise<string>} - Secure URL with token
 */
export async function createSecureStreamUrl(workerUrl, endpoint, matchId, linkId) {
  const { token, timestamp } = await generateStreamToken(matchId, linkId);
  
  const params = new URLSearchParams({
    match: matchId,
    link: linkId,
    ts: timestamp,
    token: token,
  });
  
  return `${workerUrl}${endpoint}?${params.toString()}`;
}

/**
 * Validate token timestamp (client-side check)
 */
export function isTokenValid(timestamp) {
  const ts = parseInt(timestamp);
  const now = Date.now();
  
  if (isNaN(ts)) return false;
  
  const age = now - ts;
  
  return age >= 0 && age < SECURITY_CONFIG.TOKEN_VALIDITY_DURATION;
}