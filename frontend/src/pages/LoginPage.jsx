/**
 * LoginPage — split-screen: gradient left panel + login form right.
 * Matches pic.pdf page 1 exactly.
 */
import { motion } from 'framer-motion';
import LoginForm from '../features/auth/components/LoginForm';

const LoginPage = () => (
  <div className="min-h-screen flex">
    {/* Left gradient panel */}
    <motion.div
      initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}
      className="hidden lg:flex lg:w-5/12 flex-col items-center justify-center p-12 relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #0f172a 0%, #059669 55%, #7c3aed 100%)' }}
    >
      {/* Floating blobs */}
      <div className="absolute top-20 right-10 w-64 h-64 bg-emerald-400/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-10 w-48 h-48 bg-violet-400/10 rounded-full blur-3xl" />

      <div className="relative z-10 text-center">
        {/* Logo mark */}
        <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20
                        flex items-center justify-center mx-auto mb-6">
          <span className="text-white font-bold text-2xl">B</span>
        </div>
        <h1 className="text-3xl font-bold text-white mb-3">BudgetWise</h1>
        <p className="text-emerald-100/80 text-sm mb-10">Your intelligent personal finance companion</p>

        {/* Stat badges */}
        <div className="flex gap-4 justify-center">
          {[{ value: '$0', label: 'Setup cost' }].map(({ value, label }) => (
            <div key={label} className="px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-center">
              <p className="text-white font-bold text-lg">{value}</p>
              <p className="text-emerald-100/70 text-xs">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </motion.div>

    {/* Right form panel */}
    <motion.div
      initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}
      className="flex-1 flex items-center justify-center p-8 bg-white dark:bg-gray-950"
    >
      <LoginForm />
    </motion.div>
  </div>
);

export default LoginPage;
