/**
 * CircularProgress — SVG ring progress indicator for goal cards.
 */
import { motion } from 'framer-motion';

const CircularProgress = ({ percentage = 0, size = 96, strokeWidth = 8, label }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.min(percentage, 100) / 100) * circumference;

  const color = percentage >= 100 ? '#8b5cf6'
              : percentage >= 70  ? '#f59e0b'
              : '#10b981';

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        {/* Track */}
        <circle cx={size/2} cy={size/2} r={radius}
          fill="none" stroke="#e2e8f0" strokeWidth={strokeWidth} className="dark:stroke-slate-700" />
        {/* Progress */}
        <motion.circle cx={size/2} cy={size/2} r={radius}
          fill="none" stroke={color} strokeWidth={strokeWidth}
          strokeLinecap="round" strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.0, ease: 'easeOut' }} />
      </svg>
      {/* Center text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-lg font-bold text-slate-800 dark:text-slate-100" style={{ color }}>
          {Math.round(percentage)}%
        </span>
        {label && <span className="text-[9px] text-slate-400 leading-tight">{label}</span>}
      </div>
    </div>
  );
};

export default CircularProgress;
