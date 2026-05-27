import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAll, create, update, remove } from '../api/goalApi';
import { useToast } from '../../../components/ui/Toast';

export const useGoals = () =>
  useQuery({ queryKey: ['goals'], queryFn: () => getAll().then(r => r.data.data.goals), staleTime: 60_000 });

export const useCreateGoal = () => {
  const qc = useQueryClient(); const toast = useToast();
  return useMutation({ mutationFn: create,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['goals'] }); toast({ message: 'Goal created!', type: 'success' }); },
    onError: (e) => toast({ message: e.response?.data?.message || 'Failed', type: 'error' }) });
};

export const useUpdateGoal = () => {
  const qc = useQueryClient(); const toast = useToast();
  return useMutation({ mutationFn: ({ id, data }) => update(id, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['goals'] }); toast({ message: 'Goal updated!', type: 'success' }); },
    onError: (e) => toast({ message: e.response?.data?.message || 'Failed', type: 'error' }) });
};

export const useDeleteGoal = () => {
  const qc = useQueryClient(); const toast = useToast();
  return useMutation({ mutationFn: remove,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['goals'] }); toast({ message: 'Goal deleted', type: 'success' }); },
    onError: (e) => toast({ message: e.response?.data?.message || 'Failed', type: 'error' }) });
};
