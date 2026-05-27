/**
 * GoalsPage — savings goal cards grid with circular progress indicators.
 */
import { useState } from 'react';
import { Plus, Target } from 'lucide-react';
import AppLayout from '../components/layout/AppLayout';
import Button from '../components/ui/Button';
import EmptyState from '../components/ui/EmptyState';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import GoalCard from '../features/goals/components/GoalCard';
import GoalModal from '../features/goals/components/GoalModal';
import AddFundsModal from '../features/goals/components/AddFundsModal';
import { useGoals, useDeleteGoal } from '../features/goals/hooks/useGoals';
import { SkeletonCard } from '../components/ui/Skeleton';

const GoalsPage = () => {
  const [goalModalOpen,  setGoalModalOpen]  = useState(false);
  const [fundsModalOpen, setFundsModalOpen] = useState(false);
  const [fundsTarget,    setFundsTarget]    = useState(null);
  const [editTarget,     setEditTarget]     = useState(null);
  const [deleteId,       setDeleteId]       = useState(null);

  const { data: goals = [], isLoading } = useGoals();
  const { mutate: doDelete, isPending: deleting } = useDeleteGoal();

  const handleAddFunds = (goal) => { setFundsTarget(goal); setFundsModalOpen(true); };
  const handleEdit     = (goal) => { setEditTarget(goal); setGoalModalOpen(true); };
  const handleClose    = ()     => { setGoalModalOpen(false); setEditTarget(null); };
  const handleDelete   = ()     => doDelete(deleteId, { onSuccess: () => setDeleteId(null) });

  return (
    <AppLayout title="Savings Goals">
      {/* Toolbar */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">Savings Goals</h2>
          <p className="text-sm text-slate-500">Track your progress towards financial goals</p>
        </div>
        <Button onClick={() => setGoalModalOpen(true)}>
          <Plus size={16} /> Add Goal
        </Button>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : goals.length === 0 ? (
        <EmptyState
          icon={Target}
          title="No savings goals yet"
          description="Create your first savings goal and start tracking your progress."
          action={() => setGoalModalOpen(true)}
          actionLabel="Create Goal"
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {goals.map(g => (
            <GoalCard
              key={g.id} goal={g}
              onAddFunds={handleAddFunds}
              onEdit={handleEdit}
              onDelete={(id) => setDeleteId(id)}
            />
          ))}
        </div>
      )}

      <GoalModal isOpen={goalModalOpen} onClose={handleClose} />

      <AddFundsModal
        isOpen={fundsModalOpen}
        onClose={() => { setFundsModalOpen(false); setFundsTarget(null); }}
        goal={fundsTarget}
      />

      <ConfirmDialog
        isOpen={!!deleteId} onClose={() => setDeleteId(null)}
        onConfirm={handleDelete} loading={deleting}
        title="Delete Goal"
        message="Are you sure you want to delete this goal? This action cannot be undone."
      />
    </AppLayout>
  );
};

export default GoalsPage;
