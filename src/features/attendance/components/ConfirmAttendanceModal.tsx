import type { Alumno } from '../../../types/Alumno';
import { Check, X } from 'lucide-react';

interface ConfirmAttendanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  alumno: Alumno | null;
}

export const ConfirmAttendanceModal = ({ isOpen, onClose, onConfirm, alumno }: ConfirmAttendanceModalProps) => {
  if (!isOpen || !alumno) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-slate-700 rounded-lg shadow-xl p-6 w-full max-w-sm text-center">
        <h3 className="text-xl font-bold text-white mb-2">Confirmar Asistencia</h3>
        <p className="text-slate-300 mb-4">¿Deseas registrar la asistencia para el siguiente alumno?</p>
        
        <div className="bg-slate-800 rounded-lg p-4 mb-6 text-left">
          <p className="text-lg font-semibold text-white">{alumno.nombre} {alumno.apellido}</p>
          <p className="text-sm text-slate-400">DNI: {alumno.dni}</p>
        </div>
        
        <div className="flex justify-center gap-4">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium bg-slate-600 text-white rounded-lg hover:bg-slate-500 transition-colors"
          >
            <X size={16} />
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors"
          >
            <Check size={16} />
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
};