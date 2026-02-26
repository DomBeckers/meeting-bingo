import { useEffect } from 'react';
import type { Toast as ToastType } from '../../types';
import { cn } from '../../lib/utils';

interface Props {
  toasts: ToastType[];
  onDismiss: (id: string) => void;
}

export function ToastContainer({ toasts, onDismiss }: Props) {
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map(toast => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
}

function ToastItem({ toast, onDismiss }: { toast: ToastType; onDismiss: (id: string) => void }) {
  useEffect(() => {
    const timer = setTimeout(() => onDismiss(toast.id), toast.duration ?? 3000);
    return () => clearTimeout(timer);
  }, [toast.id, toast.duration, onDismiss]);

  return (
    <div
      className={cn(
        'px-4 py-2 rounded-lg shadow-lg text-sm font-medium animate-bounce-in',
        toast.type === 'success' && 'bg-green-500 text-white',
        toast.type === 'info' && 'bg-blue-500 text-white',
        toast.type === 'warning' && 'bg-amber-500 text-white',
      )}
    >
      {toast.message}
    </div>
  );
}
