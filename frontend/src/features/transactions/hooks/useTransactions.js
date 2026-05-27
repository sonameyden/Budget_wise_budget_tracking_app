import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAll, create, update, remove } from '../api/transactionApi';
import { useToast } from '../../../components/ui/Toast';

export const useTransactions = (filters = {}) =>
  useQuery({
    queryKey: ['transactions', filters],
    queryFn: () => getAll(filters).then(r => r.data.data.transactions),
    staleTime: 30_000,
  });

export const useCreateTransaction = () => {
  const qc = useQueryClient();
  const toast = useToast();
  return useMutation({
    mutationFn: create,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['transactions'] }); qc.invalidateQueries({ queryKey: ['dashboard'] }); qc.invalidateQueries({ queryKey: ['analytics'] }); toast({ message: 'Transaction added!', type: 'success' }); },
    onError: (e) => toast({ message: e.response?.data?.message || 'Failed to add transaction', type: 'error' }),
  });
};

export const useUpdateTransaction = () => {
  const qc = useQueryClient();
  const toast = useToast();
  return useMutation({
    mutationFn: ({ id, data }) => update(id, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['transactions'] }); qc.invalidateQueries({ queryKey: ['dashboard'] }); toast({ message: 'Transaction updated!', type: 'success' }); },
    onError: (e) => toast({ message: e.response?.data?.message || 'Failed to update', type: 'error' }),
  });
};

export const useDeleteTransaction = () => {
  const qc = useQueryClient();
  const toast = useToast();
  return useMutation({
    mutationFn: remove,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['transactions'] }); qc.invalidateQueries({ queryKey: ['dashboard'] }); toast({ message: 'Transaction deleted', type: 'success' }); },
    onError: (e) => toast({ message: e.response?.data?.message || 'Failed to delete', type: 'error' }),
  });
};
