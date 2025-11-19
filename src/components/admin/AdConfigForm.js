// ========================================
// AD CONFIG FORM COMPONENT
// Configure Monetag and AdSterra settings
// ========================================

'use client';

import { useState } from 'react';

export default function AdConfigForm({ config, onSave }) {
  const [formData, setFormData] = useState({
    // Monetag
    monetag_enabled: config?.monetag_enabled ?? true,
    monetag_zone_id: config?.monetag_zone_id || '',
    monetag_smartlink_id: config?.monetag_smartlink_id || '',
    monetag_inpage_id: config?.monetag_inpage_id || '',
    monetag_vignette_id: config?.monetag_vignette_id || '',
    
    // AdSterra
    adsterra_enabled: config?.adsterra_enabled ?? true,
    adsterra_pub_id: config?.adsterra_pub_id || '',
    adsterra_banner_id: config?.adsterra_banner_id || '',
    
    // Ad Timing
    smartlink_on_load: config?.smartlink_on_load ?? true,
    interstitial_at_halftime: config?.interstitial_at_halftime ?? true,
    vignette_always: config?.vignette_always ?? true,
    inpage_push_delay: config?.inpage_push_delay || 5000,
  });
  
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSaved(false);
    
    try {
      await onSave(formData);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      alert('Failed to save config: ' + error.message);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Monetag Config */}
      <div className="bg-admin-card p-6 rounded-lg">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-admin-text mb-1">
              Monetag Configuration
            </h3>
            <p className="text-sm text-admin-text-muted">
              Configure Monetag ad network settings
            </p>
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name="monetag_enabled"
              checked={formData.monetag_enabled}
              onChange={handleChange}
              className="w-5 h-5 text-admin-accent"
            />
            <span className="text-sm text-admin-text">Enable</span>
          </label>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-admin-text mb-2">
              Zone ID
            </label>
            <input
              type="text"
              name="monetag_zone_id"
              value={formData.monetag_zone_id}
              onChange={handleChange}
              disabled={!formData.monetag_enabled}
              className="w-full bg-admin-bg border border-admin-text-muted rounded px-3 py-2 text-admin-text focus:outline-none focus:border-admin-accent disabled:opacity-50"
              placeholder="1234567"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-admin-text mb-2">
                SmartLink ID
              </label>
              <input
                type="text"
                name="monetag_smartlink_id"
                value={formData.monetag_smartlink_id}
                onChange={handleChange}
                disabled={!formData.monetag_enabled}
                className="w-full bg-admin-bg border border-admin-text-muted rounded px-3 py-2 text-admin-text focus:outline-none focus:border-admin-accent disabled:opacity-50"
                placeholder="smartlink_id"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-admin-text mb-2">
                In-Page Push ID
              </label>
              <input
                type="text"
                name="monetag_inpage_id"
                value={formData.monetag_inpage_id}
                onChange={handleChange}
                disabled={!formData.monetag_enabled}
                className="w-full bg-admin-bg border border-admin-text-muted rounded px-3 py-2 text-admin-text focus:outline-none focus:border-admin-accent disabled:opacity-50"
                placeholder="inpage_id"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-admin-text mb-2">
                Vignette ID
              </label>
              <input
                type="text"
                name="monetag_vignette_id"
                value={formData.monetag_vignette_id}
                onChange={handleChange}
                disabled={!formData.monetag_enabled}
                className="w-full bg-admin-bg border border-admin-text-muted rounded px-3 py-2 text-admin-text focus:outline-none focus:border-admin-accent disabled:opacity-50"
                placeholder="vignette_id"
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* AdSterra Config */}
      <div className="bg-admin-card p-6 rounded-lg">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-admin-text mb-1">
              AdSterra Configuration
            </h3>
            <p className="text-sm text-admin-text-muted">
              Configure AdSterra ad network settings
            </p>
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name="adsterra_enabled"
              checked={formData.adsterra_enabled}
              onChange={handleChange}
              className="w-5 h-5 text-admin-accent"
            />
            <span className="text-sm text-admin-text">Enable</span>
          </label>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-admin-text mb-2">
              Publisher ID
            </label>
            <input
              type="text"
              name="adsterra_pub_id"
              value={formData.adsterra_pub_id}
              onChange={handleChange}
              disabled={!formData.adsterra_enabled}
              className="w-full bg-admin-bg border border-admin-text-muted rounded px-3 py-2 text-admin-text focus:outline-none focus:border-admin-accent disabled:opacity-50"
              placeholder="ABC123"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-admin-text mb-2">
              Banner Ad ID
            </label>
            <input
              type="text"
              name="adsterra_banner_id"
              value={formData.adsterra_banner_id}
              onChange={handleChange}
              disabled={!formData.adsterra_enabled}
              className="w-full bg-admin-bg border border-admin-text-muted rounded px-3 py-2 text-admin-text focus:outline-none focus:border-admin-accent disabled:opacity-50"
              placeholder="banner_id"
            />
          </div>
        </div>
      </div>
      
      {/* Ad Timing */}
      <div className="bg-admin-card p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-admin-text mb-6">
          Ad Timing Settings
        </h3>
        
        <div className="space-y-4">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              name="smartlink_on_load"
              checked={formData.smartlink_on_load}
              onChange={handleChange}
              className="w-5 h-5 text-admin-accent"
            />
            <div>
              <div className="text-sm font-medium text-admin-text">
                SmartLink on Page Load
              </div>
              <div className="text-xs text-admin-text-muted">
                Show pop-under when user enters the site
              </div>
            </div>
          </label>
          
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              name="interstitial_at_halftime"
              checked={formData.interstitial_at_halftime}
              onChange={handleChange}
              className="w-5 h-5 text-admin-accent"
            />
            <div>
              <div className="text-sm font-medium text-admin-text">
                Interstitial at Half-time
              </div>
              <div className="text-xs text-admin-text-muted">
                Show full-screen ad during match break
              </div>
            </div>
          </label>
          
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              name="vignette_always"
              checked={formData.vignette_always}
              onChange={handleChange}
              className="w-5 h-5 text-admin-accent"
            />
            <div>
              <div className="text-sm font-medium text-admin-text">
                Vignette Banner Always Visible
              </div>
              <div className="text-xs text-admin-text-muted">
                Show banner at bottom of player
              </div>
            </div>
          </label>
          
          <div>
            <label className="block text-sm font-medium text-admin-text mb-2">
              In-Page Push Delay (ms)
            </label>
            <input
              type="number"
              name="inpage_push_delay"
              value={formData.inpage_push_delay}
              onChange={handleChange}
              min="0"
              step="1000"
              className="w-full bg-admin-bg border border-admin-text-muted rounded px-3 py-2 text-admin-text focus:outline-none focus:border-admin-accent"
            />
            <p className="text-xs text-admin-text-muted mt-1">
              Delay before showing in-page push notification (5000ms = 5 seconds)
            </p>
          </div>
        </div>
      </div>
      
      {/* Save Button */}
      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={loading}
          className="bg-admin-accent hover:bg-admin-accent/80 text-white font-medium px-6 py-3 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Saving...' : 'Save Configuration'}
        </button>
        
        {saved && (
          <div className="flex items-center gap-2 text-admin-success">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="text-sm font-medium">Saved successfully!</span>
          </div>
        )}
      </div>
    </form>
  );
}