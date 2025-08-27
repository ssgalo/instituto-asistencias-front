export interface Alumno {
  idAlumno: number;
  dni: number;
  nombre: string;
  apellido: string;
  email: string | null;
  direccion: string | null;
  localidad: string | null;
  nacionalidad: string | null;
  telefono: number | null;
  profesion: string | null;
  referencia: string | null;
  estaActivo: boolean;
}