import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import { User } from 'lucide-react';
import Card from '../../../components/ui/Card';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import { useAuth } from '../../../contexts/AuthContext';
import { useUpdateProfile } from '../hooks/useSettings';

const ProfileSection = () => {
  const { user } = useAuth();
  const { mutate: updateProfile, isLoading } = useUpdateProfile();
  const { register, handleSubmit, reset } = useForm({ defaultValues: { name: user?.name, email: user?.email } });

  useEffect(() => { reset({ name: user?.name, email: user?.email }); }, [user, reset]);

  const onSubmit = (data) => {
    updateProfile(data);
  };

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-5">
        <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
          <User size={16} className="text-emerald-600" />
        </div>
        <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200">Profile</h3>
      </div>

      {/* Avatar */}
      <div className="flex items-center gap-4 mb-6">
        <div className="w-14 h-14 rounded-full bg-emerald-500 flex items-center justify-center">
          <span className="text-white text-xl font-bold">{user?.name?.charAt(0)?.toUpperCase()}</span>
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">{user?.name}</p>
          <p className="text-xs text-slate-400">{user?.email}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label="Display Name" {...register('name')} />
          <Input label="Email" type="email" readOnly className="bg-slate-50 dark:bg-slate-800 cursor-not-allowed"
            {...register('email')} />
        </div>
        <Button type="submit" size="sm" loading={isLoading}>Save Changes</Button>
      </form>
    </Card>
  );
};

export default ProfileSection;
