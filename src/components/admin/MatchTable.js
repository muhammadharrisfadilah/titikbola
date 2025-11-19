// ========================================
// MATCH TABLE COMPONENT
// Display matches in admin table
// ========================================

'use client';

export default function MatchTable({ matches, onEdit, onDelete, onStatusChange }) {
  const getStatusBadge = (status) => {
    const styles = {
      live: 'bg-admin-danger text-white',
      upcoming: 'bg-admin-warning text-white',
      ended: 'bg-admin-text-muted text-white',
    };
    
    const labels = {
      live: '🔴 Live',
      upcoming: '🔜 Upcoming',
      ended: '⚫ Ended',
    };
    
    return (
      <span className={`px-2 py-1 rounded text-xs font-semibold ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };
  
  if (!matches || matches.length === 0) {
    return (
      <div className="text-center py-12 text-admin-text-muted">
        <div className="text-4xl mb-4">⚽</div>
        <p>Belum ada pertandingan</p>
      </div>
    );
  }
  
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-admin-text-muted">
            <th className="px-4 py-3 text-left text-sm font-semibold text-admin-text">ID</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-admin-text">Match</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-admin-text">Competition</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-admin-text">Date/Time</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-admin-text">Score</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-admin-text">Status</th>
            <th className="px-4 py-3 text-right text-sm font-semibold text-admin-text">Actions</th>
          </tr>
        </thead>
        <tbody>
          {matches.map((match) => (
            <tr key={match.id} className="border-b border-admin-text-muted/30 hover:bg-admin-bg/50">
              <td className="px-4 py-3 text-sm text-admin-text">
                #{match.id}
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{match.home_flag}</span>
                  <span className="text-sm text-admin-text">{match.home_team}</span>
                  <span className="text-admin-text-muted">vs</span>
                  <span className="text-sm text-admin-text">{match.away_team}</span>
                  <span className="text-xl">{match.away_flag}</span>
                </div>
              </td>
              <td className="px-4 py-3 text-sm text-admin-text">
                {match.competition}
              </td>
              <td className="px-4 py-3 text-sm text-admin-text">
                <div>{match.match_date}</div>
                <div className="text-admin-text-muted">{match.match_time}</div>
              </td>
              <td className="px-4 py-3 text-sm text-admin-text font-semibold">
                {match.home_score} - {match.away_score}
              </td>
              <td className="px-4 py-3">
                {getStatusBadge(match.status)}
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center justify-end gap-2">
                  {/* Quick status change */}
                  <select
                    value={match.status}
                    onChange={(e) => onStatusChange(match.id, e.target.value)}
                    className="px-2 py-1 text-xs bg-admin-bg border border-admin-text-muted rounded text-admin-text"
                  >
                    <option value="upcoming">Upcoming</option>
                    <option value="live">Live</option>
                    <option value="ended">Ended</option>
                  </select>
                  
                  {/* Edit */}
                  <button
                    onClick={() => onEdit(match)}
                    className="p-2 text-admin-accent hover:bg-admin-accent/20 rounded transition-colors"
                    title="Edit"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  
                  {/* View */}
                  <a
                    href={`/match/${match.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-admin-success hover:bg-admin-success/20 rounded transition-colors"
                    title="View"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </a>
                  
                  {/* Delete */}
                  <button
                    onClick={() => {
                      if (confirm('Yakin ingin menghapus pertandingan ini?')) {
                        onDelete(match.id);
                      }
                    }}
                    className="p-2 text-admin-danger hover:bg-admin-danger/20 rounded transition-colors"
                    title="Delete"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}