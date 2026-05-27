/**
 * BudgetsPage — budget cards grid with add/edit/delete.
 */
import { useState } from 'react';
import { Plus, Wallet } from 'lucide-react';
import AppLayout from '../components/layout/AppLayout';
import Button from '../components/ui/Button';
import EmptyState from '../components/ui/EmptyState';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import BudgetCard from '../features/budgets/components/BudgetCard';
import BudgetModal from '../features/budgets/components/BudgetModal';
import { useBudgets, useDeleteBudget } from '../features/budgets/hooks/useBudgets';
import { SkeletonCard } from '../components/ui/Skeleton';

const BudgetsPage = () => {
  const [modalOpen,  setModalOpen]  = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [deleteId,   setDeleteId]   = useState(null);

  const { data: budgets = [], isLoading } = useBudgets();
  const { mutate: doDelete, isPending: deleting } = useDeleteBudget();

  const handleEdit  = (b) => { setEditTarget(b); setModalOpen(true); };
  const handleClose = ()  => { setModalOpen(false); setEditTarget(null); };
  const handleDelete = () => doDelete(deleteId, { onSuccess: () => setDeleteId(null) });

  return (
    <AppLayout title="Budgets">
      {/* Toolbar */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">Budgets</h2>
          <p className="text-sm text-slate-500">Track your monthly spending limits</p>
        </div>
        <Button onClick={() => setModalOpen(true)}>
          <Plus size={16} /> Add Budget
        </Button>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : budgets.length === 0 ? (
        <EmptyState
          icon={Wallet}
          title="No budgets yet"
          description="Set spending limits for your categories to stay on track."
          action={() => setModalOpen(true)}
          actionLabel="Create Budget"
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {budgets.map(b => (
            <BudgetCard
              key={b.id} budget={b}
              onEdit={handleEdit}
              onDelete={(id) => setDeleteId(id)}
            />
          ))}
        </div>
      )}

      <BudgetModal isOpen={modalOpen} onClose={handleClose} initialData={editTarget} />

      <ConfirmDialog
        isOpen={!!deleteId} onClose={() => setDeleteId(null)}
        onConfirm={handleDelete} loading={deleting}
        title="Delete Budget"
        message="Are you sure you want to delete this budget? This action cannot be undone."
      />
    </AppLayout>
  );
};

export default BudgetsPage;
