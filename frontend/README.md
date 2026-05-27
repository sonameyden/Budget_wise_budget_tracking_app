# BudgetWise — Frontend

React + Vite frontend for the BudgetWise personal finance application.

## Tech Stack
- **React 18** + **Vite** — fast dev server and build
- **React Router DOM v6** — client-side routing
- **TanStack Query v5** — server state, caching, auto-refetch
- **Axios** — HTTP client with JWT interceptors
- **React Hook Form** — performant form handling
- **Framer Motion** — animations and transitions
- **Recharts** — financial charts
- **Tailwind CSS** — utility-first styling
- **Lucide React** — icons

## Architecture
- **Feature-based** structure — each feature owns its api/, components/, hooks/
- **React Query** for all server state — no manual useEffect fetching
- **Context API** for auth and theme — lightweight global state
- **Lazy-loaded pages** — code splitting via React.lazy

## Getting Started

```bash
cd frontend
npm install
cp .env.example .env     # set VITE_API_URL
npm run dev              # starts on http://localhost:5173
```

## Folder Structure

```
src/
  app/           # router + providers
  pages/         # thin page shells (one per route)
  features/      # feature-scoped: api/, components/, hooks/
    auth/
    dashboard/
    transactions/
    analytics/
    budgets/
    goals/
    settings/
  components/    # shared UI (used by 2+ features)
    layout/      # Sidebar, TopBar, AppLayout
    ui/          # Button, Input, Modal, Toast, etc.
    charts/      # LineChart, DonutChart, BarChart
  contexts/      # AuthContext, ThemeContext
  services/      # apiClient.js (Axios instance)
  hooks/         # useDebounce
  lib/           # formatCurrency, dateHelpers
  styles/        # globals.css
```

## Environment Variables

```
VITE_API_URL=http://localhost:5000/api
```

## Deployment (Vercel)

1. Push `frontend/` to GitHub
2. Import repo on [Vercel](https://vercel.com)
3. Set `VITE_API_URL` to your Render backend URL
4. Build command: `npm run build` | Output: `dist/`
5. Deploy — auto-deploys on every push to `main`
