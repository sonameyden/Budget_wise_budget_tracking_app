/**
 * GoalModal — matches pic: goal category icon grid, goal name,
 * target amount, current amount, target date.
 */
import { useForm, Controller } from 'react-hook-form';
import Modal from '../../../components/ui/Modal';
import Button from '../../../components/ui/Button';
import { useCreateGoal } from '../hooks/useGoals';

const GOAL_CATEGORIES = [
  { label: 'Emergency', icon: '🛡️', value: 'Emergency Fund' },
  { label: 'Vacation',  icon: '✈️', value: 'Vacation'       },
  { label: 'New Car',   icon: '🚗', value: 'New Car'        },
  { label: 'Home',      icon: '🏠', value: 'Home'           },
  { label: 'Education', icon: '🎓', value: 'Education'      },
  { label: 'Retirement',icon: '🐷', value: 'Retirement'     },
  { label: 'Custom',    icon: '🎯', value: 'Custom Goal'    },
];

const INPUT_CLS = `w-full px-4 py-3 text-sm border border-slate-200 dark:border-slate-600
  rounded-2xl bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100
  focus:outline-none focus:border-emerald-400 placeholder-slate-400`;

const GoalModal = ({ isOpen, onClose }) => {
  const { mutate: doCreate, isPending } = useCreateGoal();

  const { register, handleSubmit, control, reset, watch, formState: { errors } } = useForm({
    defaultValues: {
      category: 'Custom Goal',
      title: '',
      target_amount: '',
      current_amount: '',
      deadline: '',
    },
  });

  const selectedCategory = watch('category');

  const onSubmit = (data) => {
    doCreate(
      {
        title: data.title || data.category,
        category: data.category,
        target_amount: parseFloat(data.target_amount),
        current_amount: parseFloat(data.current_amount || 0),
        deadline: data.deadline || null,
      },
      { onSuccess: () => { reset(); onClose(); } }
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create Savings Goal" size="md">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

        {/* Goal Category grid */}
        <div>
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-3">Goal Category</p>
          <Controller
            name="category"
            control={control}
            render={({ field }) => (
              <div className="grid grid-cols-4 gap-2">
                {GOAL_CATEGORIES.map(({ label, icon, value }) => (
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
                    <span className="text-center leading-tight">{label}</span>
                  </button>
                ))}
              </div>
            )}
          />
        </div>

        {/* Goal Name */}
        <div>
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1.5">
            Goal Name <span className="text-slate-400 font-normal">(optional)</span>
          </p>
          <input
            placeholder={selectedCategory || 'Custom Goal'}
            className={INPUT_CLS}
            {...register('title')}
          />
        </div>

        {/* Target + Current amounts */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1.5">Target Amount</p>
            <input
              type="number" step="0.01" placeholder="0.00"
              className={INPUT_CLS}
              {...register('target_amount', { required: 'Target required', min: { value: 1, message: 'Must be > 0' } })}
            />
            {errors.target_amount && <p className="text-xs text-red-500 mt-1">{errors.target_amount.message}</p>}
          </div>
          <div>
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1.5">Current Amount</p>
            <input
              type="number" step="0.01" placeholder="0.00"
              className={INPUT_CLS}
              {...register('current_amount')}
            />
          </div>
        </div>

        {/* Target Date */}
        <div>
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1.5">Target Date</p>
          <input type="date" className={INPUT_CLS} {...register('deadline')} />
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-1">
          <Button type="button" variant="secondary" onClick={onClose} className="flex-1">Cancel</Button>
          <Button type="submit" loading={isPending} className="flex-1">Create Goal</Button>
        </div>
      </form>
    </Modal>
  );
};

export default GoalModal;