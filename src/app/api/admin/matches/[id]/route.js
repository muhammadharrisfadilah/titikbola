// ========================================
// MATCH API - SINGLE
// Update/Delete specific match
// ========================================

import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { kvGet, kvPut, kvDelete } from '@/lib/cloudflare/kv';

async function verifyAuth(request) {
  try {
    const token = request.cookies.get('admin_token')?.value;
    if (!token) return null;
    
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch (error) {
    return null;
  }
}

// PUT - Update match
export async function PUT(request, { params }) {
  try {
    const auth = await verifyAuth(request);
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { id } = params;
    const data = await request.json();
    
    // Get existing match
    const existing = await kvGet(process.env.KV_MATCHES_ID, `match:${id}`);
    if (!existing) {
      return NextResponse.json({ error: 'Match not found' }, { status: 404 });
    }
    
    // Update match
    const updated = {
      ...existing,
      ...data,
      id, // Ensure ID doesn't change
      updated_at: new Date().toISOString(),
    };
    
    await kvPut(process.env.KV_MATCHES_ID, `match:${id}`, updated);
    
    return NextResponse.json({
      success: true,
      match: updated,
    });
    
  } catch (error) {
    console.error('Update match error:', error);
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
  }
}

// DELETE - Delete match
export async function DELETE(request, { params }) {
  try {
    const auth = await verifyAuth(request);
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { id } = params;
    
    await kvDelete(process.env.KV_MATCHES_ID, `match:${id}`);
    
    return NextResponse.json({
      success: true,
      message: 'Match deleted',
    });
    
  } catch (error) {
    console.error('Delete match error:', error);
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
  }
}