import Card from '../../../components/ui/Card';
import LineChart from '../../../components/charts/LineChart';
import Skeleton from '../../../components/ui/Skeleton';
import { useMonthlyChart } from '../hooks/useDashboardData';

const LINES = [
  { key: 'income',  name: 'Income',   color: '#10b981' },
  { key: 'expense', name: 'Expenses', color: '#ef4444' },
];

const SpendingChart = () => {
  const { data, isLoading } = useMonthlyChart();
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200">Spending Overview</h3>
        <div className="flex gap-3">
          {LINES.map(l => (
            <span key={l.key} className="flex items-center gap-1 text-xs text-slate-500">
              <span className="w-2 h-2 rounded-full" style={{ background: l.color }} />
              {l.name}
            </span>
          ))}
        </div>
      </div>
      {isLoading ? <Skeleton variant="chart" /> : <LineChart data={data || []} lines={LINES} />}
    </Card>
  );
};

export default SpendingChart;
