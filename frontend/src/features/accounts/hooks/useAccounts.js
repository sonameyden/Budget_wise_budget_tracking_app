import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getAll, getNetWorth, create, update, remove, transfer,
  getAllIncome, createIncome, updateIncome, removeIncome,
} from '../api/accountApi';
import { useToast } from '../../../components/ui/Toast';

/* ── Accounts ─────────────────────────────────────────────── */
export const useAccounts = () =>
  useQuery({ queryKey: ['accounts'], queryFn: () => getAll().then(r => r.data.data.accounts), staleTime: 60_000 });

export const useNetWorth = () =>
  useQuery({ queryKey: ['accounts', 'net-worth'], queryFn: () => getNetWorth().then(r => r.data.data), staleTime: 60_000 });

export const useCreateAccount = () => {
  const qc = useQueryClient(); const toast = useToast();
  return useMutation({
    mutationFn: create,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['accounts'] }); qc.invalidateQueries({ queryKey: ['dashboard'] }); toast({ message: 'Account created!', type: 'success' }); },
    onError: (e) => toast({ message: e.response?.data?.message || 'Failed', type: 'error' }),
  });
};

export const useUpdateAccount = () => {
  const qc = useQueryClient(); const toast = useToast();
  return useMutation({
    mutationFn: ({ id, data }) => update(id, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['accounts'] }); toast({ message: 'Account updated!', type: 'success' }); },
    onError: (e) => toast({ message: e.response?.data?.message || 'Failed', type: 'error' }),
  });
};

export const useDeleteAccount = () => {
  const qc = useQueryClient(); const toast = useToast();
  return useMutation({
    mutationFn: remove,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['accounts'] }); toast({ message: 'Account deleted', type: 'success' }); },
    onError: (e) => toast({ message: e.response?.data?.message || 'Failed', type: 'error' }),
  });
};

export const useTransfer = () => {
  const qc = useQueryClient(); const toast = useToast();
  return useMutation({
    mutationFn: transfer,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['accounts'] }); toast({ message: 'Transfer successful!', type: 'success' }); },
    onError: (e) => toast({ message: e.response?.data?.message || 'Transfer failed', type: 'error' }),
  });
};

/* ── Income Sources ───────────────────────────────────────── */
export const useIncomeSources = (params) =>
  useQuery({ queryKey: ['income', params], queryFn: () => getAllIncome(params).then(r => r.data.data.sources), staleTime: 60_000 });

export const useCreateIncome = () => {
  const qc = useQueryClient(); const toast = useToast();
  return useMutation({
    mutationFn: createIncome,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['income'] }); qc.invalidateQueries({ queryKey: ['accounts'] }); toast({ message: 'Income source added!', type: 'success' }); },
    onError: (e) => toast({ message: e.response?.data?.message || 'Failed', type: 'error' }),
  });
};

export const useUpdateIncome = () => {
  const qc = useQueryClient(); const toast = useToast();
  return useMutation({
    mutationFn: ({ id, data }) => updateIncome(id, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['income'] }); qc.invalidateQueries({ queryKey: ['accounts'] }); toast({ message: 'Income updated!', type: 'success' }); },
    onError: (e) => toast({ message: e.response?.data?.message || 'Failed', type: 'error' }),
  });
};

export const useDeleteIncome = () => {
  const qc = useQueryClient(); const toast = useToast();
  return useMutation({
    mutationFn: removeIncome,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['income'] }); toast({ message: 'Income source removed', type: 'success' }); },
    onError: (e) => toast({ message: e.response?.data?.message || 'Failed', type: 'error' }),
  });
};
