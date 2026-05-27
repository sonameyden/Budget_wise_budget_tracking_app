import { motion } from 'framer-motion';
import RegisterForm from '../features/auth/components/RegisterForm';

const RegisterPage = () => (
  <div className="min-h-screen flex">
    <motion.div
      initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}
      className="hidden lg:flex lg:w-5/12 flex-col items-center justify-center p-12 relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #0f172a 0%, #059669 55%, #7c3aed 100%)' }}
    >
      <div className="absolute top-20 right-10 w-64 h-64 bg-emerald-400/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-10 w-48 h-48 bg-violet-400/10 rounded-full blur-3xl" />
      <div className="relative z-10 text-center">
        <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20
                        flex items-center justify-center mx-auto mb-6">
          <span className="text-white font-bold text-2xl">B</span>
        </div>
        <h1 className="text-3xl font-bold text-white mb-3">Start Your Journey</h1>
        <p className="text-emerald-100/80 text-sm mb-10">Take control of your finances with intelligent budgeting</p>
        <div className="flex gap-4 justify-center">
          {[{ value: 'Free', label: 'Forever' }, { value: '5min', label: 'Setup' }].map(({ value, label }) => (
            <div key={label} className="px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-center">
              <p className="text-white font-bold text-lg">{value}</p>
              <p className="text-emerald-100/70 text-xs">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </motion.div>

    <motion.div
      initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}
      className="flex-1 flex items-center justify-center p-8 bg-white dark:bg-gray-950 overflow-y-auto"
    >
      <RegisterForm />
    </motion.div>
  </div>
);

export default RegisterPage;
