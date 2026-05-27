/**
 * LineChart — Recharts wrapper for income vs expense line chart.
 */
import { ResponsiveContainer, LineChart as RLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-slate-700 rounded-xl p-3 shadow-lg text-xs">
      <p className="font-medium text-slate-600 dark:text-slate-300 mb-2">{label}</p>
      {payload.map(p => (
        <p key={p.dataKey} style={{ color: p.color }} className="font-semibold">
          {p.name}: ${p.value?.toFixed(2)}
        </p>
      ))}
    </div>
  );
};

const LineChart = ({ data = [], lines = [] }) => (
  <ResponsiveContainer width="100%" height={200}>
    <RLineChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
      <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#94a3b8' }} tickLine={false} axisLine={false}
        tickFormatter={v => { const d = new Date(v); return `${d.toLocaleString('en',{month:'short'})} ${d.getDate()}`; }} />
      <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} tickLine={false} axisLine={false}
        tickFormatter={v => `$${v >= 1000 ? (v/1000).toFixed(0)+'k' : v}`} />
      <Tooltip content={<CustomTooltip />} />
      <Legend wrapperStyle={{ fontSize: 12 }} />
      {lines.map(l => (
        <Line key={l.key} type="monotone" dataKey={l.key} name={l.name}
          stroke={l.color} strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
      ))}
    </RLineChart>
  </ResponsiveContainer>
);

export default LineChart;
