import { useQuery } from '@tanstack/react-query';
import { getSummary, getRecentTransactions, getMonthlyChart, getCategoryChart } from '../api/dashboardApi';

export const useDashboardSummary = () =>
  useQuery({ queryKey: ['dashboard', 'summary'], queryFn: () => getSummary().then(r => r.data.data), staleTime: 60_000 });

export const useRecentTransactions = () =>
  useQuery({ queryKey: ['dashboard', 'recent'], queryFn: () => getRecentTransactions().then(r => r.data.data.transactions?.slice(0,5)), staleTime: 60_000 });

export const useMonthlyChart = () =>
  useQuery({ queryKey: ['dashboard', 'monthly'], queryFn: () => getMonthlyChart().then(r => r.data.data.chart), staleTime: 60_000 });

export const useCategoryChart = () =>
  useQuery({ queryKey: ['dashboard', 'categories'], queryFn: () => getCategoryChart().then(r => r.data.data.categories), staleTime: 60_000 });
