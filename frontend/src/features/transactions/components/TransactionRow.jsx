import { motion } from 'framer-motion';
import { Pencil, Trash2 } from 'lucide-react';
import { formatCurrency } from '../../../lib/formatCurrency';
import { formatRelativeDate } from '../../../lib/dateHelpers';
import { useCurrency } from '../../../contexts/AuthContext';

const EMOJI = { 'Food & Dining':'🍔','Transportation':'🚗','Shopping':'🛍️','Entertainment':'🎮',
  'Bills & Utilities':'💡','Health':'❤️','Education':'📚','Travel':'✈️','Salary':'💰','Freelance':'💻','Investment':'📈','Other':'📌' };

const TransactionRow = ({ tx, onEdit, onDelete }) => {
  const currency = useCurrency();
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      className="flex items-center gap-4 p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50
                 border-b border-slate-100 dark:border-slate-800 last:border-0 group transition-colors">
      <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-lg shrink-0">
        {EMOJI[tx.category] || '💰'}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-slate-800 dark:text-slate-100 truncate">{tx.title}</p>
        <p className="text-xs text-slate-400">{tx.category} • {formatRelativeDate(tx.transaction_date)}</p>
      </div>
      <div className="text-right">
        <p className={`text-sm font-bold ${tx.type === 'income' ? 'text-emerald-600' : 'text-red-500'}`}>
          {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount, currency)}
        </p>
        <p className="text-xs text-slate-400 capitalize">{tx.payment_method}</p>
      </div>
      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button onClick={() => onEdit(tx)} className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-600 transition-colors"><Pencil size={13} /></button>
        <button onClick={() => onDelete(tx.id)} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-slate-400 hover:text-red-500 transition-colors"><Trash2 size={13} /></button>
      </div>
    </motion.div>
  );
};

export default TransactionRow;
