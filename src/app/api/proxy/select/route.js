// ========================================
// PROXY SELECTOR API
// Returns best available worker URL
// ========================================

import { NextResponse } from 'next/server';
import { getProxyBalancer } from '@/lib/cloudflare/proxy-balancer';

export async function GET(request) {
  try {
    const balancer = getProxyBalancer();
    
    // Get best worker
    const worker = balancer.selectWorker();
    
    if (!worker) {
      return NextResponse.json(
        { error: 'No workers available' },
        { status: 503 }
      );
    }
    
    return NextResponse.json({
      success: true,
      worker: {
        id: worker.id,
        url: worker.url,
        weight: worker.weight,
        latency: worker.latency,
        failures: worker.failures,
      }
    });
    
  } catch (error) {
    console.error('Proxy select error:', error);
    return NextResponse.json(
      { error: 'Failed to select proxy' },
      { status: 500 }
    );
  }
}

// Get all workers status (for admin)
export async function POST(request) {
  try {
    const balancer = getProxyBalancer();
    const status = balancer.getStatus();
    
    return NextResponse.json({
      success: true,
      workers: status,
      timestamp: new Date().toISOString(),
    });
    
  } catch (error) {
    console.error('Get workers status error:', error);
    return NextResponse.json(
      { error: 'Failed to get status' },
      { status: 500 }
    );
  }
}