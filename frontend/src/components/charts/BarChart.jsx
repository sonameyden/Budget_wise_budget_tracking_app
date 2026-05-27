/**
 * BarChart — horizontal bar chart for top spending categories.
 */
import { ResponsiveContainer, BarChart as RBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from 'recharts';

const COLORS = ['#10b981','#3b82f6','#8b5cf6','#f59e0b','#ef4444','#06b6d4','#84cc16','#f97316'];

const BarChart = ({ data = [] }) => {
  if (!data.length) return (
    <div className="flex items-center justify-center h-48 text-slate-400 text-sm">No data yet</div>
  );

  return (
    <ResponsiveContainer width="100%" height={Math.max(180, data.length * 36)}>
      <RBarChart data={data} layout="vertical" margin={{ top: 0, right: 16, left: 80, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
        <XAxis type="number" tick={{ fontSize: 11, fill: '#94a3b8' }} tickLine={false} axisLine={false}
          tickFormatter={v => `$${v >= 1000 ? (v/1000).toFixed(0)+'k' : v}`} />
        <YAxis type="category" dataKey="category" tick={{ fontSize: 11, fill: '#64748b' }} tickLine={false} axisLine={false} />
        <Tooltip formatter={(v) => [`$${v.toFixed(2)}`, 'Spent']} />
        <Bar dataKey="total" radius={[0, 6, 6, 0]} maxBarSize={24}>
          {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
        </Bar>
      </RBarChart>
    </ResponsiveContainer>
  );
};

export default BarChart;
