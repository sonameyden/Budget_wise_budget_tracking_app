/**
 * SettingsPage — profile, appearance, notifications, data & privacy.
 */
import { useNavigate } from 'react-router-dom';
import { Download, Trash2, LogOut, Shield } from 'lucide-react';
import AppLayout from '../components/layout/AppLayout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import ProfileSection from '../features/settings/components/ProfileSection';
import AppearanceSection from '../features/settings/components/AppearanceSection';
import { useAuth } from '../contexts/AuthContext';

const SettingsPage = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = () => { logout(); navigate('/login'); };

  return (
    <AppLayout title="Settings">
      <div className="max-w-2xl space-y-6">

        {/* Profile */}
        <ProfileSection />

        {/* Appearance */}
        <AppearanceSection />

        {/* Data & Privacy */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-8 h-8 rounded-xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
              <Shield size={16} className="text-orange-600" />
            </div>
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200">Data & Privacy</h3>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-xl border border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <Download size={16} className="text-blue-500" />
                <div>
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-200">Export Data</p>
                  <p className="text-xs text-slate-400">Download your data as CSV or JSON</p>
                </div>
              </div>
              <Button variant="outline" size="sm">Export</Button>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl border border-red-100 dark:border-red-900/30 bg-red-50/50 dark:bg-red-900/10">
              <div className="flex items-center gap-3">
                <Trash2 size={16} className="text-red-500" />
                <div>
                  <p className="text-sm font-medium text-red-600 dark:text-red-400">Delete Account</p>
                  <p className="text-xs text-slate-400">Permanently delete your account and data</p>
                </div>
              </div>
              <Button variant="danger" size="sm">Delete</Button>
            </div>
          </div>
        </Card>

        {/* Sign out */}
        <button
          onClick={handleSignOut}
          className="w-full py-3 text-sm font-medium text-slate-600 dark:text-slate-400
                     border border-slate-200 dark:border-slate-700 rounded-2xl
                     hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-red-500
                     transition-colors text-center"
        >
          <div className="flex items-center justify-center gap-2">
            <LogOut size={16} />
            Sign Out
          </div>
        </button>
      </div>
    </AppLayout>
  );
};

export default SettingsPage;
