// ========================================
// PROXY LOAD BALANCER
// Smart selection of best worker
// ========================================

import { API_CONFIG } from '@/lib/utils/constants';

class ProxyLoadBalancer {
  constructor() {
    this.workers = API_CONFIG.WORKERS.map((url, index) => ({
      url,
      id: `proxy-${index + 1}`,
      weight: 10,
      failures: 0,
      latency: null,
      lastCheck: null,
    }));
    
    this.healthCheckInterval = null;
  }
  
  /**
   * Start health checking
   */
  startHealthCheck() {
    if (this.healthCheckInterval) return;
    
    // Initial check
    this.checkAllWorkers();
    
    // Periodic checks
    this.healthCheckInterval = setInterval(() => {
      this.checkAllWorkers();
    }, 30000); // Every 30 seconds
  }
  
  /**
   * Stop health checking
   */
  stopHealthCheck() {
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
      this.healthCheckInterval = null;
    }
  }
  
  /**
   * Check all workers health
   */
  async checkAllWorkers() {
    const checks = this.workers.map(worker => this.checkWorkerHealth(worker));
    await Promise.allSettled(checks);
  }
  
  /**
   * Check single worker health
   */
  async checkWorkerHealth(worker) {
    const start = Date.now();
    
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 5000);
      
      const response = await fetch(`${worker.url}/health`, {
        method: 'HEAD',
        signal: controller.signal,
      });
      
      clearTimeout(timeout);
      
      if (response.ok) {
        worker.latency = Date.now() - start;
        worker.failures = 0;
        // Higher weight for faster workers
        worker.weight = Math.max(1, 10 - Math.floor(worker.latency / 100));
        
        console.log(`[HEALTH] ${worker.id}: OK (${worker.latency}ms, weight: ${worker.weight})`);
      } else {
        throw new Error(`HTTP ${response.status}`);
      }
      
    } catch (error) {
      worker.failures++;
      worker.weight = Math.max(1, worker.weight - 2);
      
      console.warn(`[HEALTH] ${worker.id}: FAIL (${error.message}, failures: ${worker.failures})`);
    }
    
    worker.lastCheck = Date.now();
  }
  
  /**
   * Select best worker using weighted random
   */
  selectWorker() {
    // Filter out workers with too many failures
    const available = this.workers.filter(w => w.failures < 3);
    
    if (available.length === 0) {
      // All failed, reset and try first
      console.warn('[BALANCER] All workers failed, resetting...');
      this.workers.forEach(w => w.failures = 0);
      return this.workers[0];
    }
    
    // Weighted random selection
    const totalWeight = available.reduce((sum, w) => sum + w.weight, 0);
    let random = Math.random() * totalWeight;
    
    for (const worker of available) {
      random -= worker.weight;
      if (random <= 0) {
        console.log(`[BALANCER] Selected ${worker.id} (weight: ${worker.weight})`);
        return worker;
      }
    }
    
    return available[0];
  }
  
  /**
   * Make request with automatic retry and fallback
   */
  async request(endpoint, options = {}) {
    const maxRetries = 3;
    let attempt = 0;
    let lastError;
    
    while (attempt < maxRetries) {
      const worker = this.selectWorker();
      
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT);
        
        const response = await fetch(`${worker.url}${endpoint}`, {
          ...options,
          signal: controller.signal,
        });
        
        clearTimeout(timeout);
        
        if (response.ok) {
          worker.failures = 0;
          return response;
        }
        
        throw new Error(`HTTP ${response.status}`);
        
      } catch (error) {
        worker.failures++;
        lastError = error;
        attempt++;
        
        console.error(`[BALANCER] ${worker.id} failed (attempt ${attempt}/${maxRetries}):`, error.message);
        
        if (attempt < maxRetries) {
          // Exponential backoff
          await new Promise(r => setTimeout(r, Math.pow(2, attempt) * 1000));
        }
      }
    }
    
    throw new Error(`All workers failed: ${lastError?.message || 'Unknown error'}`);
  }
  
  /**
   * Get worker status (for admin dashboard)
   */
  getStatus() {
    return this.workers.map(w => ({
      id: w.id,
      url: w.url,
      weight: w.weight,
      failures: w.failures,
      latency: w.latency,
      lastCheck: w.lastCheck,
      status: w.failures < 3 ? 'healthy' : 'unhealthy',
    }));
  }
}

// Singleton instance
let balancerInstance = null;

export function getProxyBalancer() {
  if (!balancerInstance) {
    balancerInstance = new ProxyLoadBalancer();
  }
  return balancerInstance;
}

export default ProxyLoadBalancer;