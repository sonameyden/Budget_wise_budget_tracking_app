import DonutChart from '../../../components/charts/DonutChart';
import { useGoals } from '../hooks/useGoals';

const GoalsDonut = () => {
  const { data: goals = [], isLoading } = useGoals();

  if (isLoading) return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-card">Loading...</div>
  );

  if (!goals.length) return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-card">No goals yet</div>
  );

  const byCategory = goals.reduce((acc, g) => {
    const key = g.category || 'Other';
    acc[key] = (acc[key] || 0) + (parseFloat(g.target_amount) || 0);
    return acc;
  }, {});

  const chartData = Object.entries(byCategory).map(([category, total]) => ({ category, total: parseFloat(total.toFixed(2)) }));

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-card">
      <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-4">Saving Goals by Type</h3>
      <DonutChart data={chartData} />
    </div>
  );
};

export default GoalsDonut;
