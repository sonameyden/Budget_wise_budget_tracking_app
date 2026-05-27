import Card from '../../../components/ui/Card';
import DonutChart from '../../../components/charts/DonutChart';
import Skeleton from '../../../components/ui/Skeleton';
import { useCategoryChart } from '../hooks/useDashboardData';

const CategoryDonut = () => {
  const { data, isLoading } = useCategoryChart();
  return (
    <Card className="p-5">
      <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-4">Spending by Category</h3>
      {isLoading ? <Skeleton variant="chart" /> : <DonutChart data={data || []} />}
    </Card>
  );
};

export default CategoryDonut;
