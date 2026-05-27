/**
 * BudgetModal — matches pic: category icon grid, budget amount input,
 * Monthly/Weekly period toggle, enable alerts checkbox.
 */
import { useForm, Controller } from 'react-hook-form';
import { useEffect } from 'react';
import Modal from '../../../components/ui/Modal';
import Button from '../../../components/ui/Button';
import { useCreateBudget, useUpdateBudget } from '../hooks/useBudgets';
import { getCurrentMonthYear } from '../../../lib/dateHelpers';

const CATEGORIES = [
  { label: 'Food & Dining',    icon: '🍴', value: 'Food & Dining'    },
  { label: 'Transport...',     icon: '🚗', value: 'Transportation'   },
  { label: 'Shopping',         icon: '🛍️', value: 'Shopping'          },
  { label: 'Entertain...',     icon: '🎬', value: 'Entertainment'    },
  { label: 'Bills',            icon: '💵', value: 'Bills & Utilities' },
  { label: 'Health',           icon: '❤️', value: 'Health'            },
  { label: 'Education',        icon: '📖', value: 'Education'         },
  { label: 'Travel',           icon: '✈️', value: 'Travel'            },
  { label: 'Other',            icon: '•••', value: 'Other'            },
];

const INPUT_CLS = `w-full px-4 py-3 text-sm border border-slate-200 dark:border-slate-600
  rounded-2xl bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100
  focus:outline-none focus:border-emerald-400 placeholder-slate-400`;

const BudgetModal = ({ isOpen, onClose, initialData = null }) => {
  const isEdit = !!initialData;
  const { month, year } = getCurrentMonthYear();
  const { mutate: doCreate, isPending: creating } = useCreateBudget();
  const { mutate: doUpdate, isPending: updating } = useUpdateBudget();

  const { register, handleSubmit, control, reset, watch, formState: { errors } } = useForm({
    defaultValues: {
      category: 'Food & Dining',
      limit_amount: '',
      period: 'monthly',
      alerts: true,
      month,
      year,
    },
  });

  useEffect(() => {
    if (initialData) reset({ ...initialData, period: 'monthly', alerts: true });
    else reset({ category: 'Food & Dining', limit_amount: '', period: 'monthly', alerts: true, month, year });
  }, [initialData, isOpen, reset]);

  const onSubmit = (data) => {
    const payload = {
      category: data.category,
      limit_amount: parseFloat(data.limit_amount),
      month: parseInt(data.month, 10),
      year: parseInt(data.year, 10),
    };
    if (isEdit) doUpdate({ id: initialData.id, data: payload }, { onSuccess: onClose });
    else doCreate(payload, { onSuccess: onClose });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEdit ? 'Edit Budget' : 'Add Budget'} size="md">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

        {/* Category grid */}
        <div>
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-3">Category</p>
          <Controller
            name="category"
            control={control}
            render={({ field }) => (
              <div className="grid grid-cols-4 gap-2">
                {CATEGORIES.map(({ label, icon, value }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => field.onChange(value)}
                    className={`flex flex-col items-center gap-1.5 p-3 rounded-2xl border-2 transition-all text-xs font-medium
                      ${field.value === value
                        ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300 bg-white dark:bg-slate-800'
                      }`}
                  >
                    <span className="text-xl leading-none">{icon}</span>
                    <span className="truncate w-full text-center leading-tight">{label}</span>
                  </button>
                ))}
              </div>
            )}
          />
        </div>

        {/* Budget Amount */}
        <div>
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1.5">Budget Amount</p>
          <input
            type="number" step="0.01" placeholder="0.00"
            className={INPUT_CLS}
            {...register('limit_amount', { required: 'Amount required', min: { value: 1, message: 'Must be > 0' } })}
          />
          {errors.limit_amount && <p className="text-xs text-red-500 mt-1">{errors.limit_amount.message}</p>}
        </div>

        {/* Period toggle */}
        <div>
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-3">Period</p>
          <Controller
            name="period"
            control={control}
            render={({ field }) => (
              <div className="flex gap-2">
                {['monthly', 'weekly'].map(p => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => field.onChange(p)}
                    className={`flex-1 py-2.5 text-sm font-medium rounded-2xl border-2 transition-all capitalize
                      ${field.value === p
                        ? 'bg-emerald-500 border-emerald-500 text-white'
                        : 'border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-800 hover:border-slate-300'
                      }`}
                  >
                    {p.charAt(0).toUpperCase() + p.slice(1)}
                  </button>
                ))}
              </div>
            )}
          />
        </div>

        {/* Enable alerts */}
        <label className="flex items-center gap-3 cursor-pointer">
          <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-emerald-500 focus:ring-emerald-400"
            {...register('alerts')} />
          <span className="text-sm text-slate-600 dark:text-slate-400">Enable budget alerts</span>
        </label>

        {/* Actions */}
        <div className="flex gap-3 pt-1">
          <Button type="button" variant="secondary" onClick={onClose} className="flex-1">Cancel</Button>
          <Button type="submit" loading={creating || updating} className="flex-1">
            {isEdit ? 'Update Budget' : 'Create Budget'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default BudgetModal;