/**
 * AccountModal — create or edit a financial account.
 */
import { useForm, Controller } from 'react-hook-form';
import { useEffect } from 'react';
import Modal from '../../../components/ui/Modal';
import Button from '../../../components/ui/Button';
import { useCreateAccount, useUpdateAccount } from '../hooks/useAccounts';

const ACCOUNT_TYPES = [
  { value: 'bank_account',       label: 'Bank Account',      icon: '🏦' },
  { value: 'cash_wallet',        label: 'Cash Wallet',       icon: '👛' },
  { value: 'savings_account',    label: 'Savings',           icon: '💰' },
  { value: 'digital_wallet',     label: 'Digital Wallet',    icon: '📱' },
  { value: 'credit_account',     label: 'Credit',            icon: '💳' },
  { value: 'investment_account', label: 'Investment',        icon: '📈' },
];

const COLOR_THEMES = [
  { value: 'emerald', bg: 'bg-emerald-500' },
  { value: 'blue',    bg: 'bg-blue-500'    },
  { value: 'violet',  bg: 'bg-violet-500'  },
  { value: 'orange',  bg: 'bg-orange-500'  },
  { value: 'red',     bg: 'bg-red-500'     },
  { value: 'purple',  bg: 'bg-purple-500'  },
];

const INPUT_CLS = `w-full px-4 py-3 text-sm border border-slate-200 dark:border-slate-600
  rounded-2xl bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100
  focus:outline-none focus:border-emerald-400 placeholder-slate-400`;

const AccountModal = ({ isOpen, onClose, initialData = null }) => {
  const isEdit = !!initialData;
  const { mutate: doCreate, isPending: creating } = useCreateAccount();
  const { mutate: doUpdate, isPending: updating } = useUpdateAccount();

  const { register, handleSubmit, control, reset, watch, formState: { errors } } = useForm({
    defaultValues: { account_type: 'bank_account', color_theme: 'blue', icon: '🏦', current_balance: '' },
  });

  useEffect(() => {
    if (initialData) reset(initialData);
    else reset({ account_type: 'bank_account', color_theme: 'blue', icon: '🏦', current_balance: '' });
  }, [initialData, isOpen, reset]);

  const selectedType = watch('account_type');

  // Auto-update icon when type changes
  const autoIcon = ACCOUNT_TYPES.find(t => t.value === selectedType)?.icon || '🏦';

  const onSubmit = (data) => {
    const payload = { ...data, current_balance: parseFloat(data.current_balance || 0) };
    if (!payload.icon) payload.icon = autoIcon;
    if (isEdit) doUpdate({ id: initialData.id, data: payload }, { onSuccess: onClose });
    else doCreate(payload, { onSuccess: onClose });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEdit ? 'Edit Account' : 'Add Account'} size="md">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

        {/* Account Type grid */}
        <div>
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-3">Account Type</p>
          <Controller name="account_type" control={control} render={({ field }) => (
            <div className="grid grid-cols-3 gap-2">
              {ACCOUNT_TYPES.map(({ value, label, icon }) => (
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

        {/* Account Name */}
        <div>
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1.5">Account Name</p>
          <input placeholder="e.g. BOB Savings, Cash Wallet"
            className={INPUT_CLS}
            {...register('account_name', { required: 'Account name is required' })} />
          {errors.account_name && <p className="text-xs text-red-500 mt-1">{errors.account_name.message}</p>}
        </div>

        {/* Initial Balance */}
        <div>
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1.5">
            {isEdit ? 'Current Balance' : 'Initial Balance'}
          </p>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium">
              {watch('currency') || '$'}
            </span>
            <input type="number" step="0.01" placeholder="0.00"
              className={`${INPUT_CLS} pl-8`}
              {...register('current_balance', { min: { value: 0, message: 'Cannot be negative' } })} />
          </div>
          {errors.current_balance && <p className="text-xs text-red-500 mt-1">{errors.current_balance.message}</p>}
        </div>

        {/* Color Theme */}
        <div>
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-3">Color Theme</p>
          <Controller name="color_theme" control={control} render={({ field }) => (
            <div className="flex gap-2">
              {COLOR_THEMES.map(({ value, bg }) => (
                <button key={value} type="button" onClick={() => field.onChange(value)}
                  className={`w-8 h-8 rounded-full ${bg} transition-all
                    ${field.value === value ? 'ring-2 ring-offset-2 ring-slate-400 scale-110' : 'hover:scale-105'}`} />
              ))}
            </div>
          )} />
        </div>

        {/* Custom Icon */}
        <div>
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1.5">Icon (emoji)</p>
          <input placeholder={autoIcon} maxLength={2}
            className={`${INPUT_CLS} w-24 text-center text-xl`}
            {...register('icon')} />
        </div>

        {/* Description */}
        <div>
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1.5">
            Notes <span className="text-slate-400 font-normal">(optional)</span>
          </p>
          <textarea rows={2} placeholder="e.g. Primary salary account"
            className={`${INPUT_CLS} resize-none`} {...register('description')} />
        </div>

        <div className="flex gap-3 pt-1">
          <Button type="button" variant="secondary" onClick={onClose} className="flex-1">Cancel</Button>
          <Button type="submit" loading={creating || updating} className="flex-1">
            {isEdit ? 'Update Account' : 'Add Account'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default AccountModal;
