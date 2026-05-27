/**
 * AccountCard — premium glassmorphism card with gradient accent per account type.
 */
import { motion } from 'framer-motion';
import { Pencil, Trash2, ArrowLeftRight } from 'lucide-react';
import { formatCurrency } from '../../../lib/formatCurrency';
import { useCurrency } from '../../../contexts/AuthContext';

const TYPE_CONFIG = {
  bank_account:       { label: 'Bank Account',       gradient: 'from-blue-500   to-blue-700',   bg: 'bg-blue-50   dark:bg-blue-900/20',   text: 'text-blue-600'   },
  cash_wallet:        { label: 'Cash Wallet',         gradient: 'from-orange-400 to-orange-600', bg: 'bg-orange-50 dark:bg-orange-900/20', text: 'text-orange-500' },
  savings_account:    { label: 'Savings Account',     gradient: 'from-emerald-500 to-emerald-700',bg: 'bg-emerald-50 dark:bg-emerald-900/20',text: 'text-emerald-600'},
  digital_wallet:     { label: 'Digital Wallet',      gradient: 'from-violet-500 to-violet-700', bg: 'bg-violet-50 dark:bg-violet-900/20', text: 'text-violet-600' },
  credit_account:     { label: 'Credit Account',      gradient: 'from-red-500    to-red-700',    bg: 'bg-red-50    dark:bg-red-900/20',    text: 'text-red-500'    },
  investment_account: { label: 'Investment Account',  gradient: 'from-purple-500 to-purple-700', bg: 'bg-purple-50 dark:bg-purple-900/20', text: 'text-purple-600' },
};

const AccountCard = ({ account, onEdit, onDelete, onTransfer }) => {
  const currency = useCurrency();
  const cfg = TYPE_CONFIG[account.account_type] || TYPE_CONFIG.bank_account;

  return (
    <motion.div
      whileHover={{ y: -4, boxShadow: '0 12px 32px rgba(0,0,0,0.12)' }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="relative overflow-hidden bg-white dark:bg-gray-900
                 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-card"
    >
      {/* Gradient top bar */}
      <div className={`h-1.5 w-full bg-gradient-to-r ${cfg.gradient}`} />

      <div className="p-5">
        {/* Header row */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-11 h-11 rounded-2xl ${cfg.bg} flex items-center justify-center text-2xl`}>
              {account.icon || '🏦'}
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{account.account_name}</p>
              <p className={`text-xs font-medium ${cfg.text}`}>{cfg.label}</p>
            </div>
          </div>
          <div className="flex gap-1">
            <button onClick={() => onTransfer(account)}
              className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-blue-500 transition-colors" title="Transfer">
              <ArrowLeftRight size={13} />
            </button>
            <button onClick={() => onEdit(account)}
              className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 transition-colors">
              <Pencil size={13} />
            </button>
            <button onClick={() => onDelete(account.id)}
              className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-slate-400 hover:text-red-500 transition-colors">
              <Trash2 size={13} />
            </button>
          </div>
        </div>

        {/* Balance */}
        <div className="mb-4">
          <p className="text-xs text-slate-400 mb-0.5">Current Balance</p>
          <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">
            {formatCurrency(account.current_balance, currency)}
          </p>
        </div>

        {/* Monthly income if linked */}
        {account.monthly_income > 0 && (
          <div className={`px-3 py-2 rounded-xl ${cfg.bg} flex items-center justify-between`}>
            <p className="text-xs text-slate-500 dark:text-slate-400">Monthly Income</p>
            <p className={`text-xs font-semibold ${cfg.text}`}>
              +{formatCurrency(account.monthly_income, currency)}
            </p>
          </div>
        )}

        {/* Description */}
        {account.description && (
          <p className="text-xs text-slate-400 mt-3 truncate">{account.description}</p>
        )}
      </div>
    </motion.div>
  );
};

export default AccountCard;
