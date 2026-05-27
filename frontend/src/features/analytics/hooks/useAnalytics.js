import { useQuery } from '@tanstack/react-query';
import { getSummary, getMonthly, getCategories, getScore } from '../api/analyticsApi';

export const useAnalyticsSummary    = (p) => useQuery({ queryKey: ['analytics','summary',p],    queryFn: () => getSummary(p).then(r => r.data.data),             staleTime: 60_000 });
export const useAnalyticsMonthly    = (p) => useQuery({ queryKey: ['analytics','monthly',p],    queryFn: () => getMonthly(p).then(r => r.data.data.chart),        staleTime: 60_000 });
export const useAnalyticsCategories = (p) => useQuery({ queryKey: ['analytics','categories',p], queryFn: () => getCategories(p).then(r => r.data.data.categories), staleTime: 60_000 });
export const useHealthScore         = ()  => useQuery({ queryKey: ['analytics','score'],         queryFn: () => getScore().then(r => r.data.data.score),           staleTime: 60_000 });
