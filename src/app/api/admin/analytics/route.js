// ========================================
// ANALYTICS API ROUTE
// Backend endpoint for analytics data
// app/api/admin/analytics/route.js
// ========================================

import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { kvGet, kvList } from '@/lib/cloudflare/kv';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'your-secret-key');

// Verify admin authentication
async function verifyAdmin(request) {
  try {
    const token = request.cookies.get('admin_token')?.value;
    if (!token) return null;
    
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload;
  } catch {
    return null;
  }
}

// GET /api/admin/analytics
export async function GET(request) {
  // Verify authentication
  const admin = await verifyAdmin(request);
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const range = searchParams.get('range') || '24h'; // 24h, 7d, 30d
    const matchId = searchParams.get('match') || 'all';

    // Calculate time range
    const now = Date.now();
    const timeRanges = {
      '24h': 24 * 60 * 60 * 1000,
      '7d': 7 * 24 * 60 * 60 * 1000,
      '30d': 30 * 24 * 60 * 60 * 1000
    };
    const startTime = now - timeRanges[range];

    // Fetch analytics data from KV
    const analyticsKeys = await kvList('ANALYTICS_KV', 'analytics:');
    
    let totalViews = 0;
    let peakViewers = 0;
    let totalWatchTime = 0;
    let viewerTimeline = [];
    let trafficSources = {};
    let devices = {};
    let countries = {};
    let matchPerformance = {};
    let p2pData = { downloaded: 0, uploaded: 0 };

    // Process each analytics entry
    for (const key of analyticsKeys.keys) {
      const data = await kvGet('ANALYTICS_KV', key.name);
      if (!data) continue;

      const entry = JSON.parse(data);
      const timestamp = entry.timestamp || 0;

      // Filter by time range
      if (timestamp < startTime) continue;

      // Filter by match if specified
      if (matchId !== 'all' && entry.matchId !== matchId) continue;

      // Aggregate data
      totalViews += entry.views || 0;
      peakViewers = Math.max(peakViewers, entry.viewers || 0);
      totalWatchTime += entry.watchTime || 0;

      // Timeline data (group by hour)
      const hour = new Date(timestamp).toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
      const existingPoint = viewerTimeline.find(p => p.time === hour);
      if (existingPoint) {
        existingPoint.viewers = Math.max(existingPoint.viewers, entry.viewers || 0);
      } else {
        viewerTimeline.push({ time: hour, viewers: entry.viewers || 0 });
      }

      // Traffic sources
      if (entry.source) {
        trafficSources[entry.source] = (trafficSources[entry.source] || 0) + 1;
      }

      // Devices
      if (entry.device) {
        devices[entry.device] = (devices[entry.device] || 0) + 1;
      }

      // Countries
      if (entry.country) {
        countries[entry.country] = (countries[entry.country] || 0) + 1;
      }

      // P2P data
      if (entry.p2p) {
        p2pData.downloaded += entry.p2p.downloaded || 0;
        p2pData.uploaded += entry.p2p.uploaded || 0;
      }

      // Match performance
      if (entry.matchId) {
        if (!matchPerformance[entry.matchId]) {
          matchPerformance[entry.matchId] = {
            id: entry.matchId,
            team1: entry.team1 || 'Team 1',
            team2: entry.team2 || 'Team 2',
            totalViews: 0,
            peakViewers: 0,
            totalWatchTime: 0,
            p2pData: { downloaded: 0, uploaded: 0 }
          };
        }
        matchPerformance[entry.matchId].totalViews += entry.views || 0;
        matchPerformance[entry.matchId].peakViewers = Math.max(
          matchPerformance[entry.matchId].peakViewers,
          entry.viewers || 0
        );
        matchPerformance[entry.matchId].totalWatchTime += entry.watchTime || 0;
        if (entry.p2p) {
          matchPerformance[entry.matchId].p2pData.downloaded += entry.p2p.downloaded || 0;
          matchPerformance[entry.matchId].p2pData.uploaded += entry.p2p.uploaded || 0;
        }
      }
    }

    // Calculate averages and percentages
    const avgWatchTime = totalViews > 0 ? Math.round(totalWatchTime / totalViews) : 0;
    
    const p2pEfficiency = p2pData.downloaded > 0
      ? Math.round((p2pData.uploaded / p2pData.downloaded) * 100)
      : 0;

    // Sort timeline by time
    viewerTimeline.sort((a, b) => {
      const timeA = new Date('1970-01-01 ' + a.time).getTime();
      const timeB = new Date('1970-01-01 ' + b.time).getTime();
      return timeA - timeB;
    });

    // Format traffic sources
    const totalTraffic = Object.values(trafficSources).reduce((a, b) => a + b, 0);
    const trafficSourcesArray = Object.entries(trafficSources).map(([name, count]) => ({
      name,
      count,
      percentage: totalTraffic > 0 ? Math.round((count / totalTraffic) * 100) : 0
    })).sort((a, b) => b.count - a.count);

    // Format devices
    const totalDevices = Object.values(devices).reduce((a, b) => a + b, 0);
    const deviceIcons = {
      'mobile': '📱',
      'desktop': '💻',
      'tablet': '📱',
      'tv': '📺'
    };
    const devicesArray = Object.entries(devices).map(([type, count]) => ({
      type,
      icon: deviceIcons[type.toLowerCase()] || '📱',
      count,
      percentage: totalDevices > 0 ? Math.round((count / totalDevices) * 100) : 0
    })).sort((a, b) => b.count - a.count);

    // Format countries (top 5)
    const countryFlags = {
      'Indonesia': '🇮🇩',
      'Malaysia': '🇲🇾',
      'Singapore': '🇸🇬',
      'Thailand': '🇹🇭',
      'Philippines': '🇵🇭'
    };
    const countriesArray = Object.entries(countries)
      .map(([name, views]) => ({
        name,
        code: name.substring(0, 2).toUpperCase(),
        flag: countryFlags[name] || '🌍',
        views
      }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 5);

    // Format match performance
    const matchPerformanceArray = Object.values(matchPerformance).map(match => ({
      ...match,
      avgDuration: match.totalViews > 0 
        ? Math.round(match.totalWatchTime / match.totalViews) 
        : 0,
      p2pPercentage: match.p2pData.downloaded > 0
        ? Math.round((match.p2pData.uploaded / match.p2pData.downloaded) * 100)
        : 0
    })).sort((a, b) => b.totalViews - a.totalViews);

    // Get list of matches for filter
    const matchesData = await kvList('MATCHES_KV', 'match:');
    const matches = [];
    for (const key of matchesData.keys.slice(0, 10)) {
      const matchData = await kvGet('MATCHES_KV', key.name);
      if (matchData) {
        const match = JSON.parse(matchData);
        matches.push({
          id: match.id,
          team1: match.team1,
          team2: match.team2
        });
      }
    }

    // Calculate changes (mock data - in production, compare with previous period)
    const viewsChange = Math.round(Math.random() * 20) - 5;
    const peakChange = Math.round(Math.random() * 20) - 5;
    const watchTimeChange = Math.round(Math.random() * 20) - 5;
    const p2pChange = Math.round(Math.random() * 10) - 3;

    return NextResponse.json({
      totalViews,
      peakViewers,
      avgWatchTime,
      p2pEfficiency,
      viewsChange,
      peakChange,
      watchTimeChange,
      p2pChange,
      viewerTimeline,
      trafficSources: trafficSourcesArray,
      devices: devicesArray,
      countries: countriesArray,
      matchPerformance: matchPerformanceArray,
      matches
    });

  } catch (error) {
    console.error('Analytics error:', error);
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
  }
}

// POST /api/admin/analytics - Record analytics event
export async function POST(request) {
  try {
    const data = await request.json();
    
    // Validate required fields
    if (!data.matchId || !data.type) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Generate analytics key
    const timestamp = Date.now();
    const key = `analytics:${data.matchId}:${timestamp}`;

    // Store analytics data
    const analyticsData = {
      matchId: data.matchId,
      type: data.type, // 'view', 'heartbeat', 'exit'
      timestamp,
      viewers: data.viewers || 1,
      views: data.type === 'view' ? 1 : 0,
      watchTime: data.watchTime || 0,
      device: data.device || 'unknown',
      source: data.source || 'direct',
      country: data.country || 'Unknown',
      p2p: data.p2p || { downloaded: 0, uploaded: 0 },
      team1: data.team1,
      team2: data.team2
    };

    // In production, store to KV
    // await kvPut('ANALYTICS_KV', key, JSON.stringify(analyticsData));

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Analytics recording error:', error);
    return NextResponse.json({ error: 'Failed to record analytics' }, { status: 500 });
  }
}