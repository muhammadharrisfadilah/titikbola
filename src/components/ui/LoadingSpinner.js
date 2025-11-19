// ========================================
// LOADING COMPONENTS
// Spinner, Skeletons, and loading states
// ========================================

// ========================================
// 1. LOADING SPINNER
// components/ui/LoadingSpinner.js
// ========================================

export function LoadingSpinner({ size = 'md', color = 'accent-red' }) {
  const sizes = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-2',
    lg: 'h-12 w-12 border-3',
    xl: 'h-16 w-16 border-4'
  };

  return (
    <div className={`animate-spin rounded-full ${sizes[size]} border-t-${color} border-r-${color} border-b-transparent border-l-transparent`}></div>
  );
}

// Centered loading spinner
export function LoadingSpinnerCentered({ message = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px]">
      <LoadingSpinner size="lg" />
      {message && (
        <p className="text-text-secondary mt-4">{message}</p>
      )}
    </div>
  );
}

// Full page loading
export function LoadingFullPage() {
  return (
    <div className="fixed inset-0 bg-background flex items-center justify-center z-50">
      <div className="text-center">
        <LoadingSpinner size="xl" />
        <p className="text-text-primary text-xl mt-4">Loading TitikBola...</p>
      </div>
    </div>
  );
}


// ========================================
// 2. MATCH CARD SKELETON
// components/ui/MatchCardSkeleton.js
// ========================================

export function MatchCardSkeleton() {
  return (
    <div className="flex-shrink-0 w-80 animate-pulse">
      <div className="bg-background-card rounded-lg overflow-hidden">
        {/* Thumbnail */}
        <div className="relative aspect-video bg-background-light">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 bg-text-secondary/20 rounded-full"></div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-3">
          {/* Live badge */}
          <div className="w-16 h-5 bg-background-light rounded"></div>

          {/* Teams */}
          <div className="space-y-2">
            <div className="h-6 bg-background-light rounded w-3/4"></div>
            <div className="h-6 bg-background-light rounded w-2/3"></div>
          </div>

          {/* Competition */}
          <div className="h-4 bg-background-light rounded w-1/2"></div>

          {/* Time */}
          <div className="h-4 bg-background-light rounded w-1/3"></div>
        </div>
      </div>
    </div>
  );
}

// Multiple match card skeletons
export function MatchCardSkeletonGrid({ count = 4 }) {
  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {[...Array(count)].map((_, i) => (
        <MatchCardSkeleton key={i} />
      ))}
    </div>
  );
}


// ========================================
// 3. DASHBOARD SKELETON
// components/ui/DashboardSkeleton.js
// ========================================

export function DashboardSkeleton() {
  return (
    <div className="p-8 space-y-6 animate-pulse">
      {/* Header */}
      <div className="h-8 bg-background-card rounded w-1/4"></div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-background-card p-6 rounded-lg space-y-3">
            <div className="h-4 bg-background-light rounded w-1/2"></div>
            <div className="h-8 bg-background-light rounded w-3/4"></div>
            <div className="h-3 bg-background-light rounded w-1/3"></div>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="bg-background-card p-6 rounded-lg">
        <div className="h-6 bg-background-light rounded w-1/4 mb-4"></div>
        <div className="h-64 bg-background-light rounded"></div>
      </div>

      {/* Table */}
      <div className="bg-background-card p-6 rounded-lg">
        <div className="h-6 bg-background-light rounded w-1/4 mb-4"></div>
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-12 bg-background-light rounded"></div>
          ))}
        </div>
      </div>
    </div>
  );
}


// ========================================
// 4. PLAYER SKELETON
// components/ui/PlayerSkeleton.js
// ========================================

export function PlayerSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      {/* Match info bar */}
      <div className="bg-background-card p-4 rounded-lg">
        <div className="flex justify-between items-center">
          <div className="space-y-2">
            <div className="h-6 bg-background-light rounded w-48"></div>
            <div className="h-4 bg-background-light rounded w-32"></div>
          </div>
          <div className="h-8 bg-background-light rounded w-24"></div>
        </div>
      </div>

      {/* Video player */}
      <div className="relative w-full aspect-video bg-background-card rounded-lg flex items-center justify-center">
        <div className="w-20 h-20 bg-background-light rounded-full"></div>
      </div>

      {/* Link selector */}
      <div className="flex gap-2">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-10 bg-background-card rounded flex-1"></div>
        ))}
      </div>
    </div>
  );
}


// ========================================
// 5. TABLE SKELETON
// components/ui/TableSkeleton.js
// ========================================

export function TableSkeleton({ rows = 5, columns = 5 }) {
  return (
    <div className="overflow-x-auto animate-pulse">
      <table className="w-full">
        <thead>
          <tr className="border-b border-text-secondary/20">
            {[...Array(columns)].map((_, i) => (
              <th key={i} className="py-3 px-4">
                <div className="h-4 bg-background-light rounded"></div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {[...Array(rows)].map((_, rowIndex) => (
            <tr key={rowIndex} className="border-b border-text-secondary/10">
              {[...Array(columns)].map((_, colIndex) => (
                <td key={colIndex} className="py-3 px-4">
                  <div className="h-4 bg-background-card rounded"></div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}


// ========================================
// 6. FORM SKELETON
// components/ui/FormSkeleton.js
// ========================================

export function FormSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {[...Array(5)].map((_, i) => (
        <div key={i}>
          <div className="h-4 bg-background-light rounded w-1/4 mb-2"></div>
          <div className="h-10 bg-background-card rounded"></div>
        </div>
      ))}
      <div className="flex gap-4">
        <div className="h-10 bg-accent-red/20 rounded flex-1"></div>
        <div className="h-10 bg-background-card rounded flex-1"></div>
      </div>
    </div>
  );
}


// ========================================
// 7. ANALYTICS SKELETON
// components/ui/AnalyticsSkeleton.js
// ========================================

export function AnalyticsSkeleton() {
  return (
    <div className="p-8 space-y-6 animate-pulse">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="h-8 bg-background-card rounded w-1/4"></div>
        <div className="flex gap-4">
          <div className="h-10 bg-background-card rounded w-32"></div>
          <div className="h-10 bg-background-card rounded w-32"></div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-background-card p-6 rounded-lg space-y-3">
            <div className="h-4 bg-background-light rounded w-1/2"></div>
            <div className="h-8 bg-background-light rounded w-3/4"></div>
            <div className="h-3 bg-background-light rounded w-1/3"></div>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="bg-background-card p-6 rounded-lg">
        <div className="h-6 bg-background-light rounded w-1/3 mb-4"></div>
        <div className="h-64 bg-background-light rounded"></div>
      </div>

      {/* Two columns */}
      <div className="grid grid-cols-2 gap-6">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="bg-background-card p-6 rounded-lg space-y-3">
            <div className="h-6 bg-background-light rounded w-1/2 mb-4"></div>
            {[...Array(4)].map((_, j) => (
              <div key={j} className="h-8 bg-background-light rounded"></div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}


// ========================================
// 8. USAGE EXAMPLES
// ========================================

/*
// Example 1: In a page with data fetching
export default function MyPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchData().then(data => {
      setData(data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <DashboardSkeleton />;
  }

  return <div>{data}</div>;
}

// Example 2: In a match carousel
function MatchCarousel() {
  const [matches, setMatches] = useState(null);

  if (!matches) {
    return <MatchCardSkeletonGrid count={4} />;
  }

  return (
    <div className="flex gap-4">
      {matches.map(match => <MatchCard key={match.id} match={match} />)}
    </div>
  );
}

// Example 3: Button with loading state
function SubmitButton({ loading, onClick }) {
  return (
    <button onClick={onClick} disabled={loading}>
      {loading ? (
        <LoadingSpinner size="sm" />
      ) : (
        'Submit'
      )}
    </button>
  );
}
*/