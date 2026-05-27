/**
 * LoginForm — fixed: forwardRef Input, no rightIcon function prop issue.
 */
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { Mail, Lock } from 'lucide-react';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import useLogin from '../hooks/useLogin';

const LoginForm = () => {
  const { mutate: login, isPending } = useLogin();
  const { register, handleSubmit, formState: { errors } } = useForm();

  return (
    <div className="w-full max-w-sm">
      <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-1">Welcome back</h2>
      <p className="text-sm text-slate-500 mb-8">Sign in to continue to your dashboard</p>

      <form onSubmit={handleSubmit((d) => login(d))} className="space-y-4">
        <Input
          label="Email"
          type="email"
          placeholder="demo@budgetwise.app"
          leftIcon={Mail}
          error={errors.email?.message}
          {...register('email', {
            required: 'Email is required',
            pattern: { value: /\S+@\S+\.\S+/, message: 'Invalid email' },
          })}
        />

        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
          leftIcon={Lock}
          error={errors.password?.message}
          {...register('password', { required: 'Password is required' })}
        />

        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 text-slate-600 dark:text-slate-400 cursor-pointer">
            <input
              type="checkbox"
              className="rounded border-slate-300 text-emerald-500"
              {...register('remember')}
            />
            Remember me
          </label>
          <Link to="/forgot-password" className="text-emerald-600 hover:text-emerald-700 font-medium">
            Forgot password?
          </Link>
        </div>

        <Button type="submit" loading={isPending} className="w-full" size="lg">
          Sign In →
        </Button>
      </form>

      <p className="text-center text-sm text-slate-500 mt-6">
        Don't have an account?{' '}
        <Link to="/register" className="text-emerald-600 font-medium hover:text-emerald-700">
          Sign up
        </Link>
      </p>
    </div>
  );
};

export default LoginForm;
