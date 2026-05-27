/**
 * routes.jsx — React Router route definitions including /accounts.
 */
import { Navigate, Outlet } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { useAuth } from '../contexts/AuthContext';

const LoginPage       = lazy(() => import('../pages/LoginPage'));
const RegisterPage    = lazy(() => import('../pages/RegisterPage'));
const DashboardPage   = lazy(() => import('../pages/DashboardPage'));
const TransactionsPage = lazy(() => import('../pages/TransactionsPage'));
const AnalyticsPage   = lazy(() => import('../pages/AnalyticsPage'));
const AccountsPage    = lazy(() => import('../pages/AccountsPage'));
const BudgetsPage     = lazy(() => import('../pages/BudgetsPage'));
const GoalsPage       = lazy(() => import('../pages/GoalsPage'));
const SettingsPage    = lazy(() => import('../pages/SettingsPage'));

const ProtectedRoute = () => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-gray-950">
    <div className="flex flex-col items-center gap-3">
      <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center animate-pulse">
        <span className="text-white font-bold text-lg">B</span>
      </div>
      <p className="text-sm text-slate-400">Loading...</p>
    </div>
  </div>
);

const wrap = (Component) => (
  <Suspense fallback={<PageLoader />}><Component /></Suspense>
);

export const routes = [
  { path: '/login',    element: wrap(LoginPage)    },
  { path: '/register', element: wrap(RegisterPage) },
  {
    element: <ProtectedRoute />,
    children: [
      { path: '/dashboard',    element: wrap(DashboardPage)    },
      { path: '/transactions', element: wrap(TransactionsPage) },
      { path: '/analytics',    element: wrap(AnalyticsPage)    },
      { path: '/accounts',     element: wrap(AccountsPage)     },
      { path: '/budgets',      element: wrap(BudgetsPage)      },
      { path: '/goals',        element: wrap(GoalsPage)        },
      { path: '/settings',     element: wrap(SettingsPage)     },
    ],
  },
  { path: '/',  element: <Navigate to="/dashboard" replace /> },
  { path: '*',  element: <Navigate to="/login"     replace /> },
];
