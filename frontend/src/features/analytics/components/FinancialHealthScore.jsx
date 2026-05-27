import { motion } from 'framer-motion';
import { useHealthScore } from '../hooks/useAnalytics';
import Card from '../../../components/ui/Card';
import { Heart } from 'lucide-react';

const FinancialHealthScore = () => {
  const { data: score = 0, isLoading } = useHealthScore();
  const color = score >= 80 ? '#10b981' : score >= 50 ? '#f59e0b' : '#ef4444';
  const label = score >= 80 ? 'Great financial health!' : score >= 50 ? 'Room to improve' : 'Needs attention';

  const circumference = 2 * Math.PI * 40;
  const offset = circumference - (score / 100) * circumference;

  return (
    <Card className="p-5 flex flex-col items-center gap-3">
      <div className="flex items-center gap-2 self-start">
        <Heart size={16} className="text-violet-500" />
        <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200">Financial Health</h3>
      </div>
      {isLoading ? (
        <div className="w-24 h-24 rounded-full bg-slate-100 dark:bg-slate-800 animate-pulse" />
      ) : (
        <div className="relative w-28 h-28">
          <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
            <circle cx="50" cy="50" r="40" fill="none" stroke="#e2e8f0" strokeWidth="8" />
            <motion.circle cx="50" cy="50" r="40" fill="none" stroke={color} strokeWidth="8"
              strokeLinecap="round" strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset: offset }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold" style={{ color }}>{score}</span>
            <span className="text-xs text-slate-400">/100</span>
          </div>
        </div>
      )}
      <p className="text-xs text-slate-500 dark:text-slate-400 text-center">{label}</p>
    </Card>
  );
};

export default FinancialHealthScore;
