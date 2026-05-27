/**
 * IncomeModal — add or edit an income source.
 */
import { useForm, Controller } from 'react-hook-form';
import { useEffect } from 'react';
import Modal from '../../../components/ui/Modal';
import Button from '../../../components/ui/Button';
import { useCreateIncome, useUpdateIncome, useAccounts } from '../hooks/useAccounts';

const CATEGORIES = [
  { value: 'salary',      label: 'Salary',      icon: '💼' },
  { value: 'freelance',   label: 'Freelance',   icon: '💻' },
  { value: 'scholarship', label: 'Scholarship', icon: '🎓' },
  { value: 'passive',     label: 'Passive',     icon: '📈' },
  { value: 'business',    label: 'Business',    icon: '🏢' },
  { value: 'side_income', label: 'Side Income', icon: '⚡' },
  { value: 'other',       label: 'Other',       icon: '💰' },
];

const FREQUENCIES = [
  { value: 'weekly',     label: 'Weekly'    },
  { value: 'bi_weekly',  label: 'Bi-weekly' },
  { value: 'monthly',    label: 'Monthly'   },
  { value: 'quarterly',  label: 'Quarterly' },
  { value: 'annually',   label: 'Annually'  },
  { value: 'one_time',   label: 'One-time'  },
];

const INPUT_CLS = `w-full px-4 py-3 text-sm border border-slate-200 dark:border-slate-600
  rounded-2xl bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100
  focus:outline-none focus:border-emerald-400 placeholder-slate-400`;

const SELECT_CLS = `${INPUT_CLS} appearance-none cursor-pointer`;

const IncomeModal = ({ isOpen, onClose, initialData = null }) => {
  const isEdit = !!initialData;
  const { mutate: doCreate, isPending: creating } = useCreateIncome();
  const { mutate: doUpdate, isPending: updating } = useUpdateIncome();
  const { data: accounts = [] } = useAccounts();

  const { register, handleSubmit, control, reset, formState: { errors } } = useForm({
    defaultValues: { category: 'salary', frequency: 'monthly', status: 'active' },
  });

  useEffect(() => {
    if (initialData) reset(initialData);
    else reset({ category: 'salary', frequency: 'monthly', status: 'active', source_name: '', income_amount: '', employer: '' });
  }, [initialData, isOpen, reset]);

  const onSubmit = (data) => {
    const payload = { ...data, income_amount: parseFloat(data.income_amount) };
    if (isEdit) doUpdate({ id: initialData.id, data: payload }, { onSuccess: onClose });
    else doCreate(payload, { onSuccess: onClose });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEdit ? 'Edit Income Source' : 'Add Income Source'} size="md">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

        {/* Category grid */}
        <div>
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-3">Income Type</p>
          <Controller name="category" control={control} render={({ field }) => (
            <div className="grid grid-cols-4 gap-2">
              {CATEGORIES.map(({ value, label, icon }) => (
                <button key={value} type="button" onClick={() => field.onChange(value)}
                  className={`flex flex-col items-center gap-1.5 p-3 rounded-2xl border-2 transition-all text-xs font-medium
                    ${field.value === value
                      ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 bg-white dark:bg-slate-800 hover:border-slate-300'}`}>
                  <span className="text-xl">{icon}</span>
                  <span className="text-center leading-tight">{label}</span>
                </button>
              ))}
            </div>
          )} />
        </div>

        {/* Source name */}
        <div>
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1.5">Job / Source Name</p>
          <input placeholder="e.g. Software Engineer, YouTube Channel"
            className={INPUT_CLS}
            {...register('source_name', { required: 'Source name is required' })} />
          {errors.source_name && <p className="text-xs text-red-500 mt-1">{errors.source_name.message}</p>}
        </div>

        {/* Employer */}
        <div>
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1.5">
            Employer / Company <span className="text-slate-400 font-normal">(optional)</span>
          </p>
          <input placeholder="e.g. Google, Self-employed" className={INPUT_CLS} {...register('employer')} />
        </div>

        {/* Amount + Frequency */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1.5">Amount</p>
            <input type="number" step="0.01" placeholder="0.00" className={INPUT_CLS}
              {...register('income_amount', { required: 'Amount required', min: { value: 0, message: 'Must be ≥ 0' } })} />
            {errors.income_amount && <p className="text-xs text-red-500 mt-1">{errors.income_amount.message}</p>}
          </div>
          <div>
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1.5">Frequency</p>
            <select className={SELECT_CLS} {...register('frequency')}>
              {FREQUENCIES.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
            </select>
          </div>
        </div>

        {/* Link to account */}
        {accounts.length > 0 && (
          <div>
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1.5">
              Link to Account <span className="text-slate-400 font-normal">(optional)</span>
            </p>
            <select className={SELECT_CLS} {...register('account_id')}>
              <option value="">— No linked account —</option>
              {accounts.map(a => <option key={a.id} value={a.id}>{a.icon} {a.account_name}</option>)}
            </select>
          </div>
        )}

        {/* Start date */}
        <div>
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1.5">
            Start Date <span className="text-slate-400 font-normal">(optional)</span>
          </p>
          <input type="date" className={INPUT_CLS} {...register('start_date')} />
        </div>

        {/* Notes */}
        <div>
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1.5">Notes</p>
          <textarea rows={2} placeholder="Any additional notes..." className={`${INPUT_CLS} resize-none`} {...register('notes')} />
        </div>

        <div className="flex gap-3 pt-1">
          <Button type="button" variant="secondary" onClick={onClose} className="flex-1">Cancel</Button>
          <Button type="submit" loading={creating || updating} className="flex-1">
            {isEdit ? 'Update' : 'Add Income Source'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default IncomeModal;
