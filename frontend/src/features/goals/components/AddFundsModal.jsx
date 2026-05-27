import { useForm } from 'react-hook-form';
import Modal from '../../../components/ui/Modal';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import { useUpdateGoal } from '../hooks/useGoals';
import { formatCurrency } from '../../../lib/formatCurrency';
import { useCurrency } from '../../../contexts/AuthContext';

const AddFundsModal = ({ isOpen, onClose, goal }) => {
  const { mutate: doUpdate, isPending } = useUpdateGoal();
  const currency = useCurrency();
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const onSubmit = ({ amount }) => {
    const newAmount = parseFloat(goal.current_amount) + parseFloat(amount);
    doUpdate({ id: goal.id, data: { current_amount: newAmount } }, {
      onSuccess: () => { reset(); onClose(); },
    });
  };

  if (!goal) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Funds" size="sm">
      <div className="mb-4 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
        <p className="text-xs text-slate-400 mb-1">{goal.title}</p>
        <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
          {formatCurrency(goal.current_amount, currency)} / {formatCurrency(goal.target_amount, currency)}
        </p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input label="Amount to Add" type="number" step="0.01" placeholder="0.00"
          error={errors.amount?.message}
          {...register('amount', { required: 'Amount required', min: { value: 0.01, message: 'Must be > 0' } })} />
        <div className="flex gap-3">
          <Button type="button" variant="secondary" onClick={onClose} className="flex-1">Cancel</Button>
          <Button type="submit" loading={isPending} className="flex-1">Add Funds</Button>
        </div>
      </form>
    </Modal>
  );
};

export default AddFundsModal;
