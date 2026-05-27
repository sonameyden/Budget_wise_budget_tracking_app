/**
 * TransactionModal — matches pic: amount input, category icon grid,
 * merchant/description, date, payment method dropdown.
 */
import { useForm, Controller } from 'react-hook-form';
import { useEffect, useState } from 'react';
import Modal from '../../../components/ui/Modal';
import Button from '../../../components/ui/Button';
import { useCreateTransaction, useUpdateTransaction } from '../hooks/useTransactions';
import { toInputDate } from '../../../lib/dateHelpers';

const CATEGORIES = [
  { label: 'Food',           icon: '🍴', value: 'Food & Dining'     },
  { label: 'Transportati...', icon: '🚗', value: 'Transportation'    },
  { label: 'Shopping',       icon: '🛍️', value: 'Shopping'           },
  { label: 'Entertainment',  icon: '🎬', value: 'Entertainment'      },
  { label: 'Bills',          icon: '💵', value: 'Bills & Utilities'  },
  { label: 'Health',         icon: '❤️', value: 'Health'             },
  { label: 'Education',      icon: '📖', value: 'Education'          },
  { label: 'Travel',         icon: '✈️', value: 'Travel'             },
  { label: 'Other',          icon: '•••', value: 'Other'             },
];

const PAYMENT_METHODS = ['Cash','Card','Wallet','Bank Transfer'];

const INPUT_CLS = `w-full px-4 py-3 text-sm border border-slate-200 dark:border-slate-600
  rounded-2xl bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100
  focus:outline-none focus:border-emerald-400 placeholder-slate-400`;

const TransactionModal = ({ isOpen, onClose, initialData = null }) => {
  const isEdit = !!initialData;
  const { mutate: doCreate, isPending: creating } = useCreateTransaction();
  const { mutate: doUpdate, isPending: updating } = useUpdateTransaction();

  const { register, handleSubmit, control, reset, watch, formState: { errors } } = useForm({
    defaultValues: {
      type: 'expense',
      category: 'Food & Dining',
      payment_method: 'Card',
      transaction_date: toInputDate(),
      amount: '',
      title: '',
      notes: '',
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({ ...initialData, transaction_date: toInputDate(initialData.transaction_date) });
    } else {
      reset({
        type: 'expense', category: 'Food & Dining', payment_method: 'Card',
        transaction_date: toInputDate(), amount: '', title: '', notes: '',
      });
    }
  }, [initialData, isOpen, reset]);

  const onSubmit = (data) => {
    const payload = { ...data, amount: parseFloat(data.amount) };
    if (isEdit) doUpdate({ id: initialData.id, data: payload }, { onSuccess: onClose });
    else doCreate(payload, { onSuccess: onClose });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEdit ? 'Edit Transaction' : 'Add Transaction'} size="md">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

        {/* Type toggle */}
        <div className="flex bg-slate-100 dark:bg-slate-800 rounded-2xl p-1 gap-1">
          {['expense','income'].map(t => (
            <label key={t} className="flex-1">
              <input type="radio" value={t} className="sr-only" {...register('type')} />
              <div className={`text-center py-2 text-sm font-medium rounded-xl cursor-pointer transition-all capitalize
                ${watch('type') === t ? 'bg-emerald-500 text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
                {t}
              </div>
            </label>
          ))}
        </div>

        {/* Amount */}
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-light text-slate-400">$</span>
          <input
            type="number" step="0.01" placeholder="0.00"
            className={`${INPUT_CLS} pl-10 text-2xl font-semibold`}
            {...register('amount', { required: 'Amount required', min: { value: 0.01, message: 'Must be > 0' } })}
          />
          {errors.amount && <p className="text-xs text-red-500 mt-1">{errors.amount.message}</p>}
        </div>

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

        {/* Merchant / Description */}
        <div>
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1.5">Merchant / Description</p>
          <input
            placeholder="e.g., Starbucks, Amazon"
            className={INPUT_CLS}
            {...register('title', { required: 'Description is required' })}
          />
          {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title.message}</p>}
        </div>

        {/* Date */}
        <div>
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1.5">Date</p>
          <input type="date" className={INPUT_CLS}
            {...register('transaction_date', { required: true })} />
        </div>

        {/* Payment method */}
        <div>
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1.5">Payment Method</p>
          <div className="relative">
            <select className={`${INPUT_CLS} appearance-none pr-10 cursor-pointer`}
              {...register('payment_method')}>
              {PAYMENT_METHODS.map(m => <option key={m} value={m.toLowerCase().replace(' ','_')}>{m}</option>)}
            </select>
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">▾</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-1">
          <Button type="button" variant="secondary" onClick={onClose} className="flex-1">Cancel</Button>
          <Button type="submit" loading={creating || updating} className="flex-1">
            {isEdit ? 'Update' : 'Add Transaction'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default TransactionModal;