// ========================================
// MATCH FORM COMPONENT
// Create/Edit match form
// ========================================

'use client';

import { useState } from 'react';

export default function MatchForm({ match = null, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    home_team: match?.home_team || '',
    home_flag: match?.home_flag || '🏴',
    away_team: match?.away_team || '',
    away_flag: match?.away_flag || '🏴',
    competition: match?.competition || '',
    match_date: match?.match_date || '',
    match_time: match?.match_time || '',
    status: match?.status || 'upcoming',
    home_score: match?.home_score || 0,
    away_score: match?.away_score || 0,
    thumbnail_url: match?.thumbnail_url || '',
    stream_url1: match?.stream_url1 || '',
    referer1: match?.referer1 || '',
    origin1: match?.origin1 || '',
    stream_url2: match?.stream_url2 || '',
    referer2: match?.referer2 || '',
    origin2: match?.origin2 || '',
    stream_url3: match?.stream_url3 || '',
    referer3: match?.referer3 || '',
    origin3: match?.origin3 || '',
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      await onSubmit(formData);
    } catch (err) {
      setError(err.message || 'Failed to save match');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-admin-danger/10 border border-admin-danger text-admin-danger px-4 py-3 rounded">
          {error}
        </div>
      )}
      
      {/* Basic Info */}
      <div className="bg-admin-card p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-admin-text mb-4">Informasi Pertandingan</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Home Team */}
          <div>
            <label className="block text-sm font-medium text-admin-text mb-2">
              Tim Home
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                name="home_flag"
                value={formData.home_flag}
                onChange={handleChange}
                placeholder="🏴"
                className="w-16 px-3 py-2 bg-admin-bg border border-admin-text-muted rounded text-admin-text"
                required
              />
              <input
                type="text"
                name="home_team"
                value={formData.home_team}
                onChange={handleChange}
                placeholder="Manchester United"
                className="flex-1 px-3 py-2 bg-admin-bg border border-admin-text-muted rounded text-admin-text"
                required
              />
            </div>
          </div>
          
          {/* Away Team */}
          <div>
            <label className="block text-sm font-medium text-admin-text mb-2">
              Tim Away
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                name="away_flag"
                value={formData.away_flag}
                onChange={handleChange}
                placeholder="🏴"
                className="w-16 px-3 py-2 bg-admin-bg border border-admin-text-muted rounded text-admin-text"
                required
              />
              <input
                type="text"
                name="away_team"
                value={formData.away_team}
                onChange={handleChange}
                placeholder="Arsenal"
                className="flex-1 px-3 py-2 bg-admin-bg border border-admin-text-muted rounded text-admin-text"
                required
              />
            </div>
          </div>
          
          {/* Competition */}
          <div>
            <label className="block text-sm font-medium text-admin-text mb-2">
              Kompetisi
            </label>
            <input
              type="text"
              name="competition"
              value={formData.competition}
              onChange={handleChange}
              placeholder="Liga Inggris"
              className="w-full px-3 py-2 bg-admin-bg border border-admin-text-muted rounded text-admin-text"
              required
            />
          </div>
          
          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-admin-text mb-2">
              Tanggal
            </label>
            <input
              type="date"
              name="match_date"
              value={formData.match_date}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-admin-bg border border-admin-text-muted rounded text-admin-text"
              required
            />
          </div>
          
          {/* Time */}
          <div>
            <label className="block text-sm font-medium text-admin-text mb-2">
              Waktu (WIB)
            </label>
            <input
              type="time"
              name="match_time"
              value={formData.match_time}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-admin-bg border border-admin-text-muted rounded text-admin-text"
              required
            />
          </div>
          
          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-admin-text mb-2">
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-admin-bg border border-admin-text-muted rounded text-admin-text"
            >
              <option value="upcoming">Upcoming</option>
              <option value="live">Live</option>
              <option value="ended">Ended</option>
            </select>
          </div>
          
          {/* Scores */}
          <div>
            <label className="block text-sm font-medium text-admin-text mb-2">
              Skor (Home - Away)
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                name="home_score"
                value={formData.home_score}
                onChange={handleChange}
                min="0"
                className="w-full px-3 py-2 bg-admin-bg border border-admin-text-muted rounded text-admin-text"
              />
              <span className="flex items-center text-admin-text">-</span>
              <input
                type="number"
                name="away_score"
                value={formData.away_score}
                onChange={handleChange}
                min="0"
                className="w-full px-3 py-2 bg-admin-bg border border-admin-text-muted rounded text-admin-text"
              />
            </div>
          </div>
          
          {/* Thumbnail */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-admin-text mb-2">
              Thumbnail URL (Optional)
            </label>
            <input
              type="url"
              name="thumbnail_url"
              value={formData.thumbnail_url}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
              className="w-full px-3 py-2 bg-admin-bg border border-admin-text-muted rounded text-admin-text"
            />
          </div>
        </div>
      </div>
      
      {/* Stream Links */}
      {[1, 2, 3].map(num => (
        <div key={num} className="bg-admin-card p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-admin-text mb-4">
            Stream Link {num} {num === 1 ? '(HLS)' : num === 2 ? '(HLS)' : '(DASH)'}
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-admin-text mb-2">
                M3U8/MPD URL
              </label>
              <input
                type="url"
                name={`stream_url${num}`}
                value={formData[`stream_url${num}`]}
                onChange={handleChange}
                placeholder="https://example.com/stream.m3u8"
                className="w-full px-3 py-2 bg-admin-bg border border-admin-text-muted rounded text-admin-text"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-admin-text mb-2">
                  Referer (Optional)
                </label>
                <input
                  type="text"
                  name={`referer${num}`}
                  value={formData[`referer${num}`]}
                  onChange={handleChange}
                  placeholder="https://example.com"
                  className="w-full px-3 py-2 bg-admin-bg border border-admin-text-muted rounded text-admin-text"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-admin-text mb-2">
                  Origin (Optional)
                </label>
                <input
                  type="text"
                  name={`origin${num}`}
                  value={formData[`origin${num}`]}
                  onChange={handleChange}
                  placeholder="https://example.com"
                  className="w-full px-3 py-2 bg-admin-bg border border-admin-text-muted rounded text-admin-text"
                />
              </div>
            </div>
          </div>
        </div>
      ))}
      
      {/* Actions */}
      <div className="flex gap-4 justify-end">
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="px-6 py-2 bg-admin-text-muted text-admin-text rounded hover:bg-opacity-80 transition-colors"
        >
          Batal
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-admin-accent text-white rounded hover:bg-opacity-80 transition-colors disabled:opacity-50"
        >
          {loading ? 'Menyimpan...' : match ? 'Update Match' : 'Create Match'}
        </button>
      </div>
    </form>
  );
}