// ========================================
// AUTH API - LOGOUT
// Clear admin session
// ========================================

import { NextResponse } from 'next/server';

export async function POST(request) {
  const response = NextResponse.json({
    success: true,
    message: 'Logged out successfully',
  });
  
  // Clear cookie
  response.cookies.delete('admin_token');
  
  return response;
}

export async function GET(request) {
  return POST(request);
}