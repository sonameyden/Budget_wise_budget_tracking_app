import { Search, Filter } from 'lucide-react';
import { CATEGORIES } from '../../../constants';

const ALL_CATEGORIES = ['All Categories', ...CATEGORIES];

const TransactionFilters = ({ search, onSearch, category, onCategory }) => (
  <div className="flex flex-col sm:flex-row gap-3">
    <div className="relative flex-1">
      <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
      <input value={search} onChange={e => onSearch(e.target.value)}
        placeholder="Search transactions..."
        className="w-full pl-9 pr-4 py-2.5 text-sm border border-slate-200 dark:border-slate-600
                   rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200
                   focus:outline-none focus:border-emerald-400 placeholder-slate-400" />
    </div>
    <div className="relative">
      <select value={category} onChange={e => onCategory(e.target.value)}
        className="appearance-none pl-4 pr-8 py-2.5 text-sm border border-slate-200 dark:border-slate-600
                   rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200
                   focus:outline-none focus:border-emerald-400 cursor-pointer min-w-[160px]">
        {ALL_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
      </select>
      <Filter size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
    </div>
  </div>
);

export default TransactionFilters;
