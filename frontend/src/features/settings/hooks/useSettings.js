import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../../../services/apiClient';
import { useAuth } from '../../../contexts/AuthContext';
import { useToast } from '../../../components/ui/Toast';

export const useSettings = () => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['settings', 'profile'],
    queryFn: () => apiClient.get('/auth/me').then(r => r.data.data.user),
    initialData: user,
    staleTime: 120_000,
  });
};

export const useUpdateProfile = () => {
  const qc = useQueryClient();
  const { updateUser } = useAuth();
  const toast = useToast();
  return useMutation({
    mutationFn: (data) => apiClient.patch('/auth/profile', data),
    onSuccess: ({ data }) => {
      updateUser(data.data.user);
      qc.invalidateQueries({ queryKey: ['settings'] });
      toast({ message: 'Profile updated!', type: 'success' });
    },
    onError: (e) => toast({ message: e.response?.data?.message || 'Failed to update', type: 'error' }),
  });
};
