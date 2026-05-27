import { motion } from 'framer-motion';
import { Pencil, Trash2 } from 'lucide-react';
import CircularProgress from './CircularProgress';
import Button from '../../../components/ui/Button';
import { formatCurrency } from '../../../lib/formatCurrency';
import { useCurrency } from '../../../contexts/AuthContext';

const ICONS = { 'Emergency Fund':'🛡️','Vacation':'✈️','New Car':'🚗','Home':'🏠',
  'Education':'📚','Retirement':'🐷','Custom Goal':'🎯','Other':'💰' };

const GoalCard = ({ goal, onAddFunds, onEdit, onDelete }) => {
  const currency = useCurrency();
  const pct = goal.percentage ?? 0;

  return (
    <motion.div whileHover={{ y: -2 }}
      className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 shadow-card">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-xl">{ICONS[goal.category] || '🎯'}</span>
          <div>
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{goal.title}</p>
            <p className="text-xs text-slate-400">{goal.category}</p>
          </div>
        </div>
        <div className="flex gap-1">
          <button onClick={() => onEdit(goal)} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 transition-colors"><Pencil size={13} /></button>
          <button onClick={() => onDelete(goal.id)} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-slate-400 hover:text-red-500 transition-colors"><Trash2 size={13} /></button>
        </div>
      </div>

      <div className="flex justify-center mb-4">
        <CircularProgress percentage={pct} label="complete" />
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4 text-xs">
        <div><p className="text-slate-400 mb-0.5">Current</p><p className="font-semibold text-slate-700 dark:text-slate-200">{formatCurrency(goal.current_amount, currency)}</p></div>
        <div><p className="text-slate-400 mb-0.5">Target</p><p className="font-semibold text-slate-700 dark:text-slate-200">{formatCurrency(goal.target_amount, currency)}</p></div>
        {goal.days_left !== null && (
          <>
            <div><p className="text-slate-400 mb-0.5">Days Left</p><p className="font-semibold text-slate-700 dark:text-slate-200">{goal.days_left}</p></div>
            <div><p className="text-slate-400 mb-0.5">Monthly Needed</p><p className="font-semibold text-slate-700 dark:text-slate-200">{formatCurrency(goal.monthly_needed, currency)}</p></div>
          </>
        )}
      </div>

      {goal.completed
        ? <div className="text-center py-2 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 text-sm font-medium rounded-xl">🎉 Goal Completed!</div>
        : <Button variant="outline" onClick={() => onAddFunds(goal)} className="w-full" size="sm">Add Funds</Button>
      }
    </motion.div>
  );
};

export default GoalCard;
