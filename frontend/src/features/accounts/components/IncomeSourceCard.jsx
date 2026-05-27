/**
 * IncomeSourceCard — displays one income source with status badge.
 */
import { motion } from 'framer-motion';
import { Pencil, Trash2, Pause, Play } from 'lucide-react';
import { formatCurrency } from '../../../lib/formatCurrency';
import { useCurrency } from '../../../contexts/AuthContext';
import { useUpdateIncome } from '../hooks/useAccounts';

const CATEGORY_CONFIG = {
  salary:      { label: 'Salary',       icon: '💼', color: 'text-blue-600    bg-blue-50    dark:bg-blue-900/20'    },
  freelance:   { label: 'Freelance',    icon: '💻', color: 'text-violet-600  bg-violet-50  dark:bg-violet-900/20'  },
  scholarship: { label: 'Scholarship',  icon: '🎓', color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20' },
  passive:     { label: 'Passive',      icon: '📈', color: 'text-amber-600   bg-amber-50   dark:bg-amber-900/20'   },
  business:    { label: 'Business',     icon: '🏢', color: 'text-orange-600  bg-orange-50  dark:bg-orange-900/20'  },
  side_income: { label: 'Side Income',  icon: '⚡', color: 'text-pink-600    bg-pink-50    dark:bg-pink-900/20'    },
  other:       { label: 'Other',        icon: '💰', color: 'text-slate-600   bg-slate-100  dark:bg-slate-800'      },
};

const FREQ_LABELS = {
  weekly: 'Weekly', bi_weekly: 'Bi-weekly', monthly: 'Monthly',
  quarterly: 'Quarterly', annually: 'Annually', one_time: 'One-time',
};

const IncomeSourceCard = ({ source, onEdit, onDelete }) => {
  const currency = useCurrency();
  const { mutate: doUpdate } = useUpdateIncome();
  const cfg = CATEGORY_CONFIG[source.category] || CATEGORY_CONFIG.other;
  const isActive = source.status === 'active';

  const toggleStatus = () => {
    doUpdate({ id: source.id, data: { status: isActive ? 'paused' : 'active' } });
  };

  return (
    <motion.div whileHover={{ y: -2 }}
      className={`bg-white dark:bg-gray-900 border rounded-2xl p-5 shadow-card transition-all
        ${isActive ? 'border-slate-200 dark:border-slate-700' : 'border-dashed border-slate-300 dark:border-slate-600 opacity-75'}`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl ${cfg.color.split(' ').slice(1).join(' ')}`}>
            {cfg.icon}
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{source.source_name}</p>
            {source.employer && <p className="text-xs text-slate-400">{source.employer}</p>}
          </div>
        </div>

        <div className="flex items-center gap-1">
          {/* Pause / Resume */}
          <button onClick={toggleStatus}
            className={`p-1.5 rounded-lg transition-colors
              ${isActive ? 'hover:bg-amber-50 text-slate-400 hover:text-amber-500' : 'hover:bg-emerald-50 text-slate-400 hover:text-emerald-500'}`}
            title={isActive ? 'Pause' : 'Resume'}>
            {isActive ? <Pause size={13} /> : <Play size={13} />}
          </button>
          <button onClick={() => onEdit(source)} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 transition-colors"><Pencil size={13} /></button>
          <button onClick={() => onDelete(source.id)} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-slate-400 hover:text-red-500 transition-colors"><Trash2 size={13} /></button>
        </div>
      </div>

      <div className="flex items-end justify-between">
        <div>
          <p className="text-xl font-bold text-slate-800 dark:text-slate-100">
            {formatCurrency(source.income_amount, currency)}
          </p>
          <p className="text-xs text-slate-400">{FREQ_LABELS[source.frequency] || source.frequency}</p>
        </div>
        <div className="text-right">
          <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${cfg.color.split(' ')[0]} ${cfg.color.split(' ').slice(1).join(' ')}`}>
            {cfg.label}
          </span>
          {!isActive && (
            <p className="text-xs text-amber-500 mt-1">Paused</p>
          )}
        </div>
      </div>

      {source.monthly_equivalent !== undefined && source.frequency !== 'monthly' && (
        <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          <p className="text-xs text-slate-400">
            ≈ <span className="font-medium text-slate-600 dark:text-slate-300">
              {formatCurrency(source.monthly_equivalent, currency)}/month
            </span>
          </p>
        </div>
      )}
    </motion.div>
  );
};

export default IncomeSourceCard;
