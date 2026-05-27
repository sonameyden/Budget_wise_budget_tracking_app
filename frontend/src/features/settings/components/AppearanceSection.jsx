/**
 * AppearanceSection — theme toggle + currency selector.
 * Saving currency updates AuthContext immediately so all formatCurrency
 * calls across the app re-render with the new currency.
 */
import { Sun, Moon, Palette } from 'lucide-react';
import Card from '../../../components/ui/Card';
import { useTheme } from '../../../contexts/ThemeContext';
import { useAuth } from '../../../contexts/AuthContext';

const CURRENCIES = [
  { code: 'USD', label: '$ USD — US Dollar'           },
  { code: 'BTN', label: 'Nu. BTN — Bhutanese Ngultrum' },
  { code: 'EUR', label: '€ EUR — Euro'                 },
  { code: 'GBP', label: '£ GBP — British Pound'        },
  { code: 'JPY', label: '¥ JPY — Japanese Yen'         },
  { code: 'CAD', label: '$ CAD — Canadian Dollar'      },
  { code: 'AUD', label: '$ AUD — Australian Dollar'    },
  { code: 'SGD', label: '$ SGD — Singapore Dollar'     },
  { code: 'INR', label: '₹ INR — Indian Rupee'         },
];

const AppearanceSection = () => {
  const { isDark, toggleTheme } = useTheme();
  const { user, updateUser } = useAuth();

  const handleCurrencyChange = (e) => {
    // Immediately persist to AuthContext + localStorage
    // All components that call useCurrency() will re-render automatically
    updateUser({ currency: e.target.value });
  };

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-5">
        <div className="w-8 h-8 rounded-xl bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center">
          <Palette size={16} className="text-violet-600" />
        </div>
        <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200">Appearance</h3>
      </div>

      {/* Theme toggle */}
      <div className="mb-6">
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">Theme</p>
        <div className="flex bg-slate-100 dark:bg-slate-800 rounded-xl p-1 gap-1 max-w-xs">
          <button
            onClick={() => isDark && toggleTheme()}
            className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-lg transition-all
              ${!isDark ? 'bg-emerald-500 text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
          >
            <Sun size={14} /> Light
          </button>
          <button
            onClick={() => !isDark && toggleTheme()}
            className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-lg transition-all
              ${isDark ? 'bg-emerald-500 text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
          >
            <Moon size={14} /> Dark
          </button>
        </div>
      </div>

      {/* Currency selector */}
      <div>
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">Currency</p>
        <select
          value={user?.currency || 'USD'}
          onChange={handleCurrencyChange}
          className="px-3 py-2.5 text-sm border border-slate-200 dark:border-slate-600 rounded-xl
                     bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200
                     focus:outline-none focus:border-emerald-400 max-w-xs w-full cursor-pointer"
        >
          {CURRENCIES.map(({ code, label }) => (
            <option key={code} value={code}>{label}</option>
          ))}
        </select>
        <p className="text-xs text-slate-400 mt-2">
          All amounts across the app will display in{' '}
          <span className="font-medium text-emerald-600">{user?.currency || 'USD'}</span>
        </p>
      </div>
    </Card>
  );
};

export default AppearanceSection;
