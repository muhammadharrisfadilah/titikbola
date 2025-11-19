// ========================================
// CLOUDFLARE KV HELPER
// Client for accessing KV from Next.js API routes
// ========================================

const CLOUDFLARE_API_BASE = 'https://api.cloudflare.com/client/v4';

/**
 * Get KV value
 */
export async function kvGet(namespaceId, key) {
  const url = `${CLOUDFLARE_API_BASE}/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/storage/kv/namespaces/${namespaceId}/values/${key}`;
  
  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${process.env.CLOUDFLARE_API_TOKEN}`,
      'Content-Type': 'application/json',
    },
  });
  
  if (response.status === 404) {
    return null;
  }
  
  if (!response.ok) {
    throw new Error(`KV GET failed: ${response.status}`);
  }
  
  const text = await response.text();
  
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

/**
 * Put KV value
 */
export async function kvPut(namespaceId, key, value, expirationTtl = null) {
  const url = `${CLOUDFLARE_API_BASE}/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/storage/kv/namespaces/${namespaceId}/values/${key}`;
  
  const body = typeof value === 'string' ? value : JSON.stringify(value);
  
  const params = new URLSearchParams();
  if (expirationTtl) {
    params.set('expiration_ttl', expirationTtl.toString());
  }
  
  const finalUrl = expirationTtl ? `${url}?${params}` : url;
  
  const response = await fetch(finalUrl, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${process.env.CLOUDFLARE_API_TOKEN}`,
      'Content-Type': 'text/plain',
    },
    body,
  });
  
  if (!response.ok) {
    throw new Error(`KV PUT failed: ${response.status}`);
  }
  
  return await response.json();
}

/**
 * Delete KV value
 */
export async function kvDelete(namespaceId, key) {
  const url = `${CLOUDFLARE_API_BASE}/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/storage/kv/namespaces/${namespaceId}/values/${key}`;
  
  const response = await fetch(url, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${process.env.CLOUDFLARE_API_TOKEN}`,
    },
  });
  
  if (!response.ok && response.status !== 404) {
    throw new Error(`KV DELETE failed: ${response.status}`);
  }
  
  return true;
}

/**
 * List KV keys
 */
export async function kvList(namespaceId, prefix = '', limit = 100) {
  const params = new URLSearchParams({
    limit: limit.toString(),
  });
  
  if (prefix) {
    params.set('prefix', prefix);
  }
  
  const url = `${CLOUDFLARE_API_BASE}/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/storage/kv/namespaces/${namespaceId}/keys?${params}`;
  
  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${process.env.CLOUDFLARE_API_TOKEN}`,
      'Content-Type': 'application/json',
    },
  });
  
  if (!response.ok) {
    throw new Error(`KV LIST failed: ${response.status}`);
  }
  
  const data = await response.json();
  return data.result || [];
}

/**
 * Match-specific helpers
 */
export async function getMatch(matchId) {
  return await kvGet(process.env.KV_MATCHES_ID, `match:${matchId}`);
}

export async function getAllMatches() {
  const keys = await kvList(process.env.KV_MATCHES_ID, 'match:');
  const matches = [];
  
  for (const key of keys) {
    const match = await kvGet(process.env.KV_MATCHES_ID, key.name);
    if (match) {
      matches.push(match);
    }
  }
  
  return matches;
}

export async function saveMatch(matchId, matchData) {
  return await kvPut(process.env.KV_MATCHES_ID, `match:${matchId}`, matchData);
}

export async function deleteMatch(matchId) {
  return await kvDelete(process.env.KV_MATCHES_ID, `match:${matchId}`);
}