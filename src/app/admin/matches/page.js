// ========================================
// ADMIN MATCHES PAGE
// Match management CRUD interface
// ========================================

'use client';

import { useEffect, useState } from 'react';

export default function AdminMatchesPage() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    home_team: '',
    home_flag: '🏴',
    away_team: '',
    away_flag: '🏴',
    competition: '',
    match_date: '',
    match_time: '',
    status: 'upcoming',
    stream_url1: '',
    stream_url2: '',
    stream_url3: '',
  });
  
  useEffect(() => {
    fetchMatches();
  }, []);
  
  const fetchMatches = async () => {
    try {
      const response = await fetch('/api/admin/matches');
      const data = await response.json();
      setMatches(data.matches || []);
      setLoading(false);
    } catch (error) {
      console.error('Fetch error:', error);
      setLoading(false);
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/admin/matches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      if (response.ok) {
        setShowForm(false);
        setFormData({
          home_team: '',
          home_flag: '🏴',
          away_team: '',
          away_flag: '🏴',
          competition: '',
          match_date: '',
          match_time: '',
          status: 'upcoming',
          stream_url1: '',
          stream_url2: '',
          stream_url3: '',
        });
        fetchMatches();
      }
    } catch (error) {
      console.error('Create error:', error);
    }
  };
  
  const handleDelete = async (id) => {
    if (!confirm('Delete this match?')) return;
    
    try {
      await fetch(`/api/admin/matches/${id}`, { method: 'DELETE' });
      fetchMatches();
    } catch (error) {
      console.error('Delete error:', error);
    }
  };
  
  if (loading) {
    return <div className="text-center py-8"><div className="spinner" /></div>;
  }
  
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-admin-text mb-2">Matches</h1>
          <p className="text-admin-text-muted">Manage all matches</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-admin-accent hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium"
        >
          {showForm ? 'Cancel' : '+ Create Match'}
        </button>
      </div>
      
      {/* Create form */}
      {showForm && (
        <div className="bg-admin-card p-6 rounded-lg border border-admin-card mb-6">
          <h2 className="text-xl font-bold text-admin-text mb-4">New Match</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Home Team"
                value={formData.home_team}
                onChange={(e) => setFormData({...formData, home_team: e.target.value})}
                className="px-4 py-2 bg-admin-bg border border-admin-card rounded text-admin-text"
                required
              />
              <input
                type="text"
                placeholder="Away Team"
                value={formData.away_team}
                onChange={(e) => setFormData({...formData, away_team: e.target.value})}
                className="px-4 py-2 bg-admin-bg border border-admin-card rounded text-admin-text"
                required
              />
              <input
                type="text"
                placeholder="Competition"
                value={formData.competition}
                onChange={(e) => setFormData({...formData, competition: e.target.value})}
                className="px-4 py-2 bg-admin-bg border border-admin-card rounded text-admin-text"
                required
              />
              <input
                type="date"
                value={formData.match_date}
                onChange={(e) => setFormData({...formData, match_date: e.target.value})}
                className="px-4 py-2 bg-admin-bg border border-admin-card rounded text-admin-text"
                required
              />
              <input
                type="time"
                value={formData.match_time}
                onChange={(e) => setFormData({...formData, match_time: e.target.value})}
                className="px-4 py-2 bg-admin-bg border border-admin-card rounded text-admin-text"
                required
              />
              <select
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: e.target.value})}
                className="px-4 py-2 bg-admin-bg border border-admin-card rounded text-admin-text"
              >
                <option value="upcoming">Upcoming</option>
                <option value="live">Live</option>
                <option value="ended">Ended</option>
              </select>
            </div>
            <input
              type="url"
              placeholder="Stream URL 1 (HLS)"
              value={formData.stream_url1}
              onChange={(e) => setFormData({...formData, stream_url1: e.target.value})}
              className="w-full px-4 py-2 bg-admin-bg border border-admin-card rounded text-admin-text"
            />
            <input
              type="url"
              placeholder="Stream URL 2 (HLS)"
              value={formData.stream_url2}
              onChange={(e) => setFormData({...formData, stream_url2: e.target.value})}
              className="w-full px-4 py-2 bg-admin-bg border border-admin-card rounded text-admin-text"
            />
            <input
              type="url"
              placeholder="Stream URL 3 (DASH)"
              value={formData.stream_url3}
              onChange={(e) => setFormData({...formData, stream_url3: e.target.value})}
              className="w-full px-4 py-2 bg-admin-bg border border-admin-card rounded text-admin-text"
            />
            <button type="submit" className="bg-admin-success text-white px-6 py-2 rounded font-medium">
              Create Match
            </button>
          </form>
        </div>
      )}
      
      {/* Matches table */}
      <div className="bg-admin-card rounded-lg border border-admin-card overflow-hidden">
        <table className="w-full">
          <thead className="bg-admin-bg border-b border-admin-card">
            <tr>
              <th className="px-4 py-3 text-left text-admin-text-muted text-sm">Match</th>
              <th className="px-4 py-3 text-left text-admin-text-muted text-sm">Date</th>
              <th className="px-4 py-3 text-left text-admin-text-muted text-sm">Status</th>
              <th className="px-4 py-3 text-right text-admin-text-muted text-sm">Actions</th>
            </tr>
          </thead>
          <tbody>
            {matches.map((match) => (
              <tr key={match.id} className="border-b border-admin-card hover:bg-admin-bg">
                <td className="px-4 py-3 text-admin-text">
                  {match.home_team} vs {match.away_team}
                  <div className="text-xs text-admin-text-muted">{match.competition}</div>
                </td>
                <td className="px-4 py-3 text-admin-text text-sm">
                  {match.match_date} {match.match_time}
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    match.status === 'live' ? 'bg-admin-success text-white' :
                    match.status === 'upcoming' ? 'bg-admin-warning text-white' :
                    'bg-admin-card text-admin-text-muted'
                  }`}>
                    {match.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => handleDelete(match.id)}
                    className="text-admin-danger hover:text-red-400 text-sm"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {matches.length === 0 && (
          <div className="text-center py-8 text-admin-text-muted">
            No matches yet. Create one!
          </div>
        )}
      </div>
    </div>
  );
}