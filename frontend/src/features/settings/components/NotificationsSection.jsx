import { useState } from 'react';
import { Bell } from 'lucide-react';
import Card from '../../../components/ui/Card';

const TOGGLES = [
  { key: 'email',   label: 'Email Notifications',  desc: 'Receive updates via email' },
  { key: 'push',    label: 'Push Notifications',    desc: 'Receive push notifications' },
  { key: 'budget',  label: 'Budget Alerts',         desc: 'Get notified when approaching budget limits' },
  { key: 'weekly',  label: 'Weekly Summary',        desc: 'Receive weekly spending summary' },
  { key: 'goals',   label: 'Goal Reminders',        desc: 'Stay on track with goal reminders' },
];

const Toggle = ({ enabled, onToggle }) => (
  <button onClick={onToggle}
    className={`relative inline-flex w-11 h-6 rounded-full transition-colors duration-200
      ${enabled ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-slate-700'}`}>
    <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200
      ${enabled ? 'translate-x-5' : 'translate-x-0'}`} />
  </button>
);

const NotificationsSection = () => {
  const [prefs, setPrefs] = useState({ email: true, push: true, budget: true, weekly: true, goals: true });
  const toggle = (key) => setPrefs(p => ({ ...p, [key]: !p[key] }));

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-5">
        <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
          <Bell size={16} className="text-amber-600" />
        </div>
        <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200">Notifications</h3>
      </div>

      <div className="space-y-4">
        {TOGGLES.map(({ key, label, desc }) => (
          <div key={key} className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800 last:border-0">
            <div>
              <p className="text-sm font-medium text-slate-700 dark:text-slate-200">{label}</p>
              <p className="text-xs text-slate-400">{desc}</p>
            </div>
            <Toggle enabled={prefs[key]} onToggle={() => toggle(key)} />
          </div>
        ))}
      </div>
    </Card>
  );
};

export default NotificationsSection;
