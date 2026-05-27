/**
 * Card — glassmorphism card wrapper with optional hover animation.
 */
import { motion } from 'framer-motion';

const Card = ({ children, className = '', hover = false, onClick }) => {
  const base = `bg-white dark:bg-gray-900 border border-slate-200 dark:border-slate-700
                 rounded-2xl shadow-card ${className}`;
  if (hover) {
    return (
      <motion.div
        whileHover={{ y: -2, boxShadow: '0 8px 24px rgba(0,0,0,0.08)' }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        onClick={onClick}
        className={`${base} cursor-pointer`}
      >
        {children}
      </motion.div>
    );
  }
  return <div className={base}>{children}</div>;
};

export default Card;
