/**
 * Skeleton — animated loading skeleton shapes.
 */
const Skeleton = ({ className = '', variant = 'text' }) => {
  const shapes = {
    text:    'h-4 rounded-lg',
    card:    'h-32 rounded-2xl',
    circle:  'rounded-full',
    chart:   'h-48 rounded-2xl',
  };
  return (
    <div className={`animate-pulse bg-slate-200 dark:bg-slate-700 ${shapes[variant]} ${className}`} />
  );
};

export const SkeletonCard = () => (
  <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 space-y-3">
    <div className="flex justify-between">
      <Skeleton className="w-24 h-3" />
      <Skeleton variant="circle" className="w-8 h-8" />
    </div>
    <Skeleton className="w-32 h-6" />
    <Skeleton className="w-16 h-3" />
  </div>
);

export default Skeleton;
