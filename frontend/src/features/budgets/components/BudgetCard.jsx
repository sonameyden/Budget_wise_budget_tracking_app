import { motion } from 'framer-motion';
import { Pencil, Trash2 } from 'lucide-react';
import { formatCurrency } from '../../../lib/formatCurrency';
import { useCurrency } from '../../../contexts/AuthContext';

const ICONS = { 'Food & Dining':'🍔','Transportation':'🚗','Shopping':'🛍️','Entertainment':'🎮',
  'Bills & Utilities':'💡','Health':'❤️','Education':'📚','Travel':'✈️','Other':'📌' };

const BudgetCard = ({ budget, onEdit, onDelete }) => {
  const currency = useCurrency();
  const spent = budget.spent || 0;
  const pct   = Math.min(Math.round((spent / budget.limit_amount) * 100), 999);
  const over  = spent > budget.limit_amount;
  const remaining = budget.limit_amount - spent;

  return (
    <motion.div whileHover={{ y: -2 }}
      className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 shadow-card">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{ICONS[budget.category] || '💰'}</span>
          <div>
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{budget.category}</p>
            <p className="text-xs text-slate-400">monthly</p>
          </div>
        </div>
        <div className="flex gap-1">
          <button onClick={() => onEdit(budget)} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 transition-colors"><Pencil size={13} /></button>
          <button onClick={() => onDelete(budget.id)} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-slate-400 hover:text-red-500 transition-colors"><Trash2 size={13} /></button>
        </div>
      </div>

      <div className="flex justify-between text-xs text-slate-500 mb-2">
        <span>{formatCurrency(spent, currency)} spent</span>
        <span className={over ? 'text-red-500 font-semibold' : 'text-slate-500'}>
          {over ? '-' : ''}{formatCurrency(Math.abs(remaining), currency)} {over ? 'over' : 'left'}
        </span>
      </div>

      <div className="h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mb-2">
        <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min(pct, 100)}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className={`h-full rounded-full ${over ? 'bg-red-500' : 'bg-emerald-500'}`} />
      </div>

      <div className="flex justify-between text-xs">
        <span className={`font-medium ${over ? 'text-red-500' : 'text-slate-500'}`}>{pct}% used</span>
        <span className="text-slate-400">{formatCurrency(budget.limit_amount, currency)}</span>
      </div>
    </motion.div>
  );
};

export default BudgetCard;
