import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, ArrowLeftRight, BarChart2, Wallet, CreditCard } from 'lucide-react';
import Sidebar from './Sidebar';
import TopBar from './TopBar';

const BOTTOM_NAV = [
  { to: '/dashboard',    Icon: LayoutDashboard },
  { to: '/transactions', Icon: ArrowLeftRight  },
  { to: '/accounts',     Icon: CreditCard      },
  { to: '/budgets',      Icon: Wallet          },
  { to: '/analytics',    Icon: BarChart2       },
];

const AppLayout = ({ children, title = 'BudgetWise' }) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-gray-950">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(p => !p)} />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <TopBar title={title} />
        <main className="flex-1 overflow-y-auto p-6 pb-20 md:pb-6 animate-fade-in">
          {children}
        </main>
      </div>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30
                      bg-white dark:bg-gray-900 border-t border-slate-200 dark:border-slate-700
                      flex items-center justify-around px-2 py-2">
        {BOTTOM_NAV.map(({ to, Icon }) => (
          <NavLink key={to} to={to}
            className={({ isActive }) =>
              `p-2.5 rounded-xl transition-colors ${isActive ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20' : 'text-slate-400'}`
            }>
            <Icon size={20} />
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default AppLayout;
