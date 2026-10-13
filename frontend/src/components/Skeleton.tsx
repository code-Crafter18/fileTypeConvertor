export function SkeletonCard() {
  return (
    <div className="card animate-pulse p-6">
      <div className="skeleton mb-4 h-8 w-8 rounded-lg" />
      <div className="skeleton mb-2 h-4 w-3/4" />
      <div className="skeleton h-3 w-full" />
    </div>
  );
}

export function SkeletonTable() {
  return (
    <div className="card animate-pulse overflow-hidden">
      <div className="border-b border-surface-200 p-4 dark:border-surface-700">
        <div className="skeleton h-4 w-48" />
      </div>
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex items-center gap-4 border-b border-surface-100 p-4 dark:border-surface-700/50">
          <div className="skeleton h-6 w-20 rounded-full" />
          <div className="skeleton h-4 flex-1" />
          <div className="skeleton h-4 w-16" />
          <div className="skeleton h-4 w-24" />
          <div className="skeleton h-8 w-24 rounded-lg" />
        </div>
      ))}
    </div>
  );
}
