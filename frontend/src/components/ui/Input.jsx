/**
 * Input — labeled input with error state, compatible with react-hook-form.
 * Uses React.forwardRef so react-hook-form's register() ref works correctly.
 */
import { forwardRef } from 'react';

const Input = forwardRef(({
  label, error, helperText, leftIcon: LeftIcon,
  rightIcon: RightIcon, className = '', type = 'text', ...props
}, ref) => (
  <div className="flex flex-col gap-1">
    {label && (
      <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
        {label}
      </label>
    )}
    <div className="relative">
      {LeftIcon && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
          <LeftIcon size={16} />
        </div>
      )}
      <input
        ref={ref}
        type={type}
        className={`
          w-full px-3 py-2.5 text-sm border rounded-xl bg-white dark:bg-slate-800
          text-slate-800 dark:text-slate-100 placeholder-slate-400
          transition-all duration-150 outline-none
          ${LeftIcon  ? 'pl-9' : ''}
          ${RightIcon ? 'pr-9' : ''}
          ${error
            ? 'border-red-400 focus:ring-2 focus:ring-red-200 dark:focus:ring-red-900'
            : 'border-slate-200 dark:border-slate-600 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 dark:focus:ring-emerald-900'
          }
          ${className}
        `}
        {...props}
      />
      {RightIcon && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
          {typeof RightIcon === 'function' ? <RightIcon /> : <RightIcon size={16} />}
        </div>
      )}
    </div>
    {error      && <p className="text-xs text-red-500">{error}</p>}
    {helperText && !error && <p className="text-xs text-slate-400">{helperText}</p>}
  </div>
));

Input.displayName = 'Input';

export default Input;
