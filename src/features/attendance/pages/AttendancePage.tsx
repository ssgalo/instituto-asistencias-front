import { Link, useParams } from 'react-router-dom';
import { AttendanceTable } from '../components/AttendanceTable';
import { ArrowLeft, Search, QrCode, ScanLine } from 'lucide-react';
import { useState, useMemo, useEffect, useCallback } from 'react';
import { formatDisplayDate } from '../../../utils/dateUtils';
import { DniModal } from '../../../components/DniModal';
import { QRScanner } from '../components/QRScanner';
import apiClient from '../../../api/apiClient';
import { useAuth } from '../../../context/AuthContext';
import type { Alumno } from '../../../types/Alumno';
import { useToast } from '../../../context/ToastContext';
import { ConfirmationModal } from '../../../components/common/ConfirmationModal';
import { ConfirmAttendanceModal } from '../components/ConfirmAttendanceModal';

const AttendancePage = () => {
    const { claseId: fechaClase } = useParams<{ claseId: string }>();
    const { showToast } = useToast();
    const { user } = useAuth();

    // Estado para los datos de la API
    const [attendees, setAttendees] = useState<Alumno[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    // Estado para los filtros de búsqueda
    const [dniFilter, setDniFilter] = useState('');
    const [nameFilter, setNameFilter] = useState('');

    // Estado para controlar los modales
    const [isDniModalOpen, setIsDniModalOpen] = useState(false);
    const [isQrModalOpen, setIsQrModalOpen] = useState(false);

    // Estado para controlar los modales de eliminar
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [selectedAttendee, setSelectedAttendee] = useState<Alumno | null>(null);

    const [scannedAlumno, setScannedAlumno] = useState<Alumno | null>(null);

    const [isScanConfirmOpen, setIsScanConfirmOpen] = useState(false);


    const openDeleteConfirm = (alumno: Alumno) => {
        setSelectedAttendee(alumno);
        setIsConfirmModalOpen(true);
    };

    const handleDelete = async () => {
        if (!selectedAttendee || !fechaClase) return;
        try {
            const response = await apiClient.delete('/EliminarAsistencia', {
                data: {
                    dni: selectedAttendee.dni.toString(),
                    fechaClase: fechaClase
                }
            });

            if (response.data && response.data.respuesta) {
                showToast('Asistencia eliminada con éxito.', 'success');
                fetchAttendees(); // Refrescar la tabla
            } else {
                showToast(`Error: ${response.data.errores}`, 'error');
            }
        } catch (err) {
            showToast('Error de conexión al eliminar la asistencia.', 'error');
        } finally {
            setIsConfirmModalOpen(false);
            setSelectedAttendee(null);
        }
    };

    const confirmAndRegister = () => {
        if (scannedAlumno) {
            handleRegister(scannedAlumno.dni.toString());
        }
        setIsScanConfirmOpen(false);
    };

    const handleQrScan = async (dni: string) => {
        setIsQrModalOpen(false);
        try {
            const response = await apiClient.get(`/ObtenerAlumno/${dni}`);
            if (response.data && response.data.respuesta) {
                setScannedAlumno(response.data.datos);
                setIsScanConfirmOpen(true);
            } else {
                showToast(response.data.errores || 'Alumno no encontrado.', 'error');
            }
        } catch (err) {
            showToast('Error de conexión al buscar el alumno.', 'error');
        }
    };

    // 1. FUNCIÓN PARA OBTENER DATOS DE LA API
    const fetchAttendees = useCallback(async () => {
        if (!fechaClase) return;
        try {
            // No seteamos isLoading aquí para que la tabla no desaparezca al refrescar
            const response = await apiClient.get(`/asistencias/${fechaClase}`);
            if (response.data && response.data.respuesta) {
                setAttendees(response.data.datos || []);
            } else {
                setError(response.data.errores || 'No se pudieron cargar los asistentes.');
            }
        } catch (err) {
            setError('Error de conexión al cargar los asistentes.');
        } finally {
            setIsLoading(false); // Solo se ejecuta la primera vez
        }
    }, [fechaClase]);

    // Llamar a fetchAttendees al cargar la página
    useEffect(() => {
        fetchAttendees();
    }, [fetchAttendees]);

    // 2. FUNCIÓN ÚNICA Y CORRECTA PARA REGISTRAR ASISTENCIA
    const handleRegister = async (dni: string) => {
        if (!user) {
            showToast("Error: No se ha encontrado el usuario logueado.", 'error');
            return;
        }
        try {
            const response = await apiClient.post('/RegistrarAsistencia', {
                dni: parseInt(dni, 10),
                id_asistente: parseInt(user.id_asistente, 10),
                fechaClase: fechaClase,
            });

            if (response.data && response.data.respuesta) {
                showToast(`Asistencia para DNI ${dni} registrada con éxito.`, 'success');
                fetchAttendees();
            } else {
                showToast(`Error al registrar: ${response.data.errores}`, 'error');
            }
        } catch (err) {
            showToast("Error de conexión al registrar la asistencia.", 'error');
        } finally {
            // Cerrar ambos modales por si acaso
            setIsDniModalOpen(false);
            setIsQrModalOpen(false);
        }
    };

    // 3. LÓGICA DE FILTRADO APLICADA A LOS DATOS REALES
    const filteredAttendees = useMemo(() => {
        // Usamos 'attendees' (el estado con datos de la API), no 'mockAttendees'
        let filtered = attendees;
        if (dniFilter) {
            filtered = filtered.filter(attendee =>
                attendee.dni.toString().includes(dniFilter)
            );
        }
        if (nameFilter) {
            const lowercasedFilter = nameFilter.toLowerCase();
            filtered = filtered.filter(attendee =>
                `${attendee.nombre} ${attendee.apellido}`.toLowerCase().includes(lowercasedFilter)
            );
        }
        return filtered;
    }, [attendees, dniFilter, nameFilter]); // Ahora depende de 'attendees'

    // Formatear la fecha para el título
    const fechaFormateada = fechaClase ? formatDisplayDate(fechaClase) : 'Cargando fecha...';

    // Manejo de estados de carga y error
    if (isLoading) return <div className="min-h-screen bg-slate-800 text-white flex justify-center items-center">Cargando...</div>;
    if (error) return <div className="min-h-screen bg-slate-800 text-red-400 flex justify-center items-center">{error}</div>;

    return (
        <div className="min-h-screen bg-slate-800 font-sans text-white p-4">
            <div className="max-w-4xl mx-auto">
                <Link to="/" className="inline-flex items-center gap-2 text-teal-400 hover:text-teal-300 transition-colors mb-4">
                    <ArrowLeft size={20} />
                    Volver al Inicio
                </Link>
                <h1 className="text-3xl font-bold mb-2">Asistencias de la Clase</h1>
                <h2 className="text-xl text-slate-300 mb-6">{fechaFormateada}</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    {/* Filtro por DNI */}
                    <div className="relative">
                        <label htmlFor="dni-search" className="sr-only">Buscar por DNI</label>
                        <input
                            type="text"
                            id="dni-search"
                            className="w-full bg-slate-700 border border-slate-600 text-white text-sm rounded-lg focus:ring-teal-500 focus:border-teal-500 block pl-10 p-2.5"
                            placeholder="Buscar por DNI..."
                            value={dniFilter}
                            onChange={(e) => setDniFilter(e.target.value)}
                        />
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <Search size={20} className="text-slate-400" />
                        </div>
                    </div>

                    <div className="relative">
                        <label htmlFor="name-search" className="sr-only">Buscar por Nombre y Apellido</label>
                        <input
                            type="text"
                            id="name-search"
                            className="w-full bg-slate-700 border border-slate-600 text-white text-sm rounded-lg focus:ring-teal-500 focus:border-teal-500 block pl-10 p-2.5"
                            placeholder="Buscar por Nombre y Apellido..."
                            value={nameFilter}
                            onChange={(e) => setNameFilter(e.target.value)}
                        />
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <Search size={20} className="text-slate-400" />
                        </div>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                    <button
                        onClick={() => setIsQrModalOpen(true)}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 font-bold text-brand-light bg-slate-700 rounded-lg shadow-md transition-transform transform hover:scale-105 duration-200"
                    >
                        <QrCode size={20} />
                        Escanear QR
                    </button>
                    <button
                        onClick={() => setIsDniModalOpen(true)} // Abre el modal
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 font-bold bg-slate-700 text-brand-light rounded-lg shadow-md transition-transform transform hover:scale-105 duration-200"
                    >
                        <ScanLine size={20} />
                        Ingresar DNI
                    </button>
                </div>
                <AttendanceTable data={filteredAttendees} fechaClase={fechaClase} onDeleteClick={openDeleteConfirm} />
            </div>
            <DniModal
                isOpen={isDniModalOpen}
                onClose={() => setIsDniModalOpen(false)}
                onRegister={handleRegister}
            />
            {isQrModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex justify-center items-center p-4">
                    <div className="bg-slate-700 rounded-lg shadow-xl p-6 w-full max-w-sm relative">
                        <h3 className="text-xl font-bold text-white mb-4">Escanear Código QR</h3>
                        <QRScanner onScan={handleQrScan} />
                        <button
                            onClick={() => setIsQrModalOpen(false)}
                            className="mt-4 w-full px-4 py-2 text-sm font-medium text-slate-300 bg-slate-600 rounded-lg hover:bg-slate-500 transition-colors"
                        >
                            Cancelar
                        </button>
                    </div>
                </div>
            )}

            <ConfirmationModal
                isOpen={isConfirmModalOpen}
                onClose={() => setIsConfirmModalOpen(false)}
                onConfirm={handleDelete}
                title="Eliminar Asistencia"
                message={`¿Estás seguro de que deseas eliminar la asistencia de ${selectedAttendee?.nombre} ${selectedAttendee?.apellido}? Esta acción no se puede deshacer.`}
            />

            <ConfirmAttendanceModal
                isOpen={isConfirmModalOpen}
                onClose={() => setIsScanConfirmOpen(false)}
                onConfirm={confirmAndRegister}
                alumno={scannedAlumno}
            />
        </div>
    );
};

export default AttendancePage;