import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAll, create, update, remove } from '../api/budgetApi';
import { useToast } from '../../../components/ui/Toast';
import { getCurrentMonthYear } from '../../../lib/dateHelpers';

const { month, year } = getCurrentMonthYear();

export const useBudgets = (params = { month, year }) =>
  useQuery({ queryKey: ['budgets', params], queryFn: () => getAll(params).then(r => r.data.data.budgets), staleTime: 60_000 });

export const useCreateBudget = () => {
  const qc = useQueryClient(); const toast = useToast();
  return useMutation({ mutationFn: create,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['budgets'] }); toast({ message: 'Budget created!', type: 'success' }); },
    onError: (e) => toast({ message: e.response?.data?.message || 'Failed', type: 'error' }) });
};
export const useUpdateBudget = () => {
  const qc = useQueryClient(); const toast = useToast();
  return useMutation({ mutationFn: ({ id, data }) => update(id, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['budgets'] }); toast({ message: 'Budget updated!', type: 'success' }); },
    onError: (e) => toast({ message: e.response?.data?.message || 'Failed', type: 'error' }) });
};
export const useDeleteBudget = () => {
  const qc = useQueryClient(); const toast = useToast();
  return useMutation({ mutationFn: remove,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['budgets'] }); toast({ message: 'Budget deleted', type: 'success' }); },
    onError: (e) => toast({ message: e.response?.data?.message || 'Failed', type: 'error' }) });
};
