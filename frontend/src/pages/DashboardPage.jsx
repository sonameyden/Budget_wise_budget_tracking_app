import { useAuth, useCurrency } from '../contexts/AuthContext';
import AppLayout from '../components/layout/AppLayout';
import StatCard from '../features/dashboard/components/StatCard';
import SpendingChart from '../features/dashboard/components/SpendingChart';
import CategoryDonut from '../features/dashboard/components/CategoryDonut';
import RecentTransactions from '../features/dashboard/components/RecentTransactions';
import QuickActions from '../features/dashboard/components/QuickActions';
import { useDashboardSummary } from '../features/dashboard/hooks/useDashboardData';
import { formatCurrency } from '../lib/formatCurrency';

const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
};

const DashboardPage = () => {
  const { user } = useAuth();
  const currency = useCurrency();
  const { data: summary, isLoading } = useDashboardSummary();

  const fmt = (v) => formatCurrency(v ?? 0, currency);

  return (
    <AppLayout title="Dashboard">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
          {getGreeting()}, {user?.name?.split(' ')[0]} 👋
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">Here's your financial overview</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <StatCard label="Total Balance"           value={fmt(summary?.total_balance)}            trend={5}   accentColor="emerald" loading={isLoading} />
        <StatCard label="Savings Balance"         value={fmt(summary?.total_savings_balance)}    trend={5}   accentColor="blue"    loading={isLoading} />
        <StatCard label="Net Savings"             value={fmt(summary?.net_savings)}              trend={summary?.net_savings >= 0 ? 5 : -5} accentColor="violet" loading={isLoading} />
        <StatCard label="Monthly Expenses"        value={fmt(summary?.total_expenses)}           trend={-3}  accentColor="red"     loading={isLoading} />
        <StatCard label="Remaining Cash"          value={fmt(summary?.remaining_available)}   trend={summary?.remaining_available >= 0 ? 5 : -5} accentColor="teal"  loading={isLoading} />
      </div>

      <div className="mb-6"><QuickActions /></div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2"><SpendingChart /></div>
        <div><CategoryDonut /></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentTransactions />
      </div>
    </AppLayout>
  );
};

export default DashboardPage;
