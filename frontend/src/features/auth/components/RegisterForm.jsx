/**
 * RegisterForm — fixed validation: errors only show after actual submit attempt.
 * Uses mode: 'onSubmit' so fields don't turn red while typing.
 */
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { User, Mail, Lock } from 'lucide-react';
import { forwardRef } from 'react';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import useRegister from '../hooks/useRegister';

const RegisterForm = () => {
  const { mutate: doRegister, isPending } = useRegister();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitted },
  } = useForm({ mode: 'onSubmit', reValidateMode: 'onChange' });

  const password = watch('password');

  const onSubmit = ({ name, email, password }) => {
    doRegister({ name, email, password });
  };

  return (
    <div className="w-full max-w-sm">
      <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-1">
        Create account
      </h2>
      <p className="text-sm text-slate-500 mb-8">Start your journey to financial freedom</p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>

        <Input
          label="Full Name"
          placeholder="Sonam Eyden"
          leftIcon={User}
          error={errors.name?.message}
          {...register('name', {
            required: 'Name is required',
            minLength: { value: 2, message: 'Min 2 characters' },
          })}
        />

        <Input
          label="Email"
          type="email"
          placeholder="demo@budgetwise.app"
          leftIcon={Mail}
          error={errors.email?.message}
          {...register('email', {
            required: 'Email is required',
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: 'Invalid email address',
            },
          })}
        />

        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
          leftIcon={Lock}
          error={errors.password?.message}
          {...register('password', {
            required: 'Password is required',
            minLength: { value: 8, message: 'Min 8 characters' },
          })}
        />

        <Input
          label="Confirm Password"
          type="password"
          placeholder="••••••••"
          leftIcon={Lock}
          error={errors.confirmPassword?.message}
          {...register('confirmPassword', {
            required: 'Please confirm your password',
            validate: (v) => v === password || 'Passwords do not match',
          })}
        />

        <label className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400 cursor-pointer">
          <input
            type="checkbox"
            className="mt-0.5 rounded border-slate-300 text-emerald-500"
            {...register('terms', { required: 'You must accept the terms' })}
          />
          <span>
            I agree to the <span className="text-emerald-600">Terms of Service</span> and{' '}
            <span className="text-emerald-600">Privacy Policy</span>
          </span>
        </label>
        {errors.terms && (
          <p className="text-xs text-red-500">{errors.terms.message}</p>
        )}

        <Button type="submit" loading={isPending} className="w-full" size="lg">
          Create Account →
        </Button>

        {/* Debug: show if backend is unreachable */}
        {isSubmitted && Object.keys(errors).length > 0 && (
          <p className="text-xs text-amber-600 bg-amber-50 rounded-lg p-2">
            ⚠ Check that your backend is running at{' '}
            <code className="font-mono">{import.meta.env.VITE_API_URL}</code>
          </p>
        )}
      </form>

      <p className="text-center text-sm text-slate-500 mt-6">
        Already have an account?{' '}
        <Link to="/login" className="text-emerald-600 font-medium hover:text-emerald-700">
          Sign in
        </Link>
      </p>
    </div>
  );
};

export default RegisterForm;
