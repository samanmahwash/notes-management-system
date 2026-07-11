import { AnimatePresence, motion } from 'framer-motion';
import { FiAlertTriangle } from 'react-icons/fi';

const ConfirmModal = ({ open, title, description, confirmLabel = 'Confirm', danger = true, onConfirm, onCancel }) => (
  <AnimatePresence>
    {open && (
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 backdrop-blur-sm px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onCancel}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.18 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-sm rounded-card bg-surface-light dark:bg-surface-dark p-6 shadow-soft-dark"
        >
          <div
            className={`mb-4 flex h-11 w-11 items-center justify-center rounded-full ${
              danger ? 'bg-clay/10 text-clay' : 'bg-gold/15 text-gold-dark'
            }`}
          >
            <FiAlertTriangle size={20} />
          </div>
          <h3 className="font-display text-lg font-medium">{title}</h3>
          <p className="mt-1.5 text-sm text-graphite">{description}</p>
          <div className="mt-6 flex justify-end gap-3">
            <button onClick={onCancel} className="btn-secondary">
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className={`inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-medium text-white transition-transform hover:-translate-y-0.5 ${
                danger ? 'bg-clay' : 'bg-pine'
              }`}
            >
              {confirmLabel}
            </button>
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

export default ConfirmModal;
