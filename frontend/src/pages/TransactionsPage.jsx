/**
 * TransactionsPage — full transaction list with search, filter, add/edit/delete.
 */
import { useState } from 'react';
import { Plus } from 'lucide-react';
import AppLayout from '../components/layout/AppLayout';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import EmptyState from '../components/ui/EmptyState';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import TransactionFilters from '../features/transactions/components/TransactionFilters';
import TransactionRow from '../features/transactions/components/TransactionRow';
import TransactionModal from '../features/transactions/components/TransactionModal';
import { useTransactions, useDeleteTransaction } from '../features/transactions/hooks/useTransactions';
import { ArrowLeftRight } from 'lucide-react';
import useDebounce from '../hooks/useDebounce';
import Skeleton from '../components/ui/Skeleton';

const TransactionsPage = () => {
  const [search,     setSearch]     = useState('');
  const [category,   setCategory]   = useState('All Categories');
  const [modalOpen,  setModalOpen]  = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [deleteId,   setDeleteId]   = useState(null);

  const debouncedSearch = useDebounce(search, 300);

  const filters = {
    ...(debouncedSearch ? { search: debouncedSearch } : {}),
    ...(category !== 'All Categories' ? { category } : {}),
  };

  const { data: transactions = [], isLoading } = useTransactions(filters);
  const { mutate: doDelete, isPending: deleting } = useDeleteTransaction();

  const handleEdit = (tx)  => { setEditTarget(tx); setModalOpen(true); };
  const handleClose = ()   => { setModalOpen(false); setEditTarget(null); };
  const handleDelete = ()  => { doDelete(deleteId, { onSuccess: () => setDeleteId(null) }); };

  return (
    <AppLayout title="Transactions">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <TransactionFilters
          search={search} onSearch={setSearch}
          category={category} onCategory={setCategory}
        />
        <Button onClick={() => setModalOpen(true)} className="shrink-0">
          <Plus size={16} /> Add Transaction
        </Button>
      </div>

      {/* List */}
      <Card>
        {isLoading ? (
          <div className="p-4 space-y-3">
            {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-14 w-full" />)}
          </div>
        ) : transactions.length === 0 ? (
          <EmptyState
            icon={ArrowLeftRight}
            title="No transactions found"
            description={search || category !== 'All Categories' ? 'Try adjusting your filters.' : 'Add your first transaction to get started.'}
            action={() => setModalOpen(true)}
            actionLabel="Add Transaction"
          />
        ) : (
          transactions.map(tx => (
            <TransactionRow
              key={tx.id}
              tx={tx}
              onEdit={handleEdit}
              onDelete={(id) => setDeleteId(id)}
            />
          ))
        )}
      </Card>

      {/* Modals */}
      <TransactionModal
        isOpen={modalOpen}
        onClose={handleClose}
        initialData={editTarget}
      />

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete Transaction"
        message="Are you sure you want to delete this transaction? This action cannot be undone."
      />
    </AppLayout>
  );
};

export default TransactionsPage;
