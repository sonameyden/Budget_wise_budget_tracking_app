import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { register } from '../api/authApi';
import { useAuth } from '../../../contexts/AuthContext';
import { useToast } from '../../../components/ui/Toast';

const useRegister = () => {
  const { login: setAuth } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  return useMutation({
    mutationFn: ({ name, email, password }) => register(name, email, password),
    onSuccess: ({ data }) => {
      setAuth(data.data.token, data.data.user);
      toast({ message: 'Account created! Welcome to BudgetWise.', type: 'success' });
      navigate('/dashboard');
    },
    onError: (err) => {
      // Show the actual server error so you can diagnose
      const message = err.response?.data?.message
        || err.message
        || 'Registration failed. Check your backend is running.';
      toast({ message, type: 'error' });
      console.error('[Register Error]', err.response?.data || err.message);
    },
  });
};

export default useRegister;
