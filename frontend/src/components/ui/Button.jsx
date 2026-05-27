/**
 * Button — reusable button with variant, size, and loading state.
 */
import { motion } from 'framer-motion';

const variants = {
  primary:   'bg-emerald-500 hover:bg-emerald-600 text-white shadow-sm hover:shadow-glow',
  secondary: 'bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200',
  danger:    'bg-red-500 hover:bg-red-600 text-white',
  ghost:     'bg-transparent hover:bg-slate-100 text-slate-600 dark:hover:bg-slate-800 dark:text-slate-300',
  outline:   'border border-slate-200 hover:border-emerald-500 hover:text-emerald-600 text-slate-600 dark:border-slate-600 dark:text-slate-300',
};

const sizes = {
  sm: 'px-3 py-1.5 text-xs rounded-lg',
  md: 'px-4 py-2 text-sm rounded-xl',
  lg: 'px-6 py-3 text-sm rounded-xl',
};

const Button = ({
  children, variant = 'primary', size = 'md',
  loading = false, disabled = false, className = '', onClick, type = 'button', ...props
}) => (
  <motion.button
    whileHover={{ scale: disabled || loading ? 1 : 1.01 }}
    whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
    type={type}
    onClick={onClick}
    disabled={disabled || loading}
    className={`
      inline-flex items-center justify-center gap-2 font-medium transition-all duration-150
      disabled:opacity-50 disabled:cursor-not-allowed
      ${variants[variant]} ${sizes[size]} ${className}
    `}
    {...props}
  >
    {loading && (
      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
      </svg>
    )}
    {children}
  </motion.button>
);

export default Button;
