const PERIODS = ['week','month','year'];
const PeriodTabs = ({ period, onChange }) => (
  <div className="flex bg-slate-100 dark:bg-slate-800 rounded-xl p-1 gap-1">
    {PERIODS.map(p => (
      <button key={p} onClick={() => onChange(p)}
        className={`flex-1 py-1.5 text-sm font-medium rounded-lg capitalize transition-all
          ${period === p
            ? 'bg-emerald-500 text-white shadow-sm'
            : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
          }`}>
        {p}
      </button>
    ))}
  </div>
);
export default PeriodTabs;
