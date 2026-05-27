/**
 * StatCard — uses useCurrency() so value reflects user's currency selection.
 */
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { SkeletonCard } from '../../../components/ui/Skeleton';

const StatCard = ({ label, value, trend, accentColor = 'emerald', loading }) => {
  if (loading) return <SkeletonCard />;

  const trendUp = trend >= 0;
  const accents = {
    emerald: 'border-l-emerald-500 bg-emerald-50/50 dark:bg-emerald-900/10',
    blue:    'border-l-blue-500    bg-blue-50/50    dark:bg-blue-900/10',
    red:     'border-l-red-500     bg-red-50/50     dark:bg-red-900/10',
    violet:  'border-l-violet-500  bg-violet-50/50  dark:bg-violet-900/10',
  };

  return (
    <motion.div whileHover={{ y: -2 }}
      className={`bg-white dark:bg-gray-900 border border-slate-200 dark:border-slate-700
                  border-l-4 ${accents[accentColor]} rounded-2xl p-5 shadow-card`}
    >
      <div className="flex items-start justify-between mb-3">
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">{label}</p>
        {trend !== undefined && (
          <span className={`flex items-center gap-0.5 text-xs font-semibold ${trendUp ? 'text-emerald-600' : 'text-red-500'}`}>
            {trendUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {Math.abs(trend)}%
          </span>
        )}
      </div>
      {/* value is pre-formatted by DashboardPage using useCurrency() */}
      <p className="text-xl font-bold text-slate-800 dark:text-slate-100">{value}</p>
    </motion.div>
  );
};

export default StatCard;
