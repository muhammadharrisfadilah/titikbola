// ========================================
// LIVE VIEWERS CHART COMPONENT
// Real-time viewers chart using Recharts
// ========================================

'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function LiveViewersChart({ data }) {
  // Sample data structure if none provided
  const sampleData = [
    { time: '18:00', viewers: 2340 },
    { time: '18:30', viewers: 3456 },
    { time: '19:00', viewers: 4532 },
    { time: '19:30', viewers: 5234 },
    { time: '20:00', viewers: 6543 },
    { time: '20:30', viewers: 5432 },
    { time: '21:00', viewers: 4321 },
    { time: '21:30', viewers: 3210 },
  ];
  
  const chartData = data || sampleData;
  
  return (
    <div className="bg-admin-card p-6 rounded-lg border border-admin-text-muted/20">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-admin-text">
          Live Viewers
        </h3>
        <div className="flex items-center gap-2 text-sm text-admin-text-muted">
          <span className="w-3 h-3 bg-admin-accent rounded-full animate-pulse" />
          Real-time
        </div>
      </div>
      
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
          <XAxis 
            dataKey="time" 
            stroke="#9ca3af"
            style={{ fontSize: '12px' }}
          />
          <YAxis 
            stroke="#9ca3af"
            style={{ fontSize: '12px' }}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: '#1a1a1a',
              border: '1px solid #2a2a2a',
              borderRadius: '8px',
              color: '#e5e5e5'
            }}
            labelStyle={{ color: '#9ca3af' }}
          />
          <Line 
            type="monotone" 
            dataKey="viewers" 
            stroke="#3b82f6" 
            strokeWidth={2}
            dot={{ fill: '#3b82f6', r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
      
      <div className="mt-4 grid grid-cols-3 gap-4 text-center">
        <div>
          <p className="text-admin-text-muted text-xs mb-1">Current</p>
          <p className="text-admin-text text-lg font-semibold">
            {chartData[chartData.length - 1]?.viewers || 0}
          </p>
        </div>
        <div>
          <p className="text-admin-text-muted text-xs mb-1">Peak</p>
          <p className="text-admin-text text-lg font-semibold">
            {Math.max(...chartData.map(d => d.viewers))}
          </p>
        </div>
        <div>
          <p className="text-admin-text-muted text-xs mb-1">Average</p>
          <p className="text-admin-text text-lg font-semibold">
            {Math.round(chartData.reduce((sum, d) => sum + d.viewers, 0) / chartData.length)}
          </p>
        </div>
      </div>
    </div>
  );
}