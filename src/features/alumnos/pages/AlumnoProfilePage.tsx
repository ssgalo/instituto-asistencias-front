// src/features/alumnos/pages/AlumnoProfilePage.tsx
import { useState, useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import apiClient from '../../../api/apiClient';
import { ArrowLeft } from 'lucide-react';
// Asumimos que la estructura del alumno es la misma que la de la respuesta de la API
import type { Alumno } from '../../../types/Alumno'; 

const AlumnoProfilePage = () => {
  const { dni } = useParams<{ dni: string }>();
  const [alumno, setAlumno] = useState<Alumno | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const location = useLocation();
  const backPath = location.state?.from || '/';

  useEffect(() => {
    const fetchAlumno = async () => {
      try {
        const response = await apiClient.get(`/ObtenerAlumno/${dni}`);
        if (response.data && response.data.respuesta) {
          setAlumno(response.data.datos);
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchAlumno();
  }, [dni]);

  if (isLoading) return <div className="min-h-screen bg-slate-800 text-white flex justify-center items-center">Cargando perfil...</div>;
  if (!alumno) return <div className="min-h-screen bg-slate-800 text-white flex justify-center items-center">Alumno no encontrado.</div>;

  return (
    <div className="min-h-screen bg-slate-800 font-sans text-white p-4">
      <div className="max-w-2xl mx-auto">
        <Link to={backPath} className="inline-flex items-center gap-2 text-teal-400 hover:text-teal-300 mb-6">
          <ArrowLeft size={20} />
          Volver
        </Link>
        <div className="bg-slate-700 shadow-lg rounded-lg p-6">
          <h1 className="text-3xl font-bold">{alumno.nombre} {alumno.apellido}</h1>
          <p className="text-slate-300">DNI: {alumno.dni}</p>
          <hr className="my-4 border-slate-600" />
          <div className="space-y-2">
            <p><strong className="text-slate-400">Email:</strong> {alumno.email}</p>
            <p><strong className="text-slate-400">Teléfono:</strong> {alumno.telefono}</p>
            <p><strong className="text-slate-400">Dirección:</strong> {alumno.direccion}, {alumno.localidad}</p>
            <p><strong className="text-slate-400">Nacionalidad:</strong> {alumno.nacionalidad}</p>
            <p><strong className="text-slate-400">Profesión:</strong> {alumno.profesion}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlumnoProfilePage;