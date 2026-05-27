/**
 * DonutChart — Recharts PieChart in donut mode for category breakdown.
 */
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#10b981','#3b82f6','#8b5cf6','#f59e0b','#ef4444','#06b6d4','#84cc16','#f97316','#ec4899'];

const DonutChart = ({ data = [] }) => {
  if (!data.length) return (
    <div className="flex items-center justify-center h-48 text-slate-400 text-sm">No data yet</div>
  );

  return (
    <ResponsiveContainer width="100%" height={220}>
      <PieChart>
        <Pie data={data} cx="50%" cy="45%" innerRadius={55} outerRadius={80}
          dataKey="total" nameKey="category" paddingAngle={2}>
          {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
        </Pie>
        <Tooltip formatter={(v) => `$${v.toFixed(2)}`} />
        <Legend
          iconType="circle" iconSize={8}
          formatter={(value) => <span style={{ fontSize: 11, color: '#64748b' }}>{value}</span>}
        />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default DonutChart;
