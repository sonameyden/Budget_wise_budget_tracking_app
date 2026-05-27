import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { login } from '../api/authApi';
import { useAuth } from '../../../contexts/AuthContext';
import { useToast } from '../../../components/ui/Toast';

const useLogin = () => {
  const { login: setAuth } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  return useMutation({
    mutationFn: ({ email, password }) => login(email, password),
    onSuccess: ({ data }) => {
      setAuth(data.data.token, data.data.user);
      toast({ message: `Welcome back, ${data.data.user.name}!`, type: 'success' });
      navigate('/dashboard');
    },
    onError: (err) => {
      toast({ message: err.response?.data?.message || 'Login failed.', type: 'error' });
    },
  });
};

export default useLogin;
