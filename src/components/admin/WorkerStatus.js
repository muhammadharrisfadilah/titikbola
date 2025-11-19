// ========================================
// WORKER STATUS COMPONENT
// Display health status of all workers
// ========================================

'use client';

import { useState, useEffect } from 'react';

export default function WorkerStatus() {
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchWorkerStatus();
    
    // Refresh every 30 seconds
    const interval = setInterval(fetchWorkerStatus, 30000);
    return () => clearInterval(interval);
  }, []);
  
  const fetchWorkerStatus = async () => {
    try {
      const response = await fetch('/api/proxy/select', {
        method: 'POST',
      });
      
      if (response.ok) {
        const data = await response.json();
        setWorkers(data.workers || []);
      }
    } catch (error) {
      console.error('Failed to fetch worker status:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const getStatusColor = (status) => {
    return status === 'healthy' ? 'bg-admin-success' : 'bg-admin-danger';
  };
  
  const getLatencyColor = (latency) => {
    if (!latency) return 'text-admin-text-muted';
    if (latency < 100) return 'text-admin-success';
    if (latency < 300) return 'text-admin-warning';
    return 'text-admin-danger';
  };
  
  if (loading) {
    return (
      <div className="bg-admin-card p-6 rounded-lg border border-admin-text-muted/20">
        <div className="text-center text-admin-text-muted">
          Loading worker status...
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-admin-card p-6 rounded-lg border border-admin-text-muted/20">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-admin-text">
          Worker Status
        </h3>
        <button
          onClick={fetchWorkerStatus}
          className="text-sm text-admin-accent hover:text-admin-accent/80 flex items-center gap-1"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </button>
      </div>
      
      <div className="space-y-4">
        {workers.map((worker) => (
          <div key={worker.id} className="flex items-center justify-between p-4 bg-admin-bg rounded-lg">
            <div className="flex items-center gap-4">
              {/* Status indicator */}
              <div className={`w-3 h-3 rounded-full ${getStatusColor(worker.status)}`} />
              
              {/* Worker info */}
              <div>
                <div className="font-semibold text-admin-text">
                  {worker.id}
                </div>
                <div className="text-xs text-admin-text-muted">
                  {worker.url}
                </div>
              </div>
            </div>
            
            {/* Stats */}
            <div className="flex items-center gap-6 text-sm">
              <div>
                <span className="text-admin-text-muted">Latency:</span>
                <span className={`ml-2 font-semibold ${getLatencyColor(worker.latency)}`}>
                  {worker.latency ? `${worker.latency}ms` : 'N/A'}
                </span>
              </div>
              
              <div>
                <span className="text-admin-text-muted">Weight:</span>
                <span className="ml-2 font-semibold text-admin-text">
                  {worker.weight}
                </span>
              </div>
              
              <div>
                <span className="text-admin-text-muted">Failures:</span>
                <span className={`ml-2 font-semibold ${worker.failures > 0 ? 'text-admin-danger' : 'text-admin-success'}`}>
                  {worker.failures}
                </span>
              </div>
              
              {/* Status badge */}
              <span className={`px-2 py-1 rounded text-xs font-semibold ${
                worker.status === 'healthy' 
                  ? 'bg-admin-success/20 text-admin-success' 
                  : 'bg-admin-danger/20 text-admin-danger'
              }`}>
                {worker.status === 'healthy' ? '🟢 Healthy' : '🔴 Unhealthy'}
              </span>
            </div>
          </div>
        ))}
      </div>
      
      {workers.length === 0 && (
        <div className="text-center text-admin-text-muted py-8">
          No workers available
        </div>
      )}
    </div>
  );
}