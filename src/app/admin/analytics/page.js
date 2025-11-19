// ========================================
// ADMIN ANALYTICS PAGE
// Detailed analytics and statistics
// ========================================

'use client';

import { useEffect, useState } from 'react';

export default function AdminAnalyticsPage() {
  const [stats, setStats] = useState({
    overview: {
      totalViews: 0,
      peakConcurrent: 0,
      avgWatchTime: 0,
      p2pEfficiency: 0,
    },
    topMatches: [],
    geographic: [],
    devices: [],
    timeSeriesData: [],
  });
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('today');
  
  useEffect(() => {
    fetchAnalytics();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchAnalytics, 30000);
    
    return () => clearInterval(interval);
  }, [timeRange]);
  
  const fetchAnalytics = async () => {
    try {
      // Mock data for now (replace with real API)
      setTimeout(() => {
        setStats({
          overview: {
            totalViews: 15234,
            peakConcurrent: 8432,
            avgWatchTime: 67, // minutes
            p2pEfficiency: 82, // percentage
          },
          topMatches: [
            { match: 'Man Utd vs Arsenal', views: 12500 },
            { match: 'Barcelona vs Real Madrid', views: 8234 },
            { match: 'Chelsea vs Liverpool', views: 5123 },
          ],
          geographic: [
            { country: 'Indonesia', percentage: 82 },
            { country: 'Malaysia', percentage: 8 },
            { country: 'Singapore', percentage: 5 },
            { country: 'Others', percentage: 5 },
          ],
          devices: [
            { type: 'Mobile', percentage: 70 },
            { type: 'Desktop', percentage: 25 },
            { type: 'TV/Other', percentage: 5 },
          ],
          timeSeriesData: Array.from({ length: 12 }, (_, i) => ({
            time: `${18 + Math.floor(i/2)}:${i % 2 === 0 ? '00' : '30'}`,
            viewers: Math.floor(Math.random() * 5000) + 3000,
          })),
        });
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Fetch analytics error:', error);
      setLoading(false);
    }
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="spinner" />
      </div>
    );
  }
  
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-admin-text mb-2">Analytics</h1>
          <p className="text-admin-text-muted">Detailed statistics and insights</p>
        </div>
        
        {/* Time range selector */}
        <div className="flex gap-2">
          {['today', '7days', '30days'].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded font-medium transition-colors ${
                timeRange === range
                  ? 'bg-admin-accent text-white'
                  : 'bg-admin-card text-admin-text hover:bg-admin-bg'
              }`}
            >
              {range === 'today' ? 'Today' : range === '7days' ? '7 Days' : '30 Days'}
            </button>
          ))}
        </div>
      </div>
      
      {/* Overview stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-admin-card p-6 rounded-lg border border-admin-card">
          <div className="text-admin-text-muted text-sm mb-2">Total Views</div>
          <div className="text-3xl font-bold text-admin-text mb-1">
            {stats.overview.totalViews.toLocaleString()}
          </div>
          <div className="text-admin-success text-sm">+12% from yesterday</div>
        </div>
        
        <div className="bg-admin-card p-6 rounded-lg border border-admin-card">
          <div className="text-admin-text-muted text-sm mb-2">Peak Concurrent</div>
          <div className="text-3xl font-bold text-admin-text mb-1">
            {stats.overview.peakConcurrent.toLocaleString()}
          </div>
          <div className="text-admin-text-muted text-sm">viewers at once</div>
        </div>
        
        <div className="bg-admin-card p-6 rounded-lg border border-admin-card">
          <div className="text-admin-text-muted text-sm mb-2">Avg Watch Time</div>
          <div className="text-3xl font-bold text-admin-text mb-1">
            {stats.overview.avgWatchTime} min
          </div>
          <div className="text-admin-text-muted text-sm">per session</div>
        </div>
        
        <div className="bg-admin-card p-6 rounded-lg border border-admin-card">
          <div className="text-admin-text-muted text-sm mb-2">P2P Efficiency</div>
          <div className="text-3xl font-bold text-admin-text mb-1">
            {stats.overview.p2pEfficiency}%
          </div>
          <div className="text-admin-success text-sm">Excellent</div>
        </div>
      </div>
      
      {/* Live viewers chart */}
      <div className="bg-admin-card p-6 rounded-lg border border-admin-card mb-8">
        <h2 className="text-xl font-bold text-admin-text mb-4">Live Viewers</h2>
        <div className="h-64">
          <div className="flex items-end justify-between h-full gap-2">
            {stats.timeSeriesData.map((point, index) => {
              const height = (point.viewers / 8000) * 100;
              return (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div 
                    className="w-full bg-admin-accent rounded-t hover:bg-blue-500 transition-colors cursor-pointer relative group"
                    style={{ height: `${height}%` }}
                  >
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-admin-bg px-2 py-1 rounded text-xs text-admin-text opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      {point.viewers.toLocaleString()}
                    </div>
                  </div>
                  <div className="text-xs text-admin-text-muted mt-2">{point.time}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top matches */}
        <div className="bg-admin-card p-6 rounded-lg border border-admin-card">
          <h2 className="text-xl font-bold text-admin-text mb-4">Top Matches</h2>
          <div className="space-y-3">
            {stats.topMatches.map((match, index) => (
              <div key={index} className="flex items-center justify-between">
                <div>
                  <div className="text-admin-text font-medium">{match.match}</div>
                  <div className="text-sm text-admin-text-muted">
                    {match.views.toLocaleString()} views
                  </div>
                </div>
                <div className="text-2xl">{index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}</div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Geographic distribution */}
        <div className="bg-admin-card p-6 rounded-lg border border-admin-card">
          <h2 className="text-xl font-bold text-admin-text mb-4">Geographic Distribution</h2>
          <div className="space-y-3">
            {stats.geographic.map((geo, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-admin-text">{geo.country}</span>
                  <span className="text-admin-text-muted">{geo.percentage}%</span>
                </div>
                <div className="w-full bg-admin-bg rounded-full h-2">
                  <div 
                    className="bg-admin-accent h-2 rounded-full transition-all duration-500"
                    style={{ width: `${geo.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Device breakdown */}
        <div className="bg-admin-card p-6 rounded-lg border border-admin-card">
          <h2 className="text-xl font-bold text-admin-text mb-4">Device Breakdown</h2>
          <div className="space-y-3">
            {stats.devices.map((device, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-admin-text">
                    {device.type === 'Mobile' ? '📱' : device.type === 'Desktop' ? '💻' : '📺'} {device.type}
                  </span>
                  <span className="text-admin-text-muted">{device.percentage}%</span>
                </div>
                <div className="w-full bg-admin-bg rounded-full h-2">
                  <div 
                    className="bg-admin-success h-2 rounded-full transition-all duration-500"
                    style={{ width: `${device.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* System status */}
        <div className="bg-admin-card p-6 rounded-lg border border-admin-card">
          <h2 className="text-xl font-bold text-admin-text mb-4">System Status</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-admin-text">Worker 1</span>
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 bg-admin-success rounded-full" />
                <span className="text-admin-success text-sm">Healthy</span>
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-admin-text">Worker 2</span>
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 bg-admin-success rounded-full" />
                <span className="text-admin-success text-sm">Healthy</span>
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-admin-text">Worker 3</span>
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 bg-admin-warning rounded-full" />
                <span className="text-admin-warning text-sm">High Load (82%)</span>
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-admin-text">P2P Network</span>
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 bg-admin-success rounded-full" />
                <span className="text-admin-success text-sm">Optimal</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}