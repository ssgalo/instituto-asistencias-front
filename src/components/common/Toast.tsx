import { AlertCircle, AlertTriangle, CheckCircle } from 'lucide-react';
import { useEffect } from 'react';

export type ToastType = 'success' | 'error' | 'warning';

export interface ToastProps {
  id: number;
  message: string;
  type: ToastType;
  onDismiss: (id: number) => void;
}

const icons = {
  success: <CheckCircle className="text-green-300" size={24} />,
  error: <AlertCircle className="text-red-300" size={24} />,
  warning: <AlertTriangle className="text-yellow-300" size={24} />,
};

const colors = {
  success: 'bg-green-500/20 border-green-500',
  error: 'bg-red-500/20 border-red-500',
  warning: 'bg-yellow-500/20 border-yellow-500',
};

export const Toast = ({ id, message, type, onDismiss }: ToastProps) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(id);
    }, 5000); // La notificación desaparece después de 5 segundos

    return () => clearTimeout(timer);
  }, [id, onDismiss]);

  return (
    <div
      className={`max-w-sm w-full bg-slate-700 shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden border-l-4 ${colors[type]}`}
    >
      <div className="p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">{icons[type]}</div>
          <div className="ml-3 w-0 flex-1 pt-0.5">
            <p className="text-sm font-medium text-white">{message}</p>
          </div>
          <div className="ml-4 flex-shrink-0 flex">
            <button
              onClick={() => onDismiss(id)}
              className="inline-flex text-slate-400 hover:text-white"
            >
              <span className="sr-only">Close</span>
              &times;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};