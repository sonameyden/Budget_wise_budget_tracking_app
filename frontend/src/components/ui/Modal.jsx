/**
 * Modal — fits viewport with internal scroll. Max height 90vh.
 */
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useEffect } from 'react';

const Modal = ({ isOpen, onClose, title, children, size = 'md' }) => {
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    if (isOpen) {
      document.addEventListener('keydown', handler);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  const widths = { sm: 'max-w-sm', md: 'max-w-md', lg: 'max-w-lg', xl: 'max-w-xl' };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />

          {/* Panel — max 90vh, scrollable inside */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1,    y: 0  }}
            exit={{   opacity: 0, scale: 0.95, y: 10  }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className={`
              relative w-full ${widths[size]}
              bg-white dark:bg-gray-900
              rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700
              z-10 flex flex-col
              max-h-[90vh]
            `}
          >
            {/* Sticky header */}
            {title && (
              <div className="flex items-center justify-between px-6 py-4
                              border-b border-slate-100 dark:border-slate-700 shrink-0">
                <h2 className="text-base font-semibold text-slate-800 dark:text-slate-100">
                  {title}
                </h2>
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800
                             text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
            )}

            {/* Scrollable body */}
            <div className="overflow-y-auto overscroll-contain flex-1 px-6 py-5">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default Modal;