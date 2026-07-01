import { useEffect, useState, useCallback } from 'react';
import { CheckCircle2, AlertTriangle, XCircle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastMessage {
  id: string;
  type: ToastType;
  message: string;
}

interface ToastProps {
  toasts: ToastMessage[];
  removeToast: (id: string) => void;
}

export function useToasts() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  
  const addToast = useCallback((type: 'success' | 'error' | 'warning' | 'info', message: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, message }]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return { toasts, addToast, removeToast };
}

export default function ToastContainer({ toasts, removeToast }: ToastProps) {
  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 w-full max-w-sm">
      <AnimatePresence>
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
        ))}
      </AnimatePresence>
    </div>
  );
}

export { ToastContainer as Toaster };

function ToastItem({ toast, onClose }: { toast: ToastMessage; onClose: () => void }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const icons = {
    success: <CheckCircle2 className="h-5 w-5 text-emerald-500" />,
    error: <XCircle className="h-5 w-5 text-rose-500" />,
    warning: <AlertTriangle className="h-5 w-5 text-amber-500" />,
    info: <CheckCircle2 className="h-5 w-5 text-blue-500" />,
  };

  const bgColors = {
    success: 'bg-white dark:bg-slate-900 border-emerald-500/20 shadow-emerald-500/5',
    error: 'bg-white dark:bg-slate-900 border-rose-500/20 shadow-rose-500/5',
    warning: 'bg-white dark:bg-slate-900 border-amber-500/20 shadow-amber-500/5',
    info: 'bg-white dark:bg-slate-900 border-blue-500/20 shadow-blue-500/5',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, y: -10 }}
      layout
      className={`flex items-start gap-3 p-4 rounded-xl border shadow-lg ${bgColors[toast.type]} pointer-events-auto`}
    >
      <div className="flex-shrink-0 mt-0.5">{icons[toast.type]}</div>
      <div className="flex-1 text-sm font-medium text-slate-800 dark:text-slate-200 leading-relaxed break-words">
        {toast.message}
      </div>
      <button
        onClick={onClose}
        className="flex-shrink-0 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
      >
        <X className="h-4 w-4" />
      </button>
    </motion.div>
  );
}
