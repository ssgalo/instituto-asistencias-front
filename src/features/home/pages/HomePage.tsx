// src/features/home/pages/HomePage.tsx

import { mockClases } from '../../../_mockData/classes';
import type { Clase } from '../../../types/Clase';
import logoInstituto from '../../../assets/logo-instituto.jpg';
import { useNavigate } from 'react-router-dom';
import { formatDisplayDate } from '../../../utils/dateUtils';

// --- Lógica de fechas ---
const getClassStatus = (fechaClase: string): { status: 'hoy' | 'pasada' | 'futura'; color: 'teal' | 'cyan' | 'slate' } => {
    const hoy = new Date();
    const fecha = new Date(fechaClase + 'T00:00:00');
    hoy.setHours(0, 0, 0, 0);

    if (fecha.getTime() < hoy.getTime()) {
        return { status: 'pasada', color: 'slate' };
    }
    if (fecha.getTime() > hoy.getTime()) {
        return { status: 'futura', color: 'cyan' };
    }
    return { status: 'hoy', color: 'teal' };
};

const HomePage = () => {
    const navigate = useNavigate();

    const handleNavigate = (claseId: number) => {
        // Navegamos a la página de asistencias con el ID de la clase
        navigate(`/clase/${claseId}/asistencias`);
    };

    const colorClasses = {
        teal: {
            border: 'border-teal-400',
            tagBg: 'bg-teal-400/20 text-teal-300',
            button: 'bg-teal-500 hover:bg-teal-600 text-white',
        },
        cyan: {
            border: 'border-cyan-400',
            tagBg: 'bg-cyan-400/20 text-cyan-300',
            button: 'bg-gray-500',
        },
        slate: {
            border: 'border-slate-500',
            tagBg: 'bg-slate-400/20 text-slate-300',
            button: 'bg-slate-600 hover:bg-slate-700 text-white',
        },
    };

    return (
        <div className="min-h-screen bg-slate-800 font-sans text-white">
            <div className="p-4 max-w-2xl mx-auto">
                <div className="flex flex-col items-center space-y-8 py-8">

                    <img src={logoInstituto} alt="Logo del Instituto Aliento de Vida" className="h-24 w-auto" />

                    <h1 className="text-3xl font-bold text-center text-slate-100">
                        Registro de Asistencias - Curso de Emprendedores
                    </h1>

                    <div className="w-full flex flex-col space-y-4">
                        {mockClases.map((clase) => {
                            const { status, color } = getClassStatus(clase.fechaClase);
                            const colors = colorClasses[color];
                            return (
                                <div
                                    key={clase.idClase}
                                    className={`bg-slate-700 shadow-lg rounded-lg p-4 border-l-4 ${colors.border} ${status === 'pasada' ? 'opacity-60' : ''}`}
                                >
                                    <div className="flex flex-col items-start space-y-3">
                                        <span className={`text-xs font-semibold px-3 py-1 rounded-full ${colors.tagBg}`}>
                                            Clase {status.toUpperCase()}
                                        </span>

                                        <h2 className="text-xl font-semibold text-white">{formatDisplayDate(clase.fechaClase)}</h2>

                                        <button
                                            // 4. Conectar la función al evento onClick del botón
                                            onClick={() => handleNavigate(clase.idClase)}
                                            className={`mt-2 px-4 py-2 font-bold rounded-lg shadow-md transition-transform transform hover:scale-105 duration-200 ${colors.button} disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none`}
                                            disabled={status === 'futura'}
                                        >
                                            {status === 'pasada' ? 'Ver Asistencias' : 'Registrar Asistencia'}
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePage;