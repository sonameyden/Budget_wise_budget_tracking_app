import { useNavigate } from 'react-router-dom';
import { Plus, Target, BarChart2, ArrowLeftRight } from 'lucide-react';
import { motion } from 'framer-motion';

const ACTIONS = [
  { label: 'Add Transaction', Icon: Plus,           color: 'bg-emerald-500', to: '/transactions' },
  { label: 'Add Goal',        Icon: Target,          color: 'bg-violet-500',  to: '/goals'        },
  { label: 'Reports',         Icon: BarChart2,       color: 'bg-blue-500',    to: '/analytics'    },
  { label: 'Budgets',         Icon: ArrowLeftRight,  color: 'bg-amber-500',   to: '/budgets'      },
];

const QuickActions = () => {
  const navigate = useNavigate();
  return (
    <div className="grid grid-cols-4 gap-3">
      {ACTIONS.map(({ label, Icon, color, to }) => (
        <motion.button key={label} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
          onClick={() => navigate(to)}
          className="flex flex-col items-center gap-2 p-4 bg-white dark:bg-gray-900
                     border border-slate-200 dark:border-slate-700 rounded-2xl shadow-card
                     hover:shadow-card-hover transition-shadow">
          <div className={`w-10 h-10 ${color} rounded-xl flex items-center justify-center`}>
            <Icon size={18} className="text-white" />
          </div>
          <span className="text-xs font-medium text-slate-600 dark:text-slate-400 text-center leading-tight">{label}</span>
        </motion.button>
      ))}
    </div>
  );
};

export default QuickActions;
