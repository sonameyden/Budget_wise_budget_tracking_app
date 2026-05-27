/**
 * TransferModal — transfer funds between two accounts.
 */
import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import Modal from '../../../components/ui/Modal';
import Button from '../../../components/ui/Button';
import { useTransfer, useAccounts } from '../hooks/useAccounts';
import { formatCurrency } from '../../../lib/formatCurrency';
import { useCurrency } from '../../../contexts/AuthContext';
import { ArrowRight } from 'lucide-react';

const INPUT_CLS = `w-full px-4 py-3 text-sm border border-slate-200 dark:border-slate-600
  rounded-2xl bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100
  focus:outline-none focus:border-emerald-400 placeholder-slate-400`;

const TransferModal = ({ isOpen, onClose, fromAccount = null }) => {
  const { mutate: doTransfer, isPending } = useTransfer();
  const { data: accounts = [] } = useAccounts();
  const currency = useCurrency();

  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm({
    defaultValues: { from_account_id: fromAccount?.id || '', to_account_id: '', amount: '' },
  });

  useEffect(() => {
    reset({ from_account_id: fromAccount?.id || '', to_account_id: '', amount: '' });
  }, [fromAccount, isOpen, reset]);

  const fromId = watch('from_account_id');
  const fromAcc = accounts.find(a => a.id === fromId);

  const onSubmit = (data) => {
    doTransfer({
      from_account_id: data.from_account_id,
      to_account_id:   data.to_account_id,
      amount: parseFloat(data.amount),
    }, { onSuccess: onClose });
  };

  const otherAccounts = accounts.filter(a => a.id !== fromId);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Transfer Funds" size="sm">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

        {/* From */}
        <div>
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1.5">From Account</p>
          <select className={`${INPUT_CLS} appearance-none cursor-pointer`}
            {...register('from_account_id', { required: 'Select source account' })}>
            <option value="">— Select account —</option>
            {accounts.map(a => (
              <option key={a.id} value={a.id}>
                {a.icon} {a.account_name} ({formatCurrency(a.current_balance, currency)})
              </option>
            ))}
          </select>
          {errors.from_account_id && <p className="text-xs text-red-500 mt-1">{errors.from_account_id.message}</p>}
        </div>

        {/* Arrow indicator */}
        <div className="flex justify-center">
          <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
            <ArrowRight size={16} className="text-emerald-600" />
          </div>
        </div>

        {/* To */}
        <div>
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1.5">To Account</p>
          <select className={`${INPUT_CLS} appearance-none cursor-pointer`}
            {...register('to_account_id', { required: 'Select destination account' })}>
            <option value="">— Select account —</option>
            {otherAccounts.map(a => (
              <option key={a.id} value={a.id}>
                {a.icon} {a.account_name} ({formatCurrency(a.current_balance, currency)})
              </option>
            ))}
          </select>
          {errors.to_account_id && <p className="text-xs text-red-500 mt-1">{errors.to_account_id.message}</p>}
        </div>

        {/* Amount */}
        <div>
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1.5">Amount</p>
          <input type="number" step="0.01" placeholder="0.00" className={INPUT_CLS}
            {...register('amount', {
              required: 'Amount required',
              min: { value: 0.01, message: 'Must be > 0' },
              validate: v => !fromAcc || parseFloat(v) <= parseFloat(fromAcc.current_balance) || 'Insufficient balance',
            })} />
          {errors.amount && <p className="text-xs text-red-500 mt-1">{errors.amount.message}</p>}
          {fromAcc && (
            <p className="text-xs text-slate-400 mt-1">
              Available: {formatCurrency(fromAcc.current_balance, currency)}
            </p>
          )}
        </div>

        <div className="flex gap-3 pt-1">
          <Button type="button" variant="secondary" onClick={onClose} className="flex-1">Cancel</Button>
          <Button type="submit" loading={isPending} className="flex-1">Transfer</Button>
        </div>
      </form>
    </Modal>
  );
};

export default TransferModal;
