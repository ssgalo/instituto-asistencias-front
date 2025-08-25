// src/features/attendance/pages/AttendancePage.tsx

import { Link, useParams } from 'react-router-dom';
import { mockAttendees } from '../../../_mockData/attendees';
import { AttendanceTable } from '../components/AttendanceTable';
import { ArrowLeft, Search, QrCode, ScanLine } from 'lucide-react';
import { useState, useMemo } from 'react';
import { mockClases } from '../../../_mockData/classes';
import { formatDisplayDate } from '../../../utils/dateUtils';
import { DniModal } from '../../../components/DniModal';
import { QRScanner } from '../components/QRScanner';

const AttendancePage = () => {
    const { claseId } = useParams(); // Obtenemos el ID de la clase desde la URL

    const claseActual = mockClases.find(clase => clase.idClase.toString() === claseId);
    const fechaFormateada = claseActual ? formatDisplayDate(claseActual.fechaClase) : 'Fecha no encontrada';


    // Aquí, en el futuro, harías una llamada a la API:
    // const { data: attendees, isLoading } = useGetAttendees(claseId);

    const [dniFilter, setDniFilter] = useState('');
    const [nameFilter, setNameFilter] = useState('');

    const [isDniModalOpen, setIsDniModalOpen] = useState(false);
    const [isQrModalOpen, setIsQrModalOpen] = useState(false);

    const filteredAttendees = useMemo(() => {
        let filtered = mockAttendees;

        // Aplicar filtro por DNI
        if (dniFilter) {
            filtered = filtered.filter(attendee =>
                attendee.dni.toString().includes(dniFilter)
            );
        }

        // Aplicar filtro por Nombre y Apellido
        if (nameFilter) {
            const lowercasedFilter = nameFilter.toLowerCase();
            filtered = filtered.filter(attendee =>
                `${attendee.nombre} ${attendee.apellido}`.toLowerCase().includes(lowercasedFilter)
            );
        }

        return filtered;
    }, [dniFilter, nameFilter]);

    const handleDniRegister = (dni: string) => {
        console.log(`DNI Registrado: ${dni}`); // Aquí irá la llamada a la API
        alert(`Asistencia registrada para el DNI: ${dni}`);
        setIsDniModalOpen(false); // Cerrar el modal
    };

    const handleQrScan = (dni: string) => {
        setIsQrModalOpen(false); // Cerrar el modal
        alert(`QR Escaneado - DNI: ${dni}`); // Mostrar el alert con el DNI
        // Aquí, en el futuro, llamarías a la API con el DNI
    };

    const attendees = mockAttendees;

    return (
        <div className="min-h-screen bg-slate-800 font-sans text-white p-4">
            <div className="max-w-4xl mx-auto">
                <Link to="/" className="inline-flex items-center gap-2 text-teal-400 hover:text-teal-300 transition-colors mb-4">
                    <ArrowLeft size={20} />
                    Volver al Inicio
                </Link>
                <h1 className="text-3xl font-bold mb-2">Asistencias de la Clase</h1>
                <h2 className="text-xl text-slate-300 mb-6">{fechaFormateada}</h2>

                {/* 4. Agregar los campos de búsqueda (inputs) */}
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

                    {/* Filtro por Nombre y Apellido */}
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
                <AttendanceTable data={filteredAttendees} />
            </div>
            <DniModal
                isOpen={isDniModalOpen}
                onClose={() => setIsDniModalOpen(false)}
                onRegister={handleDniRegister}
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
        </div>
    );
};

export default AttendancePage;