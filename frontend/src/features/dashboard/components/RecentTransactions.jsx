import { Link } from 'react-router-dom';
import Card from '../../../components/ui/Card';
import { useRecentTransactions } from '../hooks/useDashboardData';
import { formatCurrency } from '../../../lib/formatCurrency';
import { formatRelativeDate } from '../../../lib/dateHelpers';
import { SkeletonCard } from '../../../components/ui/Skeleton';
import { useCurrency } from '../../../contexts/AuthContext';

const EMOJI = { 'Food & Dining':'🍔','Transportation':'🚗','Shopping':'🛍️','Entertainment':'🎮',
  'Bills & Utilities':'💡','Health':'❤️','Education':'📚','Travel':'✈️','Salary':'💰','Freelance':'💻','Investment':'📈','Other':'📌' };

const RecentTransactions = () => {
  const { data: transactions, isLoading } = useRecentTransactions();
  const currency = useCurrency();

  return (
    <Card className="p-5 h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200">Recent Transactions</h3>
        <Link to="/transactions" className="text-xs text-emerald-600 hover:text-emerald-700 font-medium">View All →</Link>
      </div>
      {isLoading
        ? <div className="space-y-3">{[...Array(5)].map((_,i) => <SkeletonCard key={i} />)}</div>
        : (
          <div className="space-y-3">
            {(transactions || []).map(tx => (
              <div key={tx.id} className="flex items-center gap-3 py-2 border-b border-slate-50 dark:border-slate-800 last:border-0">
                <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-base shrink-0">
                  {EMOJI[tx.category] || '💰'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-200 truncate">{tx.title}</p>
                  <p className="text-xs text-slate-400">{tx.category} • {formatRelativeDate(tx.transaction_date)}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className={`text-sm font-semibold ${tx.type === 'income' ? 'text-emerald-600' : 'text-red-500'}`}>
                    {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount, currency)}
                  </p>
                  <p className="text-xs text-slate-400 capitalize">{tx.payment_method}</p>
                </div>
              </div>
            ))}
          </div>
        )
      }
    </Card>
  );
};

export default RecentTransactions;
