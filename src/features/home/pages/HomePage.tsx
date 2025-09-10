// src/features/home/pages/HomePage.tsx

import { useState, useEffect } from 'react';
import logoInstituto from '../../../assets/logo-instituto-home-login.png';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../../api/apiClient';
import { formatDisplayDate } from '../../../utils/dateUtils';

interface ClaseApi {
    fecha: string;
    total: number;
    id: number;
}

// --- Lógica de fechas ---
const getClassStatus = (fechaClase: string): { status: 'hoy' | 'pasada' | 'futura'; color: 'teal' | 'cyan' | 'slate' } => {
    const hoy = new Date();
    const fecha = new Date(fechaClase); 
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

    const [clases, setClases] = useState<ClaseApi[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    // 2. Usar useEffect para llamar a la API cuando el componente se carga
    useEffect(() => {
        const fetchClases = async () => {
            try {
                const response = await apiClient.get('/ObtenerAsistencias');
                if (response.data && response.data.respuesta) {
                    // Asignamos un ID temporal para la key de React
                    const clasesConId = response.data.datos.map((c: ClaseApi, index: number) => ({ ...c, id: index + 1 }));
                    setClases(clasesConId);
                } else {
                    setError('No se pudieron cargar las clases.');
                }
            } catch (err) {
                setError('Error de conexión al cargar las clases.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchClases();
    }, []);

    const handleNavigate = (fechaClase: string) => {
        navigate(`/clase/${fechaClase}/asistencias`);
    };

    if (isLoading) {
        return <div className="min-h-screen bg-slate-800 text-white flex justify-center items-center">Cargando clases...</div>;
    }

    if (error) {
        return <div className="min-h-screen bg-slate-800 text-white flex justify-center items-center">{error}</div>;
    }

    const colorClasses = {
        teal: {
            border: 'border-teal-400',
            tagBg: 'bg-teal-400/20 text-teal-300',
            button: 'bg-teal-500 hover:bg-teal-600 text-white',
        },
        cyan: {
            border: 'border-cyan-400',
            tagBg: 'bg-cyan-400/20 text-cyan-300',
            button: 'bg-cyan-600 hover:bg-cyan-700 text-white',
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
                        {clases.map((clase) => {
                            const { status, color } = getClassStatus(clase.fecha);
                            const colors = colorClasses[color];
                            return (
                                <div
                                    key={clase.id}
                                    className={`bg-slate-700 shadow-lg rounded-lg p-4 border-l-4 ${colors.border} ${status === 'pasada' ? 'opacity-60' : ''}`}
                                >
                                    <div className="flex flex-col items-start space-y-3">
                                        <span className={`text-xs font-semibold px-3 py-1 rounded-full ${colors.tagBg}`}>
                                            Clase {status.toUpperCase()}
                                        </span>

                                        <h2 className="text-xl font-semibold text-white">{formatDisplayDate(clase.fecha)}</h2>

                                        <button
                                            onClick={() => handleNavigate(clase.fecha.split('T')[0])}
                                            disabled={status === 'futura'}
                                            className={`mt-4 px-4 py-2 font-bold rounded-lg shadow-md transition-transform transform hover:scale-105 duration-200 ${colors.button} disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none`}
                                        >
                                            {status === 'pasada' ? `Ver Asistencias (${clase.total})` : 'Registrar Asistencia'}
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