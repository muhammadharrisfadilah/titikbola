// ========================================
// ADMIN DASHBOARD PAGE
// Overview page with quick stats and actions
// ========================================

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    liveMatches: 0,
    upcomingMatches: 0,
    totalViewers: 0,
    peakViewers: 0,
  });
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Fetch stats (mock data for now)
    setTimeout(() => {
      setStats({
        liveMatches: 2,
        upcomingMatches: 5,
        totalViewers: 8432,
        peakViewers: 12500,
      });
      setLoading(false);
    }, 1000);
  }, []);
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="spinner" />
      </div>
    );
  }
  
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-admin-text mb-2">Dashboard</h1>
        <p className="text-admin-text-muted">Welcome back! Here's what's happening today.</p>
      </div>
      
      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-admin-card p-6 rounded-lg border border-admin-card hover:border-admin-accent transition-colors duration-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-admin-text-muted text-sm">Live Now</span>
            <span className="text-2xl">🔴</span>
          </div>
          <p className="text-3xl font-bold text-admin-text">{stats.liveMatches}</p>
          <p className="text-admin-success text-sm mt-1">matches streaming</p>
        </div>
        
        <div className="bg-admin-card p-6 rounded-lg border border-admin-card hover:border-admin-accent transition-colors duration-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-admin-text-muted text-sm">Upcoming</span>
            <span className="text-2xl">📅</span>
          </div>
          <p className="text-3xl font-bold text-admin-text">{stats.upcomingMatches}</p>
          <p className="text-admin-text-muted text-sm mt-1">scheduled matches</p>
        </div>
        
        <div className="bg-admin-card p-6 rounded-lg border border-admin-card hover:border-admin-accent transition-colors duration-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-admin-text-muted text-sm">Total Viewers</span>
            <span className="text-2xl">👁️</span>
          </div>
          <p className="text-3xl font-bold text-admin-text">{stats.totalViewers.toLocaleString()}</p>
          <p className="text-admin-text-muted text-sm mt-1">watching now</p>
        </div>
        
        <div className="bg-admin-card p-6 rounded-lg border border-admin-card hover:border-admin-accent transition-colors duration-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-admin-text-muted text-sm">Peak Today</span>
            <span className="text-2xl">📈</span>
          </div>
          <p className="text-3xl font-bold text-admin-text">{stats.peakViewers.toLocaleString()}</p>
          <p className="text-admin-success text-sm mt-1">+12% from yesterday</p>
        </div>
      </div>
      
      {/* Quick actions */}
      <div className="bg-admin-card p-6 rounded-lg border border-admin-card mb-8">
        <h2 className="text-xl font-bold text-admin-text mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-4">
          <Link
            href="/admin/matches?action=create"
            className="flex items-center gap-2 bg-admin-accent hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create Match
          </Link>
          
          <Link
            href="/admin/analytics"
            className="flex items-center gap-2 bg-admin-card hover:bg-admin-bg text-admin-text px-6 py-3 rounded-lg font-medium border border-admin-card transition-colors duration-200"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            View Analytics
          </Link>
          
          <Link
            href="/admin/settings"
            className="flex items-center gap-2 bg-admin-card hover:bg-admin-bg text-admin-text px-6 py-3 rounded-lg font-medium border border-admin-card transition-colors duration-200"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Settings
          </Link>
        </div>
      </div>
      
      {/* Live matches table (placeholder) */}
      <div className="bg-admin-card p-6 rounded-lg border border-admin-card">
        <h2 className="text-xl font-bold text-admin-text mb-4">Live Matches</h2>
        <div className="text-admin-text-muted text-center py-8">
          {stats.liveMatches > 0 ? (
            <p>View details in <Link href="/admin/matches" className="text-admin-accent hover:underline">Matches page</Link></p>
          ) : (
            <p>No live matches at the moment</p>
          )}
        </div>
      </div>
    </div>
  );
}