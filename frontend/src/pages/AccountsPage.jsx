/**
 * AccountsPage — manages financial accounts and income sources.
 * Two-tab layout: Accounts | Income Sources
 */
import { useState } from 'react';
import { Plus, Wallet, Briefcase } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AppLayout from '../components/layout/AppLayout';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import EmptyState from '../components/ui/EmptyState';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import AccountCard from '../features/accounts/components/AccountCard';
import AccountModal from '../features/accounts/components/AccountModal';
import IncomeSourceCard from '../features/accounts/components/IncomeSourceCard';
import IncomeModal from '../features/accounts/components/IncomeModal';
import TransferModal from '../features/accounts/components/TransferModal';
import {
  useAccounts, useNetWorth, useDeleteAccount,
  useIncomeSources, useDeleteIncome,
} from '../features/accounts/hooks/useAccounts';
import { formatCurrency } from '../lib/formatCurrency';
import { useCurrency } from '../contexts/AuthContext';
import { SkeletonCard } from '../components/ui/Skeleton';

const TABS = ['Accounts', 'Income Sources'];

const NetWorthCard = ({ label, value, sub, color }) => (
  <div className={`bg-white dark:bg-gray-900 border border-slate-200 dark:border-slate-700
                   rounded-2xl p-5 shadow-card border-l-4 ${color}`}>
    <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">{label}</p>
    <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">{value}</p>
    {sub && <p className="text-xs text-slate-400 mt-1">{sub}</p>}
  </div>
);

const AccountsPage = () => {
  const [tab,            setTab]            = useState('Accounts');
  const [accountModal,   setAccountModal]   = useState(false);
  const [incomeModal,    setIncomeModal]    = useState(false);
  const [transferModal,  setTransferModal]  = useState(false);
  const [editAccount,    setEditAccount]    = useState(null);
  const [editIncome,     setEditIncome]     = useState(null);
  const [transferFrom,   setTransferFrom]   = useState(null);
  const [deleteAccId,    setDeleteAccId]    = useState(null);
  const [deleteIncId,    setDeleteIncId]    = useState(null);

  const currency = useCurrency();
  const { data: accounts = [],  isLoading: accLoading }  = useAccounts();
  const { data: netWorth,       isLoading: nwLoading  }  = useNetWorth();
  const { data: incomeSources = [], isLoading: incLoading } = useIncomeSources();
  const { mutate: deleteAcc, isPending: deletingAcc } = useDeleteAccount();
  const { mutate: deleteInc, isPending: deletingInc } = useDeleteIncome();

  const totalMonthlyIncome = incomeSources
    .filter(s => s.status === 'active')
    .reduce((sum, s) => sum + (s.monthly_equivalent ?? parseFloat(s.income_amount)), 0);

  const handleTransfer = (account) => { setTransferFrom(account); setTransferModal(true); };
  const handleEditAcc  = (a) => { setEditAccount(a); setAccountModal(true); };
  const handleEditInc  = (s) => { setEditIncome(s);  setIncomeModal(true);  };

  const closeAccountModal = () => { setAccountModal(false); setEditAccount(null); };
  const closeIncomeModal  = () => { setIncomeModal(false);  setEditIncome(null);  };

  return (
    <AppLayout title="Accounts">

      {/* Net Worth summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <NetWorthCard
          label="Total Balance"
          value={nwLoading ? '...' : formatCurrency(netWorth?.total_balance ?? 0, currency)}
          sub={`${netWorth?.account_count ?? 0} accounts`}
          color="border-l-emerald-500"
        />
        <NetWorthCard
          label="Monthly Income"
          value={formatCurrency(totalMonthlyIncome, currency)}
          sub={`${incomeSources.filter(s => s.status === 'active').length} active streams`}
          color="border-l-blue-500"
        />
        <NetWorthCard
          label="Total Accounts"
          value={accounts.length}
          sub="across all account types"
          color="border-l-violet-500"
        />
      </div>

      {/* Tab bar + action button */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex bg-slate-100 dark:bg-slate-800 rounded-xl p-1 gap-1">
          {TABS.map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all
                ${tab === t ? 'bg-emerald-500 text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-200'}`}>
              {t}
            </button>
          ))}
        </div>
        <Button onClick={() => tab === 'Accounts' ? setAccountModal(true) : setIncomeModal(true)}>
          <Plus size={16} />
          {tab === 'Accounts' ? 'Add Account' : 'Add Income Source'}
        </Button>
      </div>

      {/* Tab content */}
      <AnimatePresence mode="wait">
        {tab === 'Accounts' ? (
          <motion.div key="accounts"
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            {accLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...Array(3)].map((_, i) => <SkeletonCard key={i} />)}
              </div>
            ) : accounts.length === 0 ? (
              <EmptyState icon={Wallet} title="No accounts yet"
                description="Add your bank accounts, wallets and savings to track your total net worth."
                action={() => setAccountModal(true)} actionLabel="Add Account" />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {accounts.map(a => (
                  <AccountCard key={a.id} account={a}
                    onEdit={handleEditAcc}
                    onDelete={(id) => setDeleteAccId(id)}
                    onTransfer={handleTransfer} />
                ))}
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div key="income"
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            {incLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...Array(3)].map((_, i) => <SkeletonCard key={i} />)}
              </div>
            ) : incomeSources.length === 0 ? (
              <EmptyState icon={Briefcase} title="No income sources yet"
                description="Add your salary, freelance work, scholarships or any other income streams."
                action={() => setIncomeModal(true)} actionLabel="Add Income Source" />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {incomeSources.map(s => (
                  <IncomeSourceCard key={s.id} source={s}
                    onEdit={handleEditInc}
                    onDelete={(id) => setDeleteIncId(id)} />
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modals */}
      <AccountModal  isOpen={accountModal}  onClose={closeAccountModal} initialData={editAccount} />
      <IncomeModal   isOpen={incomeModal}   onClose={closeIncomeModal}  initialData={editIncome}  />
      <TransferModal isOpen={transferModal} onClose={() => { setTransferModal(false); setTransferFrom(null); }} fromAccount={transferFrom} />

      <ConfirmDialog isOpen={!!deleteAccId} onClose={() => setDeleteAccId(null)}
        onConfirm={() => deleteAcc(deleteAccId, { onSuccess: () => setDeleteAccId(null) })}
        loading={deletingAcc} title="Delete Account"
        message="Delete this account? All linked income sources will be unlinked." />

      <ConfirmDialog isOpen={!!deleteIncId} onClose={() => setDeleteIncId(null)}
        onConfirm={() => deleteInc(deleteIncId, { onSuccess: () => setDeleteIncId(null) })}
        loading={deletingInc} title="Delete Income Source"
        message="Are you sure you want to delete this income source?" />
    </AppLayout>
  );
};

export default AccountsPage;
