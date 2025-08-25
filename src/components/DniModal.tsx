import { useState } from 'react';

interface DniModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRegister: (dni: string) => void;
}

export const DniModal = ({ isOpen, onClose, onRegister }: DniModalProps) => {
  const [dni, setDni] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (dni) {
      onRegister(dni);
      setDni(''); // Limpiar el input después de registrar
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      {/* Contenedor del Modal */}
      <div className="bg-slate-700 rounded-lg shadow-xl p-6 w-full max-w-sm">
        <h3 className="text-xl font-bold text-white mb-4">Registrar Asistencia por DNI</h3>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="dni" className="block mb-2 text-sm font-medium text-slate-300">
              Número de Documento
            </label>
            <input
              type="number"
              id="dni"
              className="bg-slate-800 border border-slate-600 text-white text-sm rounded-lg focus:ring-teal-500 focus:border-teal-500 block w-full p-2.5"
              placeholder="Ingrese el DNI sin puntos"
              value={dni}
              onChange={(e) => setDni(e.target.value)}
              required
              autoFocus // Poner el foco en el input al abrir
            />
          </div>
          
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-300 bg-slate-600 rounded-lg hover:bg-slate-500 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-brand-dark bg-brand-teal rounded-lg hover:bg-opacity-80 transition-colors"
            >
              Registrar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};