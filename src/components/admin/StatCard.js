// ========================================
// STAT CARD COMPONENT
// Dashboard statistics display
// ========================================

export default function StatCard({ icon, label, value, trend, color = 'blue' }) {
  const colorClasses = {
    blue: 'bg-admin-accent/10 text-admin-accent',
    green: 'bg-admin-success/10 text-admin-success',
    red: 'bg-admin-danger/10 text-admin-danger',
    orange: 'bg-admin-warning/10 text-admin-warning',
  };
  
  const iconBg = colorClasses[color] || colorClasses.blue;
  
  return (
    <div className="bg-admin-card p-6 rounded-lg border border-admin-text-muted/20">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-admin-text-muted text-sm font-medium mb-1">
            {label}
          </p>
          <p className="text-admin-text text-3xl font-bold mb-2">
            {value}
          </p>
          {trend && (
            <div className={`flex items-center gap-1 text-sm ${
              trend.direction === 'up' ? 'text-admin-success' : 'text-admin-danger'
            }`}>
              {trend.direction === 'up' ? (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M14.707 12.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
              <span className="font-semibold">{trend.value}</span>
              <span className="text-admin-text-muted">{trend.label}</span>
            </div>
          )}
        </div>
        
        <div className={`p-3 rounded-lg ${iconBg}`}>
          <div className="text-2xl">{icon}</div>
        </div>
      </div>
    </div>
  );
}