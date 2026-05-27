/**
 * Badge — category color pills and status indicators.
 */
const CATEGORY_COLORS = {
  'Food & Dining':    'bg-orange-100 text-orange-700',
  'Transportation':   'bg-blue-100   text-blue-700',
  'Shopping':         'bg-violet-100 text-violet-700',
  'Entertainment':    'bg-pink-100   text-pink-700',
  'Bills & Utilities':'bg-yellow-100 text-yellow-700',
  'Health':           'bg-red-100    text-red-700',
  'Education':        'bg-teal-100   text-teal-700',
  'Travel':           'bg-sky-100    text-sky-700',
  'Salary':           'bg-emerald-100 text-emerald-700',
  'Freelance':        'bg-lime-100   text-lime-700',
  'Investment':       'bg-indigo-100 text-indigo-700',
  'Other':            'bg-slate-100  text-slate-600',
};

const Badge = ({ label, variant = 'category', className = '' }) => {
  const colors = variant === 'category'
    ? (CATEGORY_COLORS[label] || 'bg-slate-100 text-slate-600')
    : 'bg-slate-100 text-slate-600';

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${colors} ${className}`}>
      {label}
    </span>
  );
};

export default Badge;
