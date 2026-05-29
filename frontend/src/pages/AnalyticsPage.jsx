/**
 * AnalyticsPage — period tabs, summary stats, charts, health score.
 */
import { useState } from 'react';
import AppLayout from '../components/layout/AppLayout';
import Card from '../components/ui/Card';
import PeriodTabs from '../features/analytics/components/PeriodTabs';
import FinancialHealthScore from '../features/analytics/components/FinancialHealthScore';
import {
  useAnalyticsSummary,
  useAnalyticsMonthly,
  useAnalyticsCategories,
} from '../features/analytics/hooks/useAnalytics';
import LineChart from '../components/charts/LineChart';
import BarChart from '../components/charts/BarChart';
import DonutChart from '../components/charts/DonutChart';
import { formatCurrency } from '../lib/formatCurrency';
import { useCurrency } from '../contexts/AuthContext';
import Skeleton, { SkeletonCard } from '../components/ui/Skeleton';
import { TrendingUp, TrendingDown, DollarSign, Activity } from 'lucide-react';

const LINES = [
  { key: 'income',  name: 'Income',   color: '#10b981' },
  { key: 'expense', name: 'Expenses', color: '#ef4444' },
];

const SummaryCard = ({ label, value, icon: Icon, color }) => (
  <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 shadow-card">
    <div className="flex items-center gap-2 mb-2">
      <Icon size={15} className={color} />
      <p className="text-xs text-slate-500 dark:text-slate-400">{label}</p>
    </div>
    <p className="text-xl font-bold text-slate-800 dark:text-slate-100">{value}</p>
  </div>
);

const AnalyticsPage = () => {
  const [period, setPeriod] = useState('month');
  const currency = useCurrency();
  const formatValue = (value) => formatCurrency(value ?? 0, currency);

  const { data: summary,    isLoading: sLoad } = useAnalyticsSummary(period);
  const { data: chartData,  isLoading: cLoad } = useAnalyticsMonthly(period);
  const { data: categories, isLoading: catLoad } = useAnalyticsCategories(period);

  return (
    <AppLayout title="Analytics">
      {/* Period tabs */}
      <div className="flex items-center justify-between mb-6">
        <div className="w-56">
          <PeriodTabs period={period} onChange={setPeriod} />
        </div>
      </div>

      {/* Summary stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        {sLoad ? [...Array(5)].map((_, i) => <SkeletonCard key={i} />) : (
          <>
            <SummaryCard label="Total Income"      value={formatValue(summary?.total_income   ?? 0)} icon={TrendingUp}    color="text-emerald-500" />
            <SummaryCard label="Total Expenses"    value={formatValue(summary?.total_expenses ?? 0)} icon={TrendingDown}   color="text-red-500"     />
            <SummaryCard label="Net Savings"       value={formatValue(summary?.net_savings    ?? 0)} icon={DollarSign}    color="text-blue-500"    />
            <SummaryCard label="Savings Balance"   value={formatValue(summary?.total_savings_balance ?? 0)} icon={DollarSign}    color="text-teal-500"   />
            <SummaryCard label="Remaining Cash"   value={formatValue(summary?.remaining_available ?? 0)} icon={Activity}      color="text-violet-500"  />
          </>
        )}
      </div>

      {/* Income vs Expenses chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card className="p-5 lg:col-span-2">
          <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-4">Income vs Expenses</h3>
          {cLoad ? <Skeleton variant="chart" /> : <LineChart data={chartData || []} lines={LINES} />}
        </Card>

        <Card className="p-5">
          <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-4">Expense Breakdown</h3>
          {catLoad ? <Skeleton variant="chart" /> : <DonutChart data={categories || []} />}
        </Card>
      </div>

      {/* Top categories bar chart + health score */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="p-5 lg:col-span-2">
          <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-4">Top Spending Categories</h3>
          {catLoad ? <Skeleton variant="chart" /> : <BarChart data={categories || []} />}
        </Card>

        <FinancialHealthScore />
      </div>
    </AppLayout>
  );
};

export default AnalyticsPage;
