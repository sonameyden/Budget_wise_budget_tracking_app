/**
 * TopBar — search bar, notification bell, dark mode toggle.
 */
import { Search, Bell, Sun, Moon } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

const TopBar = ({ title }) => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white dark:bg-gray-900
                       border-b border-slate-200 dark:border-slate-700 shrink-0">
      <h1 className="text-lg font-semibold text-slate-800 dark:text-slate-100">{title}</h1>

      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="relative hidden sm:block">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text" placeholder="Search..."
            className="pl-9 pr-4 py-2 text-sm bg-slate-50 dark:bg-slate-800
                       border border-slate-200 dark:border-slate-600 rounded-xl
                       focus:outline-none focus:border-emerald-400 w-48 text-slate-700 dark:text-slate-200"
          />
        </div>

        {/* Notifications */}
        <button className="relative p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        {/* Dark mode toggle */}
        <button onClick={toggleTheme}
          className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors">
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>
    </header>
  );
};

export default TopBar;
