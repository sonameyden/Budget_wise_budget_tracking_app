/**
 * routes.jsx — React Router route definitions.
 * ProtectedRoute redirects unauthenticated users to /login.
 */
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// Lazy imports for code-splitting
import { lazy, Suspense } from 'react';
const LoginPage      = lazy(() => import('../pages/LoginPage'));
const RegisterPage   = lazy(() => import('../pages/RegisterPage'));
const DashboardPage  = lazy(() => import('../pages/DashboardPage'));
const TransactionsPage = lazy(() => import('../pages/TransactionsPage'));
const AnalyticsPage  = lazy(() => import('../pages/AnalyticsPage'));
const BudgetsPage    = lazy(() => import('../pages/BudgetsPage'));
const GoalsPage      = lazy(() => import('../pages/GoalsPage'));
const SettingsPage   = lazy(() => import('../pages/SettingsPage'));

/** Redirects to /login if user is not authenticated */
const ProtectedRoute = () => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

/** Full-page loading fallback while lazy chunks load */
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
  <Suspense fallback={<PageLoader />}>
    <Component />
  </Suspense>
);

/** Route config consumed by createBrowserRouter in App.jsx */
export const routes = [
  // Public routes
  { path: '/login',    element: wrap(LoginPage)    },
  { path: '/register', element: wrap(RegisterPage) },

  // Protected routes — all nested under ProtectedRoute
  {
    element: <ProtectedRoute />,
    children: [
      { path: '/dashboard',    element: wrap(DashboardPage)    },
      { path: '/transactions', element: wrap(TransactionsPage) },
      { path: '/analytics',   element: wrap(AnalyticsPage)   },
      { path: '/budgets',     element: wrap(BudgetsPage)     },
      { path: '/goals',       element: wrap(GoalsPage)       },
      { path: '/settings',    element: wrap(SettingsPage)    },
    ],
  },

  // Fallback — redirect root to dashboard, unknown routes to login
  { path: '/',   element: <Navigate to="/dashboard" replace /> },
  { path: '*',   element: <Navigate to="/login"     replace /> },
];
