// ========================================
// MATCHES API - CRUD
// Admin endpoints for match management
// ========================================

import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { kvList, kvGet, kvPut } from '@/lib/cloudflare/kv';

// Verify admin token
async function verifyAuth(request) {
  try {
    const token = request.cookies.get('admin_token')?.value;
    
    if (!token) {
      return null;
    }
    
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    
    return payload;
  } catch (error) {
    return null;
  }
}

// GET - List all matches
export async function GET(request) {
  try {
    const auth = await verifyAuth(request);
    
    if (!auth) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Get all matches from KV
    const keys = await kvList(process.env.KV_MATCHES_ID, 'match:');
    const matches = [];
    
    for (const key of keys) {
      const match = await kvGet(process.env.KV_MATCHES_ID, key.name);
      if (match) {
        matches.push(match);
      }
    }
    
    // Sort by date (newest first)
    matches.sort((a, b) => {
      const dateA = new Date(`${a.match_date} ${a.match_time}`);
      const dateB = new Date(`${b.match_date} ${b.match_time}`);
      return dateB - dateA;
    });
    
    return NextResponse.json({ matches });
    
  } catch (error) {
    console.error('Get matches error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch matches' },
      { status: 500 }
    );
  }
}

// POST - Create new match
export async function POST(request) {
  try {
    const auth = await verifyAuth(request);
    
    if (!auth) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const data = await request.json();
    
    // Validate required fields
    if (!data.home_team || !data.away_team || !data.competition || !data.match_date || !data.match_time) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Generate match ID (timestamp-based)
    const matchId = Date.now().toString();
    
    const match = {
      id: matchId,
      home_team: data.home_team,
      home_flag: data.home_flag || '🏴',
      away_team: data.away_team,
      away_flag: data.away_flag || '🏴',
      competition: data.competition,
      match_date: data.match_date,
      match_time: data.match_time,
      status: data.status || 'upcoming',
      home_score: data.home_score || 0,
      away_score: data.away_score || 0,
      stream_url1: data.stream_url1 || null,
      referer1: data.referer1 || null,
      origin1: data.origin1 || null,
      stream_url2: data.stream_url2 || null,
      referer2: data.referer2 || null,
      origin2: data.origin2 || null,
      stream_url3: data.stream_url3 || null,
      referer3: data.referer3 || null,
      origin3: data.origin3 || null,
      thumbnail_url: data.thumbnail_url || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    // Save to KV
    await kvPut(process.env.KV_MATCHES_ID, `match:${matchId}`, match);
    
    return NextResponse.json({
      success: true,
      match,
    });
    
  } catch (error) {
    console.error('Create match error:', error);
    return NextResponse.json(
      { error: 'Failed to create match' },
      { status: 500 }
    );
  }
}