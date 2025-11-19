// ========================================
// ADMIN SETTINGS PAGE
// System configuration and management
// ========================================

'use client';

import { useState } from 'react';

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState('workers');
  const [saving, setSaving] = useState(false);
  
  const [workers, setWorkers] = useState([
    {
      id: 'proxy-1',
      url: process.env.NEXT_PUBLIC_WORKER_1_URL || '',
      status: 'healthy',
      usage: 45231,
      limit: 100000,
    },
    {
      id: 'proxy-2',
      url: process.env.NEXT_PUBLIC_WORKER_2_URL || '',
      status: 'healthy',
      usage: 38562,
      limit: 100000,
    },
    {
      id: 'proxy-3',
      url: process.env.NEXT_PUBLIC_WORKER_3_URL || '',
      status: 'warning',
      usage: 82143,
      limit: 100000,
    },
  ]);
  
  const [adsConfig, setAdsConfig] = useState({
    monetag: {
      enabled: true,
      zoneId: process.env.NEXT_PUBLIC_MONETAG_ZONE_ID || '',
      smartlinkId: process.env.NEXT_PUBLIC_MONETAG_SMARTLINK_ID || '',
      inpageId: process.env.NEXT_PUBLIC_MONETAG_INPAGE_ID || '',
      vignetteId: process.env.NEXT_PUBLIC_MONETAG_VIGNETTE_ID || '',
    },
    adsterra: {
      enabled: true,
      pubId: process.env.NEXT_PUBLIC_ADSTERRA_PUB_ID || '',
      bannerId: process.env.NEXT_PUBLIC_ADSTERRA_BANNER_ID || '',
    },
  });
  
  const [siteConfig, setSiteConfig] = useState({
    siteName: 'TitikBola',
    siteTagline: 'Streaming Bola Gratis HD',
    maintenanceMode: false,
    p2pEnabled: true,
    p2pSeederRatio: 10,
  });
  
  const handleSaveWorkers = async () => {
    setSaving(true);
    // Save workers config
    setTimeout(() => {
      setSaving(false);
      alert('Workers configuration saved!');
    }, 1000);
  };
  
  const handleSaveAds = async () => {
    setSaving(true);
    // Save ads config
    setTimeout(() => {
      setSaving(false);
      alert('Ads configuration saved!');
    }, 1000);
  };
  
  const handleSaveSite = async () => {
    setSaving(true);
    // Save site config
    setTimeout(() => {
      setSaving(false);
      alert('Site configuration saved!');
    }, 1000);
  };
  
  const testWorker = async (workerId) => {
    const worker = workers.find(w => w.id === workerId);
    if (!worker) return;
    
    try {
      const response = await fetch(`${worker.url}/health`);
      if (response.ok) {
        alert(`${workerId} is healthy!`);
      } else {
        alert(`${workerId} returned error: ${response.status}`);
      }
    } catch (error) {
      alert(`${workerId} failed: ${error.message}`);
    }
  };
  
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-admin-text mb-2">Settings</h1>
        <p className="text-admin-text-muted">Configure system settings and integrations</p>
      </div>
      
      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-admin-card">
        {[
          { id: 'workers', label: 'Workers', icon: '🔧' },
          { id: 'ads', label: 'Ads', icon: '💰' },
          { id: 'site', label: 'Site', icon: '⚙️' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-6 py-3 font-medium transition-colors ${
              activeTab === tab.id
                ? 'text-admin-accent border-b-2 border-admin-accent'
                : 'text-admin-text-muted hover:text-admin-text'
            }`}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>
      
      {/* Workers Tab */}
      {activeTab === 'workers' && (
        <div className="space-y-6">
          <div className="bg-admin-card p-6 rounded-lg border border-admin-card">
            <h2 className="text-xl font-bold text-admin-text mb-4">Proxy Workers</h2>
            <p className="text-admin-text-muted mb-6">
              Manage Cloudflare Worker proxies for load balancing
            </p>
            
            <div className="space-y-4">
              {workers.map((worker) => (
                <div key={worker.id} className="border border-admin-card rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="text-admin-text font-medium">{worker.id}</h3>
                      <p className="text-sm text-admin-text-muted break-all">{worker.url}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        worker.status === 'healthy' 
                          ? 'bg-admin-success/20 text-admin-success'
                          : 'bg-admin-warning/20 text-admin-warning'
                      }`}>
                        {worker.status === 'healthy' ? '🟢 Healthy' : '🟡 Warning'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-admin-text-muted">Usage</span>
                      <span className="text-admin-text">
                        {worker.usage.toLocaleString()} / {worker.limit.toLocaleString()}
                      </span>
                    </div>
                    <div className="w-full bg-admin-bg rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all ${
                          (worker.usage / worker.limit) > 0.8 
                            ? 'bg-admin-warning' 
                            : 'bg-admin-success'
                        }`}
                        style={{ width: `${(worker.usage / worker.limit) * 100}%` }}
                      />
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => testWorker(worker.id)}
                      className="px-4 py-2 bg-admin-bg hover:bg-admin-accent hover:text-white text-admin-text text-sm rounded transition-colors"
                    >
                      Test Health
                    </button>
                    <button className="px-4 py-2 bg-admin-bg hover:bg-admin-accent hover:text-white text-admin-text text-sm rounded transition-colors">
                      View Logs
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 pt-6 border-t border-admin-card">
              <h3 className="text-admin-text font-medium mb-4">Load Balancing Strategy</h3>
              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="radio" name="strategy" defaultChecked className="w-4 h-4" />
                  <div>
                    <div className="text-admin-text font-medium">Weighted Random</div>
                    <div className="text-sm text-admin-text-muted">Distribute based on worker health and latency</div>
                  </div>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="radio" name="strategy" className="w-4 h-4" />
                  <div>
                    <div className="text-admin-text font-medium">Round Robin</div>
                    <div className="text-sm text-admin-text-muted">Cycle through workers equally</div>
                  </div>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="radio" name="strategy" className="w-4 h-4" />
                  <div>
                    <div className="text-admin-text font-medium">Least Used</div>
                    <div className="text-sm text-admin-text-muted">Always use worker with lowest usage</div>
                  </div>
                </label>
              </div>
            </div>
            
            <button
              onClick={handleSaveWorkers}
              disabled={saving}
              className="mt-6 bg-admin-accent hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Workers Config'}
            </button>
          </div>
        </div>
      )}
      
      {/* Ads Tab */}
      {activeTab === 'ads' && (
        <div className="space-y-6">
          {/* Monetag */}
          <div className="bg-admin-card p-6 rounded-lg border border-admin-card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-admin-text">Monetag Configuration</h2>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={adsConfig.monetag.enabled}
                  onChange={(e) => setAdsConfig({
                    ...adsConfig,
                    monetag: { ...adsConfig.monetag, enabled: e.target.checked }
                  })}
                  className="w-5 h-5"
                />
                <span className="text-admin-text font-medium">Enabled</span>
              </label>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-admin-text text-sm font-medium mb-2">
                  Zone ID
                </label>
                <input
                  type="text"
                  value={adsConfig.monetag.zoneId}
                  onChange={(e) => setAdsConfig({
                    ...adsConfig,
                    monetag: { ...adsConfig.monetag, zoneId: e.target.value }
                  })}
                  className="w-full px-4 py-2 bg-admin-bg border border-admin-card rounded text-admin-text"
                  placeholder="Your Monetag Zone ID"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-admin-text text-sm font-medium mb-2">
                    SmartLink ID
                  </label>
                  <input
                    type="text"
                    value={adsConfig.monetag.smartlinkId}
                    onChange={(e) => setAdsConfig({
                      ...adsConfig,
                      monetag: { ...adsConfig.monetag, smartlinkId: e.target.value }
                    })}
                    className="w-full px-4 py-2 bg-admin-bg border border-admin-card rounded text-admin-text"
                  />
                </div>
                <div>
                  <label className="block text-admin-text text-sm font-medium mb-2">
                    In-Page ID
                  </label>
                  <input
                    type="text"
                    value={adsConfig.monetag.inpageId}
                    onChange={(e) => setAdsConfig({
                      ...adsConfig,
                      monetag: { ...adsConfig.monetag, inpageId: e.target.value }
                    })}
                    className="w-full px-4 py-2 bg-admin-bg border border-admin-card rounded text-admin-text"
                  />
                </div>
                <div>
                  <label className="block text-admin-text text-sm font-medium mb-2">
                    Vignette ID
                  </label>
                  <input
                    type="text"
                    value={adsConfig.monetag.vignetteId}
                    onChange={(e) => setAdsConfig({
                      ...adsConfig,
                      monetag: { ...adsConfig.monetag, vignetteId: e.target.value }
                    })}
                    className="w-full px-4 py-2 bg-admin-bg border border-admin-card rounded text-admin-text"
                  />
                </div>
              </div>
            </div>
          </div>
          
          {/* AdSterra */}
          <div className="bg-admin-card p-6 rounded-lg border border-admin-card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-admin-text">AdSterra Configuration</h2>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={adsConfig.adsterra.enabled}
                  onChange={(e) => setAdsConfig({
                    ...adsConfig,
                    adsterra: { ...adsConfig.adsterra, enabled: e.target.checked }
                  })}
                  className="w-5 h-5"
                />
                <span className="text-admin-text font-medium">Enabled</span>
              </label>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-admin-text text-sm font-medium mb-2">
                  Publisher ID
                </label>
                <input
                  type="text"
                  value={adsConfig.adsterra.pubId}
                  onChange={(e) => setAdsConfig({
                    ...adsConfig,
                    adsterra: { ...adsConfig.adsterra, pubId: e.target.value }
                  })}
                  className="w-full px-4 py-2 bg-admin-bg border border-admin-card rounded text-admin-text"
                  placeholder="Your AdSterra Publisher ID"
                />
              </div>
              <div>
                <label className="block text-admin-text text-sm font-medium mb-2">
                  Banner ID
                </label>
                <input
                  type="text"
                  value={adsConfig.adsterra.bannerId}
                  onChange={(e) => setAdsConfig({
                    ...adsConfig,
                    adsterra: { ...adsConfig.adsterra, bannerId: e.target.value }
                  })}
                  className="w-full px-4 py-2 bg-admin-bg border border-admin-card rounded text-admin-text"
                  placeholder="Banner Ad ID"
                />
              </div>
            </div>
          </div>
          
          {/* Ad Timing */}
          <div className="bg-admin-card p-6 rounded-lg border border-admin-card">
            <h2 className="text-xl font-bold text-admin-text mb-4">Ad Timing</h2>
            <div className="space-y-3">
              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <div className="text-admin-text font-medium">Pop on Load</div>
                  <div className="text-sm text-admin-text-muted">Show pop-under when user first visits</div>
                </div>
                <input type="checkbox" defaultChecked className="w-5 h-5" />
              </label>
              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <div className="text-admin-text font-medium">Interstitial at Half-time</div>
                  <div className="text-sm text-admin-text-muted">Show full-screen ad during match breaks</div>
                </div>
                <input type="checkbox" defaultChecked className="w-5 h-5" />
              </label>
              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <div className="text-admin-text font-medium">Vignette Banner</div>
                  <div className="text-sm text-admin-text-muted">Fixed bottom banner</div>
                </div>
                <input type="checkbox" defaultChecked className="w-5 h-5" />
              </label>
            </div>
          </div>
          
          <button
            onClick={handleSaveAds}
            disabled={saving}
            className="bg-admin-accent hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Ads Config'}
          </button>
        </div>
      )}
      
      {/* Site Tab */}
      {activeTab === 'site' && (
        <div className="space-y-6">
          <div className="bg-admin-card p-6 rounded-lg border border-admin-card">
            <h2 className="text-xl font-bold text-admin-text mb-4">Site Configuration</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-admin-text text-sm font-medium mb-2">
                  Site Name
                </label>
                <input
                  type="text"
                  value={siteConfig.siteName}
                  onChange={(e) => setSiteConfig({ ...siteConfig, siteName: e.target.value })}
                  className="w-full px-4 py-2 bg-admin-bg border border-admin-card rounded text-admin-text"
                />
              </div>
              
              <div>
                <label className="block text-admin-text text-sm font-medium mb-2">
                  Site Tagline
                </label>
                <input
                  type="text"
                  value={siteConfig.siteTagline}
                  onChange={(e) => setSiteConfig({ ...siteConfig, siteTagline: e.target.value })}
                  className="w-full px-4 py-2 bg-admin-bg border border-admin-card rounded text-admin-text"
                />
              </div>
              
              <div className="pt-4 border-t border-admin-card">
                <label className="flex items-center justify-between cursor-pointer">
                  <div>
                    <div className="text-admin-text font-medium">Maintenance Mode</div>
                    <div className="text-sm text-admin-text-muted">Temporarily disable site access</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={siteConfig.maintenanceMode}
                    onChange={(e) => setSiteConfig({ ...siteConfig, maintenanceMode: e.target.checked })}
                    className="w-5 h-5"
                  />
                </label>
              </div>
            </div>
          </div>
          
          <div className="bg-admin-card p-6 rounded-lg border border-admin-card">
            <h2 className="text-xl font-bold text-admin-text mb-4">P2P Settings</h2>
            
            <div className="space-y-4">
              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <div className="text-admin-text font-medium">Enable P2P</div>
                  <div className="text-sm text-admin-text-muted">Use peer-to-peer for bandwidth saving</div>
                </div>
                <input
                  type="checkbox"
                  checked={siteConfig.p2pEnabled}
                  onChange={(e) => setSiteConfig({ ...siteConfig, p2pEnabled: e.target.checked })}
                  className="w-5 h-5"
                />
              </label>
              
              <div>
                <label className="block text-admin-text text-sm font-medium mb-2">
                  Seeder Ratio: {siteConfig.p2pSeederRatio}%
                </label>
                <input
                  type="range"
                  min="5"
                  max="20"
                  value={siteConfig.p2pSeederRatio}
                  onChange={(e) => setSiteConfig({ ...siteConfig, p2pSeederRatio: parseInt(e.target.value) })}
                  className="w-full"
                />
                <div className="text-sm text-admin-text-muted mt-1">
                  Percentage of users that act as seeders
                </div>
              </div>
            </div>
          </div>
          
          <button
            onClick={handleSaveSite}
            disabled={saving}
            className="bg-admin-accent hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Site Config'}
          </button>
        </div>
      )}
    </div>
  );
}