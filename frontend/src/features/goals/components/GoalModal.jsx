/**
 * GoalModal — matches pic: goal category icon grid, goal name,
 * target amount, current amount, target date, linked savings account, monthly savings.
 */
import { useForm, Controller } from 'react-hook-form';
import { useEffect, useState } from 'react';
import Modal from '../../../components/ui/Modal';
import Button from '../../../components/ui/Button';
import { useCreateGoal, useUpdateGoal } from '../hooks/useGoals';
import apiClient from '../../../services/apiClient';

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

const GoalModal = ({ isOpen, onClose, initialData = null }) => {
  const isEdit = !!initialData;
  const [accounts, setAccounts] = useState([]);
  const { mutate: doCreate, isPending: creating } = useCreateGoal();
  const { mutate: doUpdate, isPending: updating } = useUpdateGoal();

  useEffect(() => {
    // Fetch accounts to show in savings account dropdown
    if (isOpen) {
      apiClient.get('/accounts')
        .then(res => setAccounts(res.data?.data?.accounts || []))
        .catch(() => {});
    }
  }, [isOpen]);

  const { register, handleSubmit, control, reset, watch, formState: { errors } } = useForm({
    defaultValues: {
      category: 'Custom Goal',
      title: '',
      target_amount: '',
      current_amount: '',
      deadline: '',
      linked_savings_account_id: '',
      monthly_savings_amount: '',
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        ...initialData,
        monthly_savings_amount: initialData.monthly_savings_amount || '',
        linked_savings_account_id: initialData.linked_savings_account_id || '',
      });
    } else {
      reset({
        category: 'Custom Goal',
        title: '',
        target_amount: '',
        current_amount: '',
        deadline: '',
        linked_savings_account_id: '',
        monthly_savings_amount: '',
      });
    }
  }, [initialData, isOpen, reset]);

  const selectedCategory = watch('category');

  const onSubmit = (data) => {
    const payload = {
      title: data.title || data.category,
      category: data.category,
      target_amount: parseFloat(data.target_amount),
      current_amount: parseFloat(data.current_amount || 0),
      deadline: data.deadline || null,
      linked_savings_account_id: data.linked_savings_account_id || null,
      monthly_savings_amount: parseFloat(data.monthly_savings_amount || 0),
    };
    
    if (isEdit) {
      doUpdate({ id: initialData.id, data: payload }, { onSuccess: () => { reset(); onClose(); } });
    } else {
      doCreate(payload, { onSuccess: () => { reset(); onClose(); } });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEdit ? 'Edit Savings Goal' : 'Create Savings Goal'} size="md">
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

        {/* Link to Savings Account */}
        <div>
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1.5">
            Link to Savings Account <span className="text-xs text-slate-400 font-normal">(optional)</span>
          </p>
          <select className={INPUT_CLS} {...register('linked_savings_account_id')}>
            <option value="">No account linked</option>
            {accounts
              .filter((acc) => acc.account_type === 'savings_account')
              .map((acc) => (
                <option key={acc.id} value={acc.id}>
                  {acc.account_name} ({acc.account_type})
                </option>
              ))}
          </select>
          <p className="text-xs text-slate-400 mt-1">
            Select a savings account so goal deposits are tracked from that account.
            {accounts.filter((acc) => acc.account_type === 'savings_account').length === 0 && (
              <span className="block text-xs text-amber-500 mt-1">Add a savings account first to link it here.</span>
            )}
          </p>
        </div>

        {/* Monthly Savings Amount */}
        <div>
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1.5">
            Monthly Savings <span className="text-xs text-slate-400 font-normal">(optional)</span>
          </p>
          <input
            type="number" step="0.01" placeholder="0.00"
            className={INPUT_CLS}
            {...register('monthly_savings_amount')}
          />
          <p className="text-xs text-slate-400 mt-1">How much to save per month toward this goal.</p>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-1">
          <Button type="button" variant="secondary" onClick={onClose} className="flex-1">Cancel</Button>
          <Button type="submit" loading={creating || updating} className="flex-1">
            {isEdit ? 'Update Goal' : 'Create Goal'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default GoalModal;